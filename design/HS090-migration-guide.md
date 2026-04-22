# Migration Guide — Porting Apps to `hotstaq build --static`

**Status:** Draft • **Ticket:** HS090-21 • **Depends on:** all prior HS090-* tickets

## Pilot Order

1. **FreelightAuth** (first — smallest surface)
   - 3 routes: `/`, `/login`, `/register`, plus 2 partials (header, footer)
   - No live data rendered server-side
   - No SEO requirement
   - OIDC `/interaction/…` endpoints stay Express-served — only the
     `.hott` pages migrate to static
2. **FreeLightDAO** (second — biggest; chart already splits frontend+API)
   - Rich app (projects, proposals, budgets, agreements, …)
   - Admin panel usage exercises the full CSS path (HS090-7)
   - Morph-based swap (HS090-12) recommended for sidebar stability
3. **Freelight campaign platform** (last — collapses combined container)
   - After migration the `freelight` Helm chart switches from "Node web-api
     container" to "nginx static container + API-only container", matching
     the DAO chart shape (the ecosystem goal stated in HS090-1)

## Per-App Checklist

For each app the author runs through:

1. **Upgrade HotStaq** to `^0.9.0` in `package.json`. SSR behavior is unchanged,
   so this alone ships without breakage.
2. **Audit `Hot.include()` calls** for dynamic paths:
   ```bash
   grep -rE "Hot\.include\s*\(" public/ src/ | grep -vE "Hot\.include\s*\(\s*['\"]"
   ```
   Any line that shows up needs refactor — convert to explicit
   `if/else` branches that include specific literal paths, or replace
   with a data-driven template.
3. **Add `partials:` manifest** to `HotSite.yaml` (HS090-2) for every
   header/footer/component partial the app uses. Auto-discovery will
   catch literal paths, but the explicit list is what passes `--strict`
   in CI.
4. **Tier routes under `preload:`** — start with all `eager` (default),
   move heavy or rarely-visited routes to `lazy` after bundle size report
   (HS090-4 `--verbose`).
5. **Opt SEO routes into `staticRender: true`** — marketing pages, /terms,
   /privacy, campaign detail pages. Provide a fixture source (JSON file
   is the lowest friction).
6. **Run `hotstaq build --static --strict`**. Fix all warnings until it
   exits 0.
7. **Preview locally:** `cd dist && npx serve .` → open in browser, click
   through every route, verify forms post successfully and back/forward
   work.
8. **Update Helm chart** (bigger change — see next section).
9. **Deploy staging → verify → production.**

## Helm Chart Changes

### FreelightAuth (pilot)

- Current: one deployment, Node container serves both `.hott` + `/v1/*`
- Target: split into `freelight-auth-frontend` (nginx) +
  `freelight-auth-api` (Node, Express + oidc-provider only)
  - Frontend container: `nginx:alpine` serving `./dist` from HS090-4 output
  - API container keeps the Express app but drops the web-file-serving
    handlers (HotHTTPServer "fileExtensions" stays for the API but the
    static layer happens in nginx)
- `config.json` override: the existing ConfigMap mount pattern moves
  from the Node web root to the nginx web root — one path change in
  `values.yaml`
- OIDC interaction POSTs still need to reach the API container; route via
  HTTPRoute (nginx doesn't handle them)

### FreeLightDAO

- Chart already splits frontend + API. Swap the `freelight-dao-frontend`
  image from the `hotstaq run` container to nginx:alpine.
- `index.html` copy from `index.$ENVIRONMENT.html` at container startup
  (per memory, this is existing pattern) — migrate to a simpler
  `config.json` ConfigMap swap since we're static now. One commit in
  FreeLightHelmCharts.

### Freelight

- Current: combined `freelight` container runs both web + api.
- Target: split to match DAO. Biggest mechanical diff of the three.
- Blocks on: HS090-21 FreelightAuth pilot validation (proves the pattern
  works end-to-end), HS090-7 CSS consolidation (DAO admin-panel CSS
  crossover), morph swap (dashboard stability).

## Compat Rules We Enforce

(From HS090-20 — re-stated here so migrators know what *will* break on
intentional misuse.)

- Dynamic `Hot.include()` paths are banned under `--static`. Build warning
  in permissive mode; error in `--strict`.
- `preload: lazy|never` + `staticRender: true` is disallowed (crawler can't
  fetch the lazy chunk).
- Partial / route file references that don't resolve are hard errors
  (even without `--strict`). Previously these produced 404s at runtime;
  now they're caught at build.
- `Hot.echoUnsafe` still works but the output is inline HTML the preamble
  produces — it does *not* mutate the document for scripts loaded via
  `Hot.include`. Migration note because a few apps relied on the chained
  mutation.

## Rollback Plan

- Each app keeps both build paths working (via `--static` flag). Revert is
  "don't pass `--static`" and ship the old Node container image.
- `hotstaq@0.8.140` container images stay in harbor for emergencies.
- Helm chart changes include the old container as a commented alternative
  for 2 minor releases.

## Known Open Items (follow-ups, not v0.9.0)

- Watch/HMR dev loop for `--static` (HS090-22, not yet ticketed).
- Prerender service integration for truly-dynamic SEO pages
  (HS090-23-ish).
- Route-code-splitting heuristics beyond the declarative hint
  (future release).
