# .hott Parser Split — Static HTML, Preambles, Inline Scripts

**Status:** Draft • **Ticket:** HS090-3 • **Depends on:** HS090-1, HS090-2

## Goal

Factor the existing `.hott` parser so the static build pipeline can cleanly
separate (a) the static HTML structure that goes into the `<template>` stash,
(b) the `<* *>` preamble blocks that compile into per-route async functions
in `app.js`, and (c) `<script>` tags inside the template that need to execute
on each mount.

Each `.hott` compiles to a module exporting:

```ts
{
  template: string,                 // HTML structure for the <template> stash
  preamble: async (ctx) => void,    // compiled <* *> body
  scripts: string[],                // inline <script> bodies, keyed to DOM hooks
  partials: string[],               // string-literal Hot.include targets, for build-time resolve
  staticRender?: boolean,
}
```

Both pipelines consume this: SSR (today) and --static (new in v0.9.0).

## Current Shape (v0.8.x)

Parsing happens in `src/HotFile.ts` + `src/HotStaq.ts`:

- `HotFile.processContent(content, regex, onMatch, onOff, ...)` — generic
  regex-driven content walker.
- `HotFile.processNestedContent(content, startChars, endChars, triggerChar,
  onMatch, onOff, ...)` — hand-rolled stateful walker that handles nested
  `<* *>` blocks (it tracks `${}` trigger chars to balance).
- `HotStaq.processContent(options)` — high-level entry. Builds a `HotFile`,
  feeds it to a `HotPage`, and calls `processor.process(name, args)` which
  actually runs the preamble + template stitching.

Preambles execute *during* processing and produce interleaved output. That's
the piece that has to change: v0.9.0 needs to keep preamble source (or
transpiled equivalent) as a separable artifact, not as a runtime side effect.

## Target Shape

### Two-phase parse

**Phase 1 — tokenize.**  Walk the input once, emit a token stream:

```
HOT_TEMPLATE_HTML        "  <div class='foo'>..."
HOT_PREAMBLE             "{ await Hot.import('@hotstaq/admin-panel'); ... }"
HOT_TEMPLATE_HTML        "<h2>Sign In</h2>"
HOT_INLINE_SCRIPT        "{ function signIn() {...} ... }"
HOT_TEMPLATE_HTML        "<form ...>"
HOT_INCLUDE              { target: "./components/header.hott", literal: true }
HOT_TEMPLATE_HTML        "</form>"
```

Reuses `processNestedContent`'s `<* *>` handling but runs it as a pure tokenizer:
no evaluation, no output string concat. Token boundaries preserve source
offsets so error messages stay meaningful.

### Phase 2 — compile.  For each .hott:

```ts
const module = {
  template: tokens
    .filter(t => t.kind === 'TEMPLATE_HTML' || t.kind === 'INLINE_SCRIPT')
    .map(rewriteIncludesToStashClones)    // <Hot.include> → <template-clone id="hot-partial-...">
    .join(''),
  preamble: compilePreamble(
    tokens.filter(t => t.kind === 'PREAMBLE').map(t => t.source).join('\n'),
    { ctxParam: 'hotCtx' }                // rewrite Hot.Cookies.get → hotCtx.cookies.get etc.
  ),
  scripts: tokens.filter(t => t.kind === 'INLINE_SCRIPT').map(t => t.source),
  partials: tokens.filter(t => t.kind === 'INCLUDE' && t.literal).map(t => t.target),
};
```

Inline scripts are kept as strings in the module because they need to execute
after each template mount (not at module import). The runtime `new Function(src)`s
them per mount — same semantics as today's `useOutput`-driven script
reinsertion.

### Preamble rewrite

Preambles today use `Hot.*` free references (`Hot.Cookies`, `Hot.getJSON`,
`Hot.include`, `Hot.import`, `Hot.getUrlParam`, `Hot.echoUnsafe`, etc.). The
compiler rewrites these to attribute accesses on the `hotCtx` parameter:

| Source                       | Rewrite                          |
|------------------------------|-----------------------------------|
| `Hot.Cookies.get('x')`       | `hotCtx.cookies.get('x')`         |
| `Hot.getJSON('./config')`    | `hotCtx.getJSON('./config')`      |
| `Hot.include('./x.hott')`    | `hotCtx.includeStash('x')` *(build-time resolved to stash ID)* |
| `Hot.import('@pkg/foo')`     | `hotCtx.import('@pkg/foo')`       |
| `Hot.getUrlParam('email')`   | `hotCtx.search.get('email')`      |
| `Hot.echoUnsafe(html)`       | `hotCtx.echo(html)`               |

Implementation: light AST pass over the preamble source (a Program-scoped
Babel / SWC parse is cheap; we don't need a full typechecker). Only rewrites
member access expressions whose object is the free identifier `Hot` — if the
app ever shadowed `Hot` locally, the rewrite respects scope.

`hotCtx` itself is a plain object the runtime constructs per navigation:

```ts
interface HotCtx {
  cookies: { get(n: string): string | null; set(n: string, v: string, opts?: object): void; remove(n: string, opts?: object): void; };
  search: URLSearchParams;
  pathname: string;
  params: Record<string, string>;
  api: any;                               // the generated API client, singleton
  getJSON(url: string): Promise<any>;
  import(pkg: string): Promise<any>;      // same lazy-loader behaviour
  includeStash(id: string): string;       // returns HTML cloned from the partial stash
  echo(html: string): void;               // appends to the current template's buffer
}
```

### Keeping SSR working

The SSR pipeline (today) also uses these tokens but composes them differently:
it runs the preamble at request time, string-concats the output with the
surrounding template, and streams to the client. That codepath stays. What
changes is the entry point: both pipelines call `parseHottFile(path) ⇒
{ template, preamble, scripts, partials }`, and SSR mode converts that into
one-shot execution while --static mode bundles them into the stash + app.js.

Net effect: a single parser, two emitters.

## File Layout

```
src/
├── hott/
│   ├── tokenize.ts       — pure token stream over .hott source (phase 1)
│   ├── compile.ts        — tokens → { template, preamble, scripts, partials } (phase 2)
│   ├── rewrite-preamble.ts — Hot.* → hotCtx.* AST pass
│   └── types.ts          — Token, HottModule, HotCtx
└── HotFile.ts              — keep for backcompat; delegate to ./hott/*
```

## Tests

Already: `tests/hotstaq/` has .hott fixtures. Add `tests/hott/` with small
inputs that exercise each token kind (preamble-only, template-only, mixed,
nested `${}` inside preamble, inline `<script>`, string-literal include,
dynamic include which should produce a warning token).

Round-trip contract: `compile(tokenize(src))` produces a module whose
`template + preamble-as-comment + scripts` reconstructs a semantically
equivalent `.hott` source (modulo whitespace). Makes regressions obvious.

## Migration Risk

- Preamble rewrite is where subtle bugs lurk. Apps that do
  `let foo = Hot; foo.Cookies.get(...)` will *not* be rewritten. Build
  emits a warning when it detects aliasing of the free `Hot` identifier.
  HS090-21 migration guide tells app authors to avoid this pattern.
- Inline scripts that reference globals the preamble created (e.g. preamble
  defines `let userAuth = await Hot.includeJS(...)` and a `<script>` later
  references `userAuth`) keep working because the runtime runs them in the
  same scope — the runtime invokes the preamble and the inline scripts
  inside the same iife per mount.

## Not in Scope Here

- The CLI wiring (HS090-4).
- Template stash emission (HS090-5).
- Preamble bundling (HS090-6).

This ticket is the parser change + the module shape. The emitters consume
the output.
