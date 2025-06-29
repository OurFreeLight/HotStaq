import * as ppath from "path";
import * as oss from "os";

import { HotStaq, HotHTTPServer, HotLogLevel, DeveloperMode, APItoLoad, HotWebSocketClient } from "../src/api";
import { HelloWorldAPI } from "./server/HelloWorldAPI";

import { Builder, WebDriver, Session } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome";
import { HotTesterServer } from "../src/HotTesterServer";
import { ServableFileExtension } from "../src/HotHTTPServer";

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
	/**
	 * The client websocket.
	 */
	socket: HotWebSocketClient;

	constructor (processor: HotStaq = new HotStaq ())
	{
		this.processor = processor;
		this.driver = null;
		this.capabilities = {};
		this.session = null;
		this.server = null;
		this.testerServer = null;
		this.socket = null;
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

		/*
		// @todo Get this to work again. This stopped working nicely after years of being used????
		if (process.env["TESTING_DEVTOOLS"] != null)
		{
			if (process.env["TESTING_DEVTOOLS"] === "1")
			{
				options = options.addArguments ("--auto-open-devtools-for-tabs");
				defaultCreate = false;
			}
		}*/

		if ((process.env["TESTING_REMOTE_SERVER"] != null) || (process.env["TESTING_RUN_HEADLESS"] != null))
		{
			options = options.addArguments ("--headless", "--disable-gpu", "--no-sandbox","--window-size=1920,1080");
			defaultCreate = false;
		}

		if (process.env["USER_DATA_DIR"] != null)
		{
			options = options.addArguments (`user-data-dir=${process.env["USER_DATA_DIR"]}`, "--profile-directory=Default");
			defaultCreate = false;
		}

		if (defaultCreate === true)
			builder = builder.withCapabilities (this.capabilities);
		else
			builder = builder.forBrowser ("chrome").setChromeOptions (options);

		if (process.env["TESTING_REMOTE_SERVER"] != null)
			builder = builder.usingServer (process.env["TESTING_REMOTE_SERVER"]);

		this.driver = await builder.build ();
		this.session = await this.driver.getSession ();
	}

	/**
	 * Get the url for the server.
	 */
	getUrl (server: HotHTTPServer = null): string
	{
		let tempServer: HotHTTPServer = this.server;

		if (server != null)
			tempServer = server;

		return (`http://127.0.0.1:${tempServer.ports.http}`);
	}

	/**
	 * Get the Websocket url for the server.
	 */
	getWSUrl (): string
	{
		return (`ws://127.0.0.1:${this.server.ports.http}`);
	}

	/**
	 * Load the APIs from the processor.
	 */
	static loadAPIs (processor: HotStaq): { [name: string]: APItoLoad; }
	{
		let apis: { [name: string]: APItoLoad; } = {};
	
		if (processor.hotSite != null)
		{
			if (processor.hotSite.apis != null)
			{
				for (let key in processor.hotSite.apis)
				{
					let tempapi = processor.hotSite.apis[key];
	
					if (tempapi.libraryName != null)
					{
						let path: string = tempapi.filepath;
	
						let apiToLoad: APItoLoad = {
								importedAPIClass: null,
								exportedClassName: tempapi.apiName,
								path: path
							};
						apis[key] = apiToLoad;
					}
				}
			}
		}
	
		return (apis);
	}

	/**
	 * Start the web server.
	 */
	async setupServer (serveFileExtensions: ServableFileExtension[] = HotHTTPServer.getDefaultServableExtensions (), custom404: string = null): Promise<HotHTTPServer>
	{
		this.server = new HotHTTPServer (this.processor);

		this.server.logger.logLevel = HotLogLevel.All;
		this.server.staticRoutes.push ({
				"route": "/",
				"localPath": ppath.normalize (`${process.cwd ()}/`)
			});
		this.server.serveFileExtensions = serveFileExtensions;
		this.server.hottFilesAssociatedInfo.jsSrcPath = "/build-web/HotStaq.js";

		if (custom404 != null)
		{
			this.server.handle404 = (req: any, res: any, next: any): void =>
				{
					this.server.logger.verbose (`404 ${JSON.stringify (req.url)}`);

					res.status (404).sendFile (custom404);
				};
		}

		let api: HelloWorldAPI = new HelloWorldAPI (this.getUrl (), this.server);
		await api.onPreRegister ();
		await this.server.setAPI (api);

		if (this.processor.mode === DeveloperMode.Development)
		{
			let serverStarter = await HotTesterServer.startServer ();
			this.testerServer = serverStarter.server;
		}

		return (this.server);
	}

	/**
	 * Start the web server.
	 */
	async startServer (): Promise<void>
	{
		if (this.server == null)
			await this.setupServer ();

		return (await this.server.listen ());
	}

	/**
	 * Stop the server.
	 */
	async shutdown (): Promise<void>
	{
		if (this.testerServer != null)
			await this.testerServer.shutdown ();

		if (this.driver != null)
			this.driver.quit ();

		await this.server.shutdown ();
		await HotStaq.wait (1500);
	}

	/**
	 * Have a client connect to a websocket server.
	 */
	async clientConnectToWebSocket (auth: any): Promise<void>
	{
		const url: string = this.getWSUrl ();
		this.socket = new HotWebSocketClient (url);

		await this.socket.connect (auth, null, {
				"reconnection": true
			});
	}

	/**
	 * Disconnect the websocket server.
	 */
	disconnectFromWebSocket (): void
	{
		this.socket.disconnect ();
	}
}