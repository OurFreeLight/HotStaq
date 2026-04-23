/**
 * HotStaq v0.9.0 client-side runtime.
 *
 * Target: the bundled app.js for `hotstaq build --static` output. Loaded
 * once from index.html, it registers the routes that the build compiler
 * generated into the same bundle, then mounts the correct <template>
 * fragment into #app on load and on every navigation.
 *
 * Covers HS090-10 (Hot.navigate), HS090-11 (template mount + preamble
 * re-execution), and a basic HS090-13 (link interception). HS090-12
 * morph swap, HS090-14 scroll restoration, HS090-16/17 preload tiers
 * and prefetch-on-hover arrive in follow-up commits.
 */

import type { HotCtx } from "../hott/types";

/* eslint-disable no-console */

export interface RouteEntry
{
	/** URL path the route matches (from HotSite.yaml). */
	path: string;
	/** DOM id of the <template> node containing this route's HTML. */
	templateId: string;
	/** Compiled preamble — receives a fresh hotCtx per mount. */
	preamble?: (hotCtx: HotCtx) => Promise<void> | void;
	/** Inline <script> bodies to re-execute after the template mounts. */
	scripts?: string[];
	/** Preload tier; affects runtime chunk loading (HS090-16, future). */
	preload?: "eager" | "lazy" | "never";
}

interface RuntimeState
{
	mountSelector: string;
	routes: Map<string, RouteEntry>;
	api: Record<string, any>;
	currentAbort?: AbortController;
}

const state: RuntimeState =
{
	mountSelector: "#app",
	routes: new Map (),
	api: {}
};

/**
 * Register a compiled route with the runtime. Called from the bundler-
 * generated entry file; apps shouldn't need to call this directly.
 */
export function registerRoute (entry: RouteEntry): void
{
	state.routes.set (entry.path, entry);
}

/**
 * Register the auto-generated Web API client (HS090-8). The builder's
 * entry file calls this before the first mount.
 */
export function registerApi (api: Record<string, any>): void
{
	state.api = api;
}

/**
 * Change the CSS selector the runtime mounts into. Defaults to "#app".
 */
export function configureMount (selector: string): void
{
	state.mountSelector = selector;
}

/**
 * Navigate to a new path without a full page reload.
 */
export async function navigate (path: string, opts: { replace?: boolean } = {}): Promise<void>
{
	if (opts.replace)
		history.replaceState (null, "", path);
	else
		history.pushState (null, "", path);
	await mount ();
}

/**
 * Look up and mount the route that matches `location.pathname` (or
 * the `targetPath` override if given). Re-entrant: a second call aborts
 * the in-flight preamble of the first via an AbortController signal on
 * the HotCtx.
 */
export async function mount (targetPath?: string): Promise<void>
{
	const path: string = targetPath || location.pathname;
	const route: RouteEntry | undefined = resolveRoute (path);

	if (!route)
	{
		console.error (`[hs090] no route registered for ${JSON.stringify (path)}. ` +
			`Known: ${Array.from (state.routes.keys ()).join (", ")}`);
		return;
	}

	const host: HTMLElement | null = document.querySelector (state.mountSelector);

	if (!host)
	{
		console.error (`[hs090] mount host ${state.mountSelector} not found in DOM.`);
		return;
	}

	const template: HTMLTemplateElement | null = document.getElementById (route.templateId) as HTMLTemplateElement | null;

	if (!template)
	{
		console.error (`[hs090] <template id="${route.templateId}"> not found for route ${path}.`);
		return;
	}

	// Cancel any preamble still running for the previous route.
	if (state.currentAbort)
		state.currentAbort.abort ();
	const abort: AbortController = new AbortController ();
	state.currentAbort = abort;

	host.innerHTML = "";
	host.appendChild (document.importNode (template.content, true));

	const ctx: HotCtx = buildHotCtx (host, abort);

	try
	{
		if (route.preamble)
			await route.preamble (ctx);
	}
	catch (err)
	{
		if (abort.signal.aborted)
			return;
		console.error (`[hs090] preamble for ${path} threw:`, err);
	}

	if (abort.signal.aborted)
		return;

	// Re-execute inline scripts: the tokenizer left empty placeholder
	// <script data-hott-script="hott-sN"> nodes in the template; replace
	// them with real scripts so the browser runs the bodies.
	executeInlineScripts (host, route.scripts || []);
}

/**
 * Return the HotCtx singleton for the most recent mount. Intended for
 * debugging from the console — preambles receive their own hotCtx
 * parameter and should not reach for this.
 */
export function getLastContext (): HotCtx | null
{
	return (lastCtx);
}

let lastCtx: HotCtx | null = null;

/**
 * Intercept link clicks (HS090-13) — any same-origin <a href> in the
 * document gets routed via navigate() instead of a full page load.
 * Links with [download], [target=_blank], or [data-spa-ignore] skip.
 */
