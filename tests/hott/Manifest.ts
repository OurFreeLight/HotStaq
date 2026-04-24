import "mocha";
import { expect } from "chai";

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as os from "os";
import * as ppath from "path";

import { HotStaticBuilder } from "../../src/hott/HotStaticBuilder";
import { HotSite } from "../../src/HotSite";

async function buildMinimal (): Promise<{ tmp: string; out: string; manifest: any }>
{
	const tmp = await fsp.mkdtemp (ppath.join (os.tmpdir (), "hs090-mf-"));
	const pub = ppath.join (tmp, "public");
	await fsp.mkdir (ppath.join (pub, "js"), { recursive: true });

	await fsp.writeFile (ppath.join (pub, "index.hott"), "<p>hi</p>");
	await fsp.writeFile (ppath.join (pub, "js", "demoLibWeb_AppAPI.js"),
		"if (typeof (demoLibWeb) === \"undefined\") var demoLibWeb = {};\n" +
		"demoLibWeb.AppAPI = class extends (window.HotAPI||Object) {};\n" +
		"window.demoLibWeb = demoLibWeb;\n"
	);

	const site: HotSite = {
		name: "mftest",
		version: "1.2.3",
		apis: { AppAPI: { libraryName: "demoLibWeb", apiName: "AppAPI", url: "http://x" } },
		web: {
			mftest: {
				mainUrl: "/",
				routes: [{ path: "/", file: "./public/index.hott" }]
			}
		}
	};
	const out = ppath.join (tmp, "dist");
	await new HotStaticBuilder (site, { cwd: tmp, out, mode: "production" }).build ();
	const manifest = JSON.parse (await fsp.readFile (ppath.join (out, "build-manifest.json"), "utf8"));
	return ({ tmp, out, manifest });
}

describe ("v0.9.0 — HS090-9 build manifest", () =>
{
	it ("includes the required top-level fields and embeds the HotSite", async () =>
	{
		const { tmp, manifest } = await buildMinimal ();
		try
		{
			expect (manifest.manifestVersion).to.equal (1);
			expect (manifest.builtAt).to.match (/^\d{4}-\d{2}-\d{2}T/);
			expect (manifest.mode).to.equal ("production");
			expect (manifest.hotstaqVersion).to.be.a ("string");
			expect (manifest.entry).to.have.all.keys ("html", "js", "css");
			expect (manifest.entry.html).to.equal ("index.html");
			expect (manifest.entry.js).to.match (/^app\.[a-f0-9]+\.js$/);
			expect (manifest.entry.css).to.match (/^app\.[a-f0-9]+\.css$/);
			// HotSite embedded rather than deriving routes/apiClients.
			expect (manifest.hotSite).to.be.an ("object");
			expect (manifest.hotSite.name).to.equal ("mftest");
			expect (manifest.hotSite.version).to.equal ("1.2.3");
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("lists every emitted file with size + sha256, sorted by path", async () =>
	{
		const { tmp, out, manifest } = await buildMinimal ();
		try
		{
			const files: any[] = manifest.files;
			expect (files.length).to.be.greaterThan (0);
			for (const f of files)
			{
				expect (f).to.have.all.keys ("path", "size", "sha256");
				expect (f.sha256).to.match (/^[a-f0-9]{64}$/);
				expect (fs.existsSync (ppath.join (out, f.path))).to.be.true;
			}
			// Sorted.
			const paths = files.map (f => f.path);
			const sorted = paths.slice ().sort ();
			expect (paths).to.deep.equal (sorted);
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("preserves HotSite.apis for consumers that need API-client info", async () =>
	{
		const { tmp, manifest } = await buildMinimal ();
		try
		{
			// Downstream tooling reads apis via manifest.hotSite.apis
			// (single source of truth — no duplicated derived fields).
			const apis: any = manifest.hotSite.apis;
			expect (apis).to.be.an ("object");
			expect (apis.AppAPI).to.include ({
				libraryName: "demoLibWeb",
				apiName: "AppAPI",
				url: "http://x"
			});
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});

	it ("preserves HotSite.web.{app}.routes so consumers can walk them", async () =>
	{
		const { tmp, manifest } = await buildMinimal ();
		try
		{
			const routes: any = manifest.hotSite.web.mftest.routes;
			expect (routes).to.deep.equal ([
				{ path: "/", file: "./public/index.hott" }
			]);
		}
		finally { await fsp.rm (tmp, { recursive: true, force: true }); }
	});
});
