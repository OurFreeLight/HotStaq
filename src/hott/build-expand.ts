/**
 * Build-time expansion of Hot.include(path, literalArgs) calls.
 *
 * Given a partial path and a JSON-serializable args object, this module
 * compiles the partial via the legacy HotFile.parseContent pipeline and
 * executes it inside a Node-side sandbox with a minimal Hot global that
 *
 *   - echoUnsafe(str) / echo(str): appends to an Output buffer
 *   - include(path, args): recursive, reuses the same sandbox
 *   - Cookies, CurrentPage, Data: no-op stubs
 *   - getJSON / fetch / anything network: throws so the caller can
 *     detect "this partial has runtime dependencies" and fall back.
 *
 * The output HTML is fully static: interleaved `<* for/if *>` control
 * flow unrolled, `${TITLE}` substitutions resolved, nested partials
 * expanded recursively. Matches the admin-panel shape end to end.
 *
 * When execution throws, the caller falls back to the HS090-15 raw-
 * template-inline behaviour and emits a warning so the site author can
 * refactor or declare the route as staticRender: true.
 */

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as ppath from "path";
import { Node, SyntaxKind } from "ts-morph";

import { HotFile } from "../HotFile";

/**
 * Collector the builder passes in so module shims can record assets
 * for hoisting into the shell `<head>` (HS090-7 / HS090-8 integration
 * with the admin-panel's module manifest).
 */
export interface AssetCollector
{
	addCss (href: string): void;
	addJs (src: string): void;
	addComponents (componentLibrary: string, componentNames: string[]): void;
}

export interface ExpandPartialOptions
{
	/** Absolute path of the partial .hott file. */
	absPath: string;
	/** Args object — must already be JSON-serialisable. */
	args: Record<string, any>;
	/**
	 * Resolver for nested Hot.include calls. Receives the nested path
	 * exactly as written (module-prefix, ./rel, etc.) and returns the
	 * resolved absolute path, or throws if it can't be resolved.
	 */
	resolve: (requestedPath: string, fromFile: string) => string;
	/**
	 * The app's publicDir on disk. The sandbox's Hot.import looks up
	 * installed modules under `<publicDir>/hotstaq_modules/<name>/index.js`
	 * (the hotstaq module-install convention) to populate HotModule
	 * instances with their css/js/html/component manifests.
	 */
	publicDir?: string;
	/**
	 * Optional shared registry of already-loaded modules. Callers who
	 * expand multiple partials in one build can pass the same map to
	 * amortise the module-load cost and keep name→path entries visible
	 * across sibling expansions.
	 */
	moduleRegistry?: Map<string, SandboxModule>;
	/**
	 * Optional collector the builder uses to hoist module assets
	 * (<link>/<script> references emitted by module.outputCSS/JS)
	 * into the shell <head> instead of leaving them embedded inside
	 * the template stash. Matches the legacy SSR behaviour more
	 * closely: admin-panel CSS and JS load once on page entry, not
	 * per-route-mount.
	 */
	assets?: AssetCollector;
}

/** One completed expansion. */
export interface ExpandResult
{
	/** Rendered HTML. */
	html: string;
	/** Partials transitively visited. */
	visited: string[];
}

/**
 * Shape of an installed hotstaq module after its index.js has run in
 * the sandbox. Mirrors the real HotModule class (src/HotModule.ts) but
 * declared inline so build-expand doesn't pull in SSR-only imports.
 */
export interface SandboxModule
{
	name: string;
	js: string[];
	css: string[];
	html: Array<{ name: string; path: string }>;
	componentLibrary: string;
	components: string[];
}

/**
 * Render a partial at build time with the given literal args bound.
 *
 * Throws (with a descriptive message) when the partial's preamble
 * touches a runtime-only API (getJSON, fetch, Hot.API.*, etc.), when
 * the sandbox exceeds a cycle limit, or when the compiled .hott raises
 * a SyntaxError the sandbox can't wrap.
 */
export async function expandPartial (opts: ExpandPartialOptions): Promise<ExpandResult>
{
	const visited: string[] = [];
	const inflightCycleGuard: Set<string> = new Set ();
	const registry: Map<string, SandboxModule> = opts.moduleRegistry || new Map ();
	const publicDir: string = opts.publicDir || ppath.dirname (opts.absPath);
	const assets: AssetCollector | null = opts.assets || null;
	const rawHtml: string = await renderOne (
		opts.absPath,
		opts.args,
		opts.resolve,
		visited,
		inflightCycleGuard,
		registry,
		publicDir,
		assets
	);
	// admin-panel partials (and other legacy SSR partials that assume
	// they emit a full HTML document) are cleaned up into fragment-safe
	// HTML so the output drops straight into a <template> stash node.
	const html: string = stripDocumentWrappers (rawHtml);
	return ({ html, visited });
}

