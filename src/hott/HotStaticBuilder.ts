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

import { HotSite, HotSiteWebRoute } from "../HotSite";
import { HotLog, HotLogLevel } from "../HotLog";

import { compileSource } from "./compile";
import { HottModule } from "./types";
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

export interface BuildManifest
{
	version: string;
	builtAt: string;
	mode: "production" | "development";
	hotstaqVersion: string;
	files: ManifestEntry[];
	routes: {
		path: string;
		file: string;
		preload: "eager" | "lazy" | "never";
		staticRender: boolean;
	}[];
}

export interface CompiledRoute
{
	route: HotSiteWebRoute;
	absFile: string;
	module: HottModule;
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

		// 2. resolve partials — HS090-15 (stub).
		this.note ("partial-resolve-stub",
			"HS090-15 not yet implemented — partial stash IDs will pass through unresolved.");

		// 3. staticRender routes — HS090-19 (stub).
		this.note ("static-render-stub",
			"HS090-19 not yet implemented — staticRender: true routes will build as eager templates only.");

		// 4. template stash.
		const stash = this.emitTemplateStash ();

		// 5. app.js bundle — HS090-6 (stub produces a placeholder bundle).
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
		await this.writeManifest ();

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

	emitTemplateStash (): string
	{
		const fragments: string[] = [];

		for (const [appName, routes] of this.compiledRoutes.entries ())
		{
			for (const cr of routes)
			{
				const id: string = templateIdForRoute (appName, cr.route.path);
				const preload: string = cr.route.preload || "eager";
				fragments.push (
					`<template id="${id}" data-app="${escapeAttr (appName)}" ` +
					`data-path="${escapeAttr (cr.route.path)}" data-preload="${preload}">` +
					cr.module.template +
					`</template>`
				);
			}
		}

		return (fragments.join ("\n"));
	}

	async bundleAppJs (): Promise<{ path: string; hash: string; size: number }>
	{
		// Placeholder until HS090-6 wires esbuild. Emits a small script
		// exposing a `__HOTSTAQ_HS090__` global with enough metadata for
		// manual testing.
		const body: string = [
			"// HotStaq v0.9.0 static runtime placeholder.",
			"// Full implementation lands in HS090-6 (preambles + Hot.navigate + template mount).",
			`window.__HOTSTAQ_HS090__ = { mode: ${JSON.stringify (this.opts.mode)}, ` +
				`routes: ${JSON.stringify (this.routesForManifest ())} };`,
			"document.addEventListener('DOMContentLoaded', () => {",
			"  console.warn('HotStaq v0.9.0 runtime is a placeholder in this build.');",
			"});"
		].join ("\n");

		return (this.writeHashedAsset ("app", "js", body));
	}

	async bundleAppCss (): Promise<{ path: string; hash: string; size: number }>
	{
		// Placeholder until HS090-7.
		return (this.writeHashedAsset ("app", "css", "/* HotStaq v0.9.0 placeholder CSS (HS090-7) */\n"));
	}

	async emitIndexHtml (stash: string, appJs: { path: string }, appCss: { path: string }): Promise<void>
	{
		const title: string = this.site.name || "HotStaq App";
		const description: string = this.site.description || "";
		const body: string = [
			"<!doctype html>",
			"<html lang=\"en\">",
			"<head>",
			"  <meta charset=\"utf-8\">",
			"  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
			`  <title>${escapeText (title)}</title>`,
			description ? `  <meta name=\"description\" content=\"${escapeAttr (description)}\">` : "",
			`  <link rel=\"stylesheet\" href=\"./${appCss.path}\">`,
			"</head>",
			"<body>",
			"  <div id=\"app\"></div>",
			"  <!-- HotStaq v0.9.0 template stash -->",
			stash,
			`  <script src=\"./${appJs.path}\"></script>`,
			"</body>",
			"</html>",
			""
		].filter (l => l !== "").join ("\n");

		await this.writeOutputFile ("index.html", body);
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

	async writeManifest (): Promise<void>
	{
		const pkg: { version?: string } = await this.readHotStaqPackageJson ();
		const manifest: BuildManifest = {
			version: this.site.version || "0.0.0",
			builtAt: new Date ().toISOString (),
			mode: this.opts.mode,
			hotstaqVersion: pkg.version || "unknown",
			files: this.manifestFiles.slice ().sort ((a, b) => a.path.localeCompare (b.path)),
			routes: this.routesForManifest ()
		};

		await this.writeOutputFile ("build-manifest.json", JSON.stringify (manifest, null, 2));
	}

	// ── Helpers ───────────────────────────────────────────────────────

	absOut (): string
	{
		return (ppath.resolve (this.opts.cwd, this.opts.out));
	}

	routesForManifest (): BuildManifest["routes"]
	{
		const out: BuildManifest["routes"] = [];
		for (const routes of this.compiledRoutes.values ())
		{
			for (const cr of routes)
			{
				out.push ({
					path: cr.route.path,
					file: cr.route.file,
					preload: (cr.route.preload || "eager") as "eager" | "lazy" | "never",
					staticRender: !!cr.route.staticRender
				});
			}
		}
		return (out);
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

function escapeAttr (s: string): string
{
	return (s.replace (/&/g, "&amp;").replace (/"/g, "&quot;").replace (/</g, "&lt;"));
}

function escapeText (s: string): string
{
	return (s.replace (/&/g, "&amp;").replace (/</g, "&lt;").replace (/>/g, "&gt;"));
}

function formatSize (bytes: number): string
{
	if (bytes < 1024) return (`${bytes}B`);
	if (bytes < 1024 * 1024) return (`${(bytes / 1024).toFixed (1)}KB`);
	return (`${(bytes / (1024 * 1024)).toFixed (2)}MB`);
}
