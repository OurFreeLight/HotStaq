# `hotstaq build --static` CLI Command

**Status:** Draft • **Ticket:** HS090-4 • **Depends on:** HS090-1, HS090-2, HS090-3

## Surface

```
hotstaq build --static \
  --hotsite ./HotSite.yaml \
  [--out ./dist] \
  [--mode production|development] \
  [--strict] \
  [--verbose]
```

- `--static` — opt-in flag. Without it, the existing `build` command runs
  unchanged (SSR compilation). This is the HS090-20 dual-mode guarantee.
- `--hotsite` — path to HotSite.yaml. Current semantics.
- `--out` — dist root. Defaults to `./dist`.
- `--mode` — `production` minifies app.js / app.css, strips sourcemaps from
  loaded URLs; `development` leaves them readable. Current dev scripts stay
  distinct (`hotstaq develop --static` for watch mode, ticket follow-up).
- `--strict` — escalate compiler warnings (dynamic `Hot.include`, unknown
  partial paths, staticRender-without-fixture) to errors. Intended for CI.
- `--verbose` — prints route-by-route bundle size breakdown.

## Wiring (inside HotStaq)

Add a flag to the existing `build` subcommand in `src/HotCLI.ts` rather than
creating a new subcommand — both pipelines share front-loading (yaml parse,
API codegen, TS typecheck). The branch happens once the build graph is known:

```ts
// pseudo — actual lives in src/HotCLI.ts
const buildCmd = new commander.Command("build");
buildCmd.option("--static", "emit a static nginx-servable bundle instead of the SSR server");
buildCmd.option("--strict", "fail on compiler warnings");
buildCmd.option("--out <dir>", "output directory", "./dist");
buildCmd.action(async (opts) => {
    const site = await loadHotSite(opts.hotsite);
    await codegenWebApi(site);                  // HS090-8 (shared with SSR)

    if (opts.static) {
        const builder = new HotStaticBuilder(site, opts);
        await builder.build();                  // HS090-4 driver (this ticket)
    } else {
        await runLegacyBuild(site, opts);       // unchanged
    }
});
```

## Pipeline Driver

`HotStaticBuilder` orchestrates the sub-stages. Each stage is a class with
a single async `run()` — makes the build testable in isolation.

```ts
class HotStaticBuilder {
    constructor(site: IHotSite, opts: BuildOptions) {
        this.site = site;
        this.opts = opts;
        this.warnings: BuildWarning[] = [];
        this.manifest: ManifestEntry[] = [];
    }

    async build() {
        //  0. clean output dir
        await this.resetOutputDir();

        //  1. parse every .hott (HS090-3)
        const modules = await this.parseAllHottFiles();

        //  2. resolve partials (HS090-15)
        await this.resolvePartials(modules);

        //  3. render any staticRender routes against fixtures (HS090-19)
        await this.prerenderStaticRenderRoutes(modules);

        //  4. emit template stash (HS090-5) — accumulates HTML
        const stash = this.emitTemplateStash(modules);

        //  5. bundle preambles + runtime + API client via esbuild (HS090-6, HS090-8)
        const appJs = await this.bundleAppJs(modules);

        //  6. consolidate CSS (HS090-7)
        const appCss = await this.bundleAppCss();

        //  7. emit index.html shell with stash + bundle refs
        const indexHtml = this.emitIndexHtml(stash, appJs.hash, appCss.hash);

        //  8. copy assets/
        await this.copyAssets();

        //  9. preserve config.json (runtime env, unchanged — HS090-18)
        await this.copyConfig();

        // 10. build-manifest.json (HS090-9)
        await this.writeManifest();

        // 11. enforce --strict
        if (this.opts.strict && this.warnings.length > 0) {
            throw new Error(`${this.warnings.length} warning(s) in strict mode`);
        }

        this.printSizeReport();
    }
}
```

## Output Contract (matches HS090-1 + HS090-9)

After a successful `build --static`:

```
./dist/
├── index.html            # shell + inline <template> stash
├── app.js                # runtime + preambles + API client
├── app.js.map            # always in dev; also prod unless --no-sourcemap
├── app.css
├── app.css.map
├── config.json
├── assets/…
└── build-manifest.json   # { files: [{ path, size, sha256 }], version, builtAt, hotstaqVersion }
```

## Exit Status

| Exit | Condition |
|------|-----------|
|  0   | Build succeeded (warnings allowed unless `--strict`) |
|  1   | Fatal compiler error (e.g. .hott parse failure, missing route file) |
|  2   | CLI arg validation failure (e.g. `--out` not writable) |
|  3   | `--strict` escalation from warnings |

## Warnings vs. Errors

**Warnings (printed, nonfatal without `--strict`):**
- Dynamic `Hot.include()` call (target not a string literal).
- Partial referenced but not listed in `partials:` and auto-discovery couldn't
  resolve the literal path.
- `staticRender: true` fixture source returned partial / empty data.
- Bundle size over configurable budget (warn only; controlled in HotSite.yaml
  under `build.budget.{appBundleKb, routeChunkKb}`).

**Errors (always fatal):**
- Parse failure in a `.hott` file.
- `preload: lazy|never` combined with `staticRender: true`.
- Duplicate `path` or partial `id`.
- Referenced `file:` doesn't exist.
- `staticRender: true` without a fixture source.
- esbuild failure, typecheck failure.

## Integration with Existing Dev Flow

`hotstaq develop` today runs the SSR server with file watching. Out of scope
for v0.9.0 is a full `hotstaq develop --static` that live-rebuilds the bundle
+ serves via a dev middleware with morph-based reload. For v0.9.0 the expected
dev flow during pilot migrations is:

1. `hotstaq build --static --mode development --out ./dist` on save (watch).
2. Any lightweight static server (nginx locally, or `npx serve ./dist`) for
   dev preview.
3. Browser refresh — SPA runtime takes over from there.

A proper watch/HMR mode is a follow-up ticket.

## Testing Strategy

- **Unit tests** per pipeline stage (stash emitter, preamble bundler, CSS
  consolidator) with .hott fixtures and inline-snapshot asserts on output
  structure.
- **Integration tests** use the existing `tests/hotstaq/` app plus a new
  `tests/hotstaq-static/` minimal app that exercises eager + lazy + partial
  + staticRender in one bundle. The CI job `build --static` then diffs the
  output against a checked-in golden manifest.
- **E2E regression** — add a FreelightAuth sanity bundle build to CI using
  the migrated FreelightAuth chart after HS090-21 pilot #1 lands.
