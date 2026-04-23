import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

async function buildWithFixture (opts: { fixtures?: any; preamble?: string; declareFixture?: boolean } = {}):
	Promise<{ tmp: string; out: string; builder: HotStaticBuilder }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-sr-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (ppath.join (pub, "fixtures"), { recursive: true });

	if (opts.fixtures !== undefined)
		await fsp.writeFile (ppath.join (pub, "fixtures", "data.json"),
			JSON.stringify (opts.fixtures));

	const preamble: string = opts.preamble ||
		"<* const d = await Hot.getJSON('./fixtures/data.json');\n" +
		"   Hot.echoUnsafe('<p class=\"baked\">hello ' + d.name + '</p>'); *>\n";

	await fsp.writeFile (ppath.join (pub, "index.hott"),
		preamble + "<main><h1>Terms</h1></main>\n"
	);

	const site: HotSite = {
		name: "srtest",
		web: {
			srtest: {
				mainUrl: "/",
				routes: [{
					path: "/terms",
					file: "./public/index.hott",
					preload: "eager",
					staticRender: true,
					...(opts.declareFixture !== false ? { fixtures: "./public/fixtures/data.json" } : {})
				}]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
	await builder.build ();
	return ({ tmp, out, builder });
}

describe ("v0.9.0 — HS090-19 staticRender (prerender with fixtures)", function ()
{
	this.timeout (15000);

	it ("bakes preamble echo output into the template stash when staticRender + fixtures are set", async () =>
	{
		const { tmp, out } = await buildWithFixture ({ fixtures: { name: "world" } });
		try
		{
			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			expect (html).to.include ("<p class=\"baked\">hello world</p>");
			expect (html).to.include ("<h1>Terms</h1>");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("warns (non-fatal) and skips prerender when fixture file is missing", async () =>
	{
		// declare staticRender with a fixture path that doesn't exist.
		const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-sr-"));
		try
		{
			const pub: string = ppath.join (tmp, "public");
			await fsp.mkdir (pub, { recursive: true });
			await fsp.writeFile (ppath.join (pub, "index.hott"),
				"<* Hot.echoUnsafe('<p>baked</p>'); *>\n<main></main>"
			);
			const site: HotSite = {
				name: "srmissing",
				web: {
					srmissing: {
						mainUrl: "/",
						routes: [{
							path: "/terms",
							file: "./public/index.hott",
							preload: "eager",
							staticRender: true,
							fixtures: "./public/ghost.json"
						}]
					}
				}
			};
			const out: string = ppath.join (tmp, "dist");
			const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode: "development" });
			await builder.build ();

			expect (builder.warnings.map (w => w.code)).to.include ("hs090-19/fixture-missing");
			const html: string = await fsp.readFile (ppath.join (out, "index.html"), "utf8");
			// Template still inlined; but prerender was skipped so echo isn't baked.
			expect (html).to.not.include ("<p>baked</p>");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("warns and skips when preamble throws during prerender — doesn't fail the build", async () =>
	{
		const { tmp, builder } = await buildWithFixture ({
			fixtures: { name: "ok" },
			// Preamble deliberately references an undefined var to trigger a Node-time throw.
			preamble: "<* nonExistentFunction(); *>\n"
		});
		try
		{
			expect (builder.warnings.map (w => w.code)).to.include ("hs090-19/prerender-threw");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});
});
