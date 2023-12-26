import Mocha from "mocha";
import { Suite, Test } from "mocha";

import { HotTestMap } from "./HotTestMap";
import { HotTestPage } from "./HotTestPage";
import { HotTester } from "./HotTester";
import { HotTestDriver } from "./HotTestDriver";
import { HotDestination } from "./HotDestination";
import { HotTestStop } from "./HotTestStop";
import { HotStaq } from "./HotStaq";
import { HotRouteMethod } from "./HotRouteMethod";

/**
 * The tester that uses Mocha to executes all tests.
 */
export class HotTesterMocha extends HotTester
{
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

	constructor (processor: HotStaq, name: string, baseUrl: string, 
		testMaps: { [name: string]: HotTestMap; } = {}, 
		beforeAll: () => Promise<void> = null, 
		afterAll: () => Promise<void> = null)
	{
		super (processor, name, baseUrl, new HotTestDriver (processor), testMaps);

        this.mocha = null;
		this.suite = null;
        this.beforeAll = beforeAll;
        this.afterAll = afterAll;
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

		this.processor.logger.verbose (`HotTesterMocha: Setting up Mocha and creating test suite...`);
		this.mocha = new Mocha ();
		this.suite = Mocha.Suite.create (this.mocha.suite, `${url} ${destinationName} Tests`);
		this.suite.timeout (this.timeout);

        if (this.beforeAll != null)
		    this.suite.beforeAll (this.beforeAll);

		return (true);
	}

	async onTestPagePathStart (destination: HotDestination, 
		stop: HotTestStop, continueWhenTestIsComplete: boolean = false): Promise<boolean>
	{
		let testPathName: string = stop.path;

		this.processor.logger.verbose (`HotTesterMocha: Adding Web test path ${testPathName}`);

		/*if (continueWhenTestIsComplete === true)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.suite.addTest (new Test (testPathName, async () =>
						{
							this.processor.logger.verbose (() => `HotTesterMocha: Executing ${testPathName} destination ${JSON.stringify (destination)} with stop ${stop}`);

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
					this.processor.logger.verbose (() => `HotTesterMocha: Executing ${testPathName} destination ${JSON.stringify (destination)} with stop ${stop}`);

					// The true is a dumb hack to prevent any recursion.
					await this.executeTestPagePath (destination, stop, true);
				}));
		//}

		return (false);
	}

	async onTestAPIPathStart(destination: HotDestination, 
		method: HotRouteMethod, 
		testName: string, 
		continueWhenTestIsComplete?: boolean): Promise<boolean>
	{
		let testPathName: string = `${method.getRouteUrl ()} -> ${testName}`;

		this.processor.logger.verbose (`HotTesterMocha: Adding API test path ${testPathName}`);

		/*if (continueWhenTestIsComplete === true)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.suite.addTest (new Test (testPathName, async () =>
						{
							this.processor.logger.verbose (() => `HotTesterMocha: Executing ${testPathName} destination ${JSON.stringify (destination)}`);

							// The true is a dumb hack to prevent any recursion.
							await this.executeTestAPIPath (destination, method, testName, true);
							resolve ();
						}));
				});
		}
		else
		{*/
			this.suite.addTest (new Test (testPathName, async () =>
				{
					this.processor.logger.verbose (() => `HotTesterMocha: Executing ${testPathName} destination ${JSON.stringify (destination)}`);

					// The true is a dumb hack to prevent any recursion.
					await this.executeTestAPIPath (destination, method, testName, true);
				}));
		//}

		return (false);
	}

	async onCommand (destination: HotDestination, stop: HotTestStop, 
		cmd: string, args: string[], cmdFunc: ((cmdArgs: string[]) => Promise<void>)): Promise<void>
	{
		this.suite.addTest (new Test (cmd, async () =>
			{
				this.processor.logger.verbose (() => `HotTesterMocha: Executing command ${cmd} with arguments ${JSON.stringify (args)}`);

				await cmdFunc (args);
			}));
	}

	async onTestEnd (destination: HotDestination): Promise<void>
	{
		return (new Promise ((resolve, reject) =>
			{
				if (this.afterAll != null)
					this.suite.afterAll (this.afterAll);

				this.processor.logger.verbose (`HotTesterMocha: Starting Mocha and running tests...`);

				this.mocha.run ((failures: number) =>
					{
						this.numFailures = failures;
						this.processor.logger.verbose (`HotTesterMocha: Tests complete!`);
						resolve ();
					});
			}));
	}
}