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
 * HS090-21 pilot surface test — reproduces the FreelightAuth shape
 * (index + login + register, shared header/footer partials, an API
 * client at ./js, admin-panel bootstrap via Hot.import → hotCtx.import,
 * user-auth helper via Hot.includeJS → hotCtx.includeJS, JWT cookie
 * handling) to prove the v0.9.0 pipeline covers a real auth app.
 *
 * When this suite is green, the actual FreelightAuth repo migration
 * is a mechanical port: rewrite `Hot.*` → `hotCtx.*` and adapt the
 * chart to the nginx-frontend + api-container split.
 */

async function scaffoldAuthLike (): Promise<{ tmp: string; out: string }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-auth-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });
	await fsp.mkdir (ppath.join (pub, "js"), { recursive: true });

	await fsp.writeFile (ppath.join (pub, "config.json"),
		JSON.stringify ({ baseUrl: "http://localhost:8100", env: "dev" }));

	// Fake admin-panel module as a plain JS file loaded via hotCtx.includeJS.
	await fsp.writeFile (ppath.join (pub, "js", "admin-panel-bootstrap.js"),
		"(window).__adminPanelReady = true;"
	);

	// Fake user-auth helper that the login preamble calls and uses to
	// decide whether to redirect. Returns true if a jwt cookie is
	// present — exactly how FreelightAuth gates authed-only pages.
	await fsp.writeFile (ppath.join (pub, "js", "user-auth.js"),
		"// Hot.includeJS historical wrapper: this file's body runs with\n" +
		"// the args destructured into _a0.. positional vars.\n" +
		"const [config, jwt] = [_a0, _a1];\n" +
		"(window).__userAuth = { hasJwt: !!jwt, config };\n" +
		"var __hott_export = { authed: !!jwt };\n"
	);

	// Fake API client (minimal FreelightAuth-style AppAPI surface).
	await fsp.writeFile (ppath.join (pub, "js", "freelight_authWeb_AppAPI.js"),
		`if (typeof (freelight_authWeb) === "undefined") var freelight_authWeb = {};
var HotAPIGlobal = window.HotAPI;

class users {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
  async login(email, password) {
    if (email === "ok@x.com" && password === "pass")
      return { success: true, token: "faketoken", user: { id: "u1" } };
    return { success: false, error: "bad credentials" };
  }
  async register(email, password) {
    return { success: true, token: "newtoken", user: { id: "u2" } };
  }
}

freelight_authWeb.AppAPI = class extends HotAPIGlobal {
  constructor(baseUrl, connection, db) {
    super(baseUrl, connection, db);
    this.users = new users(baseUrl);
  }
};
window.freelight_authWeb = freelight_authWeb;
`);

	// Shared header/footer partials — referenced via literal Hot.include.
	await fsp.writeFile (ppath.join (pub, "components", "header.hott"),
		"<header id=\"hdr\"><span>FreelightAuth</span></header>");
	await fsp.writeFile (ppath.join (pub, "components", "footer.hott"),
		"<footer id=\"ftr\">&copy; FL</footer>");

	// Pages.
	await fsp.writeFile (ppath.join (pub, "index.hott"),
		"<* const cfg = await Hot.getJSON('./config.json');\n" +
		"   const jwt = Hot.Cookies.get('jwtToken');\n" +
		"   const adm = await Hot.includeJS('./js/admin-panel-bootstrap.js');\n" +
		"   const ua = await Hot.includeJS('./js/user-auth.js', [cfg, jwt]);\n" +
		"   await Hot.include('./components/header.hott');\n" +
		"   (window).__indexState = { cfg, authed: ua.authed, adm };\n" +
		"   await Hot.include('./components/footer.hott'); *>\n" +
		"<main id=\"home\"><h2>FreelightAuth</h2>\n" +
		"  <a href=\"/login\">Sign in</a>\n" +
		"  <a href=\"/register\">Register</a>\n" +
		"</main>\n"
	);

	await fsp.writeFile (ppath.join (pub, "login.hott"),
		"<* await Hot.include('./components/header.hott'); *>\n" +
		"<section id=\"login\">\n" +
		"  <h3>Sign in</h3>\n" +
		"  <form id=\"loginForm\" data-spa-ignore>\n" +
		"    <input name=\"email\" type=\"email\" required>\n" +
		"    <input name=\"password\" type=\"password\" required>\n" +
		"    <button type=\"submit\">Sign in</button>\n" +
		"  </form>\n" +
		"  <div id=\"result\"></div>\n" +
		"  <script>\n" +
		"    const f = document.getElementById('loginForm');\n" +
		"    f.addEventListener('submit', async (e) => {\n" +
		"      e.preventDefault();\n" +
		"      const fd = new FormData(f);\n" +
		"      const api = new window.freelight_authWeb.AppAPI('http://localhost:8100');\n" +
		"      const r = await api.users.login(fd.get('email'), fd.get('password'));\n" +
		"      document.getElementById('result').textContent = JSON.stringify(r);\n" +
		"      (window).__lastLogin = r;\n" +
		"    });\n" +
		"  </script>\n" +
		"</section>"
	);

	await fsp.writeFile (ppath.join (pub, "register.hott"),
		"<section id=\"register\"><h3>Register</h3></section>"
	);

	const site: HotSite = {
		name: "freelight-auth-pilot",
		version: "0.9.0",
		apis: {
			AppAPI: {
				libraryName: "freelight_authWeb",
				apiName: "AppAPI",
				url: "http://localhost:8100"
			}
		},
		web: {
			"freelight-auth-pilot": {
				mainUrl: "/",
				cssFiles: [],
				routes: [
					{ path: "/",         file: "./public/index.hott",    preload: "eager" },
					{ path: "/login",    file: "./public/login.hott",    preload: "eager" },
					{ path: "/register", file: "./public/register.hott", preload: "lazy" }
				]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	await new HotStaticBuilder (site, { cwd: tmp, out, mode: "production" }).build ();
	return ({ tmp, out });
}

async function loadDist (out: string, pathname: string): Promise<JSDOM>
{
	let html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
	html = html.replace (/<script src="\.\/([^"]+)"><\/script>/g, (match, rel) =>
	{
		const abs: string = ppath.join (out, rel);
		if (!fs.existsSync (abs)) return match;
		const body: string = fs.readFileSync (abs, "utf8");
		return `<script>${body}</script>`;
	});

	const dom: JSDOM = new JSDOM (html, {
		url: `http://example.test${pathname}`,
		runScripts: "dangerously",
		pretendToBeVisual: true
	});

	// Stub fetch — serve the emitted dist files so preambles can load
	// config.json and includeJS bodies.
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

	// Stub dynamic <script src> (lazy chunk loader).
	const origCreate = dom.window.document.createElement.bind (dom.window.document);
	(dom.window.document as any).createElement = (name: string) =>
	{
		const el = origCreate (name);
		if (name.toLowerCase () === "script")
		{
			Object.defineProperty (el, "src", {
				set (u: string)
				{
					let rel: string = u.replace (/^\.\//, "");
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
				},
				get () { return ""; }
			});
		}
		return (el);
	};

	await new Promise (res => dom.window.setTimeout (res, 400));
	return (dom);
}

describe ("v0.9.0 — HS090-21 FreelightAuth-shaped pilot fixture", function ()
{
	this.timeout (30000);

	let tmp: string = "";
	let out: string = "";

	before (async () =>
	{
		const r = await scaffoldAuthLike ();
		tmp = r.tmp;
		out = r.out;
	});

	after (async () =>
	{
		if (tmp)
			await fsp.rm (tmp, { recursive: true, force: true });
	});

	it ("index preamble loads config, jwt cookie, includeJS helpers, and partials", async () =>
	{
		const dom = await loadDist (out, "/");
		const state: any = (dom.window as any).__indexState;
		expect (state, "__indexState set by preamble").to.exist;
		expect (state.cfg.baseUrl).to.equal ("http://localhost:8100");
		// No jwt cookie set in this run; authed should be falsy.
		expect (state.authed).to.equal (false);
		expect ((dom.window as any).__adminPanelReady).to.equal (true);
		expect ((dom.window as any).__userAuth).to.include ({ hasJwt: false });

		// Header/footer partials inlined via Hot.include.
		const app = dom.window.document.getElementById ("app");
		expect (app!.innerHTML).to.include ("FreelightAuth");
	});

	it ("login page mounts, API client resolves, form submit calls api.users.login", async () =>
	{
		const dom = await loadDist (out, "/login");

		const form = dom.window.document.getElementById ("loginForm") as HTMLFormElement;
		expect (form, "login form mounted").to.exist;

		// Populate + submit.
		(form.elements.namedItem ("email") as HTMLInputElement).value = "ok@x.com";
		(form.elements.namedItem ("password") as HTMLInputElement).value = "pass";
		form.dispatchEvent (new dom.window.Event ("submit", { cancelable: true, bubbles: true }));

		await new Promise (res => dom.window.setTimeout (res, 250));

		const last: any = (dom.window as any).__lastLogin;
		expect (last, "__lastLogin populated by form handler").to.exist;
		expect (last.success).to.equal (true);
		expect (last.token).to.equal ("faketoken");
	});

	it ("register is shipped as a lazy chunk, not inlined in index.html", async () =>
	{
		const files: string[] = await fsp.readdir (out);
		expect (files.some (f => /^app-route-register\.[a-f0-9]+\.js$/.test (f)),
			"register chunk emitted").to.be.true;

		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.not.include ("id=\"register\"");
	});

	it ("manifest captures pilot shape (apiClient + all three routes)", async () =>
	{
		const mf = JSON.parse (await fsp.readFile (ppath.join (out, "build-manifest.json"), "utf8"));
		expect (mf.apiClients[0]).to.include ({
			libraryName: "freelight_authWeb",
			apiName: "AppAPI"
		});
		expect (mf.routes.map ((r: any) => r.path).sort ()).to.deep.equal (["/", "/login", "/register"]);
	});
});
