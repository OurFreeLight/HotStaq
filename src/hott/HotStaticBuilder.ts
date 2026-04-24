/**
 * Static-build pipeline driver for `hotstaq build --static`. Orchestrates
 * the stages defined in design/HS090-static-cli.md:
 *
 *   0. reset output dir
 *   1. parse every .hott file (HS090-3)              ← implemented
 *   2. resolve partials (HS090-15)                    ← stubbed
 *   3. prerender staticRender routes (HS090-19)       ← stubbed
 *   4. emit template stash (HS090-5)                  ← basic impl
 *   5. bundle preambles + runtime via esbuild (HS090-6) ← stubbed
 *   6. consolidate CSS (HS090-7)                      ← stubbed
 *   7. emit index.html shell                          ← basic impl
 *   8. copy assets                                    ← basic impl
 *   9. copy config.json (HS090-18)                    ← basic impl
 *  10. write build-manifest.json (HS090-9)            ← basic impl
 *  11. enforce --strict
 *
 * The "stubbed" stages log a note and skip — HS090-5/-6/-7/-15/-19 fill
 * them in. The skeleton is end-to-end walkable today so apps can start
 * trialling the CLI (they'll get a dist/ with the template stash + a
 * placeholder app.js until the bundler lands).
 */

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as ppath from "path";
import * as crypto from "crypto";

import * as esbuild from "esbuild";

import { HotSite, HotSiteWebRoute, HotSiteWebApiClient } from "../HotSite";
import { HotLog, HotLogLevel } from "../HotLog";

import { compileSource } from "./compile";
import { HottModule, PartialCallRecord } from "./types";
import { partialIdFromPath } from "./rewrite-preamble";
import { expandPartial, SandboxModule, AssetCollector } from "./build-expand";
import {
	validateHotSiteForStatic,
	HotSiteValidationIssue
} from "./validate-hotsite";

export interface StaticBuildOptions
{
	/** Output directory. Defaults to "./dist". */
	out?: string;
	/** "production" | "development". Defaults to "production". */
	mode?: "production" | "development";
	/** Escalate warnings to errors. */
	strict?: boolean;
	/** Print per-route size breakdown. */
	verbose?: boolean;
	/** Resolve file: paths in the HotSite relative to this directory. */
	cwd?: string;
	/**
	 * Directory served as the site's public root. Defaults to "./public"
	 * under cwd. Static assets outside this directory are not copied.
	 */
	publicDir?: string;
	/** Optional logger; defaults to stdout. */
	logger?: HotLog;
}

export interface BuildWarning
{
	code: string;
	message: string;
	/** Optional HotSite path or source location. */
	where?: string;
}

export interface ManifestEntry
{
	path: string;
	size: number;
	sha256: string;
}

/**
 * Build output metadata. Describes what was emitted (file hashes, entry
 * filenames) and embeds the full HotSite that drove the build so
 * downstream deploy tooling has a single source of truth for routes,
 * apiClients, cssFiles, jsFiles etc. — no duplicated/derived fields.
 */
export interface BuildManifest
{
	/** Schema version for downstream deploy tooling. Bumped on shape changes. */
	manifestVersion: 1;
	/** ISO timestamp. */
	builtAt: string;
	/** Build mode. */
	mode: "production" | "development";
	/** hotstaq package version that emitted this manifest. */
	hotstaqVersion: string;
	/** Canonical entry filenames relative to the dist root. */
	entry: {
		html: string;
		js: string;
		css: string;
	};
	/** Full list of emitted files with sizes + hashes, sorted by path. */
	files: ManifestEntry[];
	/**
	 * The HotSite this build was driven from. Includes app name,
	 * version, web.{app}.routes, web.{app}.apiClient, apis.* etc. —
	 * consumers that need route or API-client info should walk this
	 * rather than reading duplicated derived fields.
	 */
	hotSite: HotSite;
}

export interface CompiledRoute
{
	route: HotSiteWebRoute;
	absFile: string;
	module: HottModule;
}

/**
 * Resolved API client wiring for one web app. Populated during build if
 * HotSite provides enough info to bundle the generated client.
 */
export interface ResolvedApiClient
{
	/** Path the script is served at under dist/ (e.g. "js/freelight_authWeb_AppAPI.js"). */
	distPath: string;
	/** window.{libraryName} set as a side effect of loading the script. */
	libraryName: string;
	/** {libraryName}.{apiName} is the class the runtime instantiates. */
	apiName: string;
	/** Base URL passed to the client constructor. */
	baseUrl: string;
}

/**
 * Orchestrator. Callers: `new HotStaticBuilder(site, opts).build()`.
 */
export class HotStaticBuilder
{
	readonly site: HotSite;
	readonly opts: Required<Pick<StaticBuildOptions, "out" | "mode" | "strict" | "verbose" | "cwd" | "publicDir">>;
	readonly logger: HotLog;
	readonly warnings: BuildWarning[] = [];
	readonly manifestFiles: ManifestEntry[] = [];
	readonly compiledRoutes: Map<string, CompiledRoute[]> = new Map ();
	readonly resolvedApiClients: Map<string, ResolvedApiClient> = new Map ();
	readonly resolvedPartials: Map<string, string> = new Map ();
	/** HS090-16: per-route chunk entries (relative dist path). */
	readonly routeChunks: Map<string, string> = new Map ();
	/** HS090-15 build-time expansion: shared across partial expansions. */
	private readonly moduleRegistry: Map<string, SandboxModule> = new Map ();
	/** HS090-15: shell-head-hoisted <link>/<script> references from modules. */
	private readonly shellCss: string[] = [];
	private readonly shellJs: string[] = [];
	private readonly shellComponents: Array<{ library: string; names: string[] }> = [];

	constructor (site: HotSite, opts: StaticBuildOptions = {})
	{
		this.site = site;
		this.opts = {
			out: opts.out || "./dist",
			mode: opts.mode || "production",
			strict: !!opts.strict,
			verbose: !!opts.verbose,
			cwd: opts.cwd || process.cwd (),
			publicDir: opts.publicDir || "./public"
		};
		this.logger = opts.logger || new HotLog (HotLogLevel.All);
	}

