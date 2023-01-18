import Mocha from "mocha";
import { Suite, Test } from "mocha";

import { HotTestMap, HotTestPage, HotTestPath } from "./HotTestMap";
import { HotDestination, HotTester, HotTestStop } from "./HotTester";
import { HotTestDriver } from "./HotTestDriver";
import { HotStaq } from "./HotStaq";

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

	constructor (processor: HotStaq, name: string, baseUrl: string, driver: HotTestDriver, 
		testMaps: { [name: string]: HotTestMap; } = {}, 
		beforeAll: () => Promise<void> = null, 
		afterAll: () => Promise<void> = null)
	{
		super (processor, name, baseUrl, driver, testMaps);

        this.mocha = null;
        this.timeout = 10000;
		this.suite = null;
        this.beforeAll = beforeAll;
        this.afterAll = afterAll;
	}

	/**
	 * Executed when setting up the tester.
	 */
	async setup (): Promise<void>
	{
	}

	/**
	 * Executed when destroying up the tester.
	 */
	async destroy (): Promise<void>
	{
	}

	/**
	 * Executed when tests are started.
	 */
	async onTestStart (destination: HotDestination, destinationKey: string = ""): Promise<boolean>
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