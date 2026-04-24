import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

// tslint:disable-next-line:no-var-requires
const { JSDOM } = require ("jsdom");
type JSDOM = any;

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

/**
 * HS090-8: confirm a pre-generated API client script is copied into
 * dist/js/, hooked into index.html, and surfaces on hotCtx.api so the
 * preamble can call it.
 */

async function buildWithApi (): Promise<{ tmp: string; out: string }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-api-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (ppath.join (pub, "js"), { recursive: true });

	// Mimic the shape of a real HotStaq-generated client:
	//   var libraryName = {};
	//   function HotStaqPostJSONObject(...) { ... }
	//   class users { ... }
	//   libraryName.AppAPI = class extends HotAPIGlobal { constructor ... { this.users = new users(...); } }
	await fsp.writeFile (ppath.join (pub, "js", "testlibWeb_AppAPI.js"),
		`if (typeof (testlibWeb) === "undefined") var testlibWeb = {};
var HotAPIGlobal = undefined;
if (typeof (HotAPI) !== "undefined") HotAPIGlobal = HotAPI;
if (typeof (window) !== "undefined" && typeof (window.HotAPI) !== "undefined") HotAPIGlobal = window.HotAPI;

class users {
  constructor(baseUrl, connection, db) {
    this.baseUrl = baseUrl;
  }
  async login(email, password) {
    return { ok: true, email: email, echoBase: this.baseUrl };
  }
}

{
  if (typeof (testlibWeb.AppAPI) === "undefined") {
    testlibWeb.AppAPI = class extends HotAPIGlobal {
      constructor(baseUrl, connection, db) {
        super(baseUrl, connection, db);
        this.users = new users(baseUrl, connection, db);
      }
    };
  }
}
window.testlibWeb = testlibWeb;
`);

	await fsp.writeFile (ppath.join (pub, "login.hott"),
		"<* const r = await hotCtx.api.users.login('test@x.com', 'pw');\n" +
		"   (window).__apiResult = r; *>\n<section id=\"login\"><h2>Sign In</h2></section>\n"
	);

	const site: HotSite = {
		name: "testlib",
		version: "0.0.1",
		apis: {
			AppAPI: {
				libraryName: "testlibWeb",
				apiName: "AppAPI",
				url: "http://api.example"
			}
		},
		web: {
			testlib: {
				mainUrl: "/",
				routes: [ { path: "/login", file: "./public/login.hott" } ]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	await new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" }).build ();

	return ({ tmp, out });
}

async function loadDistAt (out: string, pathname: string): Promise<JSDOM>
{
	let html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
	// Inline each <script src="./..."> so jsdom doesn't need network.
	const scriptRe: RegExp = /<script src="\.\/([^"]+)"><\/script>/g;
	let match: RegExpExecArray | null;
	const inlines: Array<{ token: string; body: string }> = [];
	while ((match = scriptRe.exec (html)) !== null)
	{
		const rel: string = match[1];
		const abs: string = ppath.join (out, rel);
		if (fs.existsSync (abs))
		{
			const body: string = await fsp.readFile (abs, "utf8");
			inlines.push ({ token: match[0], body });
		}
	}
	for (const { token, body } of inlines)
		html = html.replace (token, `<script>${body}</script>`);

	const dom: JSDOM = new JSDOM (html, {
		url: `http://example.test${pathname}`,
		runScripts: "dangerously",
		pretendToBeVisual: true
	});

	(dom.window as any).fetch = async (): Promise<any> => ({
		ok: true, status: 200, json: async () => ({}), text: async () => ""
	});

	await new Promise (res => dom.window.setTimeout (res, 250));
	return (dom);
}

describe ("v0.9.0 — HS090-8 API client bundling", function ()
{
	this.timeout (20000);

	let tmp: string = "";
	let out: string = "";

	before (async () =>
	{
		const r = await buildWithApi ();
		tmp = r.tmp;
		out = r.out;
	});

	after (async () =>
	{
		if (tmp)
			await fsp.rm (tmp, { recursive: true, force: true });
	});

	it ("copies the generated API client into dist/js/", async () =>
	{
		expect (fs.existsSync (ppath.join (out, "js", "testlibWeb_AppAPI.js"))).to.be.true;
	});

	it ("injects the Hot/HotAPI shim and the API <script> before app.js in index.html", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		const hotShimIdx: number = html.indexOf ("window.Hot = window.Hot || { BearerToken: null }");
		const apiIdx: number = html.indexOf ("./js/testlibWeb_AppAPI.js");
		const appIdx: number = html.search (/\.\/app\.[^"]+\.js/);
		expect (hotShimIdx, "Hot shim missing").to.be.greaterThan (-1);
		expect (apiIdx, "api tag missing").to.be.greaterThan (hotShimIdx);
		expect (appIdx, "app.js must come after api client").to.be.greaterThan (apiIdx);
	});

	it ("mounts the route and the preamble's hotCtx.api call resolves", async () =>
	{
		const dom = await loadDistAt (out, "/login");
		const result = (dom.window as any).__apiResult;
		expect (result, "preamble should have populated __apiResult").to.exist;
		expect (result.ok).to.equal (true);
		expect (result.email).to.equal ("test@x.com");
		expect (result.echoBase).to.equal ("http://api.example");
	});
});
