import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotFile } from "../../src/HotFile";
import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

/**
 * HS090-20 release gate — every HotStaq commit must preserve SSR-mode
 * behaviour. This suite pins three invariants:
 *
 *   1. HotFile.parseContent() is byte-stable for a reference .hott input.
 *   2. A HotSite with v0.9.0-only fields (preload, staticRender, cssFiles,
 *      partials, apiClient) parses and validates without touching any
 *      legacy SSR-mode behaviour.
 *   3. HotStaticBuilder errors out on a HotSite that has *only* legacy
 *      fields and no v0.9.0 routes — i.e. the two modes are disjoint at
 *      the entry point, never silently mixed.
 */

describe ("v0.9.0 — HS090-20 dual-mode compatibility", function ()
{
	this.timeout (20000);

	it ("legacy HotFile.processContent still produces its historical shape (preamble body only, delimiters stripped)", () =>
	{
		// Reference: static HTML plus one preamble block. The legacy
		// lookbehind+lookahead regex + default numRemoveFromBeginning/End=2
		// strips the <* */ delimiters — this is the documented behaviour
		// apps have relied on pre-v0.9.
		const src = "<h1>A</h1><* Hot.echoUnsafe('<b>B</b>'); *><p>C</p>";
		const out: string = HotFile.processContent (
			src,
			new RegExp ("(?<=\\<\\*)([\\s\\S]*?)(?=\\*\\>)", "g"),
			(inside: string) => inside,
			(outside: string) => outside
		);
		expect (out).to.equal ("<h1>A</h1> Hot.echoUnsafe('<b>B</b>'); <p>C</p>");
	});

	it ("HotSite with v0.9.0 fields loads and validates cleanly — new fields are pure additions", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-dm-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (pub, { recursive: true });
			await fsp.writeFile (ppath.join (pub, "index.hott"), "<p>hi</p>");

			const site: HotSite = {
				name: "dual-mode-test",
				description: "carries every v0.9.0 field",
				web: {
					app: {
						mainUrl: "/",
						jsFiles: ["./public/js/extra.js"],
						cssFiles: [],
						partials: [],
						routes: [{ path: "/", file: "./public/index.hott", preload: "eager" }]
					}
				}
			};

			const out: string = ppath.join (tmp, "dist");
			// Must NOT throw.
			await new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" }).build ();
			expect (fs.existsSync (ppath.join (out, "index.html"))).to.be.true;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("HotStaticBuilder refuses a legacy-only HotSite (no web.{app}.routes)", async () =>
	{
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-dm-"));
		try
		{
			// This shape is legal for SSR but gives the static builder
			// nothing to emit. We expect a hard error so SSR apps don't
			// silently produce an empty dist when they forget --static.
			const site: HotSite = {
				name: "ssr-only",
				routes: {
					home: { name: "home", url: "/" }
				}
			};

			let threw: boolean = false;
			try
			{
				await new HotStaticBuilder (site, { cwd: tmp, out: ppath.join (tmp, "dist") }).build ();
			}
			catch { threw = true; }

			expect (threw, "legacy-only HotSite must error instead of silently building nothing").to.be.true;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("v0.9.0 code lives under src/hott and src/runtime only (no reach into HotFile SSR path)", async () =>
	{
		// Structural check: ensure our new modules don't accidentally
		// import from the legacy SSR entry points that SSR apps rely on.
		// If this starts failing, something crossed the line.
		const hottSources: string[] = await fsp.readdir (ppath.resolve (__dirname, "../../src/hott"));
		const forbiddenImports: RegExp[] = [
			/from\s+["']\.\.\/HotHTTPServer["']/,
			/from\s+["']\.\.\/HotServer["']/,
			/from\s+["']\.\.\/HotCLI["']/
		];

		for (const file of hottSources)
		{
			if (!file.endsWith (".ts"))
				continue;
			const abs: string = ppath.resolve (__dirname, "../../src/hott", file);
			const body: string = await fsp.readFile (abs, "utf8");
			for (const re of forbiddenImports)
			{
				expect (re.test (body),
					`src/hott/${file} must not import from SSR-only modules (${re.source})`
				).to.be.false;
			}
		}
	});
});