export function installLinkInterceptor (): void
{
	document.addEventListener ("click", (event: MouseEvent) =>
	{
		if (event.defaultPrevented) return;
		if (event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		let el: Element | null = event.target as Element;
		while (el && el.tagName !== "A") el = el.parentElement;
		if (!el) return;

		const a: HTMLAnchorElement = el as HTMLAnchorElement;
		if (a.hasAttribute ("data-spa-ignore")) return;
		if (a.hasAttribute ("download")) return;
		if (a.target && a.target !== "" && a.target !== "_self") return;

		const href: string = a.getAttribute ("href") || "";
		if (!href || href.startsWith ("#") || href.startsWith ("mailto:") ||
			href.startsWith ("tel:") || /^[a-z]+:\/\//i.test (href))
		{
			return;
		}

		const url: URL = new URL (a.href);
		if (url.origin !== location.origin) return;

		event.preventDefault ();
		navigate (url.pathname + url.search + url.hash);
	});

	window.addEventListener ("popstate", () => { mount (); });
}

/**
 * Entry point the bundler-generated entry file invokes.
 */
export function start (): void
{
	if (document.readyState === "loading")
		document.addEventListener ("DOMContentLoaded", () => initialMount ());
	else
		initialMount ();
}

function initialMount (): void
{
	installLinkInterceptor ();
	mount ();
}

// ── Internals ──────────────────────────────────────────────────────────

function resolveRoute (path: string): RouteEntry | undefined
{
	if (state.routes.has (path))
		return (state.routes.get (path));

	// Tolerate trailing slash differences.
	const trimmed: string = path.replace (/\/+$/, "") || "/";
	if (state.routes.has (trimmed))
		return (state.routes.get (trimmed));

	const withSlash: string = path.endsWith ("/") ? path : path + "/";
	if (state.routes.has (withSlash))
		return (state.routes.get (withSlash));

	return (undefined);
}

function buildHotCtx (host: HTMLElement, abort: AbortController): HotCtx
{
	const ctx: HotCtx =
	{
		cookies:
		{
			get: cookieGet,
			set: cookieSet,
			remove: cookieRemove
		},
		search: new URLSearchParams (location.search),
		pathname: location.pathname,
		params: {}, // HS090 future: pattern-matched path params.
		api: state.api,
		async getJSON (url: string): Promise<any>
		{
			const res: Response = await fetch (url, { signal: abort.signal });
			if (!res.ok)
				throw new Error (`getJSON ${url} → HTTP ${res.status}`);
			return (res.json ());
		},
		async import (pkg: string): Promise<any>
		{
			return (import (/* webpackIgnore: true */ pkg));
		},
		includeStash (id: string): string
		{
			const t: HTMLTemplateElement | null =
				document.getElementById (`hott-partial--${id}`) as HTMLTemplateElement | null;
			if (!t) return ("");
			const tmp: HTMLDivElement = document.createElement ("div");
			tmp.appendChild (document.importNode (t.content, true));
			return (tmp.innerHTML);
		},
		echo (html: string): void
		{
			host.insertAdjacentHTML ("beforeend", html);
		}
	};

	lastCtx = ctx;
	return (ctx);
}

function executeInlineScripts (host: HTMLElement, bodies: string[]): void
{
	const placeholders: NodeListOf<HTMLScriptElement> =
		host.querySelectorAll<HTMLScriptElement> ("script[data-hott-script]");

	for (const placeholder of Array.from (placeholders))
	{
		const id: string | null = placeholder.getAttribute ("data-hott-script");
		const match: RegExpMatchArray | null = id ? id.match (/^hott-s(\d+)$/) : null;
		const idx: number = match ? parseInt (match[1], 10) : -1;
		const body: string = (idx >= 0 && idx < bodies.length) ? bodies[idx] : "";

		const real: HTMLScriptElement = document.createElement ("script");
		for (const attr of Array.from (placeholder.attributes))
		{
			if (attr.name === "data-hott-script") continue;
			real.setAttribute (attr.name, attr.value);
		}
		real.textContent = body;

		placeholder.replaceWith (real);
	}
}

function cookieGet (name: string): string | null
{
	const needle: string = encodeURIComponent (name) + "=";
	for (const pair of document.cookie.split ("; "))
	{
		if (pair.startsWith (needle))
			return (decodeURIComponent (pair.substring (needle.length)));
	}
	return (null);
}

function cookieSet (name: string, value: string, opts: any = {}): void
{
	let c: string = encodeURIComponent (name) + "=" + encodeURIComponent (value);
	if (opts.path) c += "; path=" + opts.path;
	if (opts.maxAge != null) c += "; max-age=" + opts.maxAge;
	if (opts.expires) c += "; expires=" + opts.expires;
	if (opts.domain) c += "; domain=" + opts.domain;
	if (opts.secure) c += "; secure";
	if (opts.sameSite) c += "; samesite=" + opts.sameSite;
	document.cookie = c;
}

function cookieRemove (name: string, opts: any = {}): void
{
	cookieSet (name, "", Object.assign ({}, opts, { maxAge: 0 }));
}
