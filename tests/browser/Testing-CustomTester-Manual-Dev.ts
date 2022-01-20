import "mocha";

import { Common } from "./Common";
import { Tester } from "./Tester";
import { TestDriver } from "./TestDriver";

import { DeveloperMode, HotStaq, HotTestDriver, HotTestElement, HotTester } from "../../src/api";
import { HotTestMap } from "../../src/HotTestMap";

describe ("Browser Manual Testing From Server Tests - Custom Tester - Development Mode", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let tester: Tester = null;
		let testerDriver: TestDriver = null;

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.startServer ();

				let testMap: HotTestMap = new HotTestMap ([
									"page:testingManualPage -> Form-SignIn-FillOut", 
									"page:testingManualPage -> Form-SignIn-FillOut2"
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
											await driver.waitForTestElement ("username");
											await driver.run ([
													["username", "sendKeys", "a"],
													["password", "sendKeys", "a"],
													["signIn", "click"],
												]);
											await driver.wait (50);
											await driver.assertElementValue (
												"result", `{"error":"You didn't say hi."}`, "Element result is incorrect!");
										}
								}
							}
					});

				testerDriver = new TestDriver ();
				tester = new Tester (processor, "Tester", common.getUrl (), testerDriver, { testMap: testMap });
				tester.testerType = "server";

				processor.addTester (tester);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should execute the manual server side tests using a custom tester", async () =>
			{
				await processor.executeTests ("Tester", "testMap");
			});
	});