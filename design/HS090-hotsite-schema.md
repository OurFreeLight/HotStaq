# HotSite.yaml Schema Extensions for Static Build

**Status:** Draft • **Ticket:** HS090-2 • **Depends on:** HS090-1

Adds three new keys under `web.{appName}` (all optional, all backwards-compatible):

1. `routes[].preload` — `"eager" | "lazy" | "never"` (default `"eager"`)
2. `routes[].staticRender` — `boolean` (default `false`)
3. `partials` — explicit manifest so the compiler can resolve `Hot.include()`
   targets without crawling every `.hott` file

## Full Example

```yaml
name: FreelightAuth
server:
  dependencies:
    - "@hotstaq/userroute"

apis:
  AppAPI:
    file: ./src/AppAPI.ts
    baseUrl: http://localhost:8100

web:
  FreelightAuth:
    mainUrl: /
    jsFiles:
      - ./public/js/user-auth.js

    # NEW: explicit partial manifest. Compiler uses this to resolve
    # Hot.include() targets at build time. Paths are relative to publicDir.
    partials:
      - id: components/header
        src: ./public/components/header.hott
      - id: components/footer
        src: ./public/components/footer.hott

    routes:
      - path: /
        file: ./public/index.hott
        # NEW: preload tier.
        #   eager — template inlined into index.html stash, preamble in app.js bundle (default)
        #   lazy  — template + preamble ship in app-route-{slug}.js, prefetched on hover/focus
        #   never — same as lazy but no prefetch; loads on click
        preload: eager
      - path: /login
        file: ./public/login.hott
        preload: eager
      - path: /register
        file: ./public/register.hott
        preload: eager
      - path: /admin/users
        file: ./public/admin/users.hott
        preload: lazy
        # NEW: staticRender opts route into build-time preamble execution.
        # Compiler runs preamble against fixture data, bakes HTML into the
        # template stash. User's browser still hydrates on mount.
        staticRender: false
      - path: /terms
        file: ./public/terms.hott
        preload: lazy
        staticRender: true
        # When staticRender: true, compiler needs a fixture source. One of:
        #   fixtures: ./fixtures/terms.json       — static JSON
        #   fixturesApi: http://preview.../terms  — live preview API call
        #   fixturesScript: ./fixtures/terms.ts   — script that returns data
        fixtures: ./fixtures/terms.json
```

## JSON Schema (for editor autocomplete / validation)

Saved at `schemas/HotSite.schema.json`, referenced from HotSite.yaml via
`# yaml-language-server: $schema=...`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HotSite",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "server": { "type": "object" },
    "apis": {
      "type": "object",
      "additionalProperties": { "$ref": "#/definitions/api" }
    },
    "web": {
      "type": "object",
      "additionalProperties": { "$ref": "#/definitions/web" }
    }
  },
  "definitions": {
    "api": { "type": "object" },
    "web": {
      "type": "object",
      "properties": {
        "mainUrl": { "type": "string" },
        "jsFiles": { "type": "array", "items": { "type": "string" } },
        "routes": {
          "type": "array",
          "items": { "$ref": "#/definitions/route" }
        },
        "partials": {
          "type": "array",
          "items": { "$ref": "#/definitions/partial" },
          "description": "Explicit partial manifest for build-time Hot.include() resolution. Required when --static is used."
        }
      },
      "required": ["routes"]
    },
    "route": {
      "type": "object",
      "properties": {
        "path": { "type": "string" },
        "file": { "type": "string" },
        "preload": {
          "type": "string",
          "enum": ["eager", "lazy", "never"],
          "default": "eager",
          "description": "eager: inline in shell. lazy: chunk prefetched on hover. never: chunk loads on click, no prefetch."
        },
        "staticRender": {
          "type": "boolean",
          "default": false,
          "description": "When true, compiler runs the preamble at build time against fixtures and bakes resulting HTML into the template stash. For SEO-sensitive routes."
        },
        "fixtures": { "type": "string" },
        "fixturesApi": { "type": "string", "format": "uri" },
        "fixturesScript": { "type": "string" }
      },
      "required": ["path", "file"]
    },
    "partial": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "src": { "type": "string" }
      },
      "required": ["id", "src"]
    }
  }
}
```

## Defaults & Backwards Compatibility

- `preload` defaults to `"eager"`. Apps that never set it behave the same as
  they did pre-0.9 in --static mode (all routes inline).
- `staticRender` defaults to `false`. Apps that never set it behave the same.
- `partials` defaults to `[]`. In --static mode the compiler additionally
  crawls .hott files for string-literal `Hot.include()` calls and auto-adds
  them to the manifest; the explicit list is for apps that want to be strict
  (e.g. `hotstaq build --static --strict` fails on unlisted partials).
- **SSR mode ignores every one of these keys.** They are pure compiler input
  for `--static`. An SSR build reads them and simply doesn't act on them.

## Validation Rules Enforced by Compiler

- `preload: "lazy"` or `"never"` with `staticRender: true` is a hard error
  — staticRender implies "HTML needs to be in the shell for the crawler,"
  which contradicts lazy chunk loading. (Crawler loads the shell; lazy chunk
  isn't there yet.)
- `staticRender: true` without a fixture source (`fixtures`,
  `fixturesApi`, or `fixturesScript`) is a hard error.
- Duplicate `path` across routes is a hard error.
- Duplicate `id` across partials is a hard error.
- Partial `src` must resolve to a file under `publicDir` — is a build
  warning otherwise (or error under `--strict`).

## What This Unblocks

- HS090-4 (the CLI) reads these fields to drive the pipeline.
- HS090-5 (template stash emission) reads `preload` to decide which templates
  inline vs chunk.
- HS090-15 (Hot.include build-time resolution) uses the `partials` manifest.
- HS090-16 (per-route preload hints) is this schema, plumbed through to the
  emitter.
- HS090-19 (staticRender) uses `staticRender` + fixture fields.
