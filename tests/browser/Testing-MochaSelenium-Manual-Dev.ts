import "mocha";

import { Common } from "./Common";

import { HotStaq, HotTestDriver, HotTestElement, HotTester, HotTesterMochaSelenium } from "../../src/api";
import { HotTestMap } from "../../src/HotTestMap";
import { WebDriver } from "selenium-webdriver";

describe ("Browser Manual Testing From Server Tests - Mocha Selenium - Development Mode", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let tester: HotTesterMochaSelenium = null;

		before (async () =>
			{
				processor = new HotStaq ();

				common = new Common (processor);
				await common.startServer ();

				let testMap: HotTestMap = new HotTestMap ([
									`page:testingManualPage -> Form-SignIn-FillOut`, 
									`page:testingManualPage -> Form-SignIn-FillOut2`
								],
					{
						"testingManualPage": {
								"testElements": {
									"username": new HotTestElement ("username"),
									"password": new HotTestElement ("password"),
									"signIn": new HotTestElement ("signIn"),
									"result": new HotTestElement ("result")
								},
								"testPaths": {
									"Form-SignIn-FillOut": async (driver: HotTestDriver): Promise<any> =>
										{
											await driver.waitForTestElement ("username");
											await driver.run ([
													["username", "sendKeys", "hi"],
													["password", "sendKeys", "f"],
													["signIn", "click"],
												]);
											await driver.wait (50);
											await driver.assertElementValue ("result", "\"Hello!\"", "Element result is incorrect!");
										}, 
									"Form-SignIn-FillOut2": async (driver: HotTestDriver): Promise<any> =>
										{
											await driver.waitForTestElement ("*name");
											await driver.run ([
													["*name", "sendKeys", "a"],
													[">#passwordText", "sendKeys", "a"],
													["signIn", "click"],
												]);
											await driver.wait (50);
											await driver.assertElementValue (
												"result", `{"error":"You didn't say hi."}`, "Element result is incorrect!");
										}
								}
							}
					});

				tester = new HotTesterMochaSelenium (processor, "Tester", 
							common.getUrl (), { testMap: testMap });

				if (process.env["TESTING_RUN_HEADLESS"] != null)
					tester.driver.headless = true;
			
				tester.onSetup = async (driver: WebDriver): Promise<boolean> =>
					{
						await driver.get (`${common.getUrl ()}/tests/browser/index.htm`);
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
							await HotStaq.displayUrl (
								"/tests/browser/Testing-CustomTester.hott", "Testing!", processor);
							done ();`);

						return (false);
					};

				processor.addTester (tester);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should execute the manual server side tests", async () =>
			{
				await processor.executeTests ("Tester", "testMap");
			});
	});