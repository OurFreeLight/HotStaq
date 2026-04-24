import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

async function scaffold (cssFiles: string[] | undefined, missing: string[] = [], mode: "production" | "development" = "production"):
	Promise<{ tmp: string; out: string; distCss: string | null; warnings: any[] }>
{
	const tmp: string = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-css-"));
	const pub: string = ppath.join (tmp, "public");
	await fsp.mkdir (pub, { recursive: true });
	await fsp.writeFile (ppath.join (pub, "index.hott"), "<p>hi</p>");

	// Create real CSS files referenced in cssFiles (skipping ones in `missing`).
	for (const f of cssFiles || [])
	{
		if (missing.includes (f)) continue;
		const abs: string = ppath.resolve (tmp, f);
		await fsp.mkdir (ppath.dirname (abs), { recursive: true });
		await fsp.writeFile (abs, `/* marker: ${f} */\n.from-${ppath.basename (f, ".css")} { color: red; }\n`);
	}

	const site: HotSite = {
		name: "css-test",
		web: {
			"css-test": {
				mainUrl: "/",
				cssFiles,
				routes: [{ path: "/", file: "./public/index.hott" }]
			}
		}
	};

	const out: string = ppath.join (tmp, "dist");
	const builder = new HotStaticBuilder (site, { cwd: tmp, out, mode });
	await builder.build ();

	const distFiles = await fsp.readdir (out);
	const distCss: string | undefined = distFiles.find (f => /^app\..+\.css$/.test (f));
	return ({
		tmp,
		out,
		distCss: distCss ? ppath.join (out, distCss) : null,
		warnings: builder.warnings
	});
}

describe ("v0.9.0 — HS090-7 CSS consolidation", () =>
{
	it ("emits a placeholder app.css when no cssFiles are configured", async () =>
	{
		const { tmp, distCss } = await scaffold (undefined);
		try
		{
			expect (distCss).to.not.be.null;
			const body = await fsp.readFile (distCss!, "utf8");
			expect (body).to.include ("no cssFiles configured");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("concatenates cssFiles in order, with per-file separator comments (dev mode)", async () =>
	{
		const { tmp, distCss } = await scaffold (
			["./public/a.css", "./public/b.css"],
			[],
			"development"
		);
		try
		{
			expect (distCss).to.not.be.null;
			const body = await fsp.readFile (distCss!, "utf8");
			const idxA = body.indexOf ("marker: ./public/a.css");
			const idxB = body.indexOf ("marker: ./public/b.css");
			expect (idxA).to.be.greaterThan (-1);
			expect (idxB).to.be.greaterThan (idxA);
			expect (body).to.include (".from-a");
			expect (body).to.include (".from-b");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("minifies in production mode (strips comments and collapses whitespace)", async () =>
	{
		const { tmp, distCss } = await scaffold (["./public/a.css"], [], "production");
		try
		{
			const body = await fsp.readFile (distCss!, "utf8");
			// Comment markers should be gone post-minify.
			expect (body).to.not.include ("marker:");
			// Class selector still present.
			expect (body).to.include (".from-a");
			// No long whitespace runs.
			expect (/\s{2,}/.test (body)).to.be.false;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("warns (non-fatal) when a cssFiles entry points at a missing file", async () =>
	{
		const { tmp, warnings } = await scaffold (
			["./public/a.css", "./public/nope.css"],
			["./public/nope.css"]
		);
		try
		{
			expect (warnings.some (w => w.code === "hs090-7/css-not-found")).to.be.true;
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});
});
