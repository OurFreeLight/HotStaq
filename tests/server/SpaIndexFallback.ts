import "mocha";
import { expect } from "chai";
import fetch from "node-fetch";

import { Common } from "../Common";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { DeveloperMode } from "../../src/Hot";

/**
 * server.indexFile (SPA-index fallback): a full-page navigation GET to a .hott
 * (no ?hstqserve) serves the configured shell host instead of the per-route
 * page, mirroring nginx `try_files $uri /index.html` so the dev/test server
 * matches production for layout-mode apps. The SPA's ?hstqserve fetch of route
 * content is unaffected.
 */
describe ("SPA-index fallback (server.indexFile)", () =>
	{
		let common: Common = null;
		let server: HotHTTPServer = null;
		let url: string = "";

		before (async () =>
			{
				common = new Common ();
				await common.startServer ();
				server = common.server;
				url = common.getUrl ();

				if (server.processor.hotSite == null)
					(server.processor as any).hotSite = {};
				if (server.processor.hotSite.server == null)
					(server.processor.hotSite as any).server = {};

				(server.processor.hotSite.server as any).indexFile = "./tests/browser/Shell-Rendered-Host.html";
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("serves the shell host for a .hott navigation GET (no hstqserve)", async () =>
			{
				let res = await fetch (`${url}/tests/browser/ShellPageA`);
				let body: string = await res.text ();

				expect (res.status).to.equal (200);
				// The shell host, not the route page.
				expect (body).to.contain ("rendered-host-placeholder");
				expect (body).to.not.contain ("shellPageATitle");
			});

		it ("does not hijack the SPA's ?hstqserve route fetch", async () =>
			{
				let res = await fetch (`${url}/tests/browser/ShellPageA.hott?hstqserve=nahfam`);
				let body: string = await res.text ();

				// The SPA fetch must still get the route content (raw .hott), not
				// the shell host.
				expect (body).to.contain ("shellPageATitle");
				expect (body).to.not.contain ("rendered-host-placeholder");
			});
	});

/**
 * Dev/test tester bootstrap under SPA-index. In Development mode with a web
 * tester configured, the static shell host has none of the generateContent
 * tester wrap, so the server injects a window.__hotstaqDevTester marker. The
 * client boot reads it to enable Development mode + the tester client, then
 * reports the route's test paths after the initial navigation. Without this,
 * HotTester's waitForData times out under the app-shell model.
 */
describe ("SPA-index dev-tester bootstrap (server.indexFile + Development)", () =>
	{
		let common: Common = null;
		let server: HotHTTPServer = null;
		let url: string = "";
		const testerUrl: string = "http://127.0.0.1:8182";

		before (async () =>
			{
				common = new Common ();
				await common.startServer ();
				server = common.server;
				url = common.getUrl ();

				if (server.processor.hotSite == null)
					(server.processor as any).hotSite = {};
				if (server.processor.hotSite.server == null)
					(server.processor.hotSite as any).server = {};

				(server.processor.hotSite.server as any).indexFile = "./tests/browser/Shell-Rendered-Host.html";

				// Flip into Development + configure the tester URL at request time
				// (read live by the SPA-index handler) — no real tester server needed
				// for this injection assertion.
				server.processor.mode = DeveloperMode.Development;

				if (server.processor.hotSite.testing == null)
					(server.processor.hotSite as any).testing = {};
				if (server.processor.hotSite.testing.web == null)
					(server.processor.hotSite.testing as any).web = {};

				(server.processor.hotSite.testing.web as any).testerAPIUrl = testerUrl;
			});
		after (async () =>
			{
				server.processor.mode = DeveloperMode.Production;
				await common.shutdown ();
			});

		it ("injects the __hotstaqDevTester marker into the served shell host", async () =>
			{
				let res = await fetch (`${url}/tests/browser/ShellPageA`);
				let body: string = await res.text ();

				expect (res.status).to.equal (200);
				// Still the shell host, now carrying the tester bootstrap.
				expect (body).to.contain ("rendered-host-placeholder");
				expect (body).to.contain ("window.__hotstaqDevTester");
				expect (body).to.contain (testerUrl);
			});

		it ("does not inject the marker into the ?hstqserve route fetch", async () =>
			{
				let res = await fetch (`${url}/tests/browser/ShellPageA.hott?hstqserve=nahfam`);
				let body: string = await res.text ();

				// The SPA's raw route fetch must stay clean — no shell, no bootstrap.
				expect (body).to.contain ("shellPageATitle");
				expect (body).to.not.contain ("window.__hotstaqDevTester");
			});
	});
