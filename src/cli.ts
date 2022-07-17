import * as ppath from "path";
import * as fs from "fs";

import * as commander from "commander";

import { HotStaq } from "./HotStaq";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotLogLevel } from "./HotLog";
import { DeveloperMode } from "./Hot";
import { HotTesterServer } from "./HotTesterServer";
import { HotBuilder } from "./HotBuilder";
import { HotGenerator } from "./HotGenerator";
import { HotCreator } from "./HotCreator";
import { HotDBConnectionInterface } from "./HotDBConnectionInterface";
import { APItoLoad, HotAPI } from "./HotAPI";
import { HotTesterMochaSelenium } from "./HotTesterMochaSelenium";
import { HotDBMySQL } from "./schemas/HotDBMySQL";
import { HotIO } from "./HotIO";
import { HotAgentAPI } from "./HotAgentAPI";
import { HotTester } from "./HotTester";
import { HotTesterMocha } from "./HotTesterMocha";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod } from "./HotRouteMethod";

HotStaq.isWeb = false;

let VERSION: string = "";
let processor: HotStaq = new HotStaq ();
processor.logger.logLevel = HotLogLevel.All;

let hotsitePath: string = "";
let globalLogLevel: HotLogLevel = null;

/**
 * Start the API server.
 */
async function startAPIServer (server: HotHTTPServer, loadedAPI: APItoLoad, baseAPIUrl: 
	string, dbinfo: HotDBConnectionInterface, isAPIOnly: boolean): Promise<HotAPI>
{
	process.chdir (process.cwd ());
	let foundModulePath = require.resolve (loadedAPI.path, { paths: [process.cwd ()] });

	server.logger.verbose (`Loading API JavaScript from: ${foundModulePath}`);

	let apiJS = require (foundModulePath);
	let apiClass: any = apiJS[loadedAPI.exportedClassName];
	let api: HotAPI = new apiClass (baseAPIUrl, server);
	let useDatabase: boolean = true;

	server.logger.info (`Loaded API class: ${loadedAPI.exportedClassName}`);
	server.logger.verbose (`Base API URL: ${baseAPIUrl}`);
	server.logger.verbose (`Loaded API JavaScript from: ${foundModulePath}`);

	processor.api = api;
	server.processor.api = api;
	server.api = api;

	if (isAPIOnly === true)
	{
		server.addRoute ("/", async (req: any, res: any) =>
			{
				res.json ({ "status": "ok" });
			});
	}

	if (dbinfo != null)
	{
		if (dbinfo.type === "none")
			useDatabase = false;
	}

	if (process.env["DATABASE_DISABLE"] != null)
	{
		if (process.env["DATABASE_DISABLE"] === "1")
			useDatabase = false;
	}

	if (useDatabase === false)
		await server.setAPI (api);

	if ((dbinfo != null) && (useDatabase === true))
	{
		let dbClass = null;

		if (dbinfo.type === "mysql")
			dbClass = HotDBMySQL;

		api.db = new dbClass ();
		await server.setAPI (api);

		if (dbinfo.username === "")
			throw new Error (`No database username provided!`);

		if (dbinfo.password === "")
			throw new Error (`No database password provided!`);

		server.logger.verbose (`Connecting to ${dbinfo.type} database "${dbinfo.database}" on host ${dbinfo.server}:${dbinfo.port}`);
		await api.db.connect (dbinfo);
		server.logger.verbose (`Connected to ${dbinfo.type} database "${dbinfo.database}" on host ${dbinfo.server}:${dbinfo.port}`);
	}

	return (api);
}

/**
 * Get a key/value pair from a string.
 */
function getKeyValuePair (str: string): { key: string; value: string; }
{
	let pos: number = str.indexOf ("=");
	let key: string = "";
	let value: string = "";

	if (pos > -1)
	{
		key = str.substr (0, pos);
		value = str.substr (pos + 1);
	}

	return ({ key: key, value: value });
}

/**
 * Handle any build commands.
 */
async function handleBuildCommands (): Promise<commander.Command>
{
	let builder: HotBuilder = null;
	let createHotBuilder = () =>
		{
			if (builder == null)
				builder = new HotBuilder (processor.logger);
		};

	const buildCmd: commander.Command = new commander.Command ("build");
	buildCmd.description (`Build commands.`);
	buildCmd.action (async () =>
		{
			createHotBuilder ();

			if (hotsitePath === "")
				throw new Error (`When building, you must specify a HotSite.json!`);

			if (hotsitePath !== "")
			{
				await processor.loadHotSite (hotsitePath);
				await processor.processHotSite ();
			}

			builder.hotsites = [processor.hotSite];
			await builder.build ();
		});

	/*buildCmd.option ("--watch, -w", "Watch the associated files and rebuild when changes are detected.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.api = true;
		});*/
	/*buildCmd.option ("--api", "Build the web client to be used in a web browser.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.api = true;
		});*/
	buildCmd.option ("--docker", "Build Dockerfiles from the given HotSite.json. This will be the default option.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.dockerFiles = true;
		});
	buildCmd.option ("--dont-get-hard", "Do not use the default security hardening when generating the docker image.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.dockerHardenSecurity = true;
		});
	buildCmd.option ("--dont-append-readme", "Do not add the additional docker documentation to the existing README.md.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.appendReadMe = true;
		});
	buildCmd.option ("--docker-compose", "Build the docker compose file from the given HotSite.json.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.dockerCompose = true;
		});
	/*buildCmd.option ("--helm-chart", "Build a Kubernetes Helm Chart from the given HotSite.json.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.kubernetes = true;
		});*/
	buildCmd.option ("--output", "The directory path to place all files.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			builder.outputDir = arg;
		});

	return (buildCmd);
}