	async build (): Promise<void>
	{
		this.logger.info (`[hs090] static build starting (mode=${this.opts.mode})`);

		// Validation gate — every issue from validateHotSiteForStatic is
		// either a precondition for later stages or a hard user error.
		const validation = validateHotSiteForStatic (this.site);
		for (const issue of validation.errors)
			this.fatal (issue);
		if (validation.errors.length > 0)
			throw new Error (`HotSite validation failed (${validation.errors.length} error(s)).`);

		for (const w of validation.warnings)
			this.warnings.push ({ code: w.code, message: w.message, where: w.path });

		await this.resetOutputDir ();

		// 1. parse every .hott — HS090-3 lands this; we use it directly.
		await this.parseAllHottFiles ();

		// 1b. resolve API clients (HS090-8).
		await this.resolveApiClients ();

		// 1c. copy web.{app}.jsFiles + queue them for the shell head.
		await this.resolveJsFiles ();

		// 2. resolve partials (HS090-15).
		await this.resolvePartials ();

		// 3. staticRender routes — HS090-19.
		await this.prerenderStaticRoutes ();

		// 4. template stash.
		const stash = this.emitTemplateStash ();

		// 5a. emit lazy route chunks (HS090-5, HS090-16).
		await this.bundleLazyRouteChunks ();

		// 5. app.js bundle — HS090-6 (eager routes + runtime).
		const appJs = await this.bundleAppJs ();

		// 6. app.css — HS090-7 (stub: empty file).
		const appCss = await this.bundleAppCss ();

		// 7. index.html.
		await this.emitIndexHtml (stash, appJs, appCss);

		// 8. copy public assets verbatim (excluding .hott).
		await this.copyAssets ();

		// 9. copy config.json if it exists.
		await this.copyConfig ();

		// 10. manifest.
		await this.writeManifest ({ html: "index.html", js: appJs.path, css: appCss.path });

		// 11. strict gate.
		if (this.opts.strict && this.warnings.length > 0)
		{
			this.logger.error (`${this.warnings.length} warning(s) in --strict mode`);
			for (const w of this.warnings)
				this.logger.error (`  [${w.code}] ${w.message}${w.where ? ` (${w.where})` : ""}`);
			throw new Error (`--strict: ${this.warnings.length} warning(s) escalated to errors.`);
		}

		if (this.warnings.length > 0)
		{
			this.logger.info (`[hs090] ${this.warnings.length} warning(s):`);
			for (const w of this.warnings)
				this.logger.info (`  [${w.code}] ${w.message}${w.where ? ` (${w.where})` : ""}`);
		}

		if (this.opts.verbose)
			this.printSizeReport ();

		this.logger.info (`[hs090] static build complete → ${this.absOut ()}`);
	}

	// ── Stages ────────────────────────────────────────────────────────

	async resetOutputDir (): Promise<void>
	{
		const abs: string = this.absOut ();
		await fsp.rm (abs, { recursive: true, force: true });
		await fsp.mkdir (abs, { recursive: true });
		await fsp.mkdir (ppath.join (abs, "assets"), { recursive: true });
	}

	async parseAllHottFiles (): Promise<void>
	{
		if (!this.site.web)
			return;

		for (const appName of Object.keys (this.site.web))
		{
			const app = this.site.web[appName];
			const routes: HotSiteWebRoute[] = app.routes || [];
			const compiled: CompiledRoute[] = [];

			for (const r of routes)
			{
				const absFile: string = ppath.resolve (this.opts.cwd, r.file);

				if (!fs.existsSync (absFile))
				{
					this.fatal ({
						code: "hotsite/route-file-missing",
						severity: "error",
						message: `Route ${r.path}: file ${r.file} not found at ${absFile}.`
					});
					throw new Error (`Missing route file: ${absFile}`);
				}

				const src: string = await fsp.readFile (absFile, "utf8");
				const mod: HottModule = compileSource (src, { filename: absFile });

				for (const w of mod.warnings)
				{
					this.warnings.push ({
						code: w.code,
						message: w.message,
						where: absFile
					});
				}

				compiled.push ({ route: r, absFile, module: mod });
			}

			this.compiledRoutes.set (appName, compiled);
		}
	}

	/**
	 * HS090-19: run staticRender: true route preambles in Node against
	 * their fixture data and bake the resulting HTML into the route's
	 * template. The runtime still re-runs the preamble on mount for
	 * hydration — baked HTML exists purely for crawlers that see the
	 * first-paint response.
	 *
	 * MVP supports JSON `fixtures` only. `fixturesApi` and
	 * `fixturesScript` are accepted by the schema but will warn and
	 * skip prerender (route falls back to eager template mode).
	 */
	async prerenderStaticRoutes (): Promise<void>
	{
		for (const [appName, compiled] of this.compiledRoutes.entries ())
		{
			for (const cr of compiled)
			{
				if (!cr.route.staticRender)
					continue;

				const fixtureData: any = await this.loadFixtureData (appName, cr);
				if (fixtureData === undefined)
					continue; // warning already logged; fall back to template-only.

				const bakedHtml: string | null = await this.runPreambleInNode (cr, fixtureData);
				if (bakedHtml === null)
					continue;

				// Replace the route's template with the baked HTML. The
				// runtime re-executes the preamble on mount — idempotent
				// preambles produce the same DOM either way; non-idempotent
				// ones end up replacing the baked markup.
				cr.module.template = bakedHtml;
			}
		}
	}

	private async loadFixtureData (appName: string, cr: CompiledRoute): Promise<any>
	{
		if (cr.route.fixtures)
		{
			const abs: string = ppath.resolve (this.opts.cwd, cr.route.fixtures);
			if (!fs.existsSync (abs))
			{
				this.warnings.push ({
					code: "hs090-19/fixture-missing",
					message: `Fixture file not found: ${cr.route.fixtures} (resolved to ${abs}).`,
					where: `web.${appName} route ${cr.route.path}`
				});
				return (undefined);
			}
			try
			{
				return (JSON.parse (await fsp.readFile (abs, "utf8")));
			}
			catch (err)
			{
				this.warnings.push ({
					code: "hs090-19/fixture-parse-failed",
					message: `Could not parse fixture JSON ${cr.route.fixtures}: ${String (err)}.`,
					where: `web.${appName} route ${cr.route.path}`
				});
				return (undefined);
			}
		}
		if (cr.route.fixturesApi || cr.route.fixturesScript)
		{
			this.warnings.push ({
				code: "hs090-19/fixture-source-unsupported",
				message: `fixturesApi / fixturesScript not supported in MVP; route ${cr.route.path} will not prerender.`,
				where: `web.${appName}`
			});
			return (undefined);
		}
		this.warnings.push ({
			code: "hs090-19/fixture-missing-source",
			message: `Route ${cr.route.path} has staticRender: true but no fixtures declared.`,
			where: `web.${appName}`
		});
		return (undefined);
	}

