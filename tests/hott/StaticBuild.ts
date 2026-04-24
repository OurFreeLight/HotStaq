import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder, templateIdForRoute } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

/**
 * End-to-end smoke test for the --static driver against a tiny on-disk
 * fixture app. Creates a throwaway directory, runs the build, asserts the
 * output shape, then cleans up.
 */

async function withTempApp (build: (cwd: string) => Promise<void>): Promise<void>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-"));
	try
	{
		const pub: string = ppath.join (tmp, "public");
		await fsp.mkdir (pub, { recursive: true });
		// Pure-static templates (no <* *> preamble): template HTML lands
		// directly in the <template> stash so this test asserts against
		// the on-disk index.html.
		await fsp.writeFile (
			ppath.join (pub, "index.hott"),
			"<main><h1>Welcome</h1><p>home</p></main>\n"
		);
		await fsp.writeFile (
			ppath.join (pub, "login.hott"),
			"<section><h2>Sign In</h2>\n" +
			"<script>window.__onMount='login';</script>\n" +
			"</section>\n"
		);
		await fsp.writeFile (
			ppath.join (pub, "config.json"),
			JSON.stringify ({ env: "test" })
		);
		// an asset that should be copied verbatim
		await fsp.mkdir (ppath.join (pub, "assets"), { recursive: true });
		await fsp.writeFile (ppath.join (pub, "assets", "logo.svg"),
			"<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>");

		await build (tmp);
	}
	finally
	{
		await fsp.rm (tmp, { recursive: true, force: true });
	}
}

function minimalSite (): HotSite
{
	return ({
		name: "TinyApp",
		version: "0.0.1",
		web: {
			TinyApp: {
				mainUrl: "/",
				routes: [
					{ path: "/", file: "./public/index.hott" },
					{ path: "/login", file: "./public/login.hott", preload: "eager" }
				]
			}
		}
	});
}

describe ("v0.9.0 — HotStaticBuilder (skeleton)", () =>
{
	it ("produces dist/index.html, app.js, app.css, config.json, manifest, and assets", async () =>
	{
		await withTempApp (async (cwd) =>
		{
			const out: string = ppath.join (cwd, "dist");
			await new HotStaticBuilder (minimalSite (), { cwd, out }).build ();

			expect (fs.existsSync (ppath.join (out, "index.html"))).to.be.true;
			expect (fs.existsSync (ppath.join (out, "build-manifest.json"))).to.be.true;
			expect (fs.existsSync (ppath.join (out, "config.json"))).to.be.true;
			expect (fs.existsSync (ppath.join (out, "assets", "logo.svg"))).to.be.true;

			const distFiles = await fsp.readdir (out);
			expect (distFiles.some (f => /^app\.[a-f0-9]+\.js$/.test (f))).to.be.true;
			expect (distFiles.some (f => /^app\.[a-f0-9]+\.css$/.test (f))).to.be.true;
		});
	});

	it ("emits a <template> stash per route in index.html", async () =>
	{
		await withTempApp (async (cwd) =>
		{
			const out: string = ppath.join (cwd, "dist");
			await new HotStaticBuilder (minimalSite (), { cwd, out }).build ();

			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			const rootId: string = templateIdForRoute ("TinyApp", "/");
			const loginId: string = templateIdForRoute ("TinyApp", "/login");

			expect (html).to.include (`id="${rootId}"`);
			expect (html).to.include (`id="${loginId}"`);
			expect (html).to.include ("<h1>Welcome</h1>");
			expect (html).to.include ("<h2>Sign In</h2>");
			// Inline script body should NOT be in the template (it becomes an
			// unbodied placeholder); the runtime re-executes it on mount.
			expect (html).to.not.include ("window.__onMount='login'");
			expect (html).to.include ("data-hott-script=");
		});
	});

	it ("writes a manifest that lists every emitted file plus the route table", async () =>
	{
		await withTempApp (async (cwd) =>
		{
			const out: string = ppath.join (cwd, "dist");
			await new HotStaticBuilder (minimalSite (), { cwd, out }).build ();

			const mf = JSON.parse (await fsp.readFile (ppath.join (out, "build-manifest.json"), "utf8"));
			expect (mf.files.some ((f: any) => f.path === "index.html")).to.be.true;
			expect (mf.files.some ((f: any) => f.path === "config.json")).to.be.true;
			expect (mf.files.some ((f: any) => /^app\.[a-f0-9]+\.js$/.test (f.path))).to.be.true;
			// Manifest embeds the HotSite — routes live under
			// hotSite.web.{app}.routes rather than a derived top-level
			// field.
			const mfRoutes: any = mf.hotSite.web.TinyApp.routes;
			expect (mfRoutes.map ((r: any) => r.path)).to.deep.equal (["/", "/login"]);
		});
	});

	it ("fails the build when a referenced route file is missing", async () =>
	{
		await withTempApp (async (cwd) =>
		{
			const site = minimalSite ();
			site.web!.TinyApp.routes!.push ({ path: "/nope", file: "./public/missing.hott" });
			const out: string = ppath.join (cwd, "dist");
			let threw: boolean = false;
			try
			{
				await new HotStaticBuilder (site, { cwd, out }).build ();
			}
			catch { threw = true; }
			expect (threw, "build should have thrown").to.be.true;
		});
	});

	it ("escalates warnings under --strict", async () =>
	{
		await withTempApp (async (cwd) =>
		{
			// Write a .hott with a dynamic Hot.include — produces a warning.
			await fsp.writeFile (
				ppath.join (cwd, "public", "dynamic.hott"),
				"<* await Hot.include(someVar); *>\n<p>dyn</p>"
			);
			const site = minimalSite ();
			site.web!.TinyApp.routes!.push ({ path: "/dynamic", file: "./public/dynamic.hott" });

			const out: string = ppath.join (cwd, "dist");

			let threwNonStrict: boolean = false;
			try { await new HotStaticBuilder (site, { cwd, out }).build (); } catch { threwNonStrict = true; }
			expect (threwNonStrict, "should not throw without --strict").to.be.false;

			let threwStrict: boolean = false;
			try
			{
				await new HotStaticBuilder (site, { cwd, out, strict: true }).build ();
			}
			catch { threwStrict = true; }
			expect (threwStrict, "should throw with --strict").to.be.true;
		});
	});
});

describe ("v0.9.0 — templateIdForRoute", () =>
{
	it ("maps / to a stable root id", () =>
	{
		expect (templateIdForRoute ("TinyApp", "/")).to.equal ("hott-route--tinyapp--root");
	});
	it ("slugifies path segments", () =>
	{
		expect (templateIdForRoute ("App", "/admin/users"))
			.to.equal ("hott-route--app--admin-users");
	});
});
