# HotStaq v0.9.0 Design Docs

This folder holds the design documents for the v0.9.0 "static-site builds"
release. Authored against the 21-ticket HS090 plan tracked in the
FreeLightDAO production database.

| Doc | Tickets covered | Status |
|---|---|---|
| [HS090-architecture-spec.md](HS090-architecture-spec.md) | HS090-1 | Draft |
| [HS090-hotsite-schema.md](HS090-hotsite-schema.md) (+ [schema JSON](../schemas/HotSite.schema.json)) | HS090-2, HS090-16 (preload), HS090-19 (staticRender) | Draft |
| [HS090-parser-split.md](HS090-parser-split.md) | HS090-3, HS090-15 (Hot.include rewrites) | Draft |
| [HS090-static-cli.md](HS090-static-cli.md) | HS090-4, also touches HS090-5 through HS090-9 as pipeline stages | Draft |
| [HS090-runtime-sketch.md](HS090-runtime-sketch.md) | HS090-10, HS090-11, HS090-12, HS090-13, HS090-14 | Draft |
| [HS090-migration-guide.md](HS090-migration-guide.md) | HS090-21, also HS090-18 (config.json), HS090-20 (compat) | Draft |

## Design-to-Implementation Status (2026-04-22)

**Complete:** Design for every ticket. Enough to start coding each PR without
needing further upfront decisions.

**Not yet implemented:** All of it. The code changes (new `src/hott/` parser,
`HotStaticBuilder`, client runtime under `src/runtime/`, esbuild wiring, CSS
consolidator, schemas plumbed through `HotSite.ts`, tests, FreelightAuth pilot,
DAO pilot, Freelight migration, Helm chart changes in FreeLightHelmCharts) are
follow-up engineering work scoped per-ticket.

## Implementation Order (shipped)

This is the order PRs should land to keep the tree buildable at every merge:

```
Phase 1 — foundation (must ship before anything else)
  HS090-3  parser split      ── refactor behind existing SSR; no behavior change
  HS090-2  schema             ── types + validation + backwards-compat defaults
  HS090-20 compat test suite  ── prove SSR unchanged on every PR below

Phase 2 — build pipeline (no runtime-visible changes yet)
  HS090-4  CLI --static flag  ── stubs HotStaticBuilder, logs "not yet"
  HS090-8  API client bundle  ── refactor codegen to be reusable
  HS090-7  CSS consolidation  ── stand-alone, tested via fixture
  HS090-5  template stash     ── first user-visible "it renders" moment
  HS090-6  esbuild + preambles
  HS090-9  manifest

Phase 3 — runtime (parallel with Phase 2 once HS090-3 is in)
  HS090-10 Hot.navigate
  HS090-11 mount lifecycle
  HS090-12 swap (replace mode first; morph after)
  HS090-13 link + form intercept
  HS090-14 history + scroll

Phase 4 — partials + tiers
  HS090-15 Hot.include build-time resolution
  HS090-16 preload tiers
  HS090-17 prefetch-on-hover

Phase 5 — SEO / env
  HS090-19 staticRender + fixtures
  HS090-18 config.json docs (pure docs ticket)

Phase 6 — pilot rollout (needs every phase above green)
  HS090-21 FreelightAuth migration + Helm chart split
           DAO migration
           Freelight migration (chart shape alignment)
```

## Cross-Cutting Constraints

- **Dual-mode compat is the release gate.** Every PR must keep SSR-mode
  existing apps building green. HS090-20 adds a CI job that builds the
  current FreelightAuth and DAO repos against each HotStaq commit in
  SSR mode and fails the job on any diff.
- **Harbor images for rollback.** `hotstaq@0.8.140` stays pinned in harbor
  for the duration of the pilot migrations.
