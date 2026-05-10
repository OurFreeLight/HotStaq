import { HotTestElement, HotTestElementOptions } from "./HotTestElement";
import { HotTestDriver } from "./HotTestDriver";
import { HotTestPage } from "./HotTestPage";
import { HotStaq } from "./HotStaq";

import { By, until, WebDriver, WebElement, Session, Builder, logging } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";

/**
 * Runs and executes tests using Selenium.
 */
export class HotTestSeleniumDriver extends HotTestDriver
{
	/**
	 * The current selenium session running.
	 */
	session: Session;
	/**
	 * The selenium webdriver.
	 */
	driver: WebDriver;
	/**
	 * The browser to use.
	 */
	browser: string;
	/**
	 * Run the tests headless.
	 */
	headless: boolean;
	/**
	 * Disable GPU usage and the Chrome Sandbox. Mostly for usage within Docker.
	 */
	disableGPUAndSandbox: boolean;
	/**
	 * Automatically open the developer tools on start.
	 */
	openDevTools: boolean;
	/**
	 * Disables shared memory usage. Mostly for usage within Docker. This works on Chrome, 
	 * may not work on Firefox as it has not been tested on Firefox.
	 */
	disableDevShmUsage: boolean;
	/**
	 * Set the remote server to use for testing.
	 */
	remoteServer: string;
	/**
	 * Set the window size on start.
	 */
	windowSize: {
			/**
			 * The width of the window.
			 */
			width: number;
			/**
			 * The height of the window.
			 */
			height: number;
		};

	constructor (processor: HotStaq, page: HotTestPage = null)
	{
		super (processor, page);

		this.driver = null;
		this.session = null;
		this.browser = "chrome";
		this.headless = false;
		this.disableGPUAndSandbox = false;
		this.openDevTools = false;
		this.disableDevShmUsage = false;
		this.remoteServer = "";
		this.windowSize = null;
	}

	/**
	 * Disconnect this server or destroy anything associated with this HotTestDriver.
	 */
	async destroy (): Promise<void>
	{
		if (this.driver != null)
		{
			await this.driver.quit ();

			this.driver = null;
			this.session = null;
		}
	}

