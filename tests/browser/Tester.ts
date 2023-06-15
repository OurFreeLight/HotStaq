import Mocha from "mocha";
import { Suite, Test } from "mocha";

import { HotTestMap, HotTestPath } from "../../src/HotTestMap";
import { HotTestPage } from "../../src/HotTestPage";
import { HotTester } from "../../src/HotTester";
import { HotDestination } from "../../src/HotDestination";
import { HotTestStop } from "../../src/HotTestStop";
import { TestDriver } from "./TestDriver";
import { HotStaq } from "../../src/HotStaq";

import { WebDriver } from "selenium-webdriver";

/**
 * The tester that tests testing capabilities for 
 * testing purposes using HotTester.
 * Testing. Test. Test. Test. Test. Test. Test.
 * Test. Testing. Test. Test. Test. Test. Test.
 * Test. Test. Testing. Test. Test. Test. Test.
 * Test. Test. Test. Testing. Test. Test. Test.
 * Test. Test. Test. Test. Testing. Test. Test.
 * Test. Test. Test. Test. Test. Testing. Test.
 * Test. Test. Test. Test. Test. Test. Testing.
 */
export class Tester extends HotTester
{
	/**
	 * The mocha instance to run.
	 */
	mocha: Mocha;
	/**
	 * The suite to execute.
	 */
	suite: Suite;
	/**
	 * The type of tester to execute.
	 */
	testerType: string;

	constructor (processor: HotStaq, name: string, baseUrl: string, 
		driver: TestDriver, testMaps: { [name: string]: HotTestMap; } = {})
	{
		super (processor, name, baseUrl, driver, testMaps);

		this.mocha = null;
		this.suite = null;
		this.testerType = "server";
	}

	/**
	 * Executed when setting up the tester.
	 * 
	 * @returns If this returns true, the driver will execute whatever is after this.
	 * For example, if the driver is HotTestSeleniumDriver, the url will be loaded.
	 */
	async setup (isWebRoute: boolean, url: string = "", destinationKey: string = ""): Promise<void>
	{
		if (isWebRoute === false)
			return;

		let testDriver: TestDriver = (<TestDriver>this.driver);

		await testDriver.loadSeleniumDriver ();
		let driver: WebDriver = testDriver.driver;

		await driver.get (`${this.baseUrl}/tests/browser/index.htm`);

		if (this.testerType === "server")
		{
			await driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				processor.mode = HotStaqWeb.DeveloperMode.Development;
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${this.baseUrl}", client);
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl (
					"/tests/browser/Testing-CustomTester.hott", "Testing!", processor);
				done ();`);
		}

		if (this.testerType === "web")
		{
			await driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				processor.mode = HotStaqWeb.DeveloperMode.Development;
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${this.baseUrl}", client);
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl ({
						url: "/tests/browser/Testing-CustomTester.hott",
						name: "testingWebPage",
						testerName: "Tester",
						testerMap: "testMap",
						processor: processor
					});
				await HotStaq.waitForTesters ();
				done ();`);
		}
	}

	/**
	 * Executed when destroying up the tester.
	 */
	async destroy (): Promise<void>
	{
		if (this.driver != null)
			await this.driver.destroy ();
	}

	/**
	 * Executed when tests are started.
	 */
	async onTestStart (destination: HotDestination, url: string, destinationKey: string = ""): Promise<boolean>
	{
		let destinationName: string = "";

		if (destinationKey !== "")
			destinationName = ` - ${destinationKey}`;

		this.mocha = new Mocha ();
		this.suite = Mocha.Suite.create (this.mocha.suite, `${destination.page}${destinationName} Tests`);
		this.suite.timeout (10000);

		this.suite.beforeAll (async () =>
			{
			});

		return (true);
	}

	async onTestPagePathStart (destination: HotDestination, page: HotTestPage, 
		stop: HotTestStop, continueWhenTestIsComplete: boolean = false): Promise<boolean>
	{
		let testPathName: string = stop.path;

		this.suite.addTest (new Test (testPathName, async () =>
			{
				// The true is a dumb hack to prevent any recursion.
				await this.executeTestPagePath (destination, stop, true);
			}));

		return (false);
	}

	async onTestEnd (destination: HotDestination): Promise<void>
	{
		return (new Promise ((resolve, reject) =>
			{
				this.suite.afterAll (async () =>
					{
					});
				this.mocha.run ((failures: number) =>
					{
						resolve ();
					});
			}));
	}
}