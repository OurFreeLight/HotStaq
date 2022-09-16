import * as oss from "os";

import { HotTestElement, HotTestElementOptions } from "./HotTestElement";
import { HotTestDriver } from "./HotTestDriver";
import { HotTestPage } from "./HotTestMap";
import { HotStaq } from "./HotStaq";

import { By, until, WebDriver, WebElement, Session, Builder } from "selenium-webdriver";
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
				options = options.headless ();
				this.processor.logger.verbose (`  * headless`);
			}

			if (this.windowSize != null)
			{
				options = options.windowSize (this.windowSize);
				this.processor.logger.verbose (`  * Window Size: ${this.windowSize.width}x${this.windowSize.height}`);
			}

			if (process.env["USER_DATA_DIR"] != null)
			{
				options = options.addArguments(`user-data-dir=${process.env["USER_DATA_DIR"]}`);
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

			if (this.disableGPUAndSandbox === true)
			{
				options = options.addArguments ("--disable-gpu", "--no-sandbox");
				this.processor.logger.verbose (`  * Disabled GPU and No sandbox`);
			}

			if (this.openDevTools === true)
			{
				options = options.addArguments ("--auto-open-devtools-for-tabs");
				this.processor.logger.verbose (`  * Auto open devtools`);
			}

			if (this.headless === true)
			{
				options = options.headless ();
				this.processor.logger.verbose (`  * Headless`);
			}

			if (this.windowSize != null)
			{
				options = options.windowSize (this.windowSize);
				this.processor.logger.verbose (`  * Window Size: ${this.windowSize.width}x${this.windowSize.height}`);
			}

			if (process.env["USER_DATA_DIR"] != null)
			{
				options = options.addArguments(`user-data-dir=${process.env["USER_DATA_DIR"]}`);
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
		this.driver = await builder.build ();
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
			let elms: WebElement[] = await this.driver.wait (until.elementsLocated (this.getTestObjectByName (nameStr)));

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

		this.processor.logger.verbose (`HotTestSeleniumDriver: findTestElement - Found ${nameStr}`);

		return (foundElm);
	}

	/**
	 * Run a command using Selenium Webdriver.
	 */
	async runCommand (testElm: string | HotTestElement, funcName: string = "", 
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

		this.processor.logger.verbose (`HotTestSeleniumDriver: runCommand - Running ${func} with value ${value} for ${name}`);

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
				if (value != null)
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

		this.processor.logger.verbose (`HotTestSeleniumDriver: runCommand - Finished running ${func} with value ${value} for ${name}`);

		return (result);
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
}