# HotStaq v0.9.0 — Static-Site Builds

**Status:** Draft • **Ticket:** HS090-1 • **Target release:** v0.9.0

## Goal

Add a static-site build target to HotStaq. `hotstaq build --static` emits an
nginx-servable bundle (index.html shell + inline `<template>` stash + app.js +
app.css + config.json + assets/) so HotStaq frontends can be served as plain
files. Eliminates the Node process from the frontend path, aligns the Freelight
campaign platform with the FreeLightDAO operational shape (separate frontend +
api containers), and makes SPA-feel navigation the default without introducing
any state-management layer.

## Why

Today HotStaq serves `.hott` files from a Node process. For every page load,
the server processes the .hott file (preamble execution + client script
rehydration + partial inclusion) and streams the resulting HTML. This works but
it:

- Couples the frontend to a running Node.js process. You can't front an app with
  a pure CDN or nginx static host.
- Forces every deployment to include the web process in addition to the API —
  the FreeLightDAO Helm chart already separates these; the Freelight campaign
  platform still ships a combined container.
- Refetches template bodies on every SPA navigation (the router manager loads
  `.hott` bodies at runtime), which costs a round-trip per route.
- Complicates caching — partial HTML output is per-request and can't be
  aggressively cached at the edge.

v0.9.0 fixes all four by moving template resolution + API-client generation +
preamble compilation from runtime to build time. Apps still get the HotStaq
ergonomics (.hott files, `<* *>` preambles, `Hot.include`, auto-generated typed
API client) but ship as a static bundle.

## Non-Goals

- No framework ergonomic changes. `.hott` syntax is unchanged; existing apps
  build on v0.9.0 with no code diff when they stay in SSR mode.
- No new component or state-management system. The existing preamble +
  template + client-side script model stays the baseline.
- No prerender-service integration (doc-only in v0.9.0, follow-up ticket
  thereafter).
- No hot-module-replacement dev mode redesign. The existing dev flow keeps
  working; --static dev mode is a thin alternative.
- No automatic route-code-splitting heuristics beyond the declarative
  eager/lazy/never preload hint.

## Dual-Mode Compatibility (the hard constraint)

**v0.9.0 MUST ship with zero breaking changes to the current SSR behavior.**
Existing `hotstaq` commands (`develop`, `build` without `--static`, `run`)
retain their pre-0.9 semantics. `HotSite.yaml` files without the new keys
compile exactly as before. Only `hotstaq build --static` (and `hotstaq develop
--static` dev mode) opt into the new pipeline. This lets us land the release
and migrate apps one at a time (see HS090-20 for the enforcement ticket and
HS090-21 for the pilot rollout plan).

## Build Output Shape

A successful `hotstaq build --static` produces:

```
dist/
├── index.html            # shell with inline <template> stash, loads app.js + app.css
├── app.js                # runtime + preambles + route map + generated API client
├── app.js.map
├── app.css               # admin-panel CSS + user CSS consolidated
├── app.css.map
├── config.json           # runtime env (same pattern as today; k8s ConfigMap overrides)
├── assets/               # images, fonts, anything referenced from .hott files
│   └── ...
└── build-manifest.json   # file list + content-hashes for cache-busting + deploy tooling
```

`index.html` contents (schematic):

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title></title>
  <link rel="stylesheet" href="./app.css?v=<hash>" />
  <script src="./app.js?v=<hash>" defer></script>
</head>
<body>
  <div id="hot-content"></div>

  <!-- Inline template stash: every eager route + every partial -->
  <template id="hot-tpl-/dashboard">...rendered HTML...</template>
  <template id="hot-tpl-/login">...</template>
  <template id="hot-partial-components/header">...</template>
  <template id="hot-partial-components/footer">...</template>
  <!-- lazy routes are NOT inlined; their templates ship as chunks -->
</body>
</html>
```

Zero-fetch navigation between eager routes: the runtime clones the matching
template, runs the preamble, and swaps into `#hot-content`.

## Runtime Execution Model

On first paint (cold load):
1. Browser parses `index.html`, fetches `app.js` + `app.css`.
2. `app.js` loads: client runtime attaches to document, looks up the current
   `window.location.pathname` in the route map.
3. Runtime clones the target template from the stash, runs the route's
   compiled preamble (which may set up API calls, fetch data, mutate the DOM
   fragment), injects into the content region, executes any template-local
   `<script>` tags.

On navigation (warm SPA hop):
1. User clicks an `<a>` or submits a `<form>`.
2. `hotstaq/13 link-interception` intercepts, calls `Hot.navigate(targetUrl)`.
3. `Hot.navigate` updates history via `pushState`, looks up the new route,
   runs before-unmount hooks on outgoing template, clones the new template,
   runs preamble, swaps content region, runs mounted hooks.
4. If target is a lazy route, runtime awaits the chunk fetch before step 3's
   completion (with a prefetch on hover/focus/intersection to hide latency —
   see HS090-17).

On back/forward:
1. `popstate` fires.
2. Runtime handles exactly like navigation but `pushState` is skipped. Scroll
   position is restored from `history.state`.

