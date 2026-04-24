import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

/**
 * HS090-15 build-time expansion (the admin-panel surface).
 *
 * Proves the v0.9.0 pipeline handles:
 *   - Hot.include(path, { KEY: value }) with a literal args object
 *   - ${KEY} substitution inside the partial's template HTML
 *   - <* for (...) { *> HTML <* } *> interleaved loop control flow
 *   - Nested Hot.include inside an expanded partial, with args passed
 *     through
 *
 * Inputs are all literal at the call site; outputs are fully-static HTML
 * in the stash. No runtime template machinery.
 */

describe ("v0.9.0 — HS090-15 build-time partial expansion (admin-panel shape)", function ()
{
	this.timeout (20000);

	it ("expands a partial with literal args so ${KEY} interpolations resolve in the stash", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-expand-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "header.hott"),
				"<head><title>${TITLE}</title></head>\n"
			);

			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/header.hott', { TITLE: \"My App\" }); *>\n" +
				"<main><p>body</p></main>\n"
			);

			const site: HotSite = {
				name: "expand-basic",
				web: {
					"expand-basic": {
						mainUrl: "/",
						routes: [{ path: "/", file: "./public/index.hott" }]
					}
				}
			};

			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			expect (html).to.include ("<title>My App</title>");
			// Bare interpolation must NOT survive into the stash.
			expect (html).to.not.include ("${TITLE}");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("unrolls <* for (...) { *> HTML <* } *> loops at build time", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-expand-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			// Matches the admin-panel sidebar shape exactly.
			await fsp.writeFile (ppath.join (pub, "components", "sidebar.hott"),
				"<* for (let i = 0; i < SIDEBAR_ITEMS.length; i++) {\n" +
				"     let item = SIDEBAR_ITEMS[i];\n" +
				"     let url = item.url;\n" +
				"     let label = item.label; *>\n" +
				"  <li><a href=\"${url}\">${label}</a></li>\n" +
				"<* } *>"
			);

			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/sidebar.hott', {\n" +
				"     SIDEBAR_ITEMS: [\n" +
				"       { url: '/users', label: 'Users' },\n" +
				"       { url: '/groups', label: 'Groups' },\n" +
				"       { url: '/settings', label: 'Settings' }\n" +
				"     ]\n" +
				"   }); *>\n" +
				"<ul id=\"sidebar\"></ul>\n"
			);

			const site: HotSite = {
				name: "expand-loop",
				web: {
					"expand-loop": {
						mainUrl: "/",
						routes: [{ path: "/", file: "./public/index.hott" }]
					}
				}
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			expect (html).to.include ('href="/users">Users</a>');
			expect (html).to.include ('href="/groups">Groups</a>');
			expect (html).to.include ('href="/settings">Settings</a>');
			expect (html).to.not.include ("SIDEBAR_ITEMS");
			expect (html).to.not.include ("${url}");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("expands nested Hot.include (header → sidebar) with args passed through", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-expand-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "sidebar.hott"),
				"<* for (let i = 0; i < ITEMS.length; i++) { *>\n" +
				"  <li>${ITEMS[i]}</li>\n" +
				"<* } *>"
			);

			// Header includes sidebar recursively, passing through its arg.
			await fsp.writeFile (ppath.join (pub, "components", "header.hott"),
				"<header><h1>${TITLE}</h1>\n" +
				"  <ul>\n" +
				"    <* await Hot.include('./sidebar.hott', { ITEMS: ITEMS }); *>\n" +
				"  </ul>\n" +
				"</header>"
			);

			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/header.hott', {\n" +
				"     TITLE: 'Admin',\n" +
				"     ITEMS: ['Users', 'Logs']\n" +
				"   }); *>\n" +
				"<main></main>"
			);

			const site: HotSite = {
				name: "expand-nested",
				web: {
					"expand-nested": {
						mainUrl: "/",
						routes: [{ path: "/", file: "./public/index.hott" }]
					}
				}
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			expect (html).to.include ("<h1>Admin</h1>");
			expect (html).to.include ("<li>Users</li>");
			expect (html).to.include ("<li>Logs</li>");
			expect (html).to.not.include ("ITEMS");
			expect (html).to.not.include ("${TITLE}");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("same (path, args) across two call sites produces one dedup'd stash entry; different args produce two", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-expand-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "badge.hott"),
				"<span class=\"badge\">${LABEL}</span>"
			);

			// Page A uses { LABEL: "Admin" }; page B uses same args, should dedupe.
			await fsp.writeFile (ppath.join (pub, "a.hott"),
				"<* await Hot.include('./components/badge.hott', { LABEL: \"Admin\" }); *>\n<p>a</p>"
			);
			await fsp.writeFile (ppath.join (pub, "b.hott"),
				"<* await Hot.include('./components/badge.hott', { LABEL: \"Admin\" }); *>\n<p>b</p>"
			);
			// Page C uses different args, should emit a second stash entry.
			await fsp.writeFile (ppath.join (pub, "c.hott"),
				"<* await Hot.include('./components/badge.hott', { LABEL: \"User\" }); *>\n<p>c</p>"
			);

			const site: HotSite = {
				name: "expand-dedup",
				web: {
					"expand-dedup": {
						mainUrl: "/",
						routes: [
							{ path: "/a", file: "./public/a.hott" },
							{ path: "/b", file: "./public/b.hott" },
							{ path: "/c", file: "./public/c.hott" }
						]
					}
				}
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const stashIds: string[] = Array.from (builder.resolvedPartials.keys ())
				.filter (id => id.startsWith ("components/badge"));
			expect (stashIds).to.have.lengthOf (2);

			const htmls = Array.from (builder.resolvedPartials.values ());
			expect (htmls.some (h => h.includes ("Admin"))).to.be.true;
			expect (htmls.some (h => h.includes ("User"))).to.be.true;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("falls back to raw-template stash when expansion references a runtime-only API (logs warning)", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-expand-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "dyn.hott"),
				"<* const cfg = await Hot.getJSON('/config.json'); *>\n" +
				"<p>${cfg.env}</p>"
			);
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* await Hot.include('./components/dyn.hott', { FOO: 1 }); *>\n<main></main>"
			);

			const site: HotSite = {
				name: "expand-fallback",
				web: { "expand-fallback": { mainUrl: "/", routes: [{ path: "/", file: "./public/index.hott" }] } }
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			expect (builder.warnings.map (w => w.code)).to.include ("hs090-15/expand-fallback");
			// Build still succeeded (stash got the raw template).
			expect (fs.existsSync (ppath.join (out, "index.html"))).to.be.true;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	/**
	 * v0.9.1 — runtime-partial-inline.
	 *
	 * When build-time expansion fails (e.g. the partial reads runtime-only
	 * values like hotCtx.getJSON or a caller-scope variable), the builder
	 * emits the partial as a local async function in the caller's preamble
	 * with args destructured from `__args`. Caller-scope live variables
	 * (e.g. config fetched at runtime) flow into the partial naturally.
	 */
	it ("inlines the partial as a local async fn when caller passes runtime args (v0.9.1)", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs091-inline-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (ppath.join (pub, "components"), { recursive: true });

			await fsp.writeFile (ppath.join (pub, "components", "badge.hott"),
				"<* Hot.echo(`Hello ${config.name}`); *>"
			);
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* const config = await Hot.getJSON('/c.json');\n" +
				"   await Hot.include('./components/badge.hott', { config: config }); *>\n" +
				"<main></main>"
			);

			const site: HotSite = {
				name: "rti",
				web: { "rti": { mainUrl: "/", routes: [
					{ path: "/p", file: "./public/index.hott", preload: "lazy" }
				] } }
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			const files = await fsp.readdir (out);
			const chunkFile = files.find (f => f.startsWith ("app-route-p."));
			expect (chunkFile, `expected lazy chunk, got ${files.join (",")}`).to.be.a ("string");

			const chunkJs = await fsp.readFile (ppath.join (out, chunkFile!), "utf8");

			expect (chunkJs).to.match (/async function __hs_p_components_badge/);
			expect (chunkJs).to.not.include ("await await __hs_p_");
			expect (chunkJs).to.not.include ("__includePartial");
			expect (chunkJs).to.match (/await __hs_p_components_badge[\w]+\(/);
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});
});
