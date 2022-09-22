import "mocha";
import { expect, should } from "chai";
import { Builder, By, until, WebDriver, Session } from "selenium-webdriver";

import * as oss from "os";

import { Common } from "./Common";

import { DeveloperMode, HotStaq, HotTestDriver, HotTestElement, HotTester, HotTesterMochaSelenium } from "../../src/api";
import { HotTestMap } from "../../src/HotTestMap";

describe ("Browser Testing From Web Tests - Mocha Selenium - Development Mode", () =>
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

				let testMap: HotTestMap = new HotTestMap ([
						`page:testingWebPage -> Form-SignIn-FillOut`, 
						`page:testingWebPage -> Form-SignIn-FillOut2`
					]);
				tester = new HotTesterMochaSelenium (
					processor, "Tester", common.getUrl (), { testMap: testMap });

				if (process.env["TESTING_RUN_HEADLESS"] != null)
					tester.driver.headless = true;

				tester.onSetup = async (driver: WebDriver): Promise<boolean> =>
					{
						await driver.get (`${common.getUrl ()}/tests/browser/index.htm`);
						// The biggest difference between this test and the manual tests, is 
						// that this has waitForTesters. This HAS to wait for the server to be ready.
						await driver.executeAsyncScript (`
							var done = arguments[0];
							window.HotStaq = HotStaqWeb.HotStaq;
							var HotClient = HotStaqWeb.HotClient;
							var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
							var processor = new HotStaq ();
							processor.mode = HotStaqWeb.DeveloperMode.Development;
							window.Hot = HotStaqWeb.Hot;
							var client = new HotClient (processor);
							var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}", client);
							helloWorldAPI.connection.api = helloWorldAPI;
							processor.api = helloWorldAPI;
							await HotStaq.displayUrl ({
									url: "/tests/browser/Testing-MochaSelenium.hott",
									name: "testingWebPage",
									testerName: "Tester",
									testerMap: "testMap",
									processor: processor
								});
							await HotStaq.waitForTesters ();
							done ();`);

						return (false);
					};

				common.testerServer.addTester (tester);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should execute the server side tests from the web", async () =>
			{
				await common.testerServer.executeTests ("Tester", "testMap");
			});
	});