/**
 * Remove <!doctype html>, <html>, <head>, <body> wrappers from a rendered
 * fragment so it embeds cleanly into a <template> stash. Content inside
 * the wrappers (links, scripts, style, actual body markup) is preserved.
 *
 * Intentionally conservative: only strips wrappers when the fragment
 * actually starts like a full document. Leaves ordinary fragments
 * untouched.
 */
export function stripDocumentWrappers (html: string): string
{
	let out: string = html;

	// Strip leading whitespace + <!doctype ...>
	out = out.replace (/^\s*<!doctype[^>]*>\s*/i, "");

	// If there's a full <html>...</html> wrapper, unwrap it. Tolerate
	// attributes on the opening tag (`<html lang="en">` etc).
	const htmlOpen: RegExpMatchArray | null = out.match (/^\s*<html\b[^>]*>/i);
	if (htmlOpen)
	{
		const openEnd: number = htmlOpen.index! + htmlOpen[0].length;
		const closeIdx: number = out.lastIndexOf ("</html>");
		if (closeIdx > openEnd)
			out = out.substring (openEnd, closeIdx);
		else
			out = out.substring (openEnd);
	}

	// Drop stray <head>/</head> and <body>/</body> tags — their contents
	// stay. Stylesheets + scripts inside <head> still apply when the
	// fragment gets cloned into the document.
	out = out
		.replace (/<head\b[^>]*>/gi, "")
		.replace (/<\/head>/gi, "")
		.replace (/<body\b[^>]*>/gi, "")
		.replace (/<\/body>/gi, "");

	return (out.trim () + "\n");
}

const MAX_DEPTH: number = 16;

async function renderOne (
	absPath: string,
	args: Record<string, any>,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>,
	registry: Map<string, SandboxModule>,
	publicDir: string,
	assets: AssetCollector | null
): Promise<string>
{
	if (inflight.has (absPath))
		throw new Error (`[hs090] cycle detected in Hot.include: ${absPath}`);
	if (inflight.size >= MAX_DEPTH)
		throw new Error (`[hs090] Hot.include depth exceeded ${MAX_DEPTH} (runaway recursion?)`);

	inflight.add (absPath);
	visited.push (absPath);

	if (!fs.existsSync (absPath))
	{
		inflight.delete (absPath);
		throw new Error (`[hs090] partial file not found: ${absPath}`);
	}

	const source: string = await fsp.readFile (absPath, "utf8");
	const parsedJs: string = HotFile.parseContent (source, false);

	const result: string = await runCompiledPartial (
		parsedJs, args, absPath, resolve, visited, inflight, registry, publicDir, assets
	);

	inflight.delete (absPath);
	return (result);
}

async function runCompiledPartial (
	parsedJs: string,
	args: Record<string, any>,
	absFrom: string,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>,
	registry: Map<string, SandboxModule>,
	publicDir: string,
	assets: AssetCollector | null
): Promise<string>
{
	// Build the sandbox Hot shim per invocation so parallel nested
	// renders each get an isolated Output buffer. renderOne's callers
	// see only the final html string.
	const Hot: any = buildSandboxHot (absFrom, resolve, visited, inflight, registry, publicDir, assets);

	// Declare each arg as a top-level var in the executed scope — matches
	// the legacy HotPage.process() convention of `var ${key} = ${JSON};`
	// so preambles can reference {TITLE, SIDEBAR_ITEMS} by name.
	const argDecls: string[] = [];
	for (const key of Object.keys (args))
		argDecls.push (`var ${key} = ${JSON.stringify (args[key])};`);

	// Minimal helpers the legacy compiler expects in scope.
	const scaffold: string = `
${argDecls.join ("\n")}

function echoOutput (content, throwErrors) {
	if (throwErrors === false) {
		try { Hot.echoUnsafe (content); } catch { Hot.echoUnsafe (""); }
		return;
	}
	Hot.echoUnsafe (content);
}

function outputStr (value, possibleValue) {
	let result = \`\\\${\${value}}\`;
	try {
		if (possibleValue != null) result = possibleValue;
		else result = eval (value);
	} catch (ex) {}
	return (result);
}

function createFunction () { /* no-op at build time */ }
function createTestElement () { /* no-op at build time */ }

async function runContent (CurrentHotFile) {
${parsedJs}
}

return runContent (null).then (() => Hot.Output);
`;

	// eslint-disable-next-line no-new-func
	const fn: Function = new Function ("Hot", scaffold);
	return (await fn (Hot));
}