	private async runPreambleInNode (cr: CompiledRoute, fixtureData: any): Promise<string | null>
	{
		const echoed: string[] = [];
		const ctx: any = {
			cookies: {
				get: (_name: string): string | null => null,
				set: (_name: string, _value: string, _opts?: object): void => {},
				remove: (_name: string, _opts?: object): void => {}
			},
			search: new URLSearchParams (),
			pathname: cr.route.path,
			params: {},
			api: {},
			async getJSON (url: string): Promise<any>
			{
				// Fixture lookup: if fixtureData has a key matching the URL,
				// return that; else return the whole fixture object.
				if (fixtureData && typeof fixtureData === "object" && url in fixtureData)
					return (fixtureData[url]);
				return (fixtureData);
			},
			async import (): Promise<any> { return ({}); },
			includeStash (id: string): string
			{
				return (this.resolvedPartials?.get?.(id) || "");
			},
			echo (html: string): void { echoed.push (html); },
			async includeJS (): Promise<any> { return (undefined); }
		};
		ctx.resolvedPartials = this.resolvedPartials;

		try
		{
			// eslint-disable-next-line no-new-func
			const fn: Function = new Function ("hotCtx",
				`return (async () => { ${cr.module.preamble || ""}\n })();`);
			await fn (ctx);
		}
		catch (err)
		{
			this.warnings.push ({
				code: "hs090-19/prerender-threw",
				message: `Preamble for ${cr.route.path} threw during prerender: ${String (err)}. Falling back to template-only.`,
				where: cr.absFile
			});
			return (null);
		}

		return (cr.module.template + echoed.join (""));
	}

	/**
	 * HS090-15: resolve every literal Hot.include() target hoisted by
	 * the parser into a compiled partial. Also honours the explicit
	 * `web.{appName}.partials` manifest (takes precedence; its `src` is
	 * the canonical path for a given `id`). Partials can recursively
	 * include other partials — we walk until a fixed point or we hit
	 * a cycle (cycles warn and break).
	 */
	async resolvePartials (): Promise<void>
	{
		if (!this.site.web)
			return;

		// Preload every installed hotstaq module so both the top-level
		// partial path resolver AND the sandbox's Hot.include can map
		// module-prefixed paths (e.g. "@hotstaq/admin-panel/admin-header.hott")
		// to their on-disk location via the module's name → path table.
		await this.preloadInstalledModules ();

		type PartialWork = {
			stashId: string;
			src: string;
			args: Record<string, any> | null;
			fromApp: string;
		};

		const queue: PartialWork[] = [];
		const seenIds: Set<string> = new Set ();
		const idToHtml: Map<string, string> = new Map ();

		// 1. Seed from explicit `partials:` manifests (no args — raw stash).
		for (const appName of Object.keys (this.site.web))
		{
			const app = this.site.web[appName];
			for (const p of app.partials || [])
				queue.push ({ stashId: p.id, src: p.src, args: null, fromApp: appName });
		}

		// 2. Seed from every literal Hot.include() call site the parser
		//    captured — includes args-carrying calls like
		//    Hot.include('admin-header', { TITLE, SIDEBAR_ITEMS }).
		for (const [appName, routes] of this.compiledRoutes.entries ())
		{
			for (const cr of routes)
			{
				// Walk structured partialCalls first.
				for (const call of cr.module.partialCalls)
				{
					queue.push ({
						stashId: call.stashId,
						src: call.path,
						args: call.args,
						fromApp: appName
					});
				}

				// partialCalls is the source of truth now — every literal
				// Hot.include site (with or without args) is captured
				// there with its own stashId. No bare-path fallback.
			}
		}

		while (queue.length > 0)
		{
			const work: PartialWork = queue.shift ()!;
			if (seenIds.has (work.stashId))
				continue;

			const abs: string = this.resolvePartialPath (work.src, work.fromApp);

			if (!fs.existsSync (abs))
			{
				this.warnings.push ({
					code: "hs090-15/partial-not-found",
					message: `Partial ${work.src} (id="${work.stashId}") not found at ${abs}.`,
					where: `web.${work.fromApp}`
				});
				continue;
			}

			seenIds.add (work.stashId);

			// Two paths: build-time expand when args are present and
			// literal; raw-template inline otherwise.
			if (work.args != null)
			{
				const expanded: string | null = await this.tryExpand (work, abs);
				if (expanded !== null)
				{
					idToHtml.set (work.stashId, expanded);
					// No need to follow child includes — expandPartial
					// already rendered the entire transitive tree inline.
					continue;
				}
				// Expansion failed (warning logged inside tryExpand);
				// fall through to raw-template inline so the caller
				// still gets a stash entry, even if it's not the
				// fully-rendered version.
			}

			const source: string = await fsp.readFile (abs, "utf8");
			const mod: HottModule = compileSource (source, { filename: abs });

			for (const w of mod.warnings)
				this.warnings.push ({ code: w.code, message: w.message, where: abs });

			idToHtml.set (work.stashId, mod.template);

			// Follow literal includes inside this partial (raw path mode
			// — args-less child calls just get base ids).
			for (const childCall of mod.partialCalls)
			{
				if (!seenIds.has (childCall.stashId))
				{
					queue.push ({
						stashId: childCall.stashId,
						src: childCall.path,
						args: childCall.args,
						fromApp: work.fromApp
					});
				}
			}
		}

		for (const [id, html] of idToHtml.entries ())
			this.resolvedPartials.set (id, html);
	}

	private async tryExpand (
		work: { stashId: string; src: string; args: Record<string, any> | null; fromApp: string },
		absPath: string
	): Promise<string | null>
	{
		const fromApp: string = work.fromApp;
		try
		{
			const collector: AssetCollector = this.buildAssetCollector ();
			const result = await expandPartial ({
				absPath,
				args: work.args || {},
				publicDir: ppath.resolve (this.opts.cwd, this.opts.publicDir),
				moduleRegistry: this.moduleRegistry,
				assets: collector,
				resolve: (requested: string, fromFile: string): string =>
				{
					const resolved: string = this.resolveNestedPartialPath (requested, fromFile, fromApp);
					if (!fs.existsSync (resolved))
					{
						throw new Error (`nested partial ${requested} → ${resolved} not found`);
					}
					return (resolved);
				}
			});
			return (result.html);
		}
		catch (err)
		{
			this.warnings.push ({
				code: "hs090-15/expand-fallback",
				message: `Build-time expansion of ${work.src} (id="${work.stashId}") failed: ${String ((err as Error).message || err)}. ` +
					`Falling back to raw-template inline.`,
				where: `web.${work.fromApp}`
			});
			return (null);
		}
	}