/**
 * Handle create commands.
 */
async function handleCreateCommands (): Promise<commander.Command>
{
	let creator: HotCreator = null;
	let createHotCreator = () =>
		{
			if (creator == null)
				creator = new HotCreator (processor.logger);
		};

	let copyLibrariesPath: string = "";
	const createCmd: commander.Command = new commander.Command ("create");
	createCmd.description (`Create a new project.`);
	createCmd.action (async (cmdr: any, args: string) =>
		{
			createHotCreator ();

			if (copyLibrariesPath !== "")
			{
				await creator.copyLibraries (copyLibrariesPath);

				return;
			}

			if (args == null)
				throw new Error (`You must supply an npm compatible project name!`);

			if (args.length < 1)
				throw new Error (`You must supply an npm compatible project name!`);

			const name: string = args[0];

			creator.name = name;
			creator.outputDir = ppath.normalize (`${process.cwd ()}/${name}/`);

			await creator.create ();
		});

	createCmd.option (`--copy-libraries-to-location <path>`, 
		`Copy the latest HotStaq libraries to a specified location. This will not generate any projects.`, 
		(path: string, previous: any) =>
		{
			createHotCreator ();
			copyLibrariesPath = path;
		}, "");
	createCmd.option (`--type <type>`, 
		`The type of app to create. Can be (web, web-api, api)`, 
		(type: string, previous: any) =>
		{
			createHotCreator ();
			creator.type = type;
		}, "web-api");
	createCmd.option (`--code <language>`, 
		`Set the type of code output. Can be (ts, js) Default: ts`, 
		(language: string, previous: any) =>
		{
			createHotCreator ();
			creator.language = language;
		}, "ts");
	createCmd.option (`--output <path>`, 
		`The directory path to place all the files.`, 
		(path: string, previous: any) =>
		{
			createHotCreator ();
			creator.outputDir = path;
		}, "");
	createCmd.option (`--overwrite-cmd-create-init <value>`, 
		`Overwrite the create command for initalizing an app.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.createCommands.init = value;
		}, "");
	createCmd.option (`--overwrite-cmd-create-transpile <value>`, 
		`Overwrite the create command for transpiling.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.createCommands.transpileTS = value;
		}, "");
	createCmd.option (`--overwrite-cmd-npm-build-web-api <value>`, 
		`Overwrite the npm command for building the web api.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.npmCommands.buildWebAPI = value;
		}, "");
	createCmd.option (`--overwrite-cmd-npm-build-web-api-debug <value>`, 
		`Overwrite the npm command for building the debug script for web api.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.npmCommands.buildWebAPIDebug = value;
		}, "");
	createCmd.option (`--overwrite-cmd-npm-dev <value>`, 
		`Overwrite the npm command for building the development script.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.npmCommands.dev = value;
		}, "");
	createCmd.option (`--overwrite-cmd-npm-start <value>`, 
		`Overwrite the npm command for the start script.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.npmCommands.start = value;
		}, "");
	createCmd.option (`--overwrite-cmd-npm-test <value>`, 
		`Overwrite the npm command for the test script.`, 
		(value: string, previous: any) =>
		{
			createHotCreator ();
			creator.npmCommands.test = value;
		}, "");

	return (createCmd);
}

/**
 * Load the APIs from the processor.
 */
function loadAPIs (processor: HotStaq): { [name: string]: APItoLoad; }
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
 * Handle run commands.
 * 
 * @param cmdName The name of the command to use. Can be:
 * * run
 * * start
 */