function buildSandboxHot (
	absFrom: string,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>,
	registry: Map<string, SandboxModule>,
	publicDir: string,
	assets: AssetCollector | null
): any
{
	const runtimeOnly = (name: string) => (): never =>
	{
		throw new Error (
			`[hs090] Hot.${name} called at build time — this partial has runtime dependencies. ` +
			`Refactor to use literal args, or declare the route as staticRender: true.`
		);
	};

	const Hot: any =
	{
		Output: "",
		Mode: 0,
		Arguments: null,
		CurrentPage: null,
		PublicKeys: {},
		API: null,
		TesterAPI: null,
		Data: {},
		Debugger: null,
		echoUnsafe (s: string): void
		{
			if (s == null) return;
			Hot.Output += String (s);
		},
		echo (s: string): void
		{
			if (s == null) return;
			Hot.Output += String (s).replace (/&/g, "&amp;").replace (/</g, "&lt;").replace (/>/g, "&gt;");
		},
		async include (path: string, subArgs: any = {}): Promise<void>
		{
			if (typeof path !== "string")
				throw new Error (`[hs090] Hot.include at build time requires a string path; got ${typeof path}`);
			// 1. Resolve via module registry first (admin-panel-style
			//    module-prefixed includes: "@hotstaq/admin-panel/...").
			const modEntry: { name: string; path: string } | null = resolveViaRegistry (path, registry);
			let nextAbs: string;
			if (modEntry)
				nextAbs = ppath.resolve (publicDir, modEntry.path);
			else
				nextAbs = resolve (path, absFrom);
			const nested: string = await renderOne (
				nextAbs, subArgs || {}, resolve, visited, inflight, registry, publicDir, assets
			);
			Hot.Output += nested;
		},
		async includeJS (_url: string, _args?: any[]): Promise<void>
		{
			throw new Error (`[hs090] Hot.includeJS called at build time — not supported during partial expansion.`);
		},
		async import (moduleName: string): Promise<any>
		{
			// First: check the registry (shared across expandPartial calls).
			const cached: SandboxModule | undefined = registry.get (moduleName);
			if (cached)
				return (instantiateModuleShim (cached, Hot, assets));

			// Next: try loading from `<publicDir>/hotstaq_modules/<name>/index.js`
			// — the hotstaq module-install convention used by apps that run
			// `hotstaq module install @hotstaq/admin-panel`.
			const modIndex: string = ppath.resolve (
				publicDir, "hotstaq_modules", moduleName, "index.js"
			);
			if (fs.existsSync (modIndex))
			{
				const raw: SandboxModule = await evalInstalledModuleIndex (modIndex, moduleName);
				registry.set (moduleName, raw);
				return (instantiateModuleShim (raw, Hot, assets));
			}

			// Fallback: plain Node require (plenty of @hotstaq/* packages
			// export server-side helpers this way). Return empty stub if
			// not installed — keeps build-time expansion resilient.
			try { return (require (moduleName)); }
			catch { return ({}); }
		},
		async getJSON (_url: string): Promise<any> { return (runtimeOnly ("getJSON") ()); },
		async jsonRequest (_url: string): Promise<any> { return (runtimeOnly ("jsonRequest") ()); },
		Cookies:
		{
			get: (_name: string): string | null => null,
			set: (_name: string, _value: string): void => {},
			remove: (_name: string): void => {}
		},
		getUrlParam: (): string => "",
		sanitizeHTML: (s: string): string => String (s),
		addHtmlUnsafe: (_owner: any, s: string): string => s
	};

	// Keep Hot.echoUnsafe bound so the parser-emitted `Hot.echoUnsafe(...)`
	// call sites don't hit undefined-this issues.
	Hot.echoUnsafe = Hot.echoUnsafe.bind (Hot);
	Hot.echo = Hot.echo.bind (Hot);
	Hot.include = Hot.include.bind (Hot);
	Hot.import = Hot.import.bind (Hot);

	return (Hot);
}

