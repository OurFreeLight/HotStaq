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

describe ("v0.9.0 — HS090-15 build-time partial resolution", function ()
{
	this.timeout (20000);

	it ("hoists literal Hot.include() targets into the stash as <template id=\"hott-partial--...\">", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-part-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "header.hott"),
				"<header class=\"hdr\"><strong>site header</strong></header>");
			await fsp.writeFile (ppath.join (pub, "components", "footer.hott"),
				"<footer class=\"ftr\">site footer</footer>");

			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/header.hott');\n" +
				"   await Hot.include('./components/footer.hott'); *>\n" +
				"<main id=\"layout\">\n" +
				"  <div id=\"hdr-slot\"></div>\n" +
				"  <h1>Body</h1>\n" +
				"  <div id=\"ftr-slot\"></div>\n" +
				"  <script>\n" +
				"    document.getElementById('hdr-slot').innerHTML = hotCtxLastIncludeShim('components/header');\n" +
				"    document.getElementById('ftr-slot').innerHTML = hotCtxLastIncludeShim('components/footer');\n" +
				"  </script>\n" +
				"</main>\n"
			);

			// Minimal includeStash shim accessible to inline scripts.
			// (Preambles have hotCtx.includeStash via their parameter; inline
			// scripts don't — but they can read from the DOM directly.)

			const site: HotSite = {
				name: "partials-test",
				web: {
					"partials-test": {
						mainUrl: "/",
						routes: [ { path: "/", file: "./public/index.hott" } ]
					}
				}
			};

			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			expect (html).to.include (`id="hott-partial--components/header"`);
			expect (html).to.include (`id="hott-partial--components/footer"`);
			expect (html).to.include ("site header");
			expect (html).to.include ("site footer");

			// Partials dict exposes both ids.
			expect (builder.resolvedPartials.has ("components/header")).to.be.true;
			expect (builder.resolvedPartials.has ("components/footer")).to.be.true;

			// No resolution warnings for present files.
			const warnCodes = builder.warnings.map (w => w.code);
			expect (warnCodes).to.not.include ("hs090-15/partial-not-found");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("follows recursive includes across partials", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-part-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			// outer includes inner.
			await fsp.writeFile (ppath.join (pub, "components", "outer.hott"),
				"<* await Hot.include('./components/inner.hott'); *>\n<div class=\"outer\"></div>"
			);
			await fsp.writeFile (ppath.join (pub, "components", "inner.hott"),
				"<span class=\"inner\">inner content</span>"
			);
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/outer.hott'); *>\n<p>root</p>"
			);

			const site: HotSite = {
				name: "recursive-test",
				web: {
					"recursive-test": {
						mainUrl: "/",
						routes: [ { path: "/", file: "./public/index.hott" } ]
					}
				}
			};

			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			expect (builder.resolvedPartials.has ("components/outer")).to.be.true;
			expect (builder.resolvedPartials.has ("components/inner")).to.be.true;
			expect (builder.resolvedPartials.get ("components/inner")).to.include ("inner content");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("warns (non-fatal) when a literal Hot.include target doesn't exist", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-part-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (pub, { recursive: true });
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/ghost.hott'); *>\n<p>no partial</p>"
			);
			const site: HotSite = {
				name: "ghost-test",
				web: { "ghost-test": { mainUrl: "/", routes: [ { path: "/", file: "./public/index.hott" } ] } }
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			expect (builder.warnings.some (w => w.code === "hs090-15/partial-not-found")).to.be.true;
			// Build did not throw.
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("runtime hotCtx.includeStash finds a resolved partial at mount time", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-part-rt-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "banner.hott"),
				"<b class=\"banner\">PROD</b>");
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/banner.hott');\n" +
				"   (window).__bannerHtml = hotCtx.includeStash('components/banner'); *>\n" +
				"<main id=\"m\"><h1>Home</h1></main>\n");

			const site: HotSite = {
				name: "rt-partial-test",
				web: { "rt-partial-test": { mainUrl: "/", routes: [ { path: "/", file: "./public/index.hott" } ] } }
			};
			const out: string = ppath.join (tmp, "dist");
			await new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" }).build ();

			let html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			html = html.replace (/<script src="\.\/([^"]+)"><\/script>/g, (match, rel) =>
			{
				const abs = ppath.join (out, rel);
				if (!fs.existsSync (abs)) return match;
				const body = fs.readFileSync (abs, "utf8");
				return `<script>${body}</script>`;
			});

			const dom: JSDOM = new JSDOM (html, {
				url: `http://example.test/`,
				runScripts: "dangerously",
				pretendToBeVisual: true
			});
			await new Promise (res => dom.window.setTimeout (res, 200));

			const banner: string | undefined = (dom.window as any).__bannerHtml;
			expect (banner, "hotCtx.includeStash should return partial HTML").to.include ("PROD");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});
});
