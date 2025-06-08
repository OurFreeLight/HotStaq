import "mocha";
import { expect, should } from "chai";
import { Builder, By, until, WebDriver, Session } from "selenium-webdriver";

import * as oss from "os";
import * as ppath from "path";

import { Common } from "../Common";

import { DeveloperMode, HotHTTPServer, HotStaq, HotTestMap, HotTestDriver, HotTestElement, HotTester, HotTesterMochaSelenium } from "../../src/api";

describe ("Browser Testing From Browser Router Tests - Mocha Selenium - Development Mode", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let tester: HotTesterMochaSelenium = null;

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.setupServer (HotHTTPServer.getDefaultServableExtensions (), 
					ppath.normalize (`${process.cwd ()}/tests/browser/RouterTest.htm`));
				await common.startServer ();

				let testMap: HotTestMap = new HotTestMap ([
						`relUrl:/tests/browser/HelloWorld -> Form-SignIn-FillOut`
					]);
				tester = new HotTesterMochaSelenium (
					processor, "Tester", common.getUrl (), { testMap: testMap });

				if (process.env["TESTING_RUN_HEADLESS"] != null)
					tester.driver.headless = true;

				tester.onSetup = async (driver: WebDriver): Promise<boolean> =>
					{
						await driver.get (`${common.getUrl ()}/tests/browser/HelloWorld`);

						return (false);
					};

				common.testerServer.addTester (tester);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should execute the server side tests from the browser", async () =>
			{
				await common.testerServer.executeTests ("Tester", "testMap");
			});
	});