	/**
	 * Load the selenium driver.
	 */
	async loadSeleniumDriver (): Promise<void>
	{
		let createWindowSize = () =>
			{
				if (this.windowSize == null)
					this.windowSize = { width: 1920, height: 1080 };
			};

		let builder: Builder = new Builder ();
		builder = builder.forBrowser (this.browser);

		// Capture browser console + driver logs so a failed waitForData
		// can dump them (see HotTesterMochaSelenium.setup). Without this
		// the WebDriver logging API returns nothing on Chrome.
		try
		{
			const prefs = new logging.Preferences ();
			prefs.setLevel (logging.Type.BROWSER, logging.Level.ALL);
			prefs.setLevel (logging.Type.DRIVER,  logging.Level.WARNING);
			builder = builder.setLoggingPrefs (prefs);
		}
		catch (e) { /* older selenium-webdriver — skip */ }

		if (process.env["SELENIUM_REMOTE_SERVER"] != null)
			this.remoteServer = process.env["SELENIUM_REMOTE_SERVER"];

		if (process.env["SELENIUM_WINDOW_WIDTH"] != null)
		{
			createWindowSize ();
			this.windowSize.width = parseFloat (process.env["SELENIUM_WINDOW_WIDTH"]);
		}

		if (process.env["SELENIUM_WINDOW_HEIGHT"] != null)
		{
			createWindowSize ();
			this.windowSize.height = parseFloat (process.env["SELENIUM_WINDOW_HEIGHT"]);
		}

		if (this.remoteServer !== "")
		{
			this.processor.logger.verbose (`HotTestSeleniumDriver: Connecting to remote server ${this.remoteServer}`);
			builder = builder.usingServer (this.remoteServer);
			createWindowSize ();
			this.headless = true;
		}

		if (this.browser === "firefox")
		{
			let options = new firefox.Options ();

			this.processor.logger.verbose (`HotTestSeleniumDriver: Using Firefox with options`);

			if (this.openDevTools === true)
			{
				options = options.addArguments ("-devtools");
				this.processor.logger.verbose (`  * devtools`);
			}

			if (this.headless === true)
			{
				options = options.addArguments ("-headless");
				this.processor.logger.verbose (`  * headless`);
			}

			if (this.disableDevShmUsage === true)
			{
				options = options.addArguments ("-disable-dev-shm-usage");
				this.processor.logger.verbose (`  * Disable Shared Memory`);
			}

			if (this.windowSize != null)
			{
				options = options.windowSize (this.windowSize);
				this.processor.logger.verbose (`  * Window Size: ${this.windowSize.width}x${this.windowSize.height}`);
			}

			if (process.env["USER_DATA_DIR"] != null)
			{
				options = options.addArguments(`-profile ${process.env["USER_DATA_DIR"]}`);
				this.processor.logger.verbose (`  * User data dir: ${process.env["USER_DATA_DIR"]}`);
			}

			if (process.env.NODE_TLS_REJECT_UNAUTHORIZED != null)
			{
				if (process.env.NODE_TLS_REJECT_UNAUTHORIZED == "0")
				{
					options.setAcceptInsecureCerts (true);
					this.processor.logger.verbose (`  * Accepting insecure certs`);
				}
			}

			builder = builder.setFirefoxOptions (options);
		}

		if (this.browser === "chrome")
		{
			let options = new chrome.Options ();

			this.processor.logger.verbose (`HotTestSeleniumDriver: Using Chrome with options`);

			// CHROMEDRIVER_PATH lets the caller pin the driver binary so
			// Selenium Manager doesn't try to download it at runtime — that
			// download is the prime suspect for the 30-minute test-web hangs
			// in CI runners with constrained egress. CHROME_BINARY_PATH
			// pairs with it for environments where the chromium executable
			// is also non-default (Debian's `chromium` rather than `google-
			// chrome`). Both are no-ops when unset.
			const chromedriverPath: string | undefined = process.env["CHROMEDRIVER_PATH"];
			if (chromedriverPath != null && chromedriverPath !== "")
			{
				const svc = new chrome.ServiceBuilder (chromedriverPath);
				builder = builder.setChromeService (svc);
				this.processor.logger.verbose (`  * chromedriver path: ${chromedriverPath}`);
			}

			const chromeBinaryPath: string | undefined = process.env["CHROME_BINARY_PATH"];
			if (chromeBinaryPath != null && chromeBinaryPath !== "")
			{
				options.setChromeBinaryPath (chromeBinaryPath);
				this.processor.logger.verbose (`  * chrome binary: ${chromeBinaryPath}`);
			}

			if (this.disableGPUAndSandbox === true)
			{
				options.addArguments ("--disable-gpu", "--no-sandbox");
				this.processor.logger.verbose (`  * Disabled GPU and No sandbox`);
			}

			if (this.openDevTools === true)
			{
				options.addArguments ("--auto-open-devtools-for-tabs");
				this.processor.logger.verbose (`  * Auto open devtools`);
			}

			if (this.disableDevShmUsage === true)
			{
				options.addArguments ("--disable-dev-shm-usage");
				this.processor.logger.verbose (`  * Disable Shared Memory`);
			}

			if (this.headless === true)
			{
				options.addArguments ("--headless");
				this.processor.logger.verbose (`  * Headless`);
			}

			if (this.windowSize != null)
			{
				options.windowSize (this.windowSize);
				this.processor.logger.verbose (`  * Window Size: ${this.windowSize.width}x${this.windowSize.height}`);
			}

			if (process.env["USER_DATA_DIR"] != null)
			{
				options.addArguments(`--user-data-dir=${process.env["USER_DATA_DIR"]}`);
				this.processor.logger.verbose (`  * User data dir: ${process.env["USER_DATA_DIR"]}`);
			}

			if (process.env.NODE_TLS_REJECT_UNAUTHORIZED != null)
			{
				if (process.env.NODE_TLS_REJECT_UNAUTHORIZED == "0")
				{
					options.setAcceptInsecureCerts (true);
					this.processor.logger.verbose (`  * Accepting insecure certs`);
				}
			}

			builder = builder.setChromeOptions (options);
		}

		this.processor.logger.verbose (`HotTestSeleniumDriver: Starting session...`);

		// Bound builder.build() with a hard timeout. In CI runners with
		// constrained egress, Selenium Manager's auto-download of
		// chromedriver can hang silently — turning a "tests can't start"
		// failure into the full 30-minute job timeout. Cap at 60s (override
		// with SELENIUM_BUILD_TIMEOUT_MS) so the failure is fast and the
		// log says exactly what happened.
		const buildTimeoutMs: number = parseInt (
			process.env["SELENIUM_BUILD_TIMEOUT_MS"] || "60000", 10) || 60000;

		const buildPromise = builder.build ();
		const timeoutPromise = new Promise<never> ((_, reject) =>
			setTimeout (
				() => reject (new Error (
					`HotTestSeleniumDriver: Selenium driver did not start within ${buildTimeoutMs}ms. ` +
					`Set CHROMEDRIVER_PATH and CHROME_BINARY_PATH to skip Selenium Manager's auto-download, ` +
					`or raise SELENIUM_BUILD_TIMEOUT_MS to wait longer.`)),
				buildTimeoutMs));

		this.driver = await Promise.race ([buildPromise, timeoutPromise]) as WebDriver;
		this.session = await this.driver.getSession ();
		this.processor.logger.verbose (`HotTestSeleniumDriver: Session started...`);
	}