/**
 * Look up a Hot.include path against a registered module's html map.
 * admin-panel's installed index.js registers entries like:
 *   { name: "@hotstaq/admin-panel/admin-header.hott",
 *     path: "hotstaq_modules/@hotstaq/admin-panel/public/html/admin-header.hott" }
 * so a caller's `Hot.include("@hotstaq/admin-panel/admin-header.hott")` can
 * resolve to the real file without a heuristic.
 */
function resolveViaRegistry (
	requested: string,
	registry: Map<string, SandboxModule>
): { name: string; path: string } | null
{
	for (const mod of registry.values ())
	{
		for (const entry of mod.html)
		{
			if (entry.name === requested)
				return (entry);
		}
	}
	return (null);
}

/**
 * Execute an installed hotstaq_modules/<name>/index.js to produce a
 * SandboxModule. The legacy index.js expects `HotStaqWeb.HotModule` to
 * be globally available — we provide a minimal class that captures the
 * name/css/js/html/components assignments and returns itself.
 */
export async function evalInstalledModuleIndex (
	indexPath: string,
	moduleName: string
): Promise<SandboxModule>
{
	const source: string = await fsp.readFile (indexPath, "utf8");

	class HotModuleShim implements SandboxModule
	{
		name: string;
		js: string[] = [];
		css: string[] = [];
		html: Array<{ name: string; path: string }> = [];
		componentLibrary: string = "";
		components: string[] = [];
		constructor (n: string) { this.name = n; }
	}

	const HotStaqWeb: any = { HotModule: HotModuleShim };

	// The legacy installer emits a script whose top level is
	//   let newModule = new HotStaqWeb.HotModule("<name>");
	//   newModule.xxx = [...];
	//   ...
	//   return (newModule);
	// so wrap it in a function, apply with HotStaqWeb in scope, capture
	// the return value.
	// eslint-disable-next-line no-new-func
	const fn: Function = new Function ("HotStaqWeb", source);
	const result: SandboxModule = fn (HotStaqWeb);

	if (!result || typeof result !== "object" || !result.name)
		throw new Error (`[hs090] installed module ${moduleName} at ${indexPath} did not return a HotModule.`);

	return (result);
}

/**
 * Wrap a SandboxModule's data with the runtime helpers the legacy
 * admin-panel templates call on the imported object: outputCSS /
 * outputJS / outputComponents. Each emits HTML into the currently
 * active Hot.Output buffer.
 */
function instantiateModuleShim (mod: SandboxModule, Hot: any, assets: AssetCollector | null): any
{
	// v0.9.0 behaviour: outputCSS/outputJS register the referenced files
	// with the builder's shell-level asset collector (so <link>/<script>
	// tags land in dist/index.html's <head>) instead of inlining them
	// into the template stash. outputComponents behaves similarly —
	// registers with the collector for a single shell-level script.
	//
	// Callers that pass echoOut=false still get the HTML back as a string
	// so they can decide where to place it; we don't touch Hot.Output in
	// that case.
	return ({
		name: mod.name,
		js: mod.js,
		css: mod.css,
		html: mod.html,
		componentLibrary: mod.componentLibrary,
		components: mod.components,
		outputCSS (echoOut: boolean = true): string
		{
			let out: string = "";
			for (const file of mod.css)
			{
				out += `<link rel="stylesheet" href="${file}">\n`;
				if (assets) assets.addCss (file);
			}
			// Intentionally do NOT echo to Hot.Output by default — the
			// <link> tags belong in the shell <head>, not the template.
			// Returning the HTML keeps the `const css = outputCSS(false)`
			// pattern working for callers that need to place tags manually.
			if (echoOut && !assets) Hot.echoUnsafe (out);
			return (out);
		},
		outputJS (echoOut: boolean = true): string
		{
			let out: string = "";
			for (const file of mod.js)
			{
				out += `<script src="${file}"></script>\n`;
				if (assets) assets.addJs (file);
			}
			if (echoOut && !assets) Hot.echoUnsafe (out);
			return (out);
		},
		outputComponents (echoOut: boolean = true): string
		{
			if (mod.components.length === 0) return ("");
			const lib: string = mod.componentLibrary ? `${mod.componentLibrary}.` : "";
			if (assets) assets.addComponents (mod.componentLibrary, mod.components);
			let out: string = `<script type="text/javascript">\n`;
			for (const c of mod.components)
				out += `  if (typeof ${lib}${c} !== "undefined" && typeof Hot !== "undefined" && Hot.CurrentPage) Hot.CurrentPage.processor.addComponent(${lib}${c});\n`;
			out += `</script>\n`;
			if (echoOut && !assets) Hot.echoUnsafe (out);
			return (out);
		}
	});
}

