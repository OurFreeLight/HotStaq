import "mocha";
import { expect } from "chai";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

/**
 * HS-22 (legacy engine): an inline <script> defined inside a Hot.include()'d
 * partial must execute when the host route renders. The route's OWN inline
 * scripts already run (see SPATests); this proves an INCLUDED partial's inline
 * scripts run too — the gap behind "header onclick handler does nothing".
 */
describe ("Hot.include partial inline-script execution", () =>
	{
		let common: Common = null;

		before (async () =>
			{
				let processor = new HotStaq ();

				common = new Common (processor);
				await common.load ();

				await common.startServer ();
				await common.driver.get (`${common.getUrl ()}/tests/browser/IncludePartial-Load-Page.html`);

				await HotStaq.wait (2500);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("renders the included partial's markup", async () =>
			{
				let html: string = await common.driver.executeScript (
					"var el = document.getElementById ('partialContent'); return (el != null ? el.innerHTML : null);");
				expect (html).to.equal ("Partial content from Hot.include.",
					"the partial's markup should be injected into the route");
			});

		it ("runs an inline <script> defined inside the Hot.include()'d partial", async () =>
			{
				let marker: string = await common.driver.executeScript (
					"return (window.__partialInlineRan || null);");
				expect (marker).to.equal ("yes",
					"the included partial's inline script must execute on render");
			});
	});