	/**
	 * Resolve a path used by a nested Hot.include() at build time. The
	 * partial's own .hott file location (fromFile) is the primary anchor;
	 * we try relative to that first, then fall back to publicDir + cwd.
	 */
	private resolveNestedPartialPath (requested: string, fromFile: string, appName: string): string
	{
		// 0. Check if a preloaded module registered this path under its
		//    name → path table (admin-panel / userroute / dataroute
		//    module-prefixed includes).
		for (const mod of this.moduleRegistry.values ())
		{
			for (const entry of mod.html)
			{
				if (entry.name === requested)
					return (ppath.resolve (this.opts.cwd, this.opts.publicDir, entry.path));
			}
		}

		const fromDir: string = ppath.dirname (fromFile);
		const candidates: string[] = [
			ppath.resolve (fromDir, requested),
			ppath.resolve (this.opts.cwd, this.opts.publicDir, requested),
			ppath.resolve (this.opts.cwd, "public", "hotstaq_modules", requested),
			ppath.resolve (this.opts.cwd, "node_modules", requested),
			ppath.resolve (this.opts.cwd, requested)
		];
		for (const c of candidates)
			if (fs.existsSync (c))
				return (c);
		return (candidates[0]);
	}

	/**
	 * Scan `<publicDir>/hotstaq_modules/` recursively for every installed
	 * module index.js and load it into this.moduleRegistry so partial
	 * resolution can use the name → path mappings before any preamble
	 * has executed. Errors on a single module are logged and skipped —
	 * one bad install shouldn't block the rest.
	 */
	private async preloadInstalledModules (): Promise<void>
	{
		const root: string = ppath.resolve (this.opts.cwd, this.opts.publicDir, "hotstaq_modules");
		if (!fs.existsSync (root))
			return;

		const indexFiles: string[] = [];
		await walkForIndexJs (root, indexFiles);

		// Lazy import from build-expand to avoid a circular name import
		// at module-load time (build-expand doesn't export this helper
		// via index.ts, so we reach into the file directly).
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { evalInstalledModuleIndex } = require ("./build-expand-internal");

		for (const indexFile of indexFiles)
		{
			try
			{
				const moduleName: string = deriveModuleNameFromPath (indexFile, root);
				if (this.moduleRegistry.has (moduleName))
					continue;
				const mod: SandboxModule = await evalInstalledModuleIndex (indexFile, moduleName);
				this.moduleRegistry.set (moduleName, mod);
			}
			catch (err)
			{
				this.warnings.push ({
					code: "hs090-15/module-preload-failed",
					message: `Could not preload installed module at ${indexFile}: ${String ((err as Error).message || err)}.`
				});
			}
		}
	}

	/**
	 * Resolve a partial path. Explicit manifest paths are relative to
	 * publicDir (matching docs), while Hot.include() literals in .hott
	 * preambles use `./relative` form. Try publicDir first, then cwd
	 * so node_modules-relative paths still work.
	 */
	private buildAssetCollector (): AssetCollector
	{
		return ({
			addCss: (href: string): void =>
			{
				if (!this.shellCss.includes (href))
					this.shellCss.push (href);
			},
			addJs: (src: string): void =>
			{
				if (!this.shellJs.includes (src))
					this.shellJs.push (src);
			},
			addComponents: (library: string, names: string[]): void =>
			{
				let existing = this.shellComponents.find (c => c.library === library);
				if (!existing)
				{
					existing = { library, names: [] };
					this.shellComponents.push (existing);
				}
				for (const n of names)
					if (!existing.names.includes (n))
						existing.names.push (n);
			}
		});
	}

	private resolvePartialPath (src: string, appName: string): string
	{
		// First: check preloaded module registry for a name → path match.
		// Admin-panel et al register include paths like
		// "@hotstaq/admin-panel/admin-header.hott" here.
		for (const mod of this.moduleRegistry.values ())
		{
			for (const entry of mod.html)
			{
				if (entry.name === src)
					return (ppath.resolve (this.opts.cwd, this.opts.publicDir, entry.path));
			}
		}

		const candidates: string[] = [
			ppath.resolve (this.opts.cwd, this.opts.publicDir, src),
			ppath.resolve (this.opts.cwd, src)
		];
		for (const c of candidates)
			if (fs.existsSync (c))
				return (c);
		// Return the first so the warning has a concrete path.
		return (candidates[0]);
	}

	/**
	 * HS090 jsFiles wiring: for each web.{appName}.jsFiles entry, copy
	 * the file into dist (preserving a sensible relative layout under
	 * `js/`) and queue a shell <script> tag. Apps use this to pull in
	 * the legacy HotStaq.min.js client when they need HotStaqWeb-based
	 * components (admin-panel and friends).
	 */
	async resolveJsFiles (): Promise<void>
	{
		if (!this.site.web)
			return;

		for (const appName of Object.keys (this.site.web))
		{
			const app = this.site.web[appName];
			const files: string[] = app.jsFiles || [];

			for (const rel of files)
			{
				const abs: string = ppath.resolve (this.opts.cwd, rel);
				if (!fs.existsSync (abs))
				{
					this.warnings.push ({
						code: "hs090/js-file-not-found",
						message: `jsFiles entry not found: ${rel} (resolved to ${abs}).`,
						where: `web.${appName}.jsFiles`
					});
					continue;
				}
				const body: string = await fsp.readFile (abs, "utf8");
				const distRel: string = `js/${ppath.basename (abs)}`;
				await this.writeOutputFile (distRel, body);
				if (!this.shellJs.includes (distRel))
					this.shellJs.push (distRel);
			}
		}
	}

	/**
	 * HS090-8: for each web app with an apiClient config (or one that can
	 * be inferred from HotSite.apis), copy the generated client file into
	 * dist/js/ and record how the entry script should wire it up.
	 */
	async resolveApiClients (): Promise<void>
	{
		if (!this.site.web || !this.site.apis)
			return;

		for (const appName of Object.keys (this.site.web))
		{
			const app = this.site.web[appName];
			const cfg: HotSiteWebApiClient | undefined = app.apiClient;

			// Infer: if exactly one api entry and no explicit config, use it.
			const apiKeys: string[] = Object.keys (this.site.apis || {});
			if (!cfg && apiKeys.length === 0)
				continue;

			const apiRef: string | undefined =
				cfg?.apiRef ||
				(apiKeys.length === 1 ? apiKeys[0] : undefined);

			if (!apiRef)
			{
				if (cfg)
				{
					this.warnings.push ({
						code: "hs090-8/api-ref-missing",
						message: `web.${appName}.apiClient has no apiRef and multiple HotSite.apis entries exist.`
					});
				}
				continue;
			}

			const apiDef = this.site.apis[apiRef];
			if (!apiDef)
			{
				this.warnings.push ({
					code: "hs090-8/api-ref-not-found",
					message: `web.${appName}.apiClient.apiRef="${apiRef}" not found in HotSite.apis.`
				});
				continue;
			}

			const libraryName: string | undefined = apiDef.libraryName;
			const apiName: string | undefined = apiDef.apiName;

			if (!libraryName || !apiName)
			{
				this.warnings.push ({
					code: "hs090-8/api-client-incomplete",
					message: `HotSite.apis.${apiRef} is missing libraryName or apiName; skipping API client bundling.`
				});
				continue;
			}

			const bundleRel: string = cfg?.bundlePath ||
				`./js/${libraryName}_${apiName}.js`;
			const bundleAbs: string = ppath.resolve (this.opts.cwd, this.opts.publicDir, bundleRel);

			if (!fs.existsSync (bundleAbs))
			{
				this.warnings.push ({
					code: "hs090-8/api-client-not-built",
					message: `API client ${bundleRel} not found at ${bundleAbs}. ` +
						`Run \`hotstaq generate --api\` (or npm run build-web) first.`
				});
				continue;
			}

			const body: string = await fsp.readFile (bundleAbs, "utf8");
			const distRel: string = `js/${libraryName}_${apiName}.js`;
			await this.writeOutputFile (distRel, body);

			const baseUrl: string = cfg?.baseUrl || apiDef.url || "";

			this.resolvedApiClients.set (appName, {
				distPath: distRel,
				libraryName,
				apiName,
				baseUrl
			});
		}
	}