async function handleRunCommands (cmdName: string): Promise<commander.Command>
{
	let webServer: HotHTTPServer = new HotHTTPServer (processor);
	let apiServer: HotHTTPServer = new HotHTTPServer (processor);
	let testerSettings: {
			tester: string;
			address: string;
			browser: string;
			openDevTools: boolean;
			headless: boolean;
			remoteServer: string;
			http: number;
			https: number;
	 	} = {
			tester: "HotTesterMochaSelenium",
			address: "127.0.0.1",
			browser: "chrome",
			openDevTools: false,
			headless: false,
			remoteServer: "",
			http: 8182,
			https: 4143
		};
	let apis: { [name: string]: APItoLoad; } = {};
	let dbinfo: HotDBConnectionInterface = null;
	let setupDB = () =>
		{
			if (dbinfo != null)
				return;

			dbinfo = {
				"type": process.env["DATABASE_TYPE"] || "mysql",
				"server": process.env["DATABASE_SERVER"] || "127.0.0.1",
				"username": process.env["DATABASE_USERNAME"] || "",
				"password": process.env["DATABASE_PASSWORD"] || "",
				"org": process.env["DATABASE_ORG"] || "",
				"token": process.env["DATABASE_TOKEN"] || "",
				"port": 3306,
				"database": process.env["DATABASE_SCHEMA"] || ""
			};

			if (process.env["DATABASE_PORT"] != null)
			{
				try
				{
					dbinfo.port = parseInt (process.env["DATABASE_PORT"]);
				}
				catch (ex)
				{
					throw new Error (`Unable to parse db port ${process.env["DATABASE_PORT"]}`);
				}
			}
		};

	let serverType: string = "web";
	let globalApi: string = "";
	let baseWebUrl: string = "";
	let baseAPIUrl: string = "";
	let runWebTestMap: boolean = false;
	let runAPITestMap: boolean = false;
	let listAPIRoutes: boolean = false;
	let disableFileLoading: boolean = false;
	let skipSecretFiles: boolean = true;

	const runCmd: commander.Command = new commander.Command (cmdName);
	runCmd.description (`Run commands.`);
	runCmd.action (async () =>
		{
			let runWebServer: boolean = false;
			let runAPIServer: boolean = false;
			let testerServer: HotTesterServer = null;

			if (processor.mode === DeveloperMode.Development)
			{
				let serverStarter = await HotTesterServer.startServer (
					`http://${testerSettings.address}:${testerSettings.http}`, testerSettings.http, testerSettings.https, processor);
				testerServer = serverStarter.server;
	
				if (globalLogLevel != null)
					testerServer.logger.logLevel = globalLogLevel;

				let tester: HotTester = null;

				if (testerSettings.tester === "HotTesterMocha")
				{
					let mochaTester: HotTesterMocha = new HotTesterMocha (
									processor, "HotTesterMocha", baseWebUrl, null);
					tester = mochaTester;
				}

				if (testerSettings.tester === "HotTesterMochaSelenium")
				{
					let mochaSeleniumTester: HotTesterMochaSelenium = new HotTesterMochaSelenium (
									processor, "HotTesterMochaSelenium", baseWebUrl);
					mochaSeleniumTester.driver.browser = testerSettings.browser;
					mochaSeleniumTester.driver.openDevTools = testerSettings.openDevTools;
					mochaSeleniumTester.driver.headless = testerSettings.headless;
					mochaSeleniumTester.driver.remoteServer = testerSettings.remoteServer;
					tester = mochaSeleniumTester;
				}

				testerServer.addTester (tester);
			}

			if (hotsitePath !== "")
			{
				await processor.loadHotSite (hotsitePath);

				if (disableFileLoading === true)
					processor.hotSite.disableFileLoading = disableFileLoading;

				if (skipSecretFiles === false)
				{
					if (processor.hotSite.server == null)
						processor.hotSite.server = {};

					processor.hotSite.server.serveSecretFiles = true;
				}

				if (processor.hotSite.server == null)
					processor.hotSite.server = {};

				if (processor.hotSite.server.ports == null)
					processor.hotSite.server.ports = {};

				if (webServer != null)
				{
					if (processor.hotSite.server.ports.http == null)
						processor.hotSite.server.ports.http = webServer.ports.http;

					if (processor.hotSite.server.ports.https == null)
						processor.hotSite.server.ports.https = webServer.ports.https;
				}

				if (apiServer != null)
				{
					if (processor.hotSite.server.ports.apiHttp == null)
						processor.hotSite.server.ports.apiHttp = apiServer.ports.http;

					if (processor.hotSite.server.ports.apiHttps == null)
						processor.hotSite.server.ports.apiHttps = apiServer.ports.https;
				}

				// Go through each API and replace the base url with the base url set in the cli.
				if (processor.hotSite.apis != null)
				{
					for (let key in processor.hotSite.apis)
					{
						let tempApi = processor.hotSite.apis[key];
						tempApi.url = baseAPIUrl;
					}
				}

				await processor.processHotSite ();
				apis = loadAPIs (processor);
			}

			// Setup the DB if it hasn't already been setup.
			if (process.env["DATABASE_TYPE"] != null)
			{
				setupDB ();
				dbinfo.type = process.env["DATABASE_TYPE"];
			}

			if (process.env["DATABASE_SERVER"] != null)
			{
				setupDB ();
				dbinfo.server = process.env["DATABASE_SERVER"];
			}

			if (process.env["DATABASE_USERNAME"] != null)
			{
				setupDB ();
				dbinfo.username = process.env["DATABASE_USERNAME"];
			}

			if (process.env["DATABASE_PASSWORD"] != null)
			{
				setupDB ();
				dbinfo.password = process.env["DATABASE_PASSWORD"];
			}

			if (process.env["DATABASE_ORG"] != null)
			{
				setupDB ();
				dbinfo.org = process.env["DATABASE_ORG"];
			}

			if (process.env["DATABASE_TOKEN"] != null)
			{
				setupDB ();
				dbinfo.token = process.env["DATABASE_TOKEN"];
			}

			if (process.env["DATABASE_PORT"] != null)
			{
				setupDB ();

				try
				{
					dbinfo.port = parseInt (process.env["DATABASE_PORT"]);
				}
				catch (ex)
				{
					throw new Error (`Unable to parse db port ${process.env["DATABASE_PORT"]}`);
				}
			}

			if (process.env["DATABASE_SCHEMA"] != null)
			{
				setupDB ();
				dbinfo.database = process.env["DATABASE_SCHEMA"];
			}

			if (baseWebUrl === "")
			{
				let foundBaseUrl: string = HotStaq.getValueFromHotSiteObj (processor.hotSite, ["server", "url"]);
	
				if (foundBaseUrl != null)
					baseWebUrl = foundBaseUrl;
			}

			if (baseWebUrl === "")
				baseWebUrl = `http://127.0.0.1:${webServer.ports.http}`;

			if ((serverType === "web") || (serverType === "web-api"))
			{
				if (processor.hotSite != null)
				{
					if (processor.hotSite.server != null)
						processor.hotSite.server.url = baseWebUrl;
				}

				runWebServer = true;
			}

			if (globalApi !== "")
				processor.hotSite.server.globalApi = globalApi;

			if ((serverType === "api") || (serverType === "web-api"))
				runAPIServer = true;

			/// @fixme Allow for multiple APIs to be loaded, and have their 
			/// servers start in the future.
			let getBaseUrlFromHotSite = (loadAPI: APItoLoad, baseUrl: string = ""): string =>
				{
					let foundAPIUrl: string = baseUrl;

					// Attempt to find the base url from the HotSite's API.
					if (processor.hotSite != null)
					{
						if (processor.hotSite.apis != null)
						{
							for (let key in processor.hotSite.apis)
							{
								let tempAPI = processor.hotSite.apis[key];

								if (tempAPI.apiName != null)
								{
									if (tempAPI.apiName === loadAPI.exportedClassName)
									{
										if (tempAPI.url != null)
											foundAPIUrl = tempAPI.url;

										break;
									}
								}
							}
						}
					}

					return (foundAPIUrl);
				};

			let loadAPIServer = async (serverType: string, server: HotHTTPServer) =>
				{
					if (Object.keys (apis).length < 1)
						throw new Error (`No APIs are loaded! Try using --api-load`);
	
					for (let key in apis)
					{
						let loadAPI: APItoLoad = apis[key];
	
						if (baseAPIUrl === "")
							baseAPIUrl = getBaseUrlFromHotSite (loadAPI);
	
						if (baseAPIUrl === "")
							baseAPIUrl = `http://127.0.0.1:${server.ports.http}`;
	
						// Only run the api server.
						await startAPIServer (server, loadAPI, baseAPIUrl, dbinfo, true);
	
						if (globalLogLevel != null)
							server.logger.logLevel = globalLogLevel;
	
						server.serverType = serverType;
					}
				};
			let listenOnAPIServer = async (server: HotHTTPServer) =>
				{
					if (Object.keys (apis).length < 1)
						throw new Error (`No APIs are loaded! Try using --api-load`);
	
					await server.listen ();
				};
			let loadAndStartAPIServer = async (serverType: string, server: HotHTTPServer) =>
				{
					await loadAPIServer (serverType, server);
					await listenOnAPIServer (server);
				};

			if (serverType === "api")
				await loadAndStartAPIServer ("API Server", apiServer);

			if (runWebServer === true)
			{
				if (runAPIServer === true)
					await loadAPIServer ("Web-API Server", webServer);
				else
					webServer.serverType = "Web Server";

				if (globalLogLevel != null)
					webServer.logger.logLevel = globalLogLevel;

				await webServer.listen ();
			}

			if (listAPIRoutes === true)
			{
				let servers = [apiServer, testerServer];

				for (let iIdx = 0; iIdx < servers.length; iIdx++)
				{
					let server = servers[iIdx];

					if (server == null)
						continue;

					if (server.api == null)
						continue;

					for (let key2 in server.api.routes)
					{
						let route: HotRoute = server.api.routes[key2];
						let routeName: string = route.route;

						for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
						{
							let method: HotRouteMethod = route.methods[iJdx];
							let methodName: string = method.name;
							let path: string = `/${route.version}/${routeName}/${methodName}`;

							server.logger.info (`Route ${method.type.toString ()}: ${path}`);
						}
					}
				}
			}

			if (runWebTestMap === true)
			{
				if (testerServer == null)
					throw new Error (`Unable to execute tests! Is --development-mode missing?`);

				if (serverType === "api")
					throw new Error (`In order to execute web tests, you must set the server type to either web or web-api.`);

				await testerServer.executeAllWebTests (testerSettings.tester);
			}

			if (runAPITestMap === true)
			{
				if (testerServer == null)
					throw new Error (`Unable to execute tests! Is --development-mode missing?`);

				if (serverType === "web")
					throw new Error (`In order to execute API tests, you must set the server type to either api or web-api.`);

				await testerServer.executeAllAPITests (testerSettings.tester);
			}
		});

	runCmd.option (`--list-api-routes`, 
		`List the available API routes on startup.`, 
		(arg: string, previous: any) =>
		{
			listAPIRoutes = true;
		});
	runCmd.option (`--disable-file-loading`, 
		`Disable file caching and loading.`, 
		(arg: string, previous: any) =>
		{
			disableFileLoading = true;
		});
	runCmd.option (`--serve-secret-files`, 
		`Forces secret files to be served. NOT RECOMMENDED.`, 
		(arg: string, previous: any) =>
		{
			skipSecretFiles = false;
		});
	runCmd.option (`--tester-http-port <port>`, 
		`Set the tester HTTP port`, 
		(port: string, previous: any) =>
		{
			try
			{
				const tempPort: number = parseInt (port);

				testerSettings.http = tempPort;
			}
			catch (ex)
			{
				processor.logger.error (`Unable to parse tester http port ${port}`);
			}
		}, testerSettings.http);
	runCmd.option (`--tester-https-port <port>`, 
		`Set the tester HTTPS port`, 
		(port: string, previous: any) =>
		{
			if (port == null)
				return;

			if (port === "")
				return;

			try
			{
				const tempPort: number = parseInt (port);

				testerSettings.https = tempPort;
			}
			catch (ex)
			{
				processor.logger.error (`Unable to parse tester https port ${port}`);
			}
		}, testerSettings.https);
	runCmd.option (`--tester-type <tester>`, 
		`Set the tester to use. Can be: HotTesterMocha,HotTesterMochaSelenium`, 
		(tester: string, previous: any) =>
		{
			testerSettings.tester = tester;
		}, "HotTesterMochaSelenium");
	runCmd.option (`--tester-address <address>`, 
		`Set the tester address to listen on.`, 
		(address: string, previous: any) =>
		{
			testerSettings.address = address;
		}, "127.0.0.1");
	runCmd.option (`--tester-browser <browser>`, 
		`Set the tester browser to use. Can only be used with tester type: HotTesterMochaSelenium`, 
		(browser: string, previous: any) =>
		{
			testerSettings.browser = browser;
		}, "chrome");
	runCmd.option (`--tester-open-dev-tools`, 
		`Open the browsers dev tools on start. Can only be used with tester type: HotTesterMochaSelenium`, 
		(value: string, previous: any) =>
		{
			testerSettings.openDevTools = true;
		}, "false");
	runCmd.option (`--tester-headless`, 
		`Make the browser headless. Can only be used with tester type: HotTesterMochaSelenium`, 
		(value: string, previous: any) =>
		{
			testerSettings.headless = true;
		}, "false");
	runCmd.option (`--tester-remote-server <remote_server>`, 
		`Set the remote Selenium server to use for testing. Can only be used with tester type: HotTesterMochaSelenium`, 
		(remoteServer: string, previous: any) =>
		{
			testerSettings.remoteServer = remoteServer;
		}, "");

	const serverTypes: string[] = ["web", "api"];

	for (let iIdx = 0; iIdx < serverTypes.length; iIdx++)
	{
		let currentServerType: string = serverTypes[iIdx];
		let httpPort: number = 80;
		let httpsPort: number = 443;

		if (currentServerType === "api")
		{
			httpPort = 81;
			httpsPort = 444;
		}

		runCmd.option (`--${currentServerType}-base-url <url>`, 
			`Set the base ${currentServerType} server url.`, 
			(url: string, previous: any) =>
			{
				if (currentServerType === "web")
					baseWebUrl = url;
				else
					baseAPIUrl = url;
			}, "");
		runCmd.option (`--${currentServerType}-http-port <port>`, 
			`Set the ${currentServerType} HTTP port`, 
			(port: string, previous: any) =>
			{
				try
				{
					const tempPort: number = parseInt (port);

					if (currentServerType === "web")
						webServer.ports.http = tempPort;
					else
						apiServer.ports.http = tempPort;
				}
				catch (ex)
				{
					processor.logger.error (`Unable to parse ${currentServerType} http port ${port}`);
				}
			}, httpPort);
		runCmd.option (`--${currentServerType}-https-port [port]`, 
			`Set the ${currentServerType} HTTPS port`, 
			(port: string, previous: any) =>
			{
				if (port == null)
					return;

				if (port === "")
					return;

				try
				{
					const tempPort: number = parseInt (port);

					if (currentServerType === "web")
						webServer.ports.https = tempPort;
					else
						apiServer.ports.https = tempPort;
				}
				catch (ex)
				{
					processor.logger.error (`Unable to parse ${currentServerType} https port ${port}`);
				}
			}, httpsPort);
		runCmd.option (`--${currentServerType}-dont-redirect-http-to-https`, 
			`Do not redirect ${currentServerType} HTTP traffic to HTTPS`, 
			(port: string, previous: any) =>
			{
				if (currentServerType === "web")
					webServer.redirectHTTPtoHTTPS = false;
				else
					apiServer.redirectHTTPtoHTTPS = false;
			});
		runCmd.option (`--${currentServerType}-listen-address <address>`, 
			`Set the ${currentServerType} listen address`, 
			(address: string, previous: any) =>
			{
				if (currentServerType === "web")
					webServer.listenAddress = address;
				else
					apiServer.listenAddress = address;
			}, "0.0.0.0");
		runCmd.option (`--${currentServerType}-ssl-cert <path>`, 
			`Set the path to the SSL cert for the ${currentServerType} server`, 
			(cert: string, previous: any) =>
			{
				if (currentServerType === "web")
					webServer.ssl.cert = cert;
				else
					apiServer.ssl.cert = cert;
			}, "");
		runCmd.option (`--${currentServerType}-ssl-key <path>`, 
			`Set the path to the SSL key for the ${currentServerType} server`, 
			(key: string, previous: any) =>
			{
				if (currentServerType === "web")
					webServer.ssl.key = key;
				else
					apiServer.ssl.key = key;
			}, "");
		runCmd.option (`--${currentServerType}-ssl-ca <path>`, 
			`Set the path to the SSL CA for the ${currentServerType} server`, 
			(ca: string, previous: any) =>
			{
				if (currentServerType === "web")
					webServer.ssl.ca = ca;
				else
					apiServer.ssl.ca = ca;
			}, "");
		runCmd.option (`--${currentServerType}-log-level <level>`, 
			`Set the logging level for the ${currentServerType} server. Can be (info,warning,error,all,none)`, 
			(logLevel: string, previous: any) =>
			{
				let tempServer: HotHTTPServer = null;

				if (logLevel === "")
					return;

				if (currentServerType === "web")
					tempServer = webServer;
				else
					tempServer = apiServer;

				if (logLevel === "info")
					tempServer.logger.logLevel = HotLogLevel.Info;

				if (logLevel === "warning")
					tempServer.logger.logLevel = HotLogLevel.Warning;

				if (logLevel === "error")
					tempServer.logger.logLevel = HotLogLevel.Error;

				if (logLevel === "verbose")
					tempServer.logger.logLevel = HotLogLevel.Verbose;

				if (logLevel === "all")
					tempServer.logger.logLevel = HotLogLevel.All;

				if (logLevel === "none")
					tempServer.logger.logLevel = HotLogLevel.None;
			}, "");
		runCmd.option (`--${currentServerType}-test`, 
			`Execute all tests specified in HotSite.json. Must be used with --development-mode.`, 
			(map: string, previous: any) =>
			{
				if (currentServerType === "web")
					runWebTestMap = true;
				else
					runAPITestMap = true;
			});

		if (currentServerType === "web")
		{
			runCmd.option (`--${currentServerType}-route <route_and_path>`, 
				`Add a static route in "key=path" format. Example: --${currentServerType}-route "/=/var/www"`, 
				(routeAndPath: string, previous: any) =>
				{
					let keyValuePair = getKeyValuePair (routeAndPath);
					const route: string = keyValuePair.key;
					const path: string = keyValuePair.value;

					webServer.addStaticRoute (route, path);
				});
			runCmd.option (`--${currentServerType}-serve-file-extensions`, "Serve files extensions, must be passed as a JSON array.", 
				(arg: string, previous: any) =>
				{
					webServer.serveFileExtensions = JSON.parse (arg);
				}, JSON.stringify (HotHTTPServer.getDefaultServableExtensions ()));
			runCmd.option (`--${currentServerType}-js-url <url>`, "The url to the HotStaq JS", 
				(url: string, previous: any) =>
				{
					webServer.hottFilesAssociatedInfo.jsSrcPath = url;
				});
		}

		if (currentServerType === "api")
		{
			runCmd.option (`--${currentServerType}-load <exported_name_and_path>`,
				`Load an API for use in "exported_name=path_to_js_file" format. Example: --${currentServerType}-load "FreeLightAPI=/app/FreeLight/build/src/FreeLightAPI.js"`,
				(exported_name_and_path: string, previous: any) =>
				{
					let keyValuePair = getKeyValuePair (exported_name_and_path);
					const exportedClassName: string = keyValuePair.key;
					const path: string = keyValuePair.value;

					apis[exportedClassName] = { exportedClassName: exportedClassName, path: path };
				});
		}
	}

	runCmd.option (`--server-type <type>`, 
		`Set the type of server. Can be (web, api, web-api)`, 
		(type: string, previous: any) =>
		{
			serverType = type;
		}, "web");
	runCmd.option (`--global-api <api_name>`, 
		`Set the global api to be used across all pages.`, 
		(api_name: string, previous: any) =>
		{
			globalApi = api_name;
		}, "");
	runCmd.option ("--db-type <type>", "The type of database to use. Can be (none, mysql, influx)", 
		(type: string, previous: any) =>
		{
			setupDB ();
			dbinfo.type = type;
		}, "mysql");
	runCmd.option ("--db-server <address>", "The address to the database", 
		(address: string, previous: any) =>
		{
			setupDB ();
			dbinfo.server = address;
		}, "127.0.0.1");
	runCmd.option ("--db-username <username>", "The database's username", 
		(username: string, previous: any) =>
		{
			setupDB ();
			dbinfo.username = username;
		});
	runCmd.option ("--db-password <password>", "The database's password. This is insecure to use on the command line!", 
		(password: string, previous: any) =>
		{
			setupDB ();
			dbinfo.password = password;
		});
	runCmd.option ("--db-port <port>", "The database's port", 
		(port: string, previous: any) =>
		{
			setupDB ();

			try
			{
				dbinfo.port = parseInt (port);
			}
			catch (ex)
			{
				processor.logger.error (`Unable to parse db port ${port}`);
			}
		}, "3306");
	runCmd.option ("--db-database <schema>", "The database's schema to select", 
		(schema: string, previous: any) =>
		{
			setupDB ();
			dbinfo.database = schema;
		});

	return (runCmd);
}