	/**
	 * Get a test object by it's name. If a * is used, it will be used as a 
	 * wildcard for the object's name. If a > is used, then the name will 
	 * be treated as a CSS selector.
	 */
	getTestObjectByName (name: string): By
	{
		let selector: string = this.parseTestObject (name);

		return (By.css (selector));
	}

	/**
	 * Navigate to a url.
	 */
	async navigateToUrl(url: string): Promise<void>
	{
		await this.driver.get (url);
		this.processor.logger.verbose (`HotTestSeleniumDriver: navigateToUrl - ${url}`);
	}

	/**
	 * Test-friendly alias for navigateToUrl. Accepts either a fully
	 * qualified URL or a path that's resolved against the driver's
	 * current origin — that way `.hott` test paths can write
	 * `await driver.navigate("/account")` instead of having to know
	 * the test server's host:port.
	 */
	async navigate (urlOrPath: string): Promise<void>
	{
		let target: string = urlOrPath;
		if (urlOrPath.startsWith ("/"))
		{
			try
			{
				const cur: string = await this.driver.getCurrentUrl ();
				target = new URL (urlOrPath, cur).toString ();
			}
			catch (e) { /* fall through with the bare path */ }
		}
		// Reset the tester's finishedLoading so the next executeTestPagePath
		// blocks on the *new* page's pageLoaded event, not the previous
		// page's already-fired one — otherwise the runner immediately
		// looks up the next test path against stale caches and fails
		// with "Test path X does not have a function".
		if (this.tester != null)
			this.tester.finishedLoading = false;
		await this.navigateToUrl (target);
	}

	/**
	 * Wait for a test element using Selenium Webdriver.
	 */
	async waitForTestElement (name: string | HotTestElement, 
		options: HotTestElementOptions = new HotTestElementOptions ()): Promise<WebElement>
	{
		let nameStr: string = "";

		if (typeof (name) === "string")
			nameStr = name;
		else
			nameStr = name.name;

		let foundElm: WebElement = null;

		this.processor.logger.verbose (`HotTestSeleniumDriver: waitForTestElement - Searching for ${nameStr}`);

		if (options.mustBeVisible === false)
			foundElm = await this.driver.wait (until.elementLocated (this.getTestObjectByName (nameStr)));
		else
		{
			let elms: WebElement[] = await this.driver.wait (until.elementsLocated (this.getTestObjectByName (nameStr))) as unknown as WebElement[];

			for (let iIdx = 0; iIdx < elms.length; iIdx++)
			{
				let elm: WebElement = elms[iIdx];

				if (await elm.isDisplayed () === true)
				{
					foundElm = elm;

					break;
				}
			}
		}

		this.processor.logger.verbose (`HotTestSeleniumDriver: waitForTestElement - Found ${nameStr}`);

		return (foundElm);
	}