	emitTemplateStash (): string
	{
		const fragments: string[] = [];

		for (const [appName, routes] of this.compiledRoutes.entries ())
		{
			for (const cr of routes)
			{
				// HS090-5: only eager routes inline into the shell stash.
				// Lazy/never routes ship their template inside their chunk.
				const preload: string = cr.route.preload || "eager";
				if (preload !== "eager")
					continue;

				const id: string = templateIdForRoute (appName, cr.route.path);
				fragments.push (
					`<template id="${id}" data-app="${escapeAttr (appName)}" ` +
					`data-path="${escapeAttr (cr.route.path)}" data-preload="${preload}">` +
					cr.module.template +
					`</template>`
				);
			}
		}

		// HS090-15: resolved partials ship as <script type="text/html">
		// (not <template>) because legacy .hott partials (admin-panel
		// header/footer) ship UNBALANCED HTML on purpose: the header
		// opens wrapping divs that the footer closes later in the
		// render stream. <template> parses content as HTML and auto-
		// closes unclosed tags / drops orphan closes — destroying the
		// pairing. <script type="text/html"> preserves content verbatim
		// as text, and the runtime reads it via .textContent so the
		// caller's accumulator sees the original raw HTML.
		for (const [id, html] of this.resolvedPartials.entries ())
		{
			fragments.push (
				`<script type="text/html" id="hott-partial--${escapeAttr (id)}" ` +
				`data-partial="${escapeAttr (id)}">` +
				html +
				`</script>`
			);
		}

		return (fragments.join ("\n"));
	}

	/**
	 * HS090-5 / HS090-16: emit a separate chunk file for every lazy or
	 * never route. The chunk is a plain script that injects the
	 * template into the DOM and calls registerRoute() via the runtime
	 * global the entry set up (window.__HS090_RT__).
	 */
	async bundleLazyRouteChunks (): Promise<void>
	{
		for (const [appName, compiled] of this.compiledRoutes.entries ())
		{
			for (const cr of compiled)
			{
				const preload: string = cr.route.preload || "eager";
				if (preload === "eager")
					continue;

				const templateId: string = templateIdForRoute (appName, cr.route.path);
				const chunkSource: string = this.generateLazyChunkSource (
					appName, cr, templateId, preload as "lazy" | "never"
				);

				// Bundle through esbuild so preamble TS/JSX/ES2023+ syntax
				// gets downleveled consistently with app.js.
				const result = await esbuild.build ({
					stdin: {
						contents: chunkSource,
						resolveDir: ppath.resolve (__dirname, "../.."),
						sourcefile: `__hotstaq_hs090_chunk_${sluggifyPath (cr.route.path)}__.js`,
						loader: "js"
					},
					bundle: true,
					write: false,
					format: "iife",
					platform: "browser",
					target: ["es2020"],
					minify: this.opts.mode === "production",
					sourcemap: this.opts.mode === "development" ? "inline" : false,
					legalComments: "none",
					logLevel: "silent",
					banner: { js: `/* HotStaq v0.9.0 lazy chunk: ${cr.route.path} */` }
				});

				const body: string = result.outputFiles && result.outputFiles.length > 0
					? result.outputFiles[0].text
					: "";

				const slug: string = sluggifyPath (cr.route.path);
				const name: string = `app-route-${slug}`;
				const asset = await this.writeHashedAsset (name, "js", body);
				this.routeChunks.set (cr.route.path, asset.path);
			}
		}
	}

	private generateLazyChunkSource (
		appName: string,
		cr: CompiledRoute,
		templateId: string,
		preload: "lazy" | "never"
	): string
	{
		const templateLiteral: string = JSON.stringify (cr.module.template);
		const scripts: string = JSON.stringify (cr.module.scripts);
		const preambleFn: string = preambleToAsyncFn (cr.module.preamble);

		return ([
			`(function () {`,
			`  var rt = (typeof window !== "undefined") && window.__HS090_RT__;`,
			`  if (!rt) {`,
			`    console.error("[hs090] lazy chunk for ${cr.route.path} loaded before runtime");`,
			`    return;`,
			`  }`,
			``,
			`  // Inject the route template into the DOM stash.`,
			`  if (!document.getElementById(${JSON.stringify (templateId)})) {`,
			`    var tpl = document.createElement("template");`,
			`    tpl.id = ${JSON.stringify (templateId)};`,
			`    tpl.setAttribute("data-app", ${JSON.stringify (appName)});`,
			`    tpl.setAttribute("data-path", ${JSON.stringify (cr.route.path)});`,
			`    tpl.setAttribute("data-preload", ${JSON.stringify (preload)});`,
			`    tpl.innerHTML = ${templateLiteral};`,
			`    document.body.appendChild(tpl);`,
			`  }`,
			``,
			`  rt.registerRoute({`,
			`    path: ${JSON.stringify (cr.route.path)},`,
			`    templateId: ${JSON.stringify (templateId)},`,
			`    preload: ${JSON.stringify (preload)},`,
			`    scripts: ${scripts},`,
			`    preamble: ${preambleFn}`,
			`  });`,
			`})();`
		].join ("\n"));
	}