/**
 * Handle any agent commands.
 */
async function handleAgentCommands (): Promise<commander.Command>
{
	let baseAPIUrl: string = "";
	let agentKey: string = "";
	let agentSecret: string = "";
	let commands: { [name: string]: string } = {};
	let listenAddr: string = "0.0.0.0";
	let port: number = 5468;

	const agentCmd: commander.Command = new commander.Command ("agent");
	agentCmd.description (`Listen for commands on a port.`);
	agentCmd.action (async () =>
		{
			let processor: HotStaq = new HotStaq ();
			processor.logger.logLevel = HotLogLevel.Verbose;
		
			let apiServer: HotHTTPServer = new HotHTTPServer (processor);
			let api: HotAgentAPI = new HotAgentAPI (baseAPIUrl, apiServer);
			api.key = agentKey;
			api.secret = agentSecret;
			apiServer.listenAddress = listenAddr;
			apiServer.ports.http = port;
			apiServer.processor.api = api;
			apiServer.api = api;
			await apiServer.setAPI (api);

			await apiServer.listen ();
		});

	agentCmd.option ("--base-api-url <value>", "The key that must be given in order to execute the commands.", 
		(value: string, previous: any) =>
		{
			baseAPIUrl = value;
		});
	agentCmd.option ("--key <key>", "The key that must be given in order to execute the commands.", 
		(value: string, previous: any) =>
		{
			agentKey = value;
		});
	agentCmd.option ("--secret <secret>", "The secret key that must be given in order to execute the commands.", 
		(value: string, previous: any) =>
		{
			agentSecret = value;
		});
	agentCmd.option ("--file <key_filepath>", "The key and the associated NodeJS file to execute (key=path).", 
		(value: string, previous: any) =>
		{
			let key: string = "";
			let filepath: string = "";
			let pos: number = key.indexOf ("=");

			if (pos < 0)
				throw new Error (`key_filepath must be in the format (key=path)`);

			key = value.substr (0, pos);
			filepath = value.substr (pos + 1);

			commands[key] = filepath;
		});
	agentCmd.option ("--listen-addr <addr>", "The address to listen on.", 
		(value: string, previous: any) =>
		{
			listenAddr = value;
		});
	agentCmd.option ("--listen-port <port>", "The port to listen on.", 
		(value: string, previous: any) =>
		{
			try
			{
				port = parseInt (value);
			}
			catch (ex)
			{
				throw new Error (`Unable to parse port ${value}`);
			}
		});

	return (agentCmd);
}

