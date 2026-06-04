import "mocha";
import { expect } from "chai";
import fetch from "node-fetch";

import { Common } from "../Common";
import { HotHTTPServer } from "../../src/HotHTTPServer";

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
