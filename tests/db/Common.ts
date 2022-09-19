import * as oss from "os";

import { HotHTTPServer } from "../../src/HotHTTPServer";

import { Builder, WebDriver, Session } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome";
import { HotStaq } from "../../src/HotStaq";
import { HotLogLevel } from "../../src/HotLog";

/**
 * Common testing features
 */
export class Common
{
	/**
	 * The selenium webdriver.
	 */
	driver: WebDriver;
	/**
	 * The driver capabilities to use.
	 */
	capabilities: any;
	/**
	 * The current selenium session running.
	 */
	session: Session;
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The HTTP server.
	 */
	server: HotHTTPServer;

	constructor ()
	{
		this.processor = new HotStaq ();
		this.driver = null;
		this.capabilities = {};
		this.session = null;
		this.server = new HotHTTPServer (this.processor);
	}

	/**
	 * Load the tests.
	 */
	async load (): Promise<void>
	{
		this.capabilities = {
				browserName: "chrome",
				platformName: "windows"
			};

		if (oss.platform () === "linux")
			this.capabilities["platformName"] = "linux";

		if (oss.platform () === "darwin")
			this.capabilities["platformName"] = "mac";

		if (process.env.NODE_TLS_REJECT_UNAUTHORIZED != null)
		{
			if (process.env.NODE_TLS_REJECT_UNAUTHORIZED == "0")
				this.capabilities["acceptInsecureCerts"] = true;
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

		if (process.env["TESTING_REMOTE_SERVER"] != null)
		{
			options.addArguments ("--headless", "--disable-gpu", "--no-sandbox","--window-size=1920,1080");
			defaultCreate = false;
		}

		if (defaultCreate === true)
			builder = builder.withCapabilities (this.capabilities);
		else
			builder = builder.forBrowser ("chrome").setChromeOptions (options);

		if (process.env["TESTING_REMOTE_SERVER"] != null)
			builder = builder.usingServer (process.env["TESTING_REMOTE_SERVER"]);

		this.driver = await builder.build ()
		this.session = await this.driver.getSession ();
	}

	/**
	 * Get the url for the server.
	 */
	getUrl (): string
	{
		return (`http://127.0.0.1:${this.server.ports.http}`);
	}

	/**
	 * Start the micro web server.
	 */
	async startServer (): Promise<void>
	{
		this.server.logger.logLevel = HotLogLevel.All;
		this.server.staticRoutes.push ({
				"route": "/",
				"localPath": `${process.cwd ()}/`
			});

		return (this.server.listen ());
	}

	/**
	 * Stop the server.
	 */
	async shutdown (): Promise<void>
	{
		if (this.driver != null)
			this.driver.quit ();

		await this.server.shutdown ();
		await HotStaq.wait (1000);
	}
}