/**
 * Handle any generate commands.
 */
async function handleGenerateCommands (): Promise<commander.Command>
{
	let generator: HotGenerator = null;
	let generateType: string = "api";
	let createHotBuilder = () =>
		{
			if (generator == null)
				generator = new HotGenerator (processor.logger);
		};

	const generateCmd: commander.Command = new commander.Command ("generate");
	generateCmd.description (`API Generation commands.`);
	generateCmd.action (async () =>
		{
			createHotBuilder ();

			if (hotsitePath === "")
				throw new Error (`When building, you must specify a HotSite.json!`);

			let apis: { [name: string]: APItoLoad; } = {};

			if (hotsitePath !== "")
			{
				await processor.loadHotSite (hotsitePath);
				await processor.processHotSite ();
				apis = loadAPIs (processor);
			}

			generator.hotsites = [processor.hotSite];

			if (generateType === "api")
				await generator.generateAPI (processor, apis);

			if (generateType === "api-documentation")
				await generator.generateAPIDocumentation (processor, apis);
		});

	generateCmd.option ("--api", "Generate an API to use.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generateType = "api";
		});
	generateCmd.option ("--api-documentation", "Generate API documentation to use.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generateType = "api-documentation";
		});
	generateCmd.option ("--tsconfig <path>", "Specify the tsconfig.json file to use.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generator.tsconfigPath = arg;
		});
	generateCmd.option ("--webpack-config <path>", "Specify the webpack config javascript file to use.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generator.webpackConfigPath = arg;
		});
	generateCmd.option ("--optimize", "Optimize the compiled JavaScript using the Google Closure Compiler.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generator.optimizeJS = true;
		});
	generateCmd.option ("--generate-type <type>", "The type of output to generate. Can be: javascript,openapi-3.0.0-json,openapi-3.0.0-yaml", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generator.generateType = arg;
		});
	generateCmd.option ("--output <path>", "The directory path to place all files.", 
		(arg: string, previous: any) =>
		{
			createHotBuilder ();
			generator.outputDir = arg;
		});

	return (generateCmd);
}

