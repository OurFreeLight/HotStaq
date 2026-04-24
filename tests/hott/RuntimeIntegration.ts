import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

// jsdom lacks first-class types in this repo; cast the runtime import.
// tslint:disable-next-line:no-var-requires
const { JSDOM } = require ("jsdom");
type JSDOM = any;

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

/**
 * End-to-end: build a tiny app with the real esbuild bundler, load the
 * resulting index.html + app.js into jsdom, verify that the runtime
 * mounts the correct template and runs the preamble.
 */

async function buildTinyApp (): Promise<{ tmp: string; out: string }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-rt-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (pub, { recursive: true });

	await fsp.writeFile (ppath.join (pub, "index.hott"),
		"<* (window).__lastRoute = 'home'; *>\n<main id=\"home\"><h1>Home</h1></main>\n");
	await fsp.writeFile (ppath.join (pub, "login.hott"),
		"<* (window).__lastRoute = 'login'; const r = await hotCtx.getJSON('/config.json'); (window).__env = r.env; *>\n" +
		"<section id=\"login\"><h2>Sign In</h2>" +
		"<script>(window).__scriptRan = true;</script>" +
		"</section>\n");
	await fsp.writeFile (ppath.join (pub, "config.json"), JSON.stringify ({ env: "jsdom" }));

	const site: HotSite = {
		name: "tiny-app",
		version: "0.0.1",
		web: {
			"tiny-app": {
				mainUrl: "/",
				routes: [
					{ path: "/", file: "./public/index.hott" },
					{ path: "/login", file: "./public/login.hott" }
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

	// Remove the <script src="./app.*.js"> reference so jsdom doesn't try
	// to fetch it over the network — we inject the bundle inline below.
	html = html.replace (/<script src="\.\/app\.[^"]+"><\/script>/, "");

	const dom: JSDOM = new JSDOM (html, {
		url: `http://example.test${pathname}`,
		runScripts: "dangerously",
		pretendToBeVisual: true
	});

	// Stub fetch() for anything preambles request (e.g. /config.json).
	// Return a plain duck-typed Response shape — jsdom exposes no Response
	// constructor but preambles only call .ok / .json().
	(dom.window as any).fetch = async (url: any): Promise<any> =>
	{
		const href: string = typeof url === "string" ? url : (url.url || String (url));
		const u: URL = new URL (href, dom.window.location.href);
		const abs: string = ppath.join (out, u.pathname);
		if (!fs.existsSync (abs))
			return ({ ok: false, status: 404, json: async () => ({}), text: async () => "" });
		const body: string = await fsp.readFile (abs, "utf8");
		return ({
			ok: true,
			status: 200,
			json: async () => JSON.parse (body),
			text: async () => body
		});
	};

	// Inject the built app.js inline so jsdom evaluates it.
	const distFiles: string[] = await fsp.readdir (out);
	const jsFile: string | undefined = distFiles.find (f => /^app\..*\.js$/.test (f));
	if (!jsFile)
		throw new Error ("no app.*.js in dist/");

	const js: string = await fsp.readFile (ppath.join (out, jsFile), "utf8");
	const s: HTMLScriptElement = dom.window.document.createElement ("script");
	s.textContent = js;
	dom.window.document.body.appendChild (s);

	// Wait for DOMContentLoaded + the mount microtask chain to settle.
	await new Promise (res => dom.window.setTimeout (res, 200));
	return (dom);
}

describe ("v0.9.0 — runtime integration (jsdom)", function ()
{
	this.timeout (20000);

	let tmp: string = "";
	let out: string = "";

	before (async () =>
	{
		const r = await buildTinyApp ();
		tmp = r.tmp;
		out = r.out;
	});

	after (async () =>
	{
		if (tmp)
			await fsp.rm (tmp, { recursive: true, force: true });
	});

	it ("mounts the home template on / and runs its preamble", async () =>
	{
		const dom = await loadDist (out, "/");
		const app = dom.window.document.getElementById ("app");
		expect (app, "#app must exist").to.exist;
		expect (app!.innerHTML).to.include ("<h1>Home</h1>");
		expect ((dom.window as any).__lastRoute).to.equal ("home");
	});

	it ("mounts the login template on /login, runs the preamble with hotCtx.getJSON, and re-executes inline scripts", async () =>
	{
		const dom = await loadDist (out, "/login");

		// Give the async preamble time to resolve.
		await new Promise (res => dom.window.setTimeout (res, 150));

		const app = dom.window.document.getElementById ("app");
		expect (app!.innerHTML).to.include ("<h2>Sign In</h2>");
		expect ((dom.window as any).__lastRoute).to.equal ("login");
		expect ((dom.window as any).__env).to.equal ("jsdom");
		expect ((dom.window as any).__scriptRan).to.equal (true);
	});
});
