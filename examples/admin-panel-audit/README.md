# @hotstaq/admin-panel Browser Audit

Browser-truth verification harness for apps using
[`@hotstaq/admin-panel`](https://www.npmjs.com/package/@hotstaq/admin-panel)
on top of a `hotstaq build --static` output.

## What it checks

Runs your `dist/` through headless Chrome and verifies the full
runtime wiring admin-panel depends on:

- `HotStaqWeb` global (from `HotStaq.min.js`, loaded via `jsFiles`)
- `AdminPanelComponentsWeb` global (from `AdminPanelComponents.js`,
  loaded from the installed module's `public/js/`)
- `Hot.CurrentPage.processor` bootstrapped by the emitted component
  registration script
- `customElements.define` for each of the 8 admin-\* tags
- DataTable actually instantiated (`#userListTable` + `.dataTable`)
- `<admin-edit>` rendered its `<main>` wrapper
- No SEVERE browser console entries

Fails loudly on any gap so you know exactly where integration
broke.

## Running it

You need a local Chrome install; selenium-webdriver's Selenium
Manager fetches chromedriver automatically.

```bash
# From a project that has built its dist/ already
node <hotstaq-path>/examples/admin-panel-audit/verify.js

# Or override the dist location explicitly
DIST=/path/to/my-app/dist node examples/admin-panel-audit/verify.js

# Defaults:
#   DIST=./dist   (relative to cwd)
#   PORT=4456
```

Exit code is 0 on full pass, 1 on any check failure. A screenshot
of the rendered admin page lands at `<dist-parent>/admin-audit-screenshot.png`.

## HotSite.yaml snippet for an admin-panel consumer

```yaml
web:
  my-admin-app:
    mainUrl: /
    # Ship the legacy HotStaq client so AdminPanelComponentsWeb has
    # HotStaqWeb.HotComponent + Hot.CurrentPage to extend / bootstrap.
    jsFiles:
      - ./node_modules/hotstaq/build-web/HotStaq.min.js
    routes:
      - path: /
        file: ./public/admin.hott
        preload: eager
apis:
  AppAPI:
    libraryName: my_appWeb
    apiName: AppAPI
    url: http://localhost:3000
```

With `./public/hotstaq_modules/@hotstaq/admin-panel/` installed (via
`hotstaq module install @hotstaq/admin-panel`), the v0.9.0 builder
automatically:

- Preloads the module manifest so `Hot.include("@hotstaq/admin-panel/admin-header.hott", …)`
  path resolution works
- Lifts admin-panel's css/js link references into the shell `<head>`
- Emits a component-registration script that bootstraps
  `Hot.CurrentPage.processor` from `HotStaqWeb` and calls
  `customElements.define()` for every `<admin-*>` tag
- Copies `public/hotstaq_modules/` verbatim into `dist/`

## When this check fails

Common causes:

- `jsFiles` missing the `HotStaq.min.js` entry → `HotStaqWeb` never
  loads → components can't extend `HotStaqWeb.HotComponent`.
- `hotstaq_modules/@hotstaq/admin-panel/index.js` not copied into
  `dist/` → the preload step can't find the module's manifest.
- API URL in `apis.*.url` unreachable → DataTable renders but hangs
  on "Loading…" (this is *not* a verification failure; the harness
  only checks whether the DataTable was instantiated, not whether it
  resolved data).
