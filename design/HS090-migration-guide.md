# Migration Guide — Porting Apps to `hotstaq build --static`

**Status:** In progress • **Ticket:** HS090-21 • **Depends on:** all prior HS090-* tickets

## Pilot App Migration Runbook (FreelightAuth first, DAO second, Freelight last)

The pilot fixture in `tests/hott/FreelightAuthFixture.ts` is the executable
reference. When that suite is green on a commit, the surface covered here
is known to work end to end: preambles (Hot.getJSON / Hot.Cookies.get /
Hot.includeJS / Hot.include with literal partial), generated API client
bundling (HS090-8), lazy chunk loading (HS090-5/-16), link + form
interception (HS090-12/-13), scroll restoration (HS090-14).

### Per-app checklist (apply in this order)

```
1. Add the hotstaq@^0.9.0 dep in package.json.
2. Audit .hott files for dynamic Hot.include(varName) calls — refactor
   to explicit literal branches:
     if (cond) await Hot.include('./a.hott');
     else      await Hot.include('./b.hott');
   Dynamic includes warn; under --strict they error.
3. Move admin-panel CSS and app CSS into HotSite.yaml:
     web.{appName}.cssFiles:
       - node_modules/@hotstaq/admin-panel/public/main.css
       - ./public/css/app.css
4. Declare web.{appName}.routes: path / file / preload (eager|lazy|never).
   Mark landing + login routes eager; admin routes lazy.
5. If an .hott uses Hot.includeJS('./js/foo.js', [args]), the helper script
   is now evaluated inside an async Function whose positional params are
   _a0, _a1, ... and whose `this` is the hotCtx. Adapt accordingly:
     BEFORE (argument names from a wrapper the legacy includeJS used):
       let config = arguments[0]; let jwt = arguments[1];
     AFTER (positional parameters):
       const [config, jwt] = [_a0, _a1];
     If the script should yield a value, assign it to `__hott_export`
     and return via the caller's Promise.
6. Run `hotstaq generate --api` (or `npm run build-web`) to produce the
   ./public/js/${libraryName}_${apiName}.js client. v0.9.0 bundles it
   automatically if HotSite.apis has libraryName + apiName set.
7. Build: `hotstaq --hotsite ./HotSite.yaml build --static --out ./dist`
   Add `--strict` in CI. `--verbose` prints the emitted entry source
   and per-file sizes.
8. Preview: `cd dist && npx serve -s .` (or run a scratch static server).
   Click every route, confirm forms + back/forward work, DevTools
   should show no console errors after mount.
9. Update the Helm chart:
     - freelight-auth-frontend: nginx:alpine serving ./dist
     - freelight-auth-api:      existing Node container, only /v1/* and
                                /interaction/* (OIDC) routes
     - HTTPRoute:                same host, paths split between the two
10. Deploy staging → verify → production.
```

### Known Hot.* surface coverage (as of HS090 v0.9.0)

| Source                       | Rewrite                       |
|------------------------------|-------------------------------|
| `Hot.Cookies.get/set/remove` | `hotCtx.cookies.*`            |
| `Hot.getJSON(url)`           | `hotCtx.getJSON(url)`         |
| `Hot.echoUnsafe(html)`       | `hotCtx.echo(html)`           |
| `Hot.echo(html)`             | `hotCtx.echo(html)`           |
| `Hot.import(pkg)`            | `hotCtx.import(pkg)`          |
| `Hot.includeJS(url, args)`   | `hotCtx.includeJS(url, args)` |
| `Hot.include(literal.hott)`  | build-time partial + runtime `hotCtx.includeStash(id)` |
| `Hot.include(dynamicVar)`    | warning; refactor to literals |
| `Hot.API`                    | `hotCtx.api`                  |
| `Hot.getUrlParam(name)`      | `hotCtx.search.get(name)`     |
| `Hot.pathname / .params`     | `hotCtx.pathname / .params`   |

Unknown `Hot.*` references pass through and emit an `hott/hot-unknown-member`
warning so the migration guide can catch uncovered surface.

### Rollback

- Apps keep both build paths (SSR + static). Revert = don't pass
  `--static`, ship the old Node container image.
- `hotstaq@0.8.141` images stay pinned in harbor until every pilot app
  is production-stable on v0.9.0.
- Helm chart changes keep the old Node-frontend container definition as
  a commented alternative for at least two minor releases.

---



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