	async bundleAppJs (): Promise<{ path: string; hash: string; size: number }>
	{
		// HS090-6: synthesize an entry file that imports the runtime and
		// registers every compiled preamble + inline-script set, then
		// bundle the whole thing through esbuild.
		const entrySource: string = this.generateEntrySource ();

		// Stash the generated entry for debugging when --verbose is set.
		if (this.opts.verbose)
		{
			this.logger.info ("[hs090] generated entry source:\n" + entrySource);
		}

		const runtimeEntry: string = ppath.resolve (__dirname, "../runtime/HotStaticRuntime.js");

		const result = await esbuild.build ({
			stdin: {
				contents: entrySource,
				resolveDir: ppath.resolve (__dirname, "../.."),
				sourcefile: "__hotstaq_hs090_entry__.js",
				loader: "js"
			},
			bundle: true,
			write: false,
			format: "iife",
			globalName: "HotStaqStatic",
			platform: "browser",
			target: ["es2020"],
			minify: this.opts.mode === "production",
			sourcemap: this.opts.mode === "development" ? "inline" : false,
			legalComments: "none",
			define: {
				"process.env.NODE_ENV": JSON.stringify (
					this.opts.mode === "production" ? "production" : "development"
				)
			},
			banner: {
				js: "/* HotStaq v0.9.0 static build (HS090). */"
			},
			logLevel: "silent",
			alias: {
				"@hotstaq/runtime": runtimeEntry
			}
		});

		if (result.warnings && result.warnings.length > 0)
		{
			for (const w of result.warnings)
			{
				this.warnings.push ({
					code: "esbuild/warning",
					message: w.text,
					where: w.location ? `${w.location.file}:${w.location.line}` : undefined
				});
			}
		}

		const body: string = result.outputFiles && result.outputFiles.length > 0
			? result.outputFiles[0].text
			: "";

		return (this.writeHashedAsset ("app", "js", body));
	}

	/**
	 * Build the per-app entry source that registers every route's
	 * preamble + inline scripts against the runtime, then calls start().
	 */
	private generateEntrySource (): string
	{
		const runtimeSpec: string = "@hotstaq/runtime";
		const routeRegistrations: string[] = [];
		const apiLines: string[] = [];

		// HS090-8: wire the auto-generated client. The client script is
		// loaded via a <script> tag in index.html before app.js, so by
		// the time this entry runs, window[libraryName] is set.
		for (const [appName, resolved] of this.resolvedApiClients.entries ())
		{
			const lib: string = JSON.stringify (resolved.libraryName);
			const api: string = JSON.stringify (resolved.apiName);
			const base: string = JSON.stringify (resolved.baseUrl);

			const qualName: string = JSON.stringify (resolved.libraryName + "." + resolved.apiName);
			const appComment: string = JSON.stringify (appName);
			apiLines.push (
				`{\n` +
				`  const __lib = (typeof globalThis !== "undefined" ? globalThis[${lib}] : undefined)\n` +
				`    || (typeof window !== "undefined" ? window[${lib}] : undefined);\n` +
				`  if (__lib && typeof __lib[${api}] === "function") {\n` +
				`    // Legacy HotAPI requires a non-null connection. In a\n` +
				`    // static build there's no HotServer / HotClient wired\n` +
				`    // up yet, so pass a stub so the constructor succeeds.\n` +
				`    // The real fetch path lives in the generated client's\n` +
				`    // route-method functions, which use window.fetch.\n` +
				`    const __stubConn = { __hs090_stub: true };\n` +
				`    try { registerApi(new __lib[${api}](${base}, __stubConn)); }\n` +
				`    catch (__err) {\n` +
				`      console.warn("[hs090] could not instantiate " + ${qualName} + " with stub connection; exposing the raw library namespace on hotCtx.api instead.", __err);\n` +
				`      registerApi(__lib);\n` +
				`    }\n` +
				`  } else {\n` +
				`    console.warn("[hs090] API client " + ${qualName} + " not found; preambles will see an empty hotCtx.api.");\n` +
				`  }\n` +
				`  /* wired: ${appName} */\n` +
				`}`
			);
			void appComment;
		}

		if (apiLines.length === 0)
			apiLines.push (`registerApi({});`);

		const chunkRegistrations: string[] = [];

		for (const [appName, compiled] of this.compiledRoutes.entries ())
		{
			for (const cr of compiled)
			{
				const preload: string = cr.route.preload || "eager";

				if (preload !== "eager")
				{
					// Lazy / never — chunk URL registered; preamble + template
					// live inside the chunk file.
					const chunkPath: string | undefined = this.routeChunks.get (cr.route.path);
					if (!chunkPath)
					{
						this.warnings.push ({
							code: "hs090-16/chunk-missing",
							message: `No chunk built for ${cr.route.path} (preload: ${preload}); route will 404 at runtime.`
						});
						continue;
					}
					chunkRegistrations.push (
						`  registerChunk(${JSON.stringify (cr.route.path)}, ${JSON.stringify ("./" + chunkPath)});`
					);
					continue;
				}

				const templateId: string = templateIdForRoute (appName, cr.route.path);
				const preambleFn: string = preambleToAsyncFn (cr.module.preamble);
				const scripts: string = JSON.stringify (cr.module.scripts);
				const preloadJson: string = JSON.stringify (preload);

				routeRegistrations.push (
					`  registerRoute({\n` +
					`    path: ${JSON.stringify (cr.route.path)},\n` +
					`    templateId: ${JSON.stringify (templateId)},\n` +
					`    preload: ${preloadJson},\n` +
					`    scripts: ${scripts},\n` +
					`    preamble: ${preambleFn}\n` +
					`  });`
				);
			}
		}

		return ([
			`import * as __rt from ${JSON.stringify (runtimeSpec)};`,
			`const { registerRoute, registerApi, registerChunk, start } = __rt;`,
			``,
			`// HS090-16: expose runtime on window so lazy chunks can call registerRoute.`,
			`if (typeof window !== "undefined") window.__HS090_RT__ = __rt;`,
			``,
			`// HS090-8: wire any resolved API clients into the runtime.`,
			...apiLines,
			``,
			...routeRegistrations,
			``,
			...chunkRegistrations,
			``,
			`start();`
		].join ("\n"));
	}

	async bundleAppCss (): Promise<{ path: string; hash: string; size: number }>
	{
		// HS090-7: concatenate cssFiles from every web app entry in
		// HotSite order. Missing files warn (non-fatal) and are skipped
		// so apps can reference admin-panel CSS without blowing up if
		// @hotstaq/admin-panel isn't installed yet.
		const chunks: string[] = [];

		if (this.site.web)
		{
			for (const appName of Object.keys (this.site.web))
			{
				const app = this.site.web[appName];
				const files: string[] = app.cssFiles || [];

				for (const rel of files)
				{
					const abs: string = ppath.resolve (this.opts.cwd, rel);
					if (!fs.existsSync (abs))
					{
						this.warnings.push ({
							code: "hs090-7/css-not-found",
							message: `cssFiles entry not found: ${rel} (resolved to ${abs}).`,
							where: `web.${appName}.cssFiles`
						});
						continue;
					}
					const body: string = await fsp.readFile (abs, "utf8");
					chunks.push (`/* ── ${rel} ── */\n${body}`);
				}
			}
		}

		if (chunks.length === 0)
		{
			return (this.writeHashedAsset ("app", "css",
				"/* HotStaq v0.9.0 — no cssFiles configured. */\n"));
		}

		const combined: string = chunks.join ("\n\n");
		const minified: string = this.opts.mode === "production"
			? minifyCss (combined)
			: combined;
		return (this.writeHashedAsset ("app", "css", minified));
	}