## Per-.hott Compilation Model

Each `.hott` file compiles to a module (handled by HS090-3's parser split):

```ts
{
  template: string,              // HTML structure, goes into the <template> stash
  preamble: async (ctx) => void, // <* *> block body, runs on mount with URL/cookies ctx
  scripts: string[],             // inline <script> bodies, run after each mount
  partials: string[],            // Hot.include targets resolved at build time
  staticRender?: true,           // bake preamble once at build, embed HTML directly
}
```

Multiple `.hott` files → a route map:

```ts
routes = {
  "/dashboard": { templateId: "hot-tpl-/dashboard", preamble: fn_dashboard, scripts: [...], preload: "eager" },
  "/admin/users": { templateId: "hot-tpl-/admin/users", preamble: fn_admin_users, scripts: [...], preload: "lazy", chunk: "app-route-admin-users.js" },
  ...
}
```

## Preamble Context

Preambles today reference `Hot` globals (cookies, query-string, jwt, etc.).
Under v0.9.0 the build compiles each `<* *>` block into an async function whose
first argument is a preamble context object:

```ts
async function preamble(ctx) {
  const { cookies, search, params, pathname, api } = ctx;
  // existing body — Hot.Cookies.get becomes cookies.get, etc.
}
```

At runtime, `Hot.navigate` constructs a fresh context per navigation and
passes it in. This is the one place `.hott` files see a mechanical change, and
HS090-3's compiler handles the rewrite — app authors don't do it by hand.

## Partials (`Hot.include`)

- **Static path (string literal):** compiler resolves at build time, bundles
  the partial into the template stash with a stable ID, rewrites the call
  site into a synchronous clone-from-stash.
- **Dynamic path (computed at runtime):** build warning. Disallowed in
  `--static` mode. App must be refactored to use explicit conditional
  `Hot.include('./a.hott')` vs `Hot.include('./b.hott')` branches.

Justification: the entire point of the static build is "no runtime fetches for
templates." Dynamic includes defeat that.

## Environment Configuration

Unchanged from current pattern: `config.json` sits next to the bundle, loaded
at runtime from `./config.json`. Kubernetes ConfigMap mounts override it per
environment. App code reads config via `Hot.getJSON('./config.json')` today;
that call continues to work (it's just a fetch of a sibling file the nginx pod
also serves). Documentation formalization in HS090-18.

## SEO / Crawlers

`staticRender: true` on a route opts that route into build-time rendering.
Compiler runs the preamble against a fixture data source (mock API response
file, seeded local DB, or live preview API) and bakes the resulting HTML
directly into the template stash. The crawler sees server-rendered HTML; the
user's browser still hydrates on load. Stale-on-rebuild is the trade-off (vs.
per-request rendering). For truly dynamic public pages, a prerender-service
fallback is documented but out of scope for v0.9.0 (HS090-19).

## Dependencies Between Tickets

```
HS090-1 (spec) — gates everything below

Phase 2 build pipeline:
  HS090-2 (HotSite.yaml schema)      ─┐
  HS090-3 (.hott parser split)       ─┤
  HS090-4 (hotstaq build --static)   ─┴─► HS090-5, 6, 7, 8, 9

Phase 3 runtime (parallel after HS090-3):
  HS090-10 (router)
  HS090-11 (mount)
  HS090-12 (swap / morph)
  HS090-13 (link + form interception)
  HS090-14 (history + scroll)

Phase 4 partials + prefetching (needs 2 + 3):
  HS090-15 (Hot.include build-time)
  HS090-16 (preload tiers)
  HS090-17 (hover prefetch)

Phase 5 environment / SEO (parallel with 4):
  HS090-18 (config.json docs)
  HS090-19 (staticRender + fixtures)

Phase 6 compat + migration (needs all above):
  HS090-20 (dual-mode compatibility — release gate)
  HS090-21 (migration guide + pilot rollout: FreelightAuth → FreeLightDAO → Freelight)
```

## Success Criteria

1. Every existing HotStaq app continues to build + run on v0.9.0 without code
   changes (SSR mode unchanged, verified via existing test suite).
2. `hotstaq build --static` produces a bundle that nginx serves directly with
   no Node process.
3. FreelightAuth pilots first, then FreeLightDAO, then Freelight campaign
   platform.
4. After the Freelight migration, the freelight Helm chart has a pure-nginx
   frontend container and an api-only container — matching the DAO chart shape.

## Trade-offs We're Accepting

- **Initial payload weight:** eager routes inline into index.html. Apps with
  many eager routes grow the first-byte payload. Mitigation: HS090-16
  eager/lazy/never tiers let app authors tune.
- **SEO for truly dynamic pages:** `staticRender` is snapshot-at-build, not
  per-request. Fully dynamic SEO-sensitive pages need a separate prerender
  path (out of scope v0.9.0).
- **Runtime dev feedback loop:** the static build's watch mode won't be as
  quick as the SSR dev loop for template-only edits. Addressed in a follow-up.
- **Hot.include dynamic paths:** banned under `--static`. Small breaking
  change for any app using them, surfaced via build warning and documented
  in HS090-21 migration guide.