// ── ts-morph argument helpers ──────────────────────────────────────────

/**
 * Determine whether an AST node is a literal JSON-compatible expression.
 * Strings, numbers, booleans, null, arrays of literals, object literals
 * whose values are literals, NoSubstitutionTemplateLiterals.
 */
export function isLiteralAst (node: Node): boolean
{
	const kind: number = node.getKind ();

	switch (kind)
	{
		case SyntaxKind.StringLiteral:
		case SyntaxKind.NoSubstitutionTemplateLiteral:
		case SyntaxKind.NumericLiteral:
		case SyntaxKind.TrueKeyword:
		case SyntaxKind.FalseKeyword:
		case SyntaxKind.NullKeyword:
			return (true);

		case SyntaxKind.PrefixUnaryExpression:
		{
			// Allow negative numbers: -42
			const pu = node.asKindOrThrow (SyntaxKind.PrefixUnaryExpression);
			if (pu.getOperatorToken () !== SyntaxKind.MinusToken) return (false);
			return (isLiteralAst (pu.getOperand ()));
		}

		case SyntaxKind.ArrayLiteralExpression:
		{
			const arr = node.asKindOrThrow (SyntaxKind.ArrayLiteralExpression);
			return (arr.getElements ().every (isLiteralAst));
		}

		case SyntaxKind.ObjectLiteralExpression:
		{
			const obj = node.asKindOrThrow (SyntaxKind.ObjectLiteralExpression);
			for (const prop of obj.getProperties ())
			{
				if (prop.getKind () !== SyntaxKind.PropertyAssignment)
					return (false);
				const pa = prop.asKindOrThrow (SyntaxKind.PropertyAssignment);
				const nameNode = pa.getNameNode ();
				const nk: number = nameNode.getKind ();
				if (nk !== SyntaxKind.Identifier &&
					nk !== SyntaxKind.StringLiteral &&
					nk !== SyntaxKind.NumericLiteral)
					return (false);
				if (!isLiteralAst (pa.getInitializerOrThrow ()))
					return (false);
			}
			return (true);
		}

		default:
			return (false);
	}
}

/**
 * Materialise a literal-AST node as a plain JS value. Undefined
 * behaviour if `isLiteralAst(node)` is false — callers must gate.
 */
export function materialiseLiteral (node: Node): any
{
	const kind: number = node.getKind ();

	switch (kind)
	{
		case SyntaxKind.StringLiteral:
			return (node.asKindOrThrow (SyntaxKind.StringLiteral).getLiteralValue ());
		case SyntaxKind.NoSubstitutionTemplateLiteral:
			return (node.asKindOrThrow (SyntaxKind.NoSubstitutionTemplateLiteral).getLiteralValue ());
		case SyntaxKind.NumericLiteral:
			return (Number (node.getText ()));
		case SyntaxKind.TrueKeyword:
			return (true);
		case SyntaxKind.FalseKeyword:
			return (false);
		case SyntaxKind.NullKeyword:
			return (null);
		case SyntaxKind.PrefixUnaryExpression:
		{
			const pu = node.asKindOrThrow (SyntaxKind.PrefixUnaryExpression);
			return (-materialiseLiteral (pu.getOperand ()));
		}
		case SyntaxKind.ArrayLiteralExpression:
		{
			const arr = node.asKindOrThrow (SyntaxKind.ArrayLiteralExpression);
			return (arr.getElements ().map (materialiseLiteral));
		}
		case SyntaxKind.ObjectLiteralExpression:
		{
			const obj = node.asKindOrThrow (SyntaxKind.ObjectLiteralExpression);
			const result: Record<string, any> = {};
			for (const prop of obj.getProperties ())
			{
				const pa = prop.asKindOrThrow (SyntaxKind.PropertyAssignment);
				const nameNode = pa.getNameNode ();
				const key: string = nameNode.getKind () === SyntaxKind.StringLiteral
					? nameNode.asKindOrThrow (SyntaxKind.StringLiteral).getLiteralValue ()
					: nameNode.getText ();
				result[key] = materialiseLiteral (pa.getInitializerOrThrow ());
			}
			return (result);
		}
		default:
			throw new Error (`[hs090] materialiseLiteral: unsupported kind ${kind}`);
	}
}