	async emitIndexHtml (stash: string, appJs: { path: string }, appCss: { path: string }): Promise<void>
	{
		const title: string = this.site.name || "HotStaq App";
		const description: string = this.site.description || "";

		// HS090-8: API client needs a minimal Hot/HotAPI shim in place
		// before its <script> evaluates, because the generated code
		// reads `HotAPIGlobal = HotAPI` and `class ${apiName} extends
		// HotAPIGlobal`. Without this, class declaration throws.
		const hasApiClient: boolean = this.resolvedApiClients.size > 0;
		const apiShim: string = hasApiClient
			? "  <script>\n" +
			  "    window.Hot = window.Hot || { BearerToken: null };\n" +
			  "    window.HotAPI = window.HotAPI || class HotAPI {\n" +
			  "      constructor(baseUrl, connection, db) {\n" +
			  "        this.baseUrl = baseUrl; this.connection = connection || null;\n" +
			  "        this.db = db || null; this.bearerToken = null;\n" +
			  "      }\n" +
			  "    };\n" +
			  "  </script>"
			: "";

		const apiClientTags: string[] = [];
		for (const resolved of this.resolvedApiClients.values ())
			apiClientTags.push (`  <script src="./${resolved.distPath}"></script>`);

		const moduleCssLines: string[] = this.shellCss
			.map (href => `  <link rel="stylesheet" href="./${href}">`);
		const moduleJsLines: string[] = this.shellJs
			.map (src => `  <script src="./${src}"></script>`);
		const componentRegLines: string = this.shellComponents.flatMap (({ library, names }) =>
		{
			const libPrefix: string = library ? library + "." : "";
			return (names.map (n =>
				`        try { if (typeof ${libPrefix}${n} !== 'undefined') ` +
				`Hot.CurrentPage.processor.addComponent(${libPrefix}${n}); } catch (e) {}`
			));
		}).join ("\n");

		const componentRegScript: string = this.shellComponents.length === 0
			? ""
			: "  <script>\n" +
			  "    // HS090 legacy-client bootstrap. Runs TWICE:\n" +
			  "    //  (a) synchronously at parse time — registers admin-* custom\n" +
			  "    //      elements immediately so templates with <admin-*> tags\n" +
			  "    //      upgrade on insert.\n" +
			  "    //  (b) again on window.load, AFTER hotStaqWebStart — that\n" +
			  "    //      legacy startup copies HotStaqWeb.Hot onto window.Hot\n" +
			  "    //      (resetting Hot.CurrentPage to null), so we re-create\n" +
			  "    //      the page + processor so preambles running after this\n" +
			  "    //      see a live Hot.CurrentPage.processor.\n" +
			  "    function __hs090Setup() {\n" +
			  "      if (typeof HotStaqWeb === 'undefined') return;\n" +
			  "      if (typeof window.Hot === 'undefined' || typeof window.Hot === 'object') window.Hot = HotStaqWeb.Hot || {};\n" +
			  "      if (!Hot.CurrentPage || !Hot.CurrentPage.processor) {\n" +
			  "        try {\n" +
			  "          var proc = new HotStaqWeb.HotStaq();\n" +
			  "          Hot.CurrentPage = new HotStaqWeb.HotPage(proc);\n" +
			  "          Hot.CurrentPage.processor = proc;\n" +
			  "        } catch (e) { console.warn('[hs090] legacy bootstrap failed:', e); return; }\n" +
			  "      }\n" +
			  "      if (!Hot.CurrentPage || !Hot.CurrentPage.processor) return;\n" +
			  componentRegLines + "\n" +
			  "    }\n" +
			  "    __hs090Setup();\n" +
			  "    if (document.readyState !== 'complete')\n" +
			  "      window.addEventListener('load', function () { setTimeout(__hs090Setup, 60); }, { once: true });\n" +
			  "    else\n" +
			  "      setTimeout(__hs090Setup, 60);\n" +
			  "  </script>";

		const lines: string[] = [
			"<!doctype html>",
			"<html lang=\"en\">",
			"<head>",
			"  <meta charset=\"utf-8\">",
			"  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
			`  <title>${escapeText (title)}</title>`,
			description ? `  <meta name=\"description\" content=\"${escapeAttr (description)}\">` : "",
			...moduleCssLines,
			`  <link rel=\"stylesheet\" href=\"./${appCss.path}\">`,
			// Module JS (jQuery / Bootstrap / DataTables / admin-panel
			// components) loads in <head> so it's available before app.js
			// instantiates components that depend on those globals.
			...moduleJsLines,
			"</head>",
			"<body>",
			"  <div id=\"app\"></div>",
			"  <!-- HotStaq v0.9.0 template stash -->",
			stash,
			apiShim,
			...apiClientTags,
			componentRegScript,
			`  <script src=\"./${appJs.path}\"></script>`,
			"</body>",
			"</html>",
			""
		].filter (l => l !== "");

		await this.writeOutputFile ("index.html", lines.join ("\n"));
	}

	async copyAssets (): Promise<void>
	{
		const src: string = ppath.resolve (this.opts.cwd, this.opts.publicDir);

		if (!fs.existsSync (src))
			return;

		await this.copyTreeSkipping (src, this.absOut (), [".hott"]);
	}

	async copyConfig (): Promise<void>
	{
		const candidate: string = ppath.resolve (this.opts.cwd, this.opts.publicDir, "config.json");

		if (!fs.existsSync (candidate))
			return;

		const body: string = await fsp.readFile (candidate, "utf8");
		await this.writeOutputFile ("config.json", body);
	}

	async writeManifest (
		entry: { html: string; js: string; css: string }
	): Promise<void>
	{
		const pkg: { version?: string } = await this.readHotStaqPackageJson ();

		const manifest: BuildManifest = {
			manifestVersion: 1,
			builtAt: new Date ().toISOString (),
			mode: this.opts.mode,
			hotstaqVersion: pkg.version || "unknown",
			entry,
			files: this.manifestFiles.slice ().sort ((a, b) => a.path.localeCompare (b.path)),
			hotSite: this.site
		};

		await this.writeOutputFile ("build-manifest.json", JSON.stringify (manifest, null, 2));
	}

	// ── Helpers ───────────────────────────────────────────────────────

