import "mocha";
import { expect } from "chai";

import { Common } from "../Common";

import { DeveloperMode, HotStaq, HotTesterMochaSelenium } from "../../src/api";
import { HotTestMap } from "../../src/HotTestMap";

/**
 * Re-navigation race regression: under the app-shell / SPA-index model a test
 * body that does `driver.navigate(route)` then immediately asserts the route's
 * (static) content must not race the async boot. navigateToUrl's waitForAppReady
 * has to hold until THIS navigation's route is injected — not return on a stale
 * readiness flag left true by the previous load. Reproduces the DAO test-web
 * flake (`#flPgGrid` / `.fl-main-wrapper` "not found" right after navigate).
 *
 * Driven through the real boot path (server-served shell host + the tester's
 * own driver.get), so it exercises navigateToUrl exactly as the DAO does.
 */
describe ("Shell Tester re-navigation race (Development)", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let tester: HotTesterMochaSelenium = null;

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.startServer ();

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

				let testMap: HotTestMap = new HotTestMap ([
						`url:/tests/browser/ShellTesterRoute -> ShellTester_RenavStaticContent`
					]);

				// Page reports under the default tester name, so register the tester there.
				tester = new HotTesterMochaSelenium (
					processor, "HotTesterMochaSelenium", common.getUrl (), { testMap: testMap });

				if (process.env["TESTING_RUN_HEADLESS"] != null)
					tester.driver.headless = true;

				common.testerServer.addTester (tester);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("re-navigates and finds the route's static content (no stale-readiness race)", async () =>
			{
				await common.testerServer.executeTests ("HotTesterMochaSelenium", "testMap");

				// executeTests records inner test-path failures on the tester rather
				// than throwing, so assert on the count.
				expect (tester.numFailures).to.equal (0,
					"The re-navigation test path should pass once waitForAppReady actually waits");
			});
	});
