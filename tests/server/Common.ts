import * as ppath from "path";
import * as oss from "os";

import { HotStaq, HotHTTPServer, HotLogLevel, DeveloperMode } from "../../src/api";
import { HelloWorldAPI } from "../server/HelloWorldAPI";

import { Builder, WebDriver, Session } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome";
import { HotTesterServer } from "../../src/HotTesterServer";

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
	/**
	 * The tester server.
	 */
	testerServer: HotTesterServer;

	constructor (processor: HotStaq = new HotStaq ())
	{
		this.processor = processor;
		this.driver = null;
		this.capabilities = {};
		this.session = null;
		this.server = null;
		this.testerServer = null;
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
			this.driver = await builder.withCapabilities (this.capabilities).build ();
		else
			this.driver = await builder.forBrowser ("chrome").setChromeOptions (options).build ();

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
	 * Start the web server.
	 */
	async startServer (serveHottFiles: boolean = false): Promise<void>
	{
		this.server = new HotHTTPServer (this.processor);

		this.server.logger.logLevel = HotLogLevel.All;
		this.server.staticRoutes.push ({
				"route": "/",
				"localPath": ppath.normalize (`${process.cwd ()}/`)
			});
		this.server.serveHottFiles = serveHottFiles;
		this.server.hottFilesAssociatedInfo.jsSrcPath = "/build-web/HotStaq.js";
		let api: HelloWorldAPI = new HelloWorldAPI (this.getUrl (), this.server);
		await this.server.setAPI (api);

		if (this.processor.mode === DeveloperMode.Development)
		{
			let serverStarter = await HotTesterServer.startServer ();
			this.testerServer = serverStarter.server;
		}

		return (await this.server.listen ());
	}

	/**
	 * Stop the server.
	 */
	async shutdown (): Promise<void>
	{
		if (this.processor.mode === DeveloperMode.Development)
			await this.testerServer.shutdown ();

		await this.server.shutdown ();
		await HotStaq.wait (1000);
	}
}