	absOut (): string
	{
		return (ppath.resolve (this.opts.cwd, this.opts.out));
	}

	async writeHashedAsset (name: string, ext: string, body: string): Promise<{ path: string; hash: string; size: number }>
	{
		const hash: string = crypto
			.createHash ("sha256")
			.update (body)
			.digest ("hex")
			.substring (0, 10);
		const rel: string = `${name}.${hash}.${ext}`;
		await this.writeOutputFile (rel, body);
		return ({ path: rel, hash, size: Buffer.byteLength (body) });
	}

	async writeOutputFile (relPath: string, body: string): Promise<void>
	{
		const abs: string = ppath.join (this.absOut (), relPath);
		await fsp.mkdir (ppath.dirname (abs), { recursive: true });
		await fsp.writeFile (abs, body);
		const size: number = Buffer.byteLength (body);
		const sha: string = crypto.createHash ("sha256").update (body).digest ("hex");
		this.manifestFiles.push ({ path: relPath, size, sha256: sha });
	}

	async copyTreeSkipping (srcDir: string, dstDir: string, skipExts: string[]): Promise<void>
	{
		const entries = await fsp.readdir (srcDir, { withFileTypes: true });

		for (const e of entries)
		{
			const srcPath: string = ppath.join (srcDir, e.name);
			const dstPath: string = ppath.join (dstDir, e.name);

			if (e.isDirectory ())
			{
				await fsp.mkdir (dstPath, { recursive: true });
				await this.copyTreeSkipping (srcPath, dstPath, skipExts);
				continue;
			}

			const ext: string = ppath.extname (e.name).toLowerCase ();
			if (skipExts.includes (ext))
				continue;

			// Skip files we've already written (index.html, app.*, build-manifest.json, config.json).
			const rel: string = ppath.relative (this.absOut (), dstPath);
			if (rel === "index.html" || rel === "build-manifest.json" || rel === "config.json")
				continue;
			if (/^app\.[a-f0-9]+\.(js|css)$/.test (ppath.basename (rel)))
				continue;

			const body: Buffer = await fsp.readFile (srcPath);
			await fsp.mkdir (ppath.dirname (dstPath), { recursive: true });
			await fsp.writeFile (dstPath, body);
			const sha: string = crypto.createHash ("sha256").update (body).digest ("hex");
			this.manifestFiles.push ({ path: rel, size: body.length, sha256: sha });
		}
	}

	async readHotStaqPackageJson (): Promise<{ version?: string }>
	{
		try
		{
			const candidates: string[] = [
				ppath.resolve (__dirname, "../../../package.json"),
				ppath.resolve (__dirname, "../../package.json")
			];
			for (const c of candidates)
			{
				if (fs.existsSync (c))
				{
					const parsed: any = JSON.parse (await fsp.readFile (c, "utf8"));
					if (parsed && parsed.name === "hotstaq")
						return ({ version: parsed.version });
				}
			}
		}
		catch { /* best-effort */ }
		return ({});
	}

	printSizeReport (): void
	{
		const sorted = this.manifestFiles.slice ().sort ((a, b) => b.size - a.size);
		this.logger.info (`[hs090] output files (${sorted.length}):`);
		for (const f of sorted)
			this.logger.info (`  ${formatSize (f.size).padStart (8)}  ${f.path}`);
	}

	private note (code: string, message: string): void
	{
		this.warnings.push ({ code, message });
	}

	private fatal (issue: HotSiteValidationIssue): void
	{
		this.logger.error (`[${issue.code}] ${issue.message}${issue.path ? ` (${issue.path})` : ""}`);
	}
}

// ── Utilities ──────────────────────────────────────────────────────────

/**
 * Wrap a rewritten preamble source into the `async (hotCtx) => { ... }`
 * form the runtime calls. An empty preamble compiles to a no-op.
 */
export function preambleToAsyncFn (src: string): string
{
	const body: string = src ? src.trim () : "";
	if (body === "")
		return (`async (hotCtx) => {}`);
	return (`async (hotCtx) => {\n${body}\n}`);
}

export function templateIdForRoute (appName: string, routePath: string): string
{
	const slug: string = routePath === "/" ? "root" : routePath
		.replace (/^\/+/, "")
		.replace (/\/+$/, "")
		.replace (/[^a-zA-Z0-9_\-]/g, "-")
		.toLowerCase () || "root";
	return (`hott-route--${slugify (appName)}--${slug}`);
}

function slugify (s: string): string
{
	return (s.replace (/[^a-zA-Z0-9_\-]/g, "-").toLowerCase ());
}

async function walkForIndexJs (dir: string, out: string[]): Promise<void>
{
	const entries = await fsp.readdir (dir, { withFileTypes: true });
	for (const e of entries)
	{
		const p: string = ppath.join (dir, e.name);
		if (e.isDirectory ())
			await walkForIndexJs (p, out);
		else if (e.isFile () && e.name === "index.js")
			out.push (p);
	}
}

function deriveModuleNameFromPath (indexFile: string, root: string): string
{
	// hotstaq_modules/<scope>/<pkg>/index.js → "<scope>/<pkg>"
	// hotstaq_modules/<pkg>/index.js         → "<pkg>"
	const rel: string = ppath.relative (root, ppath.dirname (indexFile));
	return (rel.replace (/\\/g, "/"));
}

function sluggifyPath (routePath: string): string
{
	if (routePath === "/") return ("root");
	return (routePath.replace (/^\/+/, "").replace (/\/+$/, "").replace (/[^a-zA-Z0-9_\-]/g, "-").toLowerCase () || "root");
}

function escapeAttr (s: string): string
{
	return (s.replace (/&/g, "&amp;").replace (/"/g, "&quot;").replace (/</g, "&lt;"));
}

function escapeText (s: string): string
{
	return (s.replace (/&/g, "&amp;").replace (/</g, "&lt;").replace (/>/g, "&gt;"));
}

/**
 * Very conservative CSS minifier — strips block comments + collapses runs
 * of whitespace. Good enough for v0.9.0 without pulling in another build-
 * time dependency; apps that want a real minifier can pre-minify and
 * include the already-minified file in cssFiles.
 */
function minifyCss (src: string): string
{
	return (src
		.replace (/\/\*[\s\S]*?\*\//g, "")
		.replace (/\s+/g, " ")
		.replace (/\s*([{}:;,])\s*/g, "$1")
		.replace (/;}/g, "}")
		.trim ());
}

function formatSize (bytes: number): string
{
	if (bytes < 1024) return (`${bytes}B`);
	if (bytes < 1024 * 1024) return (`${(bytes / 1024).toFixed (1)}KB`);
	return (`${(bytes / (1024 * 1024)).toFixed (2)}MB`);
}
