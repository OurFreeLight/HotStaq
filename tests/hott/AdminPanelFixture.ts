import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { stripDocumentWrappers } from "../../src/hott/build-expand";
import { HotSite } from "../../src/HotSite";

/**
 * HS090-15 / admin-panel operational fixture.
 *
 * Reproduces the way @hotstaq/admin-panel is consumed: an installed
 * `hotstaq_modules/@hotstaq/admin-panel/index.js` registers the
 * module's .css/.js/.html/.components manifest; admin-header.hott
 * calls Hot.import("@hotstaq/admin-panel") then emits outputCSS/JS,
 * includes nested sidebar with an args loop, and the caller page
 * uses Hot.include("@hotstaq/admin-panel/admin-header.hott", { TITLE,
 * SIDEBAR_ITEMS }) to pull it all together.
 *
 * When this suite is green, v0.9.0 handles the real admin-panel
 * template surface end-to-end at build time — no runtime template
 * machinery, no admin-panel refactor.
 */

async function scaffoldAdminConsumer (): Promise<{ tmp: string; out: string }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-adm-"));
	const pub: string = ppath.join (tmp, "public");
	const modRoot: string = ppath.join (pub, "hotstaq_modules", "@hotstaq", "admin-panel");
	const modHtml: string = ppath.join (modRoot, "public", "html");
	const modCss: string = ppath.join (modRoot, "public", "css");
	const modJs: string = ppath.join (modRoot, "public", "js");

	await fsp.mkdir (modHtml, { recursive: true });
	await fsp.mkdir (modCss, { recursive: true });
	await fsp.mkdir (modJs, { recursive: true });

	// Minimal admin-header + admin-sidebar that mirror the real ones:
	// header calls Hot.import, outputs CSS/JS, uses ${TITLE} and includes
	// sidebar; sidebar iterates SIDEBAR_ITEMS with ${url}/${label}.
	await fsp.writeFile (ppath.join (modHtml, "admin-header.hott"),
		"<*\n" +
		"let adminPanel = await Hot.import(\"@hotstaq/admin-panel\");\n" +
		"*>\n" +
		"<!doctype html>\n" +
		"<html lang=\"en\">\n" +
		"<head>\n" +
		"  <title>${TITLE}</title>\n" +
		"<*\n" +
		"  adminPanel.outputCSS();\n" +
		"  adminPanel.outputJS();\n" +
		"*>\n" +
		"</head>\n" +
		"<body>\n" +
		"<header class=\"navbar\">\n" +
		"  <a class=\"brand\" href=\"#\">${PANEL_NAME}</a>\n" +
		"</header>\n" +
		"<nav id=\"sidebarMenu\">\n" +
		"<* await Hot.include(\"@hotstaq/admin-panel/admin-sidebar.hott\", { SIDEBAR_ITEMS: SIDEBAR_ITEMS }); *>\n" +
		"</nav>\n"
	);

	await fsp.writeFile (ppath.join (modHtml, "admin-sidebar.hott"),
		"<ul class=\"nav\">\n" +
		"<* for (let i = 0; i < SIDEBAR_ITEMS.length; i++) {\n" +
		"  let item = SIDEBAR_ITEMS[i];\n" +
		"  let url = item.url;\n" +
		"  let label = item.label; *>\n" +
		"  <li><a href=\"${url}\">${label}</a></li>\n" +
		"<* } *>\n" +
		"</ul>\n"
	);

	// Install index.js — exactly the shape hotstaq module install emits.
	await fsp.writeFile (ppath.join (modRoot, "index.js"),
		"let newModule = new HotStaqWeb.HotModule(\"@hotstaq/admin-panel\");\n" +
		"newModule.css = [\"hotstaq_modules/@hotstaq/admin-panel/public/css/main.css\"];\n" +
		"newModule.js = [\"hotstaq_modules/@hotstaq/admin-panel/public/js/components.js\"];\n" +
		"newModule.html = [\n" +
		"  { name: \"@hotstaq/admin-panel/admin-header.hott\",\n" +
		"    path: \"hotstaq_modules/@hotstaq/admin-panel/public/html/admin-header.hott\" },\n" +
		"  { name: \"@hotstaq/admin-panel/admin-sidebar.hott\",\n" +
		"    path: \"hotstaq_modules/@hotstaq/admin-panel/public/html/admin-sidebar.hott\" }\n" +
		"];\n" +
		"newModule.componentLibrary = \"AdminPanelComponentsWeb\";\n" +
		"newModule.components = [\"AdminDashboard\"];\n" +
		"return (newModule);\n"
	);

	// Stub assets (empty files — the builder's copyAssets will pick them up).
	await fsp.writeFile (ppath.join (modCss, "main.css"), ".brand { color: red; }\n");
	await fsp.writeFile (ppath.join (modJs, "components.js"), "// admin components stub\n");

	// Consumer page — uses admin-panel the way a real app does.
	await fsp.writeFile (ppath.join (pub, "index.hott"),
		"<* await Hot.import(\"@hotstaq/admin-panel\");\n" +
		"   await Hot.include(\"@hotstaq/admin-panel/admin-header.hott\", {\n" +
		"     TITLE: \"My Admin\",\n" +
		"     PANEL_NAME: \"Users Panel\",\n" +
		"     SIDEBAR_ITEMS: [\n" +
		"       { url: '/users', label: 'Users' },\n" +
		"       { url: '/groups', label: 'Groups' }\n" +
		"     ]\n" +
		"   }); *>\n" +
		"<main id=\"content\"><h1>Page body</h1></main>\n"
	);

	const site: HotSite = {
		name: "admin-consumer",
		version: "0.9.0-test",
		web: {
			"admin-consumer": {
				mainUrl: "/",
				routes: [ { path: "/", file: "./public/index.hott", preload: "eager" } ]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
	await builder.build ();

	return ({ tmp, out });
}

describe ("v0.9.0 — admin-panel operational fixture", function ()
{
	this.timeout (25000);

	let tmp: string = "";
	let out: string = "";

	before (async () =>
	{
		const r = await scaffoldAdminConsumer ();
		tmp = r.tmp;
		out = r.out;
	});

	after (async () =>
	{
		if (tmp)
			await fsp.rm (tmp, { recursive: true, force: true });
	});

	it ("preloads the installed module so @hotstaq/admin-panel/* partial paths resolve", async () =>
	{
		// Header partial made it into the stash; sidebar was recursively
		// inlined inside the header's expansion (no separate stash entry
		// for args-carrying nested calls — that's the design).
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.include ("@hotstaq/admin-panel/admin-header");
		expect (html).to.include ("<ul class=\"nav\">");
	});

	it ("expands ${TITLE} / ${PANEL_NAME} from the caller's literal args", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.include ("<title>My Admin</title>");
		expect (html).to.include ("Users Panel");
		expect (html).to.not.include ("${TITLE}");
		expect (html).to.not.include ("${PANEL_NAME}");
	});

	it ("inlines adminPanel.outputCSS/JS as <link>/<script> tags from the module manifest", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.include ("hotstaq_modules/@hotstaq/admin-panel/public/css/main.css");
		expect (html).to.include ("hotstaq_modules/@hotstaq/admin-panel/public/js/components.js");
	});

	it ("unrolls the sidebar for-loop over SIDEBAR_ITEMS at build time", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
		expect (html).to.include ('href="/users">Users</a>');
		expect (html).to.include ('href="/groups">Groups</a>');
		expect (html).to.not.include ("SIDEBAR_ITEMS");
		expect (html).to.not.include ("${url}");
	});

	it ("strips <!doctype>, <html>, <head>, <body> wrappers so the fragment embeds cleanly", async () =>
	{
		const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");

		// The top-level dist/index.html shell has exactly one doctype.
		const doctypeCount: number = (html.match (/<!doctype\s+html\s*>/gi) || []).length;
		expect (doctypeCount, "exactly one doctype in the emitted shell").to.equal (1);

		// No nested <html>/<body> markers inside the stash. <head> may
		// appear in the shell itself but not inside a <template>.
		const firstTemplateIdx: number = html.indexOf ("<template ");
		const htmlInStash: number = html.indexOf ("<html", firstTemplateIdx);
		expect (htmlInStash, "no stray <html> inside stash").to.equal (-1);
	});

	it ("copies the module's public/ assets into dist/hotstaq_modules/", async () =>
	{
		const cssPath: string = ppath.join (out, "hotstaq_modules", "@hotstaq", "admin-panel", "public", "css", "main.css");
		const jsPath: string = ppath.join (out, "hotstaq_modules", "@hotstaq", "admin-panel", "public", "js", "components.js");
		expect (fs.existsSync (cssPath), "CSS copied").to.be.true;
		expect (fs.existsSync (jsPath), "JS copied").to.be.true;
	});
});

describe ("v0.9.0 — stripDocumentWrappers", () =>
{
	it ("leaves a pure fragment untouched", () =>
	{
		const out = stripDocumentWrappers ("<p>hi</p>");
		expect (out.trim ()).to.equal ("<p>hi</p>");
	});
	it ("removes a leading <!doctype html>", () =>
	{
		expect (stripDocumentWrappers ("<!doctype html><p>x</p>").trim ()).to.equal ("<p>x</p>");
	});
	it ("unwraps <html>…</html>", () =>
	{
		const out = stripDocumentWrappers ("<!doctype html><html lang=\"en\"><body><p>x</p></body></html>");
		expect (out.trim ()).to.equal ("<p>x</p>");
	});
	it ("preserves <head> contents even after stripping the tag", () =>
	{
		const out = stripDocumentWrappers (
			"<!doctype html><html><head><link rel=\"stylesheet\" href=\"a.css\"></head><body><p>x</p></body></html>"
		);
		expect (out).to.include ('<link rel="stylesheet" href="a.css">');
		expect (out).to.include ("<p>x</p>");
		expect (out).to.not.include ("<head");
		expect (out).to.not.include ("<body");
	});
});
