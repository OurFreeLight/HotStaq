import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

// tslint:disable-next-line:no-var-requires
const { JSDOM } = require ("jsdom");
type JSDOM = any;

import { HotStaticBuilder, templateIdForRoute } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

async function buildMixedPreloadApp (): Promise<{ tmp: string; out: string }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-chunk-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (pub, { recursive: true });

	await fsp.writeFile (ppath.join (pub, "index.hott"),
		"<* (window).__home='mounted'; *>\n<main id=\"home\"><h1>Home</h1>" +
		"<a href=\"/admin\">admin</a> <a href=\"/settings\">settings</a></main>");

	await fsp.writeFile (ppath.join (pub, "admin.hott"),
		"<* (window).__admin='mounted'; *>\n<section id=\"admin\"><h1>Admin</h1></section>");

	await fsp.writeFile (ppath.join (pub, "settings.hott"),
		"<* (window).__settings='mounted'; *>\n<section id=\"settings\"><h1>Settings</h1></section>");

	const site: HotSite = {
		name: "lazyapp",
		web: {
			lazyapp: {
				mainUrl: "/",
				routes: [
					{ path: "/",         file: "./public/index.hott",    preload: "eager" },
					{ path: "/admin",    file: "./public/admin.hott",    preload: "lazy" },
					{ path: "/settings", file: "./public/settings.hott", preload: "never" }
				]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	await new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" }).build ();
	return ({ tmp, out });
}

async function loadDist (out: string, pathname: string): Promise<JSDOM>
{
	let html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");

	// Inline every <script src="./..."> that points at a local file so
	// jsdom doesn't try to fetch over the network.
	html = html.replace (/<script src="\.\/([^"]+)"><\/script>/g, (match, rel) =>
	{
		const abs: string = ppath.join (out, rel);
		if (!fs.existsSync (abs)) return match;
		const body: string = fs.readFileSync (abs, "utf8");
		return `<script data-inlined-from="${rel}">${body}</script>`;
	});

	const dom: JSDOM = new JSDOM (html, {
		url: `http://example.test${pathname}`,
		runScripts: "dangerously",
		pretendToBeVisual: true
	});

	// Stub scripts loaded dynamically by the runtime's loadRouteChunk()
	// (they use `document.createElement("script"); s.src = url;`). jsdom
	// won't actually fetch them without `resources: "usable"` + network,
	// so we intercept script element creation and inline the body manually.
	const originalCreate = dom.window.document.createElement.bind (dom.window.document);
	(dom.window.document as any).createElement = (name: string) =>
	{
		const el = originalCreate (name);
		if (name.toLowerCase () === "script")
		{
			Object.defineProperty (el, "src", {
				set (url: string)
				{
					// Use the builder's dist dir to resolve chunk URLs.
					let rel: string = url.replace (/^\.\//, "");
					if (rel.startsWith ("http://example.test/"))
						rel = rel.substring ("http://example.test/".length);
					const abs: string = ppath.join (out, rel);
					if (fs.existsSync (abs))
					{
						el.textContent = fs.readFileSync (abs, "utf8");
						setTimeout (() =>
						{
							if (typeof el.onload === "function")
								el.onload (new Event ("load"));
						}, 0);
					}
					else
					{
						setTimeout (() =>
						{
							if (typeof el.onerror === "function")
								el.onerror (new Event ("error"));
						}, 0);
					}
				},
				get () { return ""; }
			});
		}
		return (el);
	};

	await new Promise (res => dom.window.setTimeout (res, 200));
	return (dom);
}

describe ("v0.9.0 — HS090-5/-16 lazy route chunks", function ()
{
	this.timeout (30000);

	let tmp: string = "";
	let out: string = "";

	before (async () =>
	{
		const r = await buildMixedPreloadApp ();
		tmp = r.tmp;
		out = r.out;
	});

	after (async () =>
	{
		if (tmp)
			await fsp.rm (tmp, { recursive: true, force: true });
	});

	it ("emits one app-route-{slug}.*.js per lazy/never route (not for eager)", async () =>
	{
		const files: string[] = await fsp.readdir (out);
		expect (files.some (f => /^app-route-admin\.[a-f0-9]+\.js$/.test (f)),
			"admin chunk").to.be.true;
		expect (files.some (f => /^app-route-settings\.[a-f0-9]+\.js$/.test (f)),
			"settings chunk").to.be.true;
		expect (files.some (f => /^app-route-root\.[a-f0-9]+\.js$/.test (f)),
			"no chunk expected for eager /").to.be.false;
	});

	it ("index.html stash only contains eager route templates", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.include (`id="${templateIdForRoute ("lazyapp", "/")}"`);
		expect (html).to.not.include (`id="${templateIdForRoute ("lazyapp", "/admin")}"`);
		expect (html).to.not.include (`id="${templateIdForRoute ("lazyapp", "/settings")}"`);
	});

	it ("main app.js registers chunk URLs via registerChunk for lazy/never routes", async () =>
	{
		const files: string[] = await fsp.readdir (out);
		const appJs: string = files.find (f => /^app\..*\.js$/.test (f))!;
		const body: string = await fsp.readFile (ppath.join (out, appJs), "utf8");
		expect (body).to.include ("registerChunk");
		expect (body).to.include ("/admin");
		expect (body).to.include ("/settings");
	});

	it ("mount on /admin fetches the chunk and registers + mounts the route", async () =>
	{
		const dom = await loadDist (out, "/admin");
		await new Promise (res => dom.window.setTimeout (res, 300));
		const app = dom.window.document.getElementById ("app");
		expect (app!.innerHTML).to.include ("<h1>Admin</h1>");
		expect ((dom.window as any).__admin).to.equal ("mounted");
	});

	it ("mount on /settings (preload: never) also works once the chunk loads", async () =>
	{
		const dom = await loadDist (out, "/settings");
		await new Promise (res => dom.window.setTimeout (res, 300));
		const app = dom.window.document.getElementById ("app");
		expect (app!.innerHTML).to.include ("<h1>Settings</h1>");
		expect ((dom.window as any).__settings).to.equal ("mounted");
	});

	it ("manifest.hotSite preserves the preload tier per route", async () =>
	{
		const mf = JSON.parse (await fsp.readFile (ppath.join (out, "build-manifest.json"), "utf8"));
		const byPath: Record<string, any> = {};
		for (const r of mf.hotSite.web.lazyapp.routes) byPath[r.path] = r;
		expect (byPath["/"].preload).to.equal ("eager");
		expect (byPath["/admin"].preload).to.equal ("lazy");
		expect (byPath["/settings"].preload).to.equal ("never");
	});
});