	/**
	 * Get a test element using selenium webdriver.
	 */
	async findTestElement (name: string | HotTestElement, 
		options: HotTestElementOptions = new HotTestElementOptions ()): Promise<WebElement>
	{
		let nameStr: string = "";

		if (typeof (name) === "string")
			nameStr = name;
		else
			nameStr = name.name;

		let foundElm: WebElement = null;

		this.processor.logger.verbose (`HotTestSeleniumDriver: findTestElement - Searching for ${nameStr}`);

		if (options.mustBeVisible === false)
		{
			let elms: WebElement[] = await this.driver.findElements (this.getTestObjectByName (nameStr));

			if (elms.length > 0)
				foundElm = elms[0];
		}
		else
		{
			let elms: WebElement[] = await this.driver.findElements (this.getTestObjectByName (nameStr));

			for (let iIdx = 0; iIdx < elms.length; iIdx++)
			{
				let elm: WebElement = elms[iIdx];

				if (await elm.isDisplayed () === true)
				{
					foundElm = elm;

					break;
				}
			}
		}

		if (foundElm != null)
			this.processor.logger.verbose (`HotTestSeleniumDriver: findTestElement - Found ${nameStr}`);
		else
			this.processor.logger.verbose (`HotTestSeleniumDriver: findTestElement - Not found ${nameStr}`);

		return (foundElm);
	}

	/**
	 * Run a command using Selenium Webdriver.
	 */
	async runCommand (testElm: string | HotTestElement, 
		funcName: string = "", 
		valueStr: string = "", 
		options: HotTestElementOptions = new HotTestElementOptions ()): Promise<any>
	{
		let name: string = "";
		let func: string = "";
		let value: string = "";

		if (typeof (testElm) !== "string")
		{
			name = testElm.name;
			func = testElm.func;
			value = testElm.value;
		}
		else
		{
			name = testElm;
			func = funcName;
			value = valueStr;
		}

		this.processor.logger.verbose (`HotTestSeleniumDriver: runCommand - Running Selenium function ${func} with value ${value} using element ${name}`);

		let elm: WebElement = await this.findTestElement (name, options);
		let result: any = null;

		if (elm == null)
		{
			if (options.ignoreMissingElementError === true)
				return (result);

			throw new Error (`HotTestSeleniumDriver: Unable to find test element ${name}!`);
		}

		if (func != null)
		{
			if (func !== "")
			{
				// Click hardening: layouts with sticky footers, fixed
				// banners, or BotBlocker overlays routinely intercept the
				// raw `elm.click()`. Scroll the target into the centre of
				// the viewport first; if Selenium still rejects the click
				// as intercepted, fall back to a JS click which bypasses
				// hit-testing entirely.
				if (func === "click")
				{
					try
					{
						await this.driver.executeScript (
							"arguments[0].scrollIntoView({block:'center', inline:'center'});",
							elm);
					}
					catch (_e) { /* best-effort scroll */ }

					try
					{
						result = await elm.click ();
					}
					catch (clickErr)
					{
						const msg: string = (clickErr && (clickErr as any).message) || String (clickErr);
						if (msg.indexOf ("intercepted") > -1 || msg.indexOf ("not clickable") > -1)
						{
							this.processor.logger.verbose (
								`HotTestSeleniumDriver: click intercepted on ${name}; ` +
								`falling back to JS click.`);
							result = await this.driver.executeScript (
								"arguments[0].click();", elm);
						}
						else
							throw clickErr;
					}
				}
				else if (value != null)
				{
					/// @ts-ignore
					result = await elm[func] (value);
				}
				else
				{
					/// @ts-ignore
					result = await elm[func] ();
				}
			}
		}

		this.processor.logger.verbose (() => `HotTestSeleniumDriver: runCommand - Finished Running Selenium function ${func}`);

		return (result);
	}

