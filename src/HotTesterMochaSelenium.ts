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

		// Restore cookies snapshotted by destroy() — without this, login
		// state (refreshToken, session) set in a previous destination is
		// lost when HotTester quits the WebDriver between destinations.
		if (this.savedCookies != null && this.savedCookies.length > 0 && url !== "")
		{
			try
			{
				const targetOrigin: string = new URL (url).origin;
				await driver.get (targetOrigin + "/");
				for (const c of this.savedCookies)
				{
					try { await driver.manage ().addCookie (c as any); }
					catch (e) { /* skip cookies that addCookie rejects (e.g. domain mismatch) */ }
				}
				this.processor.logger.verbose (
					`HotTesterMochaSelenium: restored ${this.savedCookies.length} cookies to ${targetOrigin}`);
			}
			catch (e) { /* best-effort */ }
			this.savedCookies = [];
			this.savedCookiesUrl = "";
		}
		let loadDriverUrl: boolean = true;

		if (this.onSetup != null)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.onSetup (driver, url).then ((result: boolean) =>
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
			this.processor.logger.verbose (`HotTesterMochaSelenium: Retreiving url ${url} and waiting for data...`);

			try
			{
				let testUrl: URL = new URL (url);
			}
			catch (ex)
			{
				throw new Error (`HotTesterMochaSelenium: Cannot start tests. Invalid URL: ${url}`);
			}
 
			this.finishedLoading = false;
			await driver.get (url);

			try
			{
				await this.waitForData ();
				this.processor.logger.verbose (`HotTesterMochaSelenium: Received data...`);
			}
			catch (ex)
			{
				// Drain the browser console + page source so the CI log shows
				// *what the browser actually saw* rather than just "we never
				// heard from it." A page-side JS error before
				// Hot.CurrentPage.createTestPath is the most common reason
				// the tester never registers test paths and waitForData
				// hits its cap.
				try
				{
					const logs = await (driver.manage () as any).logs ().get ("browser");
					const lines: string[] = (logs as any[]).map ((e: any) =>
						`[${e.level?.name || e.level || "?"}] ${e.message}`);
					this.processor.logger.error (
						`HotTesterMochaSelenium: browser console (${lines.length} entries):\n` +
						(lines.length === 0 ? "  (empty)" : lines.map ((l) => `  ${l}`).join ("\n")));
				}
				catch (logEx)
				{
					this.processor.logger.error (
						`HotTesterMochaSelenium: could not pull browser logs — ${(logEx as Error).message}`);
				}

				try
				{
					const html: string = await driver.getPageSource ();
					const head: string = html.length > 4000 ? html.slice (0, 4000) + "\n[…truncated]" : html;
					this.processor.logger.error (
						`HotTesterMochaSelenium: rendered page source (first 4kB):\n${head}`);
				}
				catch (srcEx) { /* ignore */ }

				throw ex;
			}
		}
		else
			this.processor.logger.verbose (`HotTesterMochaSelenium: Not retreiving url.`);
	}

	/**
	 * Cookies snapshotted on destroy() so the next setup() can re-add
	 * them to a fresh WebDriver session. HotTester calls destroy()
	 * after every destination, which would otherwise wipe auth cookies
	 * (refreshToken, session) set during a previous destination's
	 * login flow.
	 */
	private savedCookies: any[] = [];
	private savedCookiesUrl: string = "";

	/**
	 * Executed when destroying this tester.
	 */
	async destroy (): Promise<void>
	{
		if (this.driver != null)
		{
			// Snapshot cookies before quitting the WebDriver so loadSeleniumDriver
			// can restore them on the next destination's fresh session.
			try
			{
				const wd: any = (this.driver as any).driver;
				if (wd != null)
				{
					this.savedCookies = await wd.manage ().getCookies ();
					this.savedCookiesUrl = await wd.getCurrentUrl ();
					this.processor.logger.verbose (
						`HotTesterMochaSelenium: snapshotted ${this.savedCookies.length} cookies from ${this.savedCookiesUrl}`);
				}
			}
			catch (e) { /* best-effort */ }

			await this.driver.destroy ();
		}
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

	async onCommand (destination: HotDestination, stop: HotTestStop, 
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

				// Same listener-leak fix as HotTesterMocha.onTestEnd:
				// mocha.run() registers uncaughtException + unhandledRejection
				// listeners on `process`; without runner.dispose() each test
				// destination leaks two of them, the EventEmitter limit is
				// hit after a handful, and tests stall on the 10s mocha
				// timeout until the whole job times out.
				const runner = this.mocha.run ((failures: number) =>
					{
						this.numFailures += failures;
						this.processor.logger.verbose (`HotTesterMochaSelenium: Tests complete!`);
						try { runner.dispose (); } catch (e) { /* mocha < 8 lacks dispose */ }
						resolve ();
					});
			}));
	}
}