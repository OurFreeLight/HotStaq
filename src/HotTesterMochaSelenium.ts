import Mocha from "mocha";
import { Suite, Test } from "mocha";

import { HotTestMap } from "./HotTestMap";
import { HotTestPage } from "./HotTestPage";
import { HotTester } from "./HotTester";
import { HotDestination } from "./HotDestination";
import { HotTestStop } from "./HotTestStop";
import { HotStaq } from "./HotStaq";
import { HotTesterMocha } from "./HotTesterMocha";
import { HotTestSeleniumDriver } from "./HotTestSeleniumDriver";

import { WebDriver } from "selenium-webdriver";

/**
 * The tester that uses Mocha to executes all tests.
 */
export class HotTesterMochaSelenium extends HotTesterMocha
{
	/**
	 * The driver to use when running tests.
	 */
	override driver: HotTestSeleniumDriver;
	/**
	 * If set to true, this will wait for the tester API data. If 
	 * onSetup is used, it will have to return true in order to 
	 * wait for the tester data.
	 */
	waitForTesterData: boolean;
    /**
     * This event is executed after the Selenium driver and url have 
	 * been loaded. If this returns true, Selenium will load the url.
     */
    onSetup: (driver: WebDriver, url: string) => Promise<boolean>;

	constructor (processor: HotStaq, name: string, baseUrl: string, 
		testMaps: { [name: string]: HotTestMap; } = {}, 
		onSetup: (driver: WebDriver) => Promise<boolean> = null, 
		beforeAll: () => Promise<void> = null, 
		afterAll: () => Promise<void> = null)
	{
		super (processor, name, baseUrl, testMaps, beforeAll, afterAll);

		this.driver = new HotTestSeleniumDriver (processor);
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
		{
			this.processor.logger.verbose (`HotTesterMochaSelenium: Not a web route. Skipping...`);

			return;
		}

		this.processor.logger.verbose (`HotTesterMochaSelenium: Setting up`);
		let testDriver: HotTestSeleniumDriver = (<HotTestSeleniumDriver>this.driver);

		await testDriver.loadSeleniumDriver ();
		let driver: WebDriver = testDriver.driver;
		let loadDriverUrl: boolean = true;
		let tempUrl: string = this.baseUrl;

		if (url !== "")
			tempUrl = url;

		if (this.onSetup != null)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.onSetup (driver, tempUrl).then ((result: boolean) =>
						{
							loadDriverUrl = result;
							resolve ();
						})
						.catch ((error) =>
						{
							this.processor.logger.error (`HotTesterMochaSelenium Error: ${error.message}`);
							reject (error);
						});
				});

			if (loadDriverUrl == null)
				loadDriverUrl = true;
		}

		this.processor.logger.verbose (`HotTesterMochaSelenium: Finished setting up`);

		if (loadDriverUrl === true)
		{
			this.processor.logger.verbose (`HotTesterMochaSelenium: Retreiving url ${tempUrl} and waiting for data...`);

			this.finishedLoading = false;
			await driver.get (tempUrl);
			await this.waitForData ();

			this.processor.logger.verbose (`HotTesterMochaSelenium: Received data...`);
		}
		else
			this.processor.logger.verbose (`HotTesterMochaSelenium: Not retreiving url.`);
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

		this.processor.logger.verbose (`HotTesterMochaSelenium: Setting up Mocha and creating test suite...`);
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

		this.processor.logger.verbose (`HotTesterMochaSelenium: Adding test path ${testPathName}`);

		/*if (continueWhenTestIsComplete === true)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.suite.addTest (new Test (testPathName, async () =>
						{
							this.processor.logger.verbose (() => `HotTesterMochaSelenium: Executing ${testPathName} destination ${JSON.stringify (destination)} with stop ${stop}`);

							// The true is a dumb hack to prevent any recursion.
							await this.executeTestPagePath (destination, stop, true);
							resolve ();
						}));
				});
		}
		else
		{*/
			this.suite.addTest (new Test (testPathName, async () =>
				{
					this.processor.logger.verbose (() => `HotTesterMochaSelenium: Executing ${testPathName} destination ${JSON.stringify (destination)} with stop ${stop}`);

					// The true is a dumb hack to prevent any recursion.
					await this.executeTestPagePath (destination, stop, true);
				}));
		//}

		return (false);
	}

	async onCommand (destination: HotDestination, page: HotTestPage, stop: HotTestStop, 
		cmd: string, args: string[], cmdFunc: ((cmdArgs: string[]) => Promise<void>)): Promise<void>
	{
		this.suite.addTest (new Test (cmd, async () =>
			{
				this.processor.logger.verbose (() => `HotTesterMochaSelenium: Executing command ${cmd} with arguments ${JSON.stringify (args)}`);

				await cmdFunc (args);
			}));
	}

	async onTestEnd (destination: HotDestination): Promise<void>
	{
		return (new Promise ((resolve, reject) =>
			{
				if (this.afterAll != null)
					this.suite.afterAll (this.afterAll);

				this.processor.logger.verbose (`HotTesterMochaSelenium: Starting Mocha/Selenium and running tests...`);

				this.mocha.run ((failures: number) =>
					{
						this.processor.logger.verbose (`HotTesterMochaSelenium: Tests complete!`);
						resolve ();
					});
			}));
	}
}