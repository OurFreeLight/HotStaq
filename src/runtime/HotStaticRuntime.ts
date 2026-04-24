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
	/** HS090-16: chunk URL per lazy/never route path. */
	chunkUrls: Map<string, string>;
	/** HS090-16: inflight chunk fetches, so we don't race on two navs. */
	chunkLoads: Map<string, Promise<void>>;
}

const state: RuntimeState =
{
	mountSelector: "#app",
	routes: new Map (),
	api: {},
	chunkUrls: new Map (),
	chunkLoads: new Map ()
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
 * HS090-16: register a lazy/never route's chunk URL. When `mount(path)`
 * is called for an unregistered route whose chunk is known, the runtime
 * fetches the chunk (which then calls registerRoute) and retries mount.
 */
export function registerChunk (path: string, url: string): void
{
	state.chunkUrls.set (path, url);
}

/**
 * Explicitly load a route's chunk without mounting. Used by hover
 * prefetch (HS090-17) and callable from preambles that know the user
 * is about to navigate.
 */
export function prefetchRoute (path: string): Promise<void>
{
	return (loadRouteChunk (path));
}

function loadRouteChunk (path: string): Promise<void>
{
	if (state.routes.has (path))
		return (Promise.resolve ());

	const inflight: Promise<void> | undefined = state.chunkLoads.get (path);
	if (inflight)
		return (inflight);

	const url: string | undefined = state.chunkUrls.get (path);
	if (!url)
		return (Promise.resolve ());

	const p: Promise<void> = new Promise ((resolve, reject) =>
	{
		const s: HTMLScriptElement = document.createElement ("script");
		s.src = url;
		s.async = true;
		s.onload = () => resolve ();
		s.onerror = () => reject (new Error (`[hs090] failed to load chunk ${url}`));
		document.head.appendChild (s);
	});

	state.chunkLoads.set (path, p);
	return (p);
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
	// HS090-14: scroll to top for fresh navigations, restore on popstate.
	window.scrollTo (0, 0);
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
	let route: RouteEntry | undefined = resolveRoute (path);

	if (!route)
	{
		// HS090-16: maybe it's a lazy route whose chunk hasn't loaded yet.
		const chunkPath: string = matchChunkPath (path);
		if (chunkPath)
		{
			try { await loadRouteChunk (chunkPath); }
			catch (err) { console.error (err); return; }
			route = resolveRoute (path);
		}
	}

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

	// Pure-static templates have their HTML inline in the stash; we
	// clone that first so the initial paint is free of preamble latency.
	// Dynamic routes (.hott files that contain <* *> preambles) have an
	// empty stash template and rely on the compiled preamble to echo all
	// content in source order — that preserves admin-panel's header →
	// body → footer layering.
	const stashHtml: string = template.innerHTML || "";
	const pureStatic: boolean = stashHtml.trim () !== "";
	if (pureStatic)
		host.appendChild (document.importNode (template.content, true));

	const buffer: EchoBuffer = { html: "" };
	const ctx: HotCtx = buildHotCtx (host, abort, buffer);

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

	// Single innerHTML parse of the accumulated echoes — lets unclosed
	// tags in one echo get closed by a later echo (admin-panel's
	// header → body → footer layering needs this).
	if (!pureStatic && buffer.html)
		host.innerHTML = buffer.html;

	// Re-execute inline scripts: the tokenizer left empty placeholder
	// <script data-hott-script="hott-sN"> nodes; replace them with real
	// scripts so the browser runs the bodies. Works whether they
	// landed via template clone or preamble echo.
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
 * HS090-14 scroll restoration: stash scroll position on every nav and
 * restore on popstate.
 */
function saveScrollPosition (): void
{
	try
	{
		const existing: any = (history.state as any) || {};
		history.replaceState (
			Object.assign ({}, existing, { __hs090_scroll: { x: window.scrollX, y: window.scrollY } }),
			"", location.href
		);
	}
	catch { /* replaceState can fail in some sandboxes; non-critical */ }
}

function restoreScrollPosition (): void
{
	const s: any = (history.state as any) || {};
	if (s.__hs090_scroll)
		window.scrollTo (s.__hs090_scroll.x || 0, s.__hs090_scroll.y || 0);
	else
		window.scrollTo (0, 0);
}

/**
 * Intercept link clicks (HS090-13) + form submits (HS090-12 subset) —
 * any same-origin <a href> or <form method=get action=...> routes via
 * navigate() instead of a full page load. Links with [download],
 * [target=_blank], or [data-spa-ignore] skip; forms with
 * [data-spa-ignore] skip.
 */
export function installLinkInterceptor (): void
{
	document.addEventListener ("click", (event: MouseEvent) =>
	{
		if (event.defaultPrevented) return;
		if (event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		const a: HTMLAnchorElement | null = findAnchor (event.target as Element);
		if (!a) return;

		const url: URL | null = intraAppHref (a);
		if (!url) return;

		event.preventDefault ();
		saveScrollPosition ();
		navigate (url.pathname + url.search + url.hash);
	});

	// HS090-12 form interception: GET forms that target same-origin get
	// serialized into a querystring and navigated via pushState. POST
	// forms stay as full submits — preambles handle those via hotCtx.api.
	document.addEventListener ("submit", (event: Event) =>
	{
		const form = event.target as HTMLFormElement;
		if (!form || form.tagName !== "FORM") return;
		if (form.hasAttribute ("data-spa-ignore")) return;
		if ((form.method || "get").toLowerCase () !== "get") return;

		const action: string = form.getAttribute ("action") || location.pathname;
		let actionUrl: URL;
		try { actionUrl = new URL (action, location.href); }
		catch { return; }
		if (actionUrl.origin !== location.origin) return;

		event.preventDefault ();
		const data: FormData = new FormData (form);
		const qs: URLSearchParams = new URLSearchParams ();
		data.forEach ((v, k) => { if (typeof v === "string") qs.append (k, v); });
		const q: string = qs.toString ();
		const dest: string = actionUrl.pathname + (q ? "?" + q : "") + actionUrl.hash;
		saveScrollPosition ();
		navigate (dest);
	});

	// HS090-17: hover/focus prefetch. Only warms the chunk (no mount).
	// Uses `mouseover` (buubbles) with a WeakSet to debounce per anchor.
	const prefetched: WeakSet<HTMLAnchorElement> = new WeakSet ();

	const maybePrefetch = (a: HTMLAnchorElement | null) =>
	{
		if (!a || prefetched.has (a)) return;
		const url: URL | null = intraAppHref (a);
		if (!url) return;
		const chunkPath: string = matchChunkPath (url.pathname);
		if (!chunkPath) return;
		const route: RouteEntry | undefined = state.routes.get (chunkPath);
		if (route && route.preload === "never") return;
		prefetched.add (a);
		loadRouteChunk (chunkPath).catch (() => { /* swallow — mount will retry */ });
	};

	document.addEventListener ("mouseover", (e: MouseEvent) =>
	{
		maybePrefetch (findAnchor (e.target as Element));
	});
	document.addEventListener ("focusin", (e: FocusEvent) =>
	{
		maybePrefetch (findAnchor (e.target as Element));
	});

	window.addEventListener ("popstate", async () =>
	{
		await mount ();
		restoreScrollPosition ();
	});
}

function findAnchor (start: Element | null): HTMLAnchorElement | null
{
	let el: Element | null = start;
	while (el && el.tagName !== "A") el = el.parentElement;
	return (el as HTMLAnchorElement | null);
}

function intraAppHref (a: HTMLAnchorElement | null): URL | null
{
	if (!a) return (null);
	if (a.hasAttribute ("data-spa-ignore")) return (null);
	if (a.hasAttribute ("download")) return (null);
	if (a.target && a.target !== "" && a.target !== "_self") return (null);
	const href: string = a.getAttribute ("href") || "";
	if (!href || href.startsWith ("#") || href.startsWith ("mailto:") ||
		href.startsWith ("tel:") || /^[a-z]+:\/\//i.test (href))
	{
		return (null);
	}
	const url: URL = new URL (a.href);
	if (url.origin !== location.origin) return (null);
	return (url);
}

function matchChunkPath (path: string): string
{
	if (state.chunkUrls.has (path))
		return (path);
	const trimmed: string = path.replace (/\/+$/, "") || "/";
	if (state.chunkUrls.has (trimmed))
		return (trimmed);
	const withSlash: string = path.endsWith ("/") ? path : path + "/";
	if (state.chunkUrls.has (withSlash))
		return (withSlash);
	return ("");
}

/**
 * Entry point the bundler-generated entry file invokes.
 */
export function start (): void
{
	// Legacy HotStaq.min.js (when shipped via jsFiles) registers
	// hotStaqWebStart on window.load; that callback copies HotStaqWeb
	// keys onto window (including window.Hot) — which clobbers any
	// Hot.CurrentPage.processor we set up earlier. We defer our initial
	// mount until after window.load so the legacy startup runs first
	// and our bootstrap gets the last word on Hot.CurrentPage.
	const runLater = (): void =>
	{
		// Give hotStaqWebStart's microtask chain one macrotask to settle
		// (it does its work inside a setTimeout(…, 50)).
		setTimeout (() => initialMount (), 70);
	};
	if (document.readyState === "complete")
		runLater ();
	else
		window.addEventListener ("load", runLater, { once: true });
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

interface EchoBuffer { html: string }

function buildHotCtx (host: HTMLElement, abort: AbortController, buffer: EchoBuffer): HotCtx
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
			// 1) If a legacy-compat bootstrap has populated the
			//    processor's module map (via the <script src> load
			//    of hotstaq_modules/{name}/index.js), just return
			//    the cached HotModule.
			const w: any = (typeof window !== "undefined" ? window : null);
			if (w && w.Hot && w.Hot.CurrentPage && w.Hot.CurrentPage.processor)
			{
				const proc: any = w.Hot.CurrentPage.processor;
				if (typeof proc.getModule === "function")
				{
					const cached: any = proc.getModule (pkg);
					if (cached) return (cached);
				}
			}

			// 2) Fetch + eval hotstaq_modules/{pkg}/index.js the way
			//    legacy Hot.import does. The file expects a
			//    HotStaqWeb.HotModule global already on the page.
			try
			{
				const res: Response = await fetch (`./hotstaq_modules/${pkg}/index.js`);
				if (res.ok && w)
				{
					const body: string = await res.text ();
					// eslint-disable-next-line no-new-func
					const fn: Function = new Function (body);
					const mod: any = fn.call (w);
					if (w.Hot && w.Hot.CurrentPage && w.Hot.CurrentPage.processor &&
						typeof w.Hot.CurrentPage.processor.addModule === "function")
					{
						w.Hot.CurrentPage.processor.addModule (pkg, mod);
					}
					return (mod);
				}
			}
			catch { /* fall through */ }

			return ({});
		},
		includeStash (id: string): string
		{
			const el: HTMLElement | null = document.getElementById (`hott-partial--${id}`);
			if (!el) return ("");
			// Partial stash entries ship as <script type="text/html">
			// whose .textContent preserves the raw HTML (including
			// intentionally unbalanced tag pairs between header/footer
			// partials).
			return (el.textContent || "");
		},
		echo (html: string): void
		{
			// Accumulate echoes into a string buffer so the final
			// innerHTML parse sees a single well-formed fragment.
			// Legacy .hott partials (admin-panel's header/footer) rely
			// on unclosed tags from one include being CLOSED by a later
			// sibling include — per-call insertAdjacentHTML parses each
			// piece independently, which auto-closes unbalanced tags
			// and breaks that model.
			if (html == null) return;
			buffer.html += String (html);
		},
		async jsonRequest (url: string, body: any, auth?: string): Promise<any>
		{
			const headers: Record<string, string> = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
			if (auth) headers["Authorization"] = "Bearer " + auth;
			const res: Response = await fetch (url, {
				method: "POST",
				headers,
				body: JSON.stringify (body),
				signal: abort.signal
			});
			const text: string = await res.text ();
			try { return (JSON.parse (text)); }
			catch { return (text); }
		},
		async includeJS (url: string, args: any[] = []): Promise<any>
		{
			// Legacy-compat helper: Hot.includeJS("./js/foo.js", [arg1, arg2])
			// fetches the script body, evaluates it as a function body whose
			// `this` is the hotCtx, and returns whatever it yields.
			const abs: URL = new URL (url, location.href);
			const res: Response = await fetch (abs.toString (), { signal: abort.signal });
			if (!res.ok)
				throw new Error (`includeJS ${url} → HTTP ${res.status}`);
			const body: string = await res.text ();
			const argNames: string[] = args.map ((_, i) => `_a${i}`);
			// Wrap in an async function so `await` inside works.
			// eslint-disable-next-line no-new-func
			const fn: Function = new Function (...argNames, `return (async () => { ${body}\nreturn (typeof __hott_export !== 'undefined' ? __hott_export : undefined); })();`);
			return (fn.apply (ctx, args));
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
