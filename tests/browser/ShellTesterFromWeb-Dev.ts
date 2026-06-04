import "mocha";
import { expect } from "chai";

import { Common } from "../Common";

import { DeveloperMode, HotStaq, HotTesterMochaSelenium } from "../../src/api";
import { HotTestPage } from "../../src/HotTestPage";

/**
 * End-to-end: HotTester registration under the app-shell / SPA-index model.
 *
 * Reproduces the DAO's test-web setup: a rendered shell (`src` on <hotstaq>)
 * with content-only routes injected into <hot-outlet>, served via the
 * SPA-index fallback. In Development the server injects window.__hotstaqDevTester
 * into the served shell host (Fix A); the boot reads it to enable Development +
 * the tester client, suppresses the shell's own empty auto-POST (Fix B1), and
 * after the initial navigation reports the route's test paths to HotTesterAPI
 * (Fix B2/B3). Without these, the route's createTestPath registration never
 * reaches the tester and waitForData times out.
 *
 * Asserts the tester server actually received the route's test path — i.e. the
 * exact data waitForData blocks on.
 */
describe ("Shell Tester From Web - SPA-index + rendered shell (Development)", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let tester: HotTesterMochaSelenium = null;
		let captured: HotTestPage = null;

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.load ();
				await common.startServer ();

				// Configure the SPA-index fallback + tester URL the way the DAO's
				// HotSite.yaml does, so a navigation GET to the route path serves the
				// shell host with the dev-tester bootstrap injected.
				if (processor.hotSite == null)
					(processor as any).hotSite = {};
				if (processor.hotSite.server == null)
					(processor.hotSite as any).server = {};
				if (processor.hotSite.testing == null)
					(processor.hotSite as any).testing = {};
				if (processor.hotSite.testing.web == null)
					(processor.hotSite.testing as any).web = {};

				(processor.hotSite.server as any).indexFile = "./tests/browser/ShellTester-Rendered-Host.html";
				(processor.hotSite.testing.web as any).testerAPIUrl = "http://127.0.0.1:8182";

				// The route page reports under the default tester name, so register
				// the tester there. onFinishedLoading captures the reported page.
				tester = new HotTesterMochaSelenium (
					processor, "HotTesterMochaSelenium", common.getUrl (), {});
				tester.onFinishedLoading = async (page: HotTestPage): Promise<boolean> =>
					{
						captured = page;

						return (true);
					};

				common.testerServer.addTester (tester);

				// Navigate to the ROUTE path (not the host file). The SPA-index
				// fallback serves the shell host + bootstrap; the boot then renders
				// the shell and injects this route, firing reportTestPaths.
				await common.driver.get (`${common.getUrl ()}/tests/browser/ShellTesterRoute`);

				// Give the boot → shell render → navigateTo → reportTestPaths chain
				// time to POST. (Same order of magnitude as the other shell tests.)
				await HotStaq.wait (3500);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("renders the shell chrome and injects the route into its outlet", async () =>
			{
				let hasChrome: boolean = await common.driver.executeScript (
					"return document.getElementById ('shell-tester-nav') != null;");
				expect (hasChrome).to.equal (true, "The shell .hott chrome should be rendered once");

				let inOutlet: boolean = await common.driver.executeScript (
					"return document.querySelector ('#hot-outlet #shellTesterRouteTitle') != null;");
				expect (inOutlet).to.equal (true, "Route content should be injected into the shell outlet");
			});

		it ("reports the route's test path to HotTesterAPI (waitForData would resolve)", async () =>
			{
				expect (tester.finishedLoading).to.equal (true,
					"The tester should have received the page's pageLoaded POST");
				expect (captured).to.not.equal (null,
					"HotTesterAPI should have received a reported page");
				expect (captured.testPaths).to.have.property ("ShellTester_RouteLoaded");
			});

		it ("does not register the shell's empty auto-POST as the page", async () =>
			{
				// The captured page is the ROUTE (with the test path), proving the
				// rendered shell's setupClientTesters auto-POST was suppressed in
				// layout mode — otherwise an empty page would have overwritten it.
				expect (Object.keys (captured.testPaths).length).to.be.greaterThan (0,
					"The reported page must be the route, not the empty shell");
			});
	});