	/**
	 * Assert that a named test element exists in the DOM. Used by .hott
	 * test paths that just need to verify a control rendered (e.g. an
	 * error message, a confirmation banner) without comparing its value.
	 *
	 * Throws when the element is missing — same shape as
	 * `assertElementValue` so test paths can mix the two freely.
	 */
	async assertElementExists (name: string | HotTestElement,
		errorMessage: string = "",
		options: HotTestElementOptions = new HotTestElementOptions ()): Promise<WebElement>
	{
		let elm: WebElement = await this.findTestElement (name, options);

		if (elm == null)
		{
			let realName: string = "";
			if (typeof (name) === "string") realName = name;
			else                            realName = name.name;

			if (options.ignoreMissingElementError === true)
				return (null);

			throw new Error (errorMessage !== ""
				? `${errorMessage} (test element ${realName} not found)`
				: `Unable to find test element ${realName}`);
		}

		this.processor.logger.verbose (`HotTestSeleniumDriver: assertElementExists - Found ${typeof name === "string" ? name : name.name}`);
		return (elm);
	}

	/**
	 * An expression to test.
	 */
	async assertElementValue (name: string | HotTestElement, value: any,
		errorMessage: string = "", 
		options: HotTestElementOptions = new HotTestElementOptions ()): Promise<any>
	{
		let elm: WebElement = await this.findTestElement (name, options);

		if (elm == null)
		{
			let realName: string = "";

			if (typeof (name) === "string")
				realName = name;
			else
				realName = name.name;

			if (options.ignoreMissingElementError === true)
				return;

			throw new Error (`Unable to find test object ${realName}`);
		}

		this.processor.logger.verbose (`HotTestSeleniumDriver: assertElementValue - Asserting`);

		let elmValue: string = await elm.getText ();
		let elmValue2: string = "";
		let elmValue3: string = "";
		let finalElmValue: string = elmValue;

		if (finalElmValue === "")
		{
			elmValue2 = await elm.getAttribute ("value");

			if (elmValue2 != null)
			{
				if (elmValue2 !== "")
					finalElmValue = elmValue2;
			}
		}

		if (finalElmValue === "")
		{
			elmValue3 = await elm.getAttribute ("innerHTML");

			if (elmValue3 != null)
			{
				if (elmValue3 !== "")
					finalElmValue = elmValue3;
			}
		}

		if (finalElmValue != value)
			throw new Error (`Error: ${errorMessage}. Expected: ${JSON.stringify (value)}, Actual: ${JSON.stringify (finalElmValue)}`);
	}

	/**
	 * Run a series of test elements.
	 */
	async run (executions: string[] | string[][]): Promise<any[]>
	{
		let results: any[] = [];

		for (let iIdx = 0; iIdx < executions.length; iIdx++)
		{
			let execution: any = executions[iIdx];
			let testElm: HotTestElement = null;
			let func: string = "";
			let value: string = "";

			if (typeof (execution) === "string")
			{
				testElm = this.page.testElements[execution];

				/// @fixme This is going to wreck selecting test elements by wildcards.
				if (testElm == null)
					throw new Error (`HotTestDriver: Unable to find test element ${execution}`);

				func = testElm.func;
				value = testElm.value;
			}

			if (execution instanceof Array)
			{
				let name: string = execution[0];
				testElm = this.page.testElements[name];

				// This null catch is specifically to help find wildcard test elements.
				if (testElm == null)
				{
					testElm = new HotTestElement (name);
					func = execution[1];
					value = execution[2];
				}
				else
				{
					func = testElm.func;
					value = testElm.value;

					if (execution.length > 1)
						func = execution[1];

					if (execution.length > 2)
						value = execution[2];
				}
			}

			testElm.func = func;
			testElm.value = value;

			let result = await this.runCommand (testElm);

			await HotStaq.wait (this.commandDelay);

			results.push (result);
		}

		return (results);
	}
}