/**
 * Check if the path exists.
 */
function checkIfPathExists (path: string): boolean
{
	if (fs.existsSync (path) === true)
		return (true);

	return (false);
}

/**
 * Start the CLI app.
 */
async function start ()
{
	try
	{
		let packagePath: string = ppath.normalize (`${__dirname}/../../package.json`);

		if (checkIfPathExists (packagePath) === false)
		{
			packagePath = ppath.normalize (`${process.cwd ()}/package.json`);

			if (checkIfPathExists (packagePath) === false)
			{
				console.error (`Unable to find path to HotStaq!`);

				return;
			}
		}

		let packageJSON: any = JSON.parse (fs.readFileSync (packagePath).toString ());
		VERSION = packageJSON.version;

		const program: commander.Command = new commander.Command ("hotstaq");

		program.description (`Copyright(c) 2022, FreeLight, Inc. Under the MIT License.`);
		let command: commander.Command = program.version (VERSION);

		let hotsiteExists: boolean = false;
		let foundHotsitePath: string = "";

		if (checkIfPathExists ("./HotSite.json") === true)
		{
			hotsiteExists = true;
			foundHotsitePath = ppath.normalize ("./HotSite.json");
		}

		if (hotsiteExists === false)
		{
			if (checkIfPathExists ("./hotsite.json") === true)
			{
				hotsiteExists = true;
				foundHotsitePath = ppath.normalize ("./hotsite.json");
			}
		}

		if (hotsiteExists === false)
		{
			if (checkIfPathExists ("./HOTSITE.json") === true)
			{
				hotsiteExists = true;
				foundHotsitePath = ppath.normalize ("./HOTSITE.json");
			}
		}

		if (hotsiteExists === true)
			hotsitePath = foundHotsitePath;

		command.option ("--cwd <path>", "Set the current working directory to use.", 
			(path: string, previous: any) =>
			{
				process.chdir (path);
			});
		command.option ("-o, --hotsite <path>", "Specify the HotSite.json to use. This will look in the current directory to find one first.", 
			(path: string, previous: any) =>
			{
				hotsitePath = path;
			}, foundHotsitePath);
		command.option ("--not-hot", "Do not use a HotSite.json.", 
			(path: string, previous: any) =>
			{
				hotsitePath = "";
			});
		command.option ("--verbose", "Set the logging level to verbose.", 
			(logLevel: string, previous: any) =>
			{
				globalLogLevel = HotLogLevel.Verbose;
			});
		command.option ("-l, --log-level <level>", "Set the logging level. Can be (info,warning,error,all,none)", 
			(logLevel: string, previous: any) =>
			{
				if (logLevel === "info")
					globalLogLevel = HotLogLevel.Info;

				if (logLevel === "warning")
					globalLogLevel = HotLogLevel.Warning;

				if (logLevel === "error")
					globalLogLevel = HotLogLevel.Error;

				if (logLevel === "verbose")
					globalLogLevel = HotLogLevel.Verbose;

				if (logLevel === "all")
					globalLogLevel = HotLogLevel.All;

				if (logLevel === "none")
					globalLogLevel = HotLogLevel.None;
			}, "all");
		command.option ("--dev, --development-mode", "Set to execute in development mode. This will allow for testing data to be collected and executed", 
			(value: string, previous: any) =>
			{
				processor.mode = DeveloperMode.Development;
			});

		let createCmd: commander.Command = await handleCreateCommands ();
		command.addCommand (createCmd);

		let runCmd: commander.Command = await handleRunCommands ("run");
		command.addCommand (runCmd);

		runCmd = await handleRunCommands ("start");
		command.addCommand (runCmd);

		let buildCmd: commander.Command = await handleBuildCommands ();
		command.addCommand (buildCmd);

		let generateCmd: commander.Command = await handleGenerateCommands ();
		command.addCommand (generateCmd);

		let agentCmd: commander.Command = await handleAgentCommands ();
		command.addCommand (agentCmd);

		if (process.argv.length > 2)
			program.parse (process.argv);
	}
	catch (ex)
	{
		processor.logger.error (ex.stack);
	}
}

start ();