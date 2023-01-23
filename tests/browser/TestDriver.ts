import * as oss from "os";

import { HotTestElement, HotTestElementOptions } from "../../src/HotTestElement";
import { HotTestDriver } from "../../src/HotTestDriver";
import { HotTestPage } from "../../src/HotTestPage";
import { HotStaq } from "../../src/HotStaq";

import { By, until, WebDriver, WebElement, Session, Builder } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome";

/**
 * Runs and executes tests.
 */
export class TestDriver extends HotTestDriver
{
	/**
	 * The current selenium session running.
	 */
	session: Session;
	/**
	 * The selenium webdriver.
	 */
	driver: WebDriver;

	constructor (processor: HotStaq, page: HotTestPage = null)
	{
		super (processor, page);

		this.driver = null;
		this.session = null;
	}

	/**
	 * Disconnect the driver.
	 */
	async destroy (): Promise<void>
	{
		if (this.driver != null)
			await this.driver.quit ();
	}

	/**
	 * Load the selenium driver.
	 */
	async loadSeleniumDriver (): Promise<void>
	{
		let capabilities: any = {
				browserName: "chrome",
				platformName: "windows"
			};

		if (oss.platform () === "linux")
			capabilities["platformName"] = "linux";

		if (oss.platform () === "darwin")
			capabilities["platformName"] = "mac";

		if (process.env.NODE_TLS_REJECT_UNAUTHORIZED != null)
		{
			if (process.env.NODE_TLS_REJECT_UNAUTHORIZED == "0")
				capabilities["acceptInsecureCerts"] = true;
		}

		let builder: Builder = new Builder ();
		let defaultCreate: boolean = true;
		let options = new Chrome.Options ();

		if (process.env["TESTING_DEVTOOLS"] != null)
		{
			if (process.env["TESTING_DEVTOOLS"] === "1")
			{
				options.addArguments ("--auto-open-devtools-for-tabs");
				defaultCreate = false;
			}
		}

		if ((process.env["TESTING_REMOTE_SERVER"] != null) || (process.env["TESTING_RUN_HEADLESS"] != null))
		{
			options.addArguments ("--headless", "--disable-gpu", "--no-sandbox","--window-size=1920,1080");
			defaultCreate = false;
		}

		if (defaultCreate === true)
			builder = builder.withCapabilities (capabilities);
		else
			builder = builder.forBrowser ("chrome").setChromeOptions (options);

		if (process.env["TESTING_REMOTE_SERVER"] != null)
			builder = builder.usingServer (process.env["TESTING_REMOTE_SERVER"]);

		this.driver = await builder.build ()
		this.session = await this.driver.getSession ();
	}

	/**
	 * Navigate to a url.
	 */
	async navigateToUrl(url: string): Promise<void>
	{
		await this.driver.get (url);
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

		let elm: WebElement = await this.driver.wait (until.elementLocated (
				By.css (`[data-test-object-name='${nameStr}']`)));

		return (elm);
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

		let elm: WebElement = await this.driver.findElement (By.css (`[data-test-object-name='${nameStr}']`));

		return (elm);
	}

	/**
	 * Run a command using Selenium Webdriver.
	 */
	async runCommand (testElm: HotTestElement): Promise<any>
	{
		let name: string = testElm.name;
		let func: string = testElm.func;
		let value: string = testElm.value;

		let elm: WebElement = await this.findTestElement (name);
		let result: any = null;

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

		return (result);
	}

	/**
	 * An expression to test.
	 */
	async assertElementValue (name: string | HotTestElement, value: any, errorMessage: string = ""): Promise<any>
	{
		let elm: WebElement = await this.findTestElement (name);
		let elmValue: string = await elm.getAttribute ("value");

		if (elmValue != value)
			throw new Error (errorMessage);
	}

	/**
	 * An expression to test.
	 */
	async assert (value: any, errorMessage: string = ""): Promise<any>
	{
		if (! (value))
			throw new Error (errorMessage);
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