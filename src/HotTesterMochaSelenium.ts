import Mocha from "mocha";
import { Suite, Test } from "mocha";

import { HotTestMap, HotTestPage, HotTestPath } from "./HotTestMap";
import { HotDestination, HotTester, HotTestStop } from "./HotTester";
import { HotStaq } from "./HotStaq";
import { HotTestSeleniumDriver } from "./HotTestSeleniumDriver";

import { WebDriver } from "selenium-webdriver";

/**
 * The tester that uses Mocha to executes all tests.
 */
export class HotTesterMochaSelenium extends HotTester
{
	/**
	 * The driver to use when running tests.
	 */
	driver: HotTestSeleniumDriver;
	/**
	 * The mocha instance to run.
	 */
	mocha: Mocha;
	/**
	 * The timeout for each test.
	 */
	timeout: number;
	/**
	 * The suite to execute.
	 */
	suite: Suite;
    /**
     * The Mocha beforeAll event to call before any tests are executed.
     */
    beforeAll: () => Promise<void>;
    /**
     * The Mocha afterAll event to call before any tests are executed.
     */
    afterAll: () => Promise<void>;
    /**
     * This event is executed after the Selenium driver and url have 
	 * been loaded. If this returns true, Selenium will load the url.
     */
    onSetup: (driver: WebDriver, url: string) => Promise<boolean>;
	/**
	 * If set to true, this will wait for the tester API data. If 
	 * onSetup is used, it will have to return true in order to 
	 * wait for the tester data.
	 */
	waitForTesterData: boolean;

	constructor (processor: HotStaq, name: string, baseUrl: string, 
		testMaps: { [name: string]: HotTestMap; } = {}, 
		onSetup: (driver: WebDriver) => Promise<boolean> = null, 
		beforeAll: () => Promise<void> = null, 
		afterAll: () => Promise<void> = null)
	{
		super (processor, name, baseUrl, null, testMaps);

		this.driver = new HotTestSeleniumDriver ();
        this.mocha = null;
        this.timeout = 10000;
		this.suite = null;
		this.onSetup = onSetup;
        this.beforeAll = beforeAll;
        this.afterAll = afterAll;
		this.waitForTesterData = true;
	}

	/**
	 * Setup the Mocha/Selenium frameworks.
	 * 
	 * @param tester The 
	 * @param url If this is set, this url will be used instead of the url associated with this 
	 * tester.
	 */
	async setup (isWebRoute: boolean, url: string = "", destinationKey: string = ""): Promise<void>
	{
		// Only execute web routes using Selenium.
		if (isWebRoute === false)
			return;

		let testDriver: HotTestSeleniumDriver = (<HotTestSeleniumDriver>this.driver);

		await testDriver.loadSeleniumDriver ();
		let driver: WebDriver = testDriver.driver;
		let loadDriverUrl: boolean = true;
		let tempUrl: string = this.baseUrl;

		if (url !== "")
			tempUrl = url;

		if (this.onSetup != null)
		{
			loadDriverUrl = await this.onSetup (driver, tempUrl);

			if (loadDriverUrl == null)
				loadDriverUrl = true;
		}

		if (loadDriverUrl === true)
		{
			this.finishedLoading = false;
			await driver.get (tempUrl);
			await this.waitForData ();
		}
	}

	/**
	 * Executed when destroying this tester.
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
		this.suite.timeout (this.timeout);

        if (this.beforeAll != null)
		    this.suite.beforeAll (this.beforeAll);

		return (true);
	}

	async onTestPagePathStart (destination: HotDestination, page: HotTestPage, 
		stop: HotTestStop, continueWhenTestIsComplete: boolean = false): Promise<boolean>
	{
		let testPathName: string = stop.path;

		if (continueWhenTestIsComplete === true)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.suite.addTest (new Test (testPathName, async () =>
						{
							// The true is a dumb hack to prevent any recursion.
							await this.executeTestPagePath (destination, stop, true);
							resolve ();
						}));
				});
		}
		else
		{
			this.suite.addTest (new Test (testPathName, async () =>
				{
					// The true is a dumb hack to prevent any recursion.
					await this.executeTestPagePath (destination, stop, true);
				}));
		}

		return (false);
	}

	async onCommand (destination: HotDestination, page: HotTestPage, stop: HotTestStop, 
		cmd: string, args: string[], cmdFunc: ((cmdArgs: string[]) => Promise<void>)): Promise<void>
	{
		this.suite.addTest (new Test (cmd, async () =>
			{
				await cmdFunc (args);
			}));
	}

	async onTestEnd (destination: HotDestination): Promise<void>
	{
		return (await new Promise ((resolve, reject) =>
			{
				if (this.afterAll != null)
					this.suite.afterAll (this.afterAll);

				this.mocha.run ((failures: number) =>
					{
						resolve ();
					});
			}));
	}
}