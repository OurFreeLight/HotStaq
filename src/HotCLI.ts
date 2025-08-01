import * as ppath from "path";
import * as fs from "fs";

import * as dotenv from "dotenv";
import * as commander from "commander";
import fetch from "node-fetch";
import { Headers } from "node-fetch";

import { HotStaq } from "./HotStaq";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotLogLevel } from "./HotLog";
import { DeveloperMode } from "./Hot";
import { HotTesterServer } from "./HotTesterServer";
import { HotBuilder, ModuleBuildOptions } from "./HotBuilder";
import { HotGenerator } from "./HotGenerator";
import { HotCreator } from "./HotCreator";
import { HotDBConnectionInterface } from "./HotDBConnectionInterface";
import { APItoLoad, HotAPI } from "./HotAPI";
import { HotTesterMochaSelenium } from "./HotTesterMochaSelenium";
import { HotDBMySQL } from "./schemas/HotDBMySQL";
import { HotDBInflux } from "./schemas/HotDBInflux";
import { HotDBPostgres } from "./schemas/HotDBPostgres";
import { HotIO } from "./HotIO";
import { HotAgentAPI } from "./HotAgentAPI";
import { HotTester } from "./HotTester";
import { HotTesterMocha } from "./HotTesterMocha";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod } from "./HotRouteMethod";
import { HotServerType } from "./HotServer";
import { HotDeployer } from "./HotDeployer";
import { HotDBType } from "./HotDB";

HotStaq.isWeb = false;

/**
 * The CLI that executes HotStaq.
 */
export class HotCLI
{
	/**
	 * The name of this CLI application.
	 * 
	 * Default: hotstaq
	 */
	name: string;
	/**
	 * The description of this CLI application.
	 * 
	 * Default: hotstaq
	 */
	description: string;
	/**
	 * The commander program that parses the cli arguments.
	 */
	program: commander.Command;
	/**
	 * The current HotStaq version.
	 */
	VERSION: string;
	/**
	 * The path to the package.json file.
	 */
	packagePath: string;
	/**
	 * The HotStaq processor.
	 */
	processor: HotStaq;
	/**
	 * The path to the .env file to use.
	 */
	envFile: string;
	/**
	 * The path to the Hotsite JSON to parse.
	 */
	hotsitePath: string;
	/**
	 * If set, the global log level to use.
	 */
	globalLogLevel: HotLogLevel;
	/**
	 * If using the CLI for a creator, you can adjust the settings here.
	 */
	creator: HotCreator;
	/**
	 * The APIs to load for the API server.
	 */
	apis: { [name: string]: APItoLoad; };
	/**
	 * The server to start.
	 */
	servers: {
		/**
		 * The web server.
		 */
		web: HotHTTPServer;
		/**
		 * The api server.
		 */
		api: HotHTTPServer;
		/**
		 * The agent server.
		 */
		agent: HotHTTPServer;
	};
	/**
	 * The module install action to execute.
	 */
	onModuleInstallAction: () => Promise<void>;
	/**
	 * The module build action to execute.
	 */
	onModuleBuildAction: () => Promise<void>;
	/**
	 * The create action to execute.
	 */
	onCreateAction: () => Promise<void>;
	/**
	 * The run action to execute.
	 */
	onRunAction: () => Promise<void>;
	/**
	 * The agent action to execute.
	 */
	onAgentAction: () => Promise<void>;
	/**
	 * The generate action to execute.
	 */
	onGenerateAction: () => Promise<void>;
	/**
	 * The deploy action to execute.
	 */
	onDeployAction: () => Promise<void>;
	/**
	 * The build action to execute.
	 */
	onBuildAction: () => Promise<void>;
	/**
	 * The healthcheck action to execute.
	 */
	onHealthcheckAction: () => Promise<void>;

	constructor ()
	{
		this.name = "hotstaq";
		this.description = `Copyright(c) 2023, FreeLight, Inc. Under the MIT License.`;
		this.program = null;
		this.VERSION = "";
		this.packagePath = ppath.normalize (`${__dirname}/../../package.json`);
		this.processor = new HotStaq ();
		this.processor.logger.logLevel = HotLogLevel.All;
	
		this.envFile = "";
		this.hotsitePath = "";
		this.globalLogLevel = null;
		this.apis = {};
		this.servers = {
			web: null,
			api: null,
			agent: null
		};

		this.creator = null;
		this.onModuleInstallAction = null;
		this.onModuleBuildAction = null;
		this.onCreateAction = null;
		this.onRunAction = null;
		this.onAgentAction = null;
		this.onGenerateAction = null;
		this.onBuildAction = null;
	}

	/**
	 * Start the API server.
	 */
	async startAPIServer (server: HotHTTPServer, loadedAPI: APItoLoad, baseAPIUrl: 
		string, dbinfo: HotDBConnectionInterface, isAPIOnly: boolean): Promise<HotAPI>
	{
		let api: HotAPI = null;

		if (loadedAPI.importedAPIClass == null)
		{
			let foundModulePath: string = require.resolve (loadedAPI.path, { paths: [process.cwd ()] });

			server.logger.verbose (`Loading API JavaScript from: ${foundModulePath}`);

			let apiJS = require (foundModulePath);
			let apiClass: any = apiJS[loadedAPI.exportedClassName];
			api = new apiClass (baseAPIUrl, server);
			server.logger.verbose (`Loaded API JavaScript from: ${foundModulePath}`);
		}
		else
			api = new loadedAPI.importedAPIClass (baseAPIUrl, server)

		let useDatabase: boolean = true;

		server.logger.info (`Loaded API class: ${loadedAPI.exportedClassName}`);
		server.logger.verbose (`Base API URL: ${baseAPIUrl}`);
		server.logger.verbose (`Server Type Set to: ${server.serverType}`);

		this.processor.api = api;
		server.processor.api = api;
		server.api = api;

		if (server.serverType === "api")
		{
			server.logger.info (`Server is ONLY an API.`);

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

			if ((dbinfo.type === "mysql") || (dbinfo.type === "mariadb"))
				dbClass = HotDBMySQL;

			if (dbinfo.type === "influx")
				dbClass = HotDBInflux;

			if (dbinfo.type === "postgres")
				dbClass = HotDBPostgres;

			if (dbClass == null)
				throw new Error (`Unable to use database type ${dbinfo.type}, no class available.`);

			api.db = new dbClass ();

			if (dbinfo.type === "mariadb")
				api.db.type = HotDBType.MariaDB;

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
	getKeyValuePair (str: string): { key: string; value: string; }
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
	async handleBuildCommands (): Promise<commander.Command>
	{
		let builder: HotBuilder = null;
		let createHotBuilder = () =>
			{
				if (builder == null)
					builder = new HotBuilder (this.processor.logger);
			};

		const buildCmd: commander.Command = new commander.Command ("build");
		buildCmd.description (`Build commands.`);
		buildCmd.action (() =>
			{
				this.onBuildAction = async () =>
				{
					createHotBuilder ();

					if (this.hotsitePath === "")
						throw new Error (`When building, you must specify a HotSite.json!`);

					if (this.hotsitePath !== "")
					{
						await this.processor.loadHotSite (this.hotsitePath);
						await this.processor.processHotSite ();
					}

					builder.hotsites = [this.processor.hotSite];
					await builder.build ();
				};
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
		buildCmd.option ("--docker-namespace", "The namespace to tag the built docker image.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.dockerNamespace = arg;
			});
		buildCmd.option ("--helm", "Build Helm Charts from the given HotSite.json files. THIS IS EXPERIMENTAL AND UNTESTED. GOOD LUCK.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.helmChart = true;
			});
		buildCmd.option ("--hotstaq-version <version>", `Specify the HotStaq version to use. If not specified, the current version of HotStaq will be used to generate the files.`, 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.hotstaqVersion = arg;
			});
		buildCmd.option ("--dont-append-readme", "Do not add the additional docker documentation to the existing README.md.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.appendReadMe = true;
			});
		/*buildCmd.option ("--helm-chart", "Build a Kubernetes Helm Chart from the given HotSite.json.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.kubernetes = true;
			});*/
		buildCmd.option ("--interfaces", "Generates interfaces to what is set with --interfaces-out and generate the specified interfaces that use --interface.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.interfaces = true;
			});
		buildCmd.option ("--interface <interface_name>", "The name of the interface to generate a IHotParameter JSON for.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();

				builder.interfaceConfig.filesToGenerate.push (arg);
			});
		buildCmd.option ("--interfaces-tsconfig <path>", "The path to the tsconfig to load and use.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.interfaceConfig.tsconfigPath = arg;
			});
		buildCmd.option ("--interfaces-out <path>", "The path to output all the generated route parameters to.", 
			(arg: string, previous: any) =>
			{
				createHotBuilder ();
				builder.interfaceConfig.outputDir = arg;
			});
		buildCmd.option ("--output", "The path to place all files.", 
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
	async handleCreateCommands (): Promise<commander.Command>
	{
		let createHotCreator = () =>
			{
				if (this.creator == null)
					this.creator = new HotCreator (this.processor.logger, "");
			};

		let copyLibrariesPath: string = "";
		const createCmd: commander.Command = new commander.Command ("create");
		createCmd.description (`Create a new project.`);
		createCmd.arguments ("<name>");
		createCmd.action ((name: string, cmdr: any) =>
			{
				createHotCreator ();

				this.creator.name = name;

				this.onCreateAction = async () =>
					{
						createHotCreator ();

						if (copyLibrariesPath !== "")
						{
							await this.creator.copyLibraries (copyLibrariesPath);

							return;
						}

						if (this.creator.name == null)
							throw new Error (`You must supply an npm compatible project name!`);

						this.creator.outputDir = ppath.normalize (`${process.cwd ()}/${this.creator.name}/`);

						await this.creator.create ();
					};
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
				this.creator.type = type;
			}, "web-api");
		createCmd.option ("--hotstaq-version <version>", `Specify the HotStaq version to use. The version must be NPM version compatible. If not specified, the current version of HotStaq will be used to generate the files.`, 
			(arg: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.hotstaqVersion = arg;
			});
		createCmd.option (`--code <language>`, 
			`Set the type of code output. Can be (ts, js) Default: ts`, 
			(language: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.language = language;
			}, "ts");
		createCmd.option (`--output <path>`, 
			`The directory path to place all the files.`, 
			(path: string, previous: any) =>
			{
				createHotCreator ();

				if ((path === "") || (path === "."))
					path = process.cwd ();

					this.creator.outputDir = path;
			}, "");
		createCmd.option (`--overwrite-cmd-create-init <value>`, 
			`Overwrite the create command for initalizing an app.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.createCommands.init = value;
			}, "");
		createCmd.option (`--dont-transpile`, 
			`Do not transpile. If this setting is used, it's highly recommended to also use --dont-generate-api as well. Using this setting will set --overwrite-cmd-create-transpile to an empty string.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.createCommands.transpileTS = "";
			}, "");
		createCmd.option (`--overwrite-cmd-create-transpile <value>`, 
			`Overwrite the create command for transpiling.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.createCommands.transpileTS = value;
			}, "");
		createCmd.option (`--dont-generate-api`, 
			`Do not generate the api. This sets --overwrite-cmd-generate-api to an empty string.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.createCommands.generateAPI = "";
			}, "");
		createCmd.option (`--overwrite-cmd-generate-api <value>`, 
			`Overwrite the generate command for generating the client API for use on the web.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.createCommands.generateAPI = value;
			}, "");
		createCmd.option (`--overwrite-cmd-npm-build-web-api <value>`, 
			`Overwrite the npm command for building the web api.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.npmCommands.buildWebAPI = value;
			}, "");
		createCmd.option (`--overwrite-cmd-npm-build-web-api-debug <value>`, 
			`Overwrite the npm command for building the debug script for web api.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.npmCommands.buildWebAPIDebug = value;
			}, "");
		createCmd.option (`--overwrite-cmd-npm-develop <value>`, 
			`Overwrite the npm command for building the development script.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.npmCommands.develop = value;
			}, "");
		createCmd.option (`--overwrite-cmd-npm-start <value>`, 
			`Overwrite the npm command for the start script.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.npmCommands.start = value;
			}, "");
		createCmd.option (`--overwrite-cmd-npm-test <value>`, 
			`Overwrite the npm command for the test script.`, 
			(value: string, previous: any) =>
			{
				createHotCreator ();
				this.creator.npmCommands.test = value;
			}, "");

		return (createCmd);
	}

	/**
	 * Handle module commands.
	 */
	async handleModuleCommands (): Promise<commander.Command>
	{
		const moduleCmd: commander.Command = new commander.Command ("module");
		moduleCmd.description (`Install and build HotStaq modules.`);

		let moduleInstallCmd: commander.Command = await this.handleModuleInstallCommands ();
		moduleCmd.addCommand (moduleInstallCmd);

		let moduleBuildCmd: commander.Command = await this.handleModuleBuildCommands ();
		moduleCmd.addCommand (moduleBuildCmd);

		return (moduleCmd);
	}

	/**
	 * Handle module install commands.
	 */
	async handleModuleInstallCommands (): Promise<commander.Command>
	{
		let installStr: string = "install";
		let outDir: string = "";
		let baseUrl: string = "";
		let cwd: string = process.cwd ();

		const installCmd: commander.Command = new commander.Command ("install");
		installCmd.description (`Install dependencies from NPM.`);
		installCmd.arguments ("<name...>");
		installCmd.action ((names: string[], cmdr: any) =>
			{
				this.onModuleInstallAction = async () =>
					{
						if (this.hotsitePath === "")
							throw new Error (`When installing a dependency, you must specify a HotSite.json!`);
	
						await this.processor.loadHotSite (this.hotsitePath);

						let hotsite = this.processor.hotSite;

						if (hotsite.dependencies == null)
							hotsite.dependencies = { web: {} };

						for (let iIdx = 0; iIdx < names.length; iIdx++)
						{
							let name: string = names[iIdx];
							let realName: string = HotBuilder.getNameFromNPMName (name);

							let buildOptions: ModuleBuildOptions = {
									installType: installStr, 
									name: name,
									processor: this.processor, 
									hotsite: hotsite,
									hotsitePath: this.hotsitePath,
									modulePath: `${cwd}/node_modules/${realName}/`,
									moduleHotsite: `${cwd}/node_modules/${realName}/HotSite`,
									outDir: outDir,
									baseUrl: baseUrl,
									cwd: cwd
								};
							await HotBuilder.installModule (buildOptions);
							await HotBuilder.buildModule (buildOptions);
						}
					};
			});
		installCmd.option (`--out <value>`, 
			`Output the public files into a specific directory.`, 
			(value: string, previous: any) =>
			{
				outDir = value;
			}, `${cwd}/public/hotstaq_modules/MODULE_NAME/`);
		installCmd.option (`--base-url <value>`, 
			`The base url to use when accessing the files from the web. Typically just needs to be a relative directory.`, 
			(value: string, previous: any) =>
			{
				baseUrl = value;
			}, "./hotstaq_modules/MODULE_NAME/");
		installCmd.option (`--use-link`, 
			`Link a module instead of installing it.`, 
			(value: string, previous: any) =>
			{
				installStr = "link";
			}, "");

		return (installCmd);
	}

	/**
	 * Handle module build commands.
	 */
	async handleModuleBuildCommands (): Promise<commander.Command>
	{
		let buildStr: string = "build";
		let baseUrl: string = "";
		let cwd: string = process.cwd ();

		const buildCmd: commander.Command = new commander.Command ("build");
		buildCmd.description (`Build a HotStaq module.`);
		buildCmd.arguments ("[path]");
		buildCmd.action ((buildPath: string, cmdr: any) =>
			{
				this.onModuleBuildAction = async () =>
					{
						let outDir: string = "";

						if (buildPath != null)
						{
							if (buildPath !== "")
								outDir = buildPath;
						}

						if (this.hotsitePath === "")
							throw new Error (`When installing a dependency, you must specify a HotSite.json!`);
	
						await this.processor.loadHotSite (this.hotsitePath);

						let hotsite = this.processor.hotSite;

						if (hotsite.dependencies == null)
							hotsite.dependencies = { web: {} };

						const pkgObjStr: string = await HotIO.readTextFile (`${cwd}/package.json`);
						const pkgObj: any = JSON.parse (pkgObjStr);
						const name: string = pkgObj.name;

						if (hotsite.name !== name)
							this.processor.logger.warning (`WARNING: Hotsite name ${hotsite.name} does not match package.json name ${name}!`);

						let buildOptions: ModuleBuildOptions = {
								buildType: buildStr, 
								name: name,
								processor: this.processor, 
								hotsite: hotsite,
								hotsitePath: this.hotsitePath, 
								modulePath: cwd,
								moduleHotsite: `${cwd}/HotSite`,
								outDir: outDir,
								baseUrl: baseUrl,
								cwd: cwd
							};
						await HotBuilder.buildModule (buildOptions);
					};
			});
		buildCmd.option (`--base-url <value>`, 
			`The base url to use when accessing the files from the web. Typically just needs to be a relative directory.`, 
			(value: string, previous: any) =>
			{
				baseUrl = value;
			}, "./hotstaq_modules/MODULE_NAME/");

		return (buildCmd);
	}

	/**
	 * Load the APIs from the processor.
	 */
	loadAPIs (processor: HotStaq): { [name: string]: APItoLoad; }
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
	 * Handle run commands.
	 * 
	 * @param cmdName The name of the command to use. Can be:
	 * * run
	 * * start
	 */
	async handleRunCommands (cmdName: string): Promise<commander.Command>
	{
		this.servers.web = new HotHTTPServer (this.processor);
		this.servers.api = new HotHTTPServer (this.processor);
		let serverType: string = "web";
		let globalApi: string = "";
		let baseWebUrl: string = "";
		let baseAPIUrl: string = "";
		let runWebTestMap: boolean = false;
		let runAPITestMap: boolean = false;
		let listAPIRoutes: boolean = false;
		let disableFileLoading: boolean = false;
		let skipSecretFiles: boolean = true;
		let dontLoadAPIFiles: boolean = false;
		let swaggerUIFilepath: string = "";
		let swaggerUIRoute: string = "/swagger";
		let errorHandlingResponseCode: number = 500;
		let cors: { origin: string; allowedHeaders: string[] } = {
				origin: "*",
				allowedHeaders: []
			};
		let rateLimiter: { enabled: boolean; windowLength: number; limit: number; 
				store: {
						host?: string;
						port?: number;
						username?: string;
						password?: string;
					}
			} = {
				enabled: null,
				windowLength: 60000,
				limit: 500,
				store: null
			};
		let testerSettings: {
				tester: string;
				address: string;
				timeout: number;
				browser: string;
				openDevTools: boolean;
				disableGPUAndSandbox: boolean;
				disableDevShmUsage: boolean;
				headless: boolean;
				remoteServer: string;
				windowWidth: number;
				windowHeight: number;
				http: number;
				https: number;
				shutdownAfterTests: boolean;
				commandDelay: number;
				deployTester: boolean;
			} = {
				tester: "",
				address: "127.0.0.1",
				timeout: 10000,
				browser: "chrome",
				openDevTools: false,
				disableGPUAndSandbox: false,
				disableDevShmUsage: false,
				headless: false,
				remoteServer: "",
				windowWidth: null,
				windowHeight: null,
				http: 8182,
				https: 4143,
				shutdownAfterTests: true,
				commandDelay: 20,
				deployTester: true
			};
		let dbinfo: HotDBConnectionInterface = null;
		let setupDB = () =>
			{
				if (dbinfo != null)
					return;

				dbinfo = {
					"type": (<HotDBType>(process.env["DATABASE_TYPE"] || "mysql")),
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

		const runCmd: commander.Command = new commander.Command (cmdName);
		runCmd.description (`Run commands.`);
		runCmd.action (() =>
			{
				this.onRunAction = async () =>
				{
					let runWebServer: boolean = false;
					let runAPIServer: boolean = false;
					let testerServer: HotTesterServer = null;
					let tester: HotTester = null;

					if (this.processor.mode === DeveloperMode.Development)
					{
						if (testerSettings.deployTester === true)
						{
							if (baseWebUrl === "")
								baseWebUrl = `http://127.0.0.1:${this.servers.web.ports.http}`;

							let serverStarter = await HotTesterServer.startServer (
								`http://${testerSettings.address}:${testerSettings.http}`, 
								testerSettings.http, testerSettings.https, this.processor);
							testerServer = serverStarter.server;

							if (this.globalLogLevel != null)
								testerServer.logger.logLevel = this.globalLogLevel;

							if (runWebTestMap === true)
							{
								this.servers.web.type = HotServerType.WebTesting;
								this.servers.api.type = HotServerType.WebTesting;
							}

							if (runAPITestMap === true)
							{
								this.servers.web.type = HotServerType.APITesting;
								this.servers.api.type = HotServerType.APITesting;
							}

							if (testerSettings.tester === "")
							{
								if (runWebTestMap === true)
									testerSettings.tester = "HotTesterMochaSelenium";

								if (runAPITestMap === true)
									testerSettings.tester = "HotTesterMocha";
							}

							if (testerSettings.tester === "HotTesterMocha")
							{
								let mochaTester: HotTesterMocha = new HotTesterMocha (
									this.processor, "HotTesterMocha", baseWebUrl);
								tester = mochaTester;
							}

							if (testerSettings.tester === "HotTesterMochaSelenium")
							{
								let mochaSeleniumTester: HotTesterMochaSelenium = new HotTesterMochaSelenium (
									this.processor, "HotTesterMochaSelenium", baseWebUrl);
								mochaSeleniumTester.driver.browser = testerSettings.browser;
								mochaSeleniumTester.driver.openDevTools = testerSettings.openDevTools;
								mochaSeleniumTester.driver.disableGPUAndSandbox = testerSettings.disableGPUAndSandbox;
								mochaSeleniumTester.driver.disableDevShmUsage = testerSettings.disableDevShmUsage;
								mochaSeleniumTester.driver.headless = testerSettings.headless;
								mochaSeleniumTester.driver.remoteServer = testerSettings.remoteServer;

								if ((testerSettings.windowWidth != null) || (testerSettings.windowHeight != null))
								{
									if (mochaSeleniumTester.driver.windowSize == null)
									{
										mochaSeleniumTester.driver.windowSize = {
												width: 1920,
												height: 1080
											};
									}
								}

								if (testerSettings.windowWidth != null)
									mochaSeleniumTester.driver.windowSize.width = testerSettings.windowWidth;

								if (testerSettings.windowHeight != null)
									mochaSeleniumTester.driver.windowSize.height = testerSettings.windowHeight;

								tester = mochaSeleniumTester;
							}

							if (tester != null)
							{
								tester.timeout = testerSettings.timeout;
								tester.driver.commandDelay = testerSettings.commandDelay;

								testerServer.addTester (tester);
								this.processor.addTester (tester);
							}
							else
								this.processor.logger.warning ("Warning: No tester set!");
						}
						else
							this.processor.logger.warning ("No tester being deployed.");

						this.processor.logger.info ("RUNNING IN DEVELOPMENT MODE. DO NOT RUN THIS MODE IN PRODUCTION.");
					}

					if (this.hotsitePath !== "")
					{
						await this.processor.loadHotSite (this.hotsitePath);

						if (disableFileLoading === true)
							this.processor.hotSite.disableFileLoading = disableFileLoading;

						if (skipSecretFiles === false)
						{
							if (this.processor.hotSite.server == null)
								this.processor.hotSite.server = {};

							this.processor.hotSite.server.serveSecretFiles = true;
						}

						if (this.processor.hotSite.server == null)
							this.processor.hotSite.server = {};

						if (this.processor.hotSite.server.ports == null)
							this.processor.hotSite.server.ports = {};

						if (this.servers.web != null)
						{
							if (this.processor.hotSite.server.ports.http == null)
								this.processor.hotSite.server.ports.http = this.servers.web.ports.http;

							if (this.processor.hotSite.server.ports.https == null)
								this.processor.hotSite.server.ports.https = this.servers.web.ports.https;
						}

						if (this.servers.api != null)
						{
							this.processor.hotSite.server.ports.http = this.servers.api.ports.http;
							this.processor.hotSite.server.ports.https = this.servers.api.ports.https;
						}

						// Go through each API and replace the base url with the base url set in the cli.
						if (this.processor.hotSite.apis != null)
						{
							for (let key in this.processor.hotSite.apis)
							{
								let tempApi = this.processor.hotSite.apis[key];
								tempApi.url = baseAPIUrl;
							}
						}

						await this.processor.processHotSite (tester);

						if (dontLoadAPIFiles === false)
							this.apis = this.loadAPIs (this.processor);
					}

					// Setup the DB if it hasn't already been setup.
					if (process.env["DATABASE_TYPE"] != null)
					{
						setupDB ();
						dbinfo.type = (<HotDBType>process.env["DATABASE_TYPE"]);
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

					let sslObj: any = null;

					if ((process.env["DATABASE_SSL_REJECT_UNAUTHORIZED"] != null) || 
						(process.env["DATABASE_SSL_CA"] != null) ||
						(process.env["DATABASE_SSL_KEY"] != null) ||
						(process.env["DATABASE_SSL_CERT"] != null))
					{
						setupDB ();
						sslObj = {};
					}

					if (process.env["DATABASE_SSL_REJECT_UNAUTHORIZED"] != null)
					{
						if (process.env["DATABASE_SSL_REJECT_UNAUTHORIZED"] === "0")
							sslObj.rejectUnauthorized = false;
					}

					if (process.env["DATABASE_SSL_CA"] != null)
					{
						if (process.env["DATABASE_SSL_CA"] !== "")
							sslObj.ca = process.env["DATABASE_SSL_CA"];
					}

					if (process.env["DATABASE_SSL_KEY"] != null)
					{
						if (process.env["DATABASE_SSL_KEY"] !== "")
							sslObj.key = process.env["DATABASE_SSL_KEY"];
					}

					if (process.env["DATABASE_SSL_CERT"] != null)
					{
						if (process.env["DATABASE_SSL_CERT"] !== "")
							sslObj.cert = process.env["DATABASE_SSL_CERT"];
					}

					if (sslObj != null)
						dbinfo.ssl = sslObj;

					if (baseWebUrl === "")
					{
						let foundBaseUrl: string = HotStaq.getValueFromHotSiteObj (this.processor.hotSite, ["server", "url"]);
			
						if (foundBaseUrl != null)
							baseWebUrl = foundBaseUrl;
					}

					if (baseWebUrl === "")
						baseWebUrl = `http://127.0.0.1:${this.servers.web.ports.http}`;

					if ((serverType === "web") || (serverType === "web-api"))
					{
						if (this.processor.hotSite != null)
						{
							if (this.processor.hotSite.server != null)
								this.processor.hotSite.server.url = baseWebUrl;
						}

						runWebServer = true;
					}

					if (globalApi !== "")
						this.processor.hotSite.server.globalApi = globalApi;

					if (serverType === "api")
					{
						if (rateLimiter.enabled != null)
							rateLimiter.enabled = true;
					}

					if ((serverType === "api") || (serverType === "web-api"))
					{
						runAPIServer = true;

						if (cors.allowedHeaders.length === 0)
							cors.allowedHeaders = ["Origin", "X-Requested-With", "Content-Type", "Accept"];

						this.servers.api.cors.origin = cors.origin;
						this.servers.api.cors.allowedHeaders = cors.allowedHeaders;

						this.servers.api.rateLimiter.enabled = rateLimiter.enabled;
						this.servers.api.rateLimiter.windowLength = rateLimiter.windowLength;
						this.servers.api.rateLimiter.limit = rateLimiter.limit;
						this.servers.api.errorHandlingResponseCode = errorHandlingResponseCode;

						if (rateLimiter.store != null)
						{
							this.servers.api.rateLimiter.store.redisConfig = {
									host: rateLimiter.store.host
								};

							if (rateLimiter.store.port != null)
								this.servers.api.rateLimiter.store.redisConfig.port = rateLimiter.store.port;

							if (rateLimiter.store.username != null)
								this.servers.api.rateLimiter.store.redisConfig.username = rateLimiter.store.username;

							if (rateLimiter.store.password != null)
								this.servers.api.rateLimiter.store.redisConfig.password = rateLimiter.store.password;
						}

						if (swaggerUIFilepath !== "")
						{
							if (serverType === "web-api")
							{
								this.servers.web.swaggerUI.filepath = swaggerUIFilepath;
								this.servers.web.swaggerUI.route = swaggerUIRoute;
							}

							this.servers.api.swaggerUI.filepath = swaggerUIFilepath;
							this.servers.api.swaggerUI.route = swaggerUIRoute;
						}
					}

					if (dbinfo != null)
						this.processor.logger.verbose (`Connecting to ${dbinfo.type} database at ${dbinfo.server}:${dbinfo.port} using schema ${dbinfo.database}`);

					/// @fixme Allow for multiple APIs to be loaded, and have their 
					/// servers start in the future.
					let getBaseUrlFromHotSite = (loadAPI: APItoLoad, baseUrl: string = ""): string =>
						{
							let foundAPIUrl: string = baseUrl;

							// Attempt to find the base url from the HotSite's API.
							if (this.processor.hotSite != null)
							{
								if (this.processor.hotSite.apis != null)
								{
									for (let key in this.processor.hotSite.apis)
									{
										let tempAPI = this.processor.hotSite.apis[key];

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

					let loadAPIServer = async (serverTypeDisplayName: string, server: HotHTTPServer) =>
						{
							if (Object.keys (this.apis).length < 1)
								throw new Error (`No APIs are loaded! Try using --api-load`);
			
							for (let key in this.apis)
							{
								let loadAPI: APItoLoad = this.apis[key];
								let isAPIOnly: boolean = true;
			
								if (baseAPIUrl === "")
									baseAPIUrl = getBaseUrlFromHotSite (loadAPI);
			
								if (baseAPIUrl === "")
									baseAPIUrl = `http://127.0.0.1:${server.ports.http}`;

								if ((serverType === "web") || (serverType === "web-api"))
									isAPIOnly = false;
			
								if (this.globalLogLevel != null)
									server.logger.logLevel = this.globalLogLevel;
			
								server.serverType = serverType;

								// Only run the api server.
								await this.startAPIServer (server, loadAPI, baseAPIUrl, dbinfo, isAPIOnly);
			
								// Change the name to a friendly display name.
								server.serverType = serverTypeDisplayName;
							}
						};
					let listenOnAPIServer = async (server: HotHTTPServer) =>
						{
							if (Object.keys (this.apis).length < 1)
								throw new Error (`No APIs are loaded! Try using --api-load`);
			
							await server.listen ();
						};
					let loadAndStartAPIServer = async (serverType: string, server: HotHTTPServer) =>
						{
							await loadAPIServer (serverType, server);
							await listenOnAPIServer (server);
						};

					if (serverType === "api")
						await loadAndStartAPIServer ("API Server", this.servers.api);

					if (runWebServer === true)
					{
						if (runAPIServer === true)
							await loadAPIServer ("Web-API Server", this.servers.web);
						else
							this.servers.web.serverType = "Web Server";

						if (this.globalLogLevel != null)
							this.servers.web.logger.logLevel = this.globalLogLevel;

						await this.servers.web.listen ();
					}

					if (listAPIRoutes === true)
					{
						let servers = [this.servers.api, testerServer];

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

						this.processor.logger.info (`Executing web tests...`);
						await testerServer.executeAllWebTests (testerSettings.tester);
					}

					if (runAPITestMap === true)
					{
						if (testerServer == null)
							throw new Error (`Unable to execute tests! Is --development-mode missing?`);

						if (serverType === "web")
							throw new Error (`In order to execute API tests, you must set the server type to either api or web-api.`);

						this.processor.logger.info (`Executing api tests...`);
						await testerServer.executeAllAPITests (testerSettings.tester);
					}

					if ((runWebTestMap === true) ||
						(runAPITestMap === true))
					{
						if (testerSettings.shutdownAfterTests === true)
						{
							if (testerServer != null)
							{
								await testerServer.shutdown ();
								testerServer = null;
							}

							if (this.servers.web != null)
							{
								await this.servers.web.shutdown ();
								this.servers.web = null;
							}

							if (this.servers.api != null)
							{
								await this.servers.api.shutdown ();
								this.servers.api = null;
							}

							/// @todo Remove this once the shutdown process is fixed.
							process.exit (tester.numFailures);
						}
					}
				};
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
			`Allows secret files to be served. NOT RECOMMENDED.`, 
			(arg: string, previous: any) =>
			{
				skipSecretFiles = false;
			});
		runCmd.option (`--dont-load-apis-from-hotsite`, 
			`Do not load APIs from the HotSite.`, 
			(arg: string, previous: any) =>
			{
				dontLoadAPIFiles = true;
			});
		runCmd.option (`--swagger-ui <yaml_filepath>`, 
			`If set to a JSON or YAML file, Swagger UI will run on the route /swagger. This will only work if the server type is set to web-api or api.`, 
			(filepath: string, previous: any) =>
			{
				swaggerUIFilepath = filepath;
			}, "");
		runCmd.option (`--swagger-ui-route <route>`, 
			`If --swagger-ui is used, you can change the default name of the route used.`, 
			(route: string, previous: any) =>
			{
				swaggerUIRoute = route;
			}, "/swagger");
		runCmd.option (`--dont-deploy-tester`, 
			`If set, this will not deploy a tester. If this is enabled this will cause automated tests to fail.`, 
			(arg: string, previous: any) =>
			{
				testerSettings.deployTester = false;
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
					this.processor.logger.error (`Unable to parse tester http port ${port}`);
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
					this.processor.logger.error (`Unable to parse tester https port ${port}`);
				}
			}, testerSettings.https);
		runCmd.option (`--tester-type <tester>`, 
			`Set the tester to use. Can be: HotTesterMocha,HotTesterMochaSelenium`, 
			(tester: string, previous: any) =>
			{
				testerSettings.tester = tester;
			}, "");
		runCmd.option (`--tester-dont-shutdown`, 
			`Do not shutdown after the tests have been completed.`, 
			(value: string, previous: any) =>
			{
				testerSettings.shutdownAfterTests = false;
			}, "");
		runCmd.option (`--tester-test-timeout <value>`, 
			`Set the timeout for each test that executes. Set to 0 to disable timeouts.`, 
			(value: string, previous: any) =>
			{
				try
				{
					testerSettings.timeout = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse --tester-test-timeout ${value}`);
				}
			}, "10000");
		runCmd.option (`--tester-command-delay <value>`, 
			`Set the command delay for each command that executes.`, 
			(value: string, previous: any) =>
			{
				try
				{
					testerSettings.commandDelay = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse --tester-command-delay ${value}`);
				}
			}, "10000");
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
		runCmd.option (`--tester-disable-gpu-sandbox`, 
			`Disable GPU and Sandbox. Useful for executing in headless environments. Can only be used with tester type: HotTesterMochaSelenium`, 
			(value: string, previous: any) =>
			{
				testerSettings.disableGPUAndSandbox = true;
			}, "false");
		runCmd.option (`--tester-disable-dev-shm-usage`, 
			`Disable shared memory usage in the launched browser. Useful for executing in headless environments. Can only be used with tester type: HotTesterMochaSelenium`, 
			(value: string, previous: any) =>
			{
				testerSettings.disableDevShmUsage = true;
			}, "false");
		runCmd.option (`--tester-window-width <number>`, 
			`Set the width of the brower's window. Can only be used with tester type: HotTesterMochaSelenium`, 
			(value: string, previous: any) =>
			{
				try
				{
					const tempValue: number = parseInt (value);

					testerSettings.windowWidth = tempValue;
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse window width ${value}`);
				}
			}, "");
		runCmd.option (`--tester-window-height <number>`, 
			`Set the height of the brower's window. Can only be used with tester type: HotTesterMochaSelenium`, 
			(value: string, previous: any) =>
			{
				try
				{
					const tempValue: number = parseInt (value);

					testerSettings.windowHeight = tempValue;
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse window height ${value}`);
				}
			}, "");
		runCmd.option (`--tester-headless`, 
			`Make the browser headless. Can only be used with tester type: HotTesterMochaSelenium`, 
			(value: string, previous: any) =>
			{
				testerSettings.headless = true;
			}, "false");
		runCmd.option (`--tester-remote-server <remote_server>`, 
			`Set the remote Selenium server to use for testing. Example: "http://localhost:4444" Can only be used with tester type: HotTesterMochaSelenium`, 
			(remoteServer: string, previous: any) =>
			{
				testerSettings.remoteServer = remoteServer;
			}, "");
		runCmd.option (`--ws, --accept-websocket-connections`, 
			`This will allow the all servers to accept websocket connections.`, 
			(remoteServer: string, previous: any) =>
			{
				this.servers.web.useWebsocketServer = true;
				this.servers.api.useWebsocketServer = true;
			}, "");
		runCmd.option (`--error-handling-response-code`, 
			`The status code to respond with when an API error occurs.`, 
			(value: string, previous: any) =>
			{
				try
				{
					errorHandlingResponseCode = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse error handling response code ${value}`);
				}
			}, "500");

		const serverTypes: string[] = ["web", "api"];

		for (let iIdx = 0; iIdx < serverTypes.length; iIdx++)
		{
			let currentServerType: string = serverTypes[iIdx];
			let httpPort: number = 5000;
			let httpsPort: number = 443;

			if (currentServerType === "api")
			{
				httpPort = 6001;
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

			if (currentServerType === "api")
			{
				runCmd.option (`--${currentServerType}-port <port>`, 
					`Set the ${currentServerType} HTTP port`, 
					(port: string, previous: any) =>
					{
						try
						{
							const tempPort: number = parseInt (port);
		
							// @ts-ignore
							if (currentServerType === "web")
								this.servers.web.ports.http = tempPort;
							else
								this.servers.api.ports.http = tempPort;
						}
						catch (ex)
						{
							this.processor.logger.error (`Unable to parse ${currentServerType} http port ${port}`);
						}
					}, httpPort);
			}

			runCmd.option (`--${currentServerType}-http-port <port>`, 
				`Set the ${currentServerType} HTTP port`, 
				(port: string, previous: any) =>
				{
					try
					{
						const tempPort: number = parseInt (port);

						if (currentServerType === "web")
							this.servers.web.ports.http = tempPort;
						else
							this.servers.api.ports.http = tempPort;
					}
					catch (ex)
					{
						this.processor.logger.error (`Unable to parse ${currentServerType} http port ${port}`);
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
							this.servers.web.ports.https = tempPort;
						else
							this.servers.api.ports.https = tempPort;
					}
					catch (ex)
					{
						this.processor.logger.error (`Unable to parse ${currentServerType} https port ${port}`);
					}
				}, httpsPort);
			runCmd.option (`--${currentServerType}-dont-redirect-http-to-https`, 
				`Do not redirect ${currentServerType} HTTP traffic to HTTPS`, 
				(port: string, previous: any) =>
				{
					if (currentServerType === "web")
						this.servers.web.redirectHTTPtoHTTPS = false;
					else
						this.servers.api.redirectHTTPtoHTTPS = false;
				});
			runCmd.option (`--${currentServerType}-listen-address <address>`, 
				`Set the ${currentServerType} listen address`, 
				(address: string, previous: any) =>
				{
					if (currentServerType === "web")
						this.servers.web.listenAddress = address;
					else
						this.servers.api.listenAddress = address;
				}, "0.0.0.0");
			runCmd.option (`--${currentServerType}-ssl-cert <path>`, 
				`Set the path to the SSL cert for the ${currentServerType} server`, 
				(cert: string, previous: any) =>
				{
					if (currentServerType === "web")
						this.servers.web.ssl.cert = cert;
					else
						this.servers.api.ssl.cert = cert;
				}, "");
			runCmd.option (`--${currentServerType}-ssl-key <path>`, 
				`Set the path to the SSL key for the ${currentServerType} server`, 
				(key: string, previous: any) =>
				{
					if (currentServerType === "web")
						this.servers.web.ssl.key = key;
					else
						this.servers.api.ssl.key = key;
				}, "");
			runCmd.option (`--${currentServerType}-ssl-ca <path>`, 
				`Set the path to the SSL CA for the ${currentServerType} server`, 
				(ca: string, previous: any) =>
				{
					if (currentServerType === "web")
						this.servers.web.ssl.ca = ca;
					else
						this.servers.api.ssl.ca = ca;
				}, "");
			runCmd.option (`--${currentServerType}-log-level <level>`, 
				`Set the logging level for the ${currentServerType} server. Can be (info,warning,error,all,none)`, 
				(logLevel: string, previous: any) =>
				{
					let tempServer: HotHTTPServer = null;

					if (logLevel === "")
						return;

					if (currentServerType === "web")
						tempServer = this.servers.web;
					else
						tempServer = this.servers.api;

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
						let keyValuePair = this.getKeyValuePair (routeAndPath);
						const route: string = keyValuePair.key;
						const path: string = keyValuePair.value;

						this.servers.web.addStaticRoute (route, path);
					});
				runCmd.option (`--${currentServerType}-serve-file-extensions`, "Serve files extensions, must be passed as a JSON array.", 
					(arg: string, previous: any) =>
					{
						this.servers.web.serveFileExtensions = JSON.parse (arg);
					}, JSON.stringify (HotHTTPServer.getDefaultServableExtensions ()));
				runCmd.option (`--${currentServerType}-js-url <url>`, "The url to the HotStaq JS", 
					(url: string, previous: any) =>
					{
						this.servers.web.hottFilesAssociatedInfo.jsSrcPath = url;
					});
			}

			if (currentServerType === "api")
			{
				runCmd.option (`--${currentServerType}-load <exported_name_and_path>`,
					`Load an API for use in "exported_name=path_to_js_file" format. Example: --${currentServerType}-load "FreeLightAPI=/app/FreeLight/build/src/FreeLightAPI.js"`,
					(exported_name_and_path: string, previous: any) =>
					{
						let keyValuePair = this.getKeyValuePair (exported_name_and_path);
						const exportedClassName: string = keyValuePair.key;
						const path: string = keyValuePair.value;

						this.apis[exportedClassName] = { importedAPIClass: null, exportedClassName: exportedClassName, path: path };
					});
			}
		}

		runCmd.option (`--server-type <type>`, 
			`Set the type of server. Can be (web, api, web-api)`, 
			(type: string, previous: any) =>
			{
				serverType = type;
			}, "web");
		runCmd.option (`--rate-limiter <enabled>`, 
			`Enable or disable the rate limiter. If the server-type is set to API, this will be enabled by default. Can be (true, false)`, 
			(type: string, previous: any) =>
			{
				rateLimiter.enabled = false;

				if (type === "true")
					rateLimiter.enabled = true;
			}, "true");
		runCmd.option (`--rate-limiter-window <length>`, 
			`The number of milliseconds to remember requests for. Default: 60000`, 
			(value: string, previous: any) =>
			{
				try
				{
					rateLimiter.windowLength = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse rate-limiter-window ${value}`);
				}
			}, "60000");
		runCmd.option (`--rate-limiter-limit <length>`, 
			`The number of requests allowed per window. Default: 500`, 
			(value: string, previous: any) =>
			{
				try
				{
					rateLimiter.limit = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse rate-limiter-limit ${value}`);
				}
			}, "500");
		runCmd.option (`--rate-limiter-redis-host <host>`, 
			`Use Redis to store rate limiter data, this will set the redis host to connect to. This must be set if a rate limiter store is being used.`, 
			(value: string, previous: any) =>
			{
				rateLimiter.store = {
						host: value
					};
			}, "localhost");
		runCmd.option (`--rate-limiter-redis-port <port>`, 
			`Will set the Redis port to use for the rate limiter store.`, 
			(value: string, previous: any) =>
			{
				try
				{
					rateLimiter.store.port = parseInt (value);
				}
				catch (ex)
				{
					this.processor.logger.error (`Unable to parse rate-limiter-redis-port ${value}`);
				}
			}, "6379");
		runCmd.option (`--rate-limiter-redis-username <username>`, 
			`Will set the Redis username to use for the rate limiter store.`, 
			(value: string, previous: any) =>
			{
				rateLimiter.store.username = value;
			});
		runCmd.option (`--rate-limiter-redis-password <password>`, 
			`Will set the Redis password to use for the rate limiter store.`, 
			(value: string, previous: any) =>
			{
				rateLimiter.store.password = value;
			});
		runCmd.option (`--cors-origin <value>`, 
			`The cors origin(s) to set comma separated if necessary. Default: *`, 
			(value: string, previous: any) =>
			{
				cors.origin = value;
			}, "*");
		runCmd.option (`--cors-allowed-header <value>`, 
			`The cors allowed header to set, this can be set multiple times. Default: ["Origin", "X-Requested-With", "Content-Type", "Accept"]`, 
			(value: string, previous: any) =>
			{
				cors.allowedHeaders.push (value);
			});
		runCmd.option (`--global-api <api_name>`, 
			`Set the global api to be used across all pages.`, 
			(api_name: string, previous: any) =>
			{
				globalApi = api_name;
			}, "");
		runCmd.option ("--db-type <type>", "The type of database to use. Can be (none, mysql, mariadb, postgres, influx)", 
			(type: string, previous: any) =>
			{
				setupDB ();
				dbinfo.type = (<HotDBType>type);
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
		runCmd.option ("--db-token <password>", "The database's token. This is insecure to use on the command line!", 
			(token: string, previous: any) =>
			{
				setupDB ();
				dbinfo.token = token;
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
					this.processor.logger.error (`Unable to parse db port ${port}`);
				}
			}, "3306");
		runCmd.option ("--db-database <schema>", "The database's schema to select", 
			(schema: string, previous: any) =>
			{
				setupDB ();
				dbinfo.database = schema;
			});
		runCmd.option ("--db-ssl-accept-unauthorized-certs", "Accept database SSL connections with unauthorized certificates.", 
			(schema: string, previous: any) =>
			{
				setupDB ();
				dbinfo.ssl.rejectUnauthorized = false;
			});
		runCmd.option ("--db-ssl-ca", "The path to the ssl ca certificate.",
			(path: string, previous: any) =>
			{
				setupDB ();
				dbinfo.ssl.ca = path;
			});
		runCmd.option ("--db-ssl-key", "The path to the ssl key certificate.",
			(path: string, previous: any) =>
			{
				setupDB ();
				dbinfo.ssl.key = path;
			});
		runCmd.option ("--db-ssl-cert", "The path to the ssl certificate.",
			(path: string, previous: any) =>
			{
				setupDB ();
				dbinfo.ssl.cert = path;
			});

		return (runCmd);
	}

	/**
	 * Handle any agent commands.
	 */
	async handleAgentCommands (): Promise<commander.Command>
	{
		let baseAPIUrl: string = "";
		let agentKey: string = "";
		let agentSecret: string = "";
		let commands: { [name: string]: string } = {};
		let listenAddr: string = "0.0.0.0";
		let port: number = 5468;

		const agentCmd: commander.Command = new commander.Command ("agent");
		agentCmd.description (`Listen for commands on a port.`);
		agentCmd.action (() =>
			{
				this.onAgentAction = async () =>
				{
					let processor: HotStaq = new HotStaq ();
					processor.logger.logLevel = HotLogLevel.Verbose;
				
					this.servers.agent = new HotHTTPServer (processor);
					let api: HotAgentAPI = new HotAgentAPI (baseAPIUrl, this.servers.agent);
					api.key = agentKey;
					api.secret = agentSecret;
					this.servers.agent.listenAddress = listenAddr;
					this.servers.agent.ports.http = port;
					this.servers.agent.processor.api = api;
					this.servers.agent.api = api;
					await this.servers.agent.setAPI (api);

					await this.servers.agent.listen ();
				};
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
	 * Handle any healthcheck commands.
	 */
	async handleHealthcheckCommands (): Promise<commander.Command>
	{
		let timeout: number = 10000;
		let headers: Headers = new Headers ();

		const healthcheckCmd: commander.Command = new commander.Command ("healthcheck");
		healthcheckCmd.description (`Execute a healthcheck. Will exit with error code 1 if an HTTP status other than 200 returns.`);
		healthcheckCmd.arguments ("<url>");
		healthcheckCmd.action ((url: string, cmdr: any) =>
			{
				this.onHealthcheckAction = async () =>
				{
					try
					{
						const controller = new AbortController ();
						let signalTimeout: NodeJS.Timeout = setTimeout (() =>
							{
								this.processor.logger.error (`Error: Timeout`);

								controller.abort ();
								process.exit (1);
							}, timeout);

						this.processor.logger.verbose (`Starting healthcheck at ${url}`);

						let res = await fetch (url, {
								"signal": controller.signal,
								"headers": headers
							});
						clearTimeout (signalTimeout);

						if (res.status !== 200)
						{
							this.processor.logger.error (`Error: Received ${res.status}`);
							process.exit (1);
						}

						// Do not output the responses from the healthcheck. The responses 
						// could still be used to launch an attack. Exiting with a 0 indicates 
						// that the healthcheck was successful.

						process.exit (0);
					}
					catch (ex)
					{
						this.processor.logger.error (`Error: ${ex.message}`);
						process.exit (1);
					}
				};
			});

		healthcheckCmd.option ("--timeout <value>", "The number of milliseconds before timing out.", 
			(value: string, previous: any) =>
			{
				timeout = parseInt (value);
			});
		healthcheckCmd.option ("--header <value>", `The key/value to add to the HTTP GET request before sending, in the form key=value. Example: --header "Content-Type=text/html; charset=utf-8"`, 
			(value: string, previous: any) =>
			{
				let theSplits: string[] = value.split ("=");
				let key: string = theSplits[0];
				let value2: string = theSplits[1];

				headers.append (key, value2);
			});

		return (healthcheckCmd);
	}

	/**
	 * Handle any generate commands.
	 */
	async handleGenerateCommands (): Promise<commander.Command>
	{
		let generator: HotGenerator = null;
		let generateType: string = "api";
		let createHotGenerator = () =>
			{
				if (generator == null)
					generator = new HotGenerator (this.processor.logger);
			};

		const generateCmd: commander.Command = new commander.Command ("generate");
		generateCmd.description (`API Generation commands.`);
		generateCmd.action (() =>
			{
				this.onGenerateAction = async () =>
				{
					createHotGenerator ();

					if (this.hotsitePath === "")
						throw new Error (`When building, you must specify a HotSite.json!`);

					let apis: { [name: string]: APItoLoad; } = {};

					if (this.hotsitePath !== "")
					{
						await this.processor.loadHotSite (this.hotsitePath);
						await this.processor.processHotSite ();
						apis = this.loadAPIs (this.processor);
					}

					generator.hotsites = [this.processor.hotSite];

					if (generateType === "api")
						await generator.generateAPI (this.processor, apis);

					if (generateType === "api-documentation")
					{
						if (generator.generateType === "javascript")
							generator.generateType = "openapi-3.0.0-yaml";

						await generator.generateAPIDocumentation (this.processor, apis);
					}
				};
			});

		generateCmd.option ("--api", "Generate an API to use.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generateType = "api";
			});
		generateCmd.option ("--api-documentation", "Generate API documentation to use.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generateType = "api-documentation";
			});
		generateCmd.option ("--tsconfig <path>", "Specify the tsconfig.json file to use.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.tsconfigPath = arg;
			});
		generateCmd.option ("--optimize", "Optimize the compiled JavaScript using the Google Closure Compiler.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.optimizeJS = true;
			});
		generateCmd.option ("--skip-route", "Skip a particular route and continue to the next.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.skipRoutes.push (arg);
			});
		generateCmd.option ("--generate-type <type>", "The type of output to generate. Can be: javascript,openapi-3.0.0-json,openapi-3.0.0-yaml,asyncapi-2.6.0-json,asyncapi-2.6.0-yaml", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.generateType = arg;

				if ((generator.generateType === "openapi-3.0.0-json") || 
					(generator.generateType === "openapi-3.0.0-yaml") || 
					(generator.generateType === "asyncapi-2.6.0-json") || 
					(generator.generateType === "asyncapi-2.6.0-yaml"))
				{
					generateType = "api-documentation";
				}
			});
		generateCmd.option ("--output <path>", "The directory path to place all files.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.outputDir = arg;
			});
		generateCmd.option ("--copy-to <path>", "The directory to copy all built files to.", 
			(arg: string, previous: any) =>
			{
				createHotGenerator ();
				generator.copyTo = arg;
			});

		return (generateCmd);
	}

	/**
	 * Handle any deployment commands.
	 */
	async handleDeployCommands (): Promise<commander.Command>
	{
		const deployCmd: commander.Command = new commander.Command ("deploy");

		deployCmd.description (`Deploy your application.`);
		deployCmd.action (() =>
			{
				this.onDeployAction = async () =>
					{
						if (this.hotsitePath === "")
							throw new Error (`When building, you must specify a HotSite.json!`);

						await this.processor.loadHotSite (this.hotsitePath);
						await this.processor.processHotSite ();

						let deployer: HotDeployer = new HotDeployer (this.processor.logger);
						await deployer.deploy ();
					};
			});

		return (deployCmd);
	}

	/**
	 * Setup the CLI app.
	 */
	async setup (): Promise<{
			program: commander.Command;
			mainCommand: commander.Command;
			createCmd: commander.Command;
			moduleCmd: commander.Command;
			runCmd: commander.Command;
			generateCmd: commander.Command;
			buildCmd: commander.Command;
			agentCmd: commander.Command;
			healthcheckCmd: commander.Command;
		}>
	{
		let command: commander.Command = null;
		let createCmd: commander.Command = null;
		let moduleCmd: commander.Command = null;
		let runCmd: commander.Command = null;
		let buildCmd: commander.Command = null;
		let generateCmd: commander.Command = null;
		let agentCmd: commander.Command = null;
		let healthcheckCmd: commander.Command = null;

		try
		{
			if (await HotIO.exists (this.packagePath) === false)
			{
				this.packagePath = ppath.normalize (`${process.cwd ()}/package.json`);

				if (await HotIO.exists (this.packagePath) === false)
				{
					console.error (`Unable to find path to HotStaq!`);

					return;
				}
			}

			let packageJSON: any = JSON.parse (fs.readFileSync (this.packagePath).toString ());
			this.VERSION = packageJSON.version;

			dotenv.config ();

			if (process.env["LOGGING_LEVEL"] != null)
			{
				let logLevel: string = process.env["LOGGING_LEVEL"];

				if (logLevel === "info")
					this.globalLogLevel = HotLogLevel.Info;

				if (logLevel === "warning")
					this.globalLogLevel = HotLogLevel.Warning;

				if (logLevel === "error")
					this.globalLogLevel = HotLogLevel.Error;

				if (logLevel === "verbose")
					this.globalLogLevel = HotLogLevel.Verbose;

				if (logLevel === "all")
					this.globalLogLevel = HotLogLevel.All;

				if (logLevel === "none")
					this.globalLogLevel = HotLogLevel.None;
			}

			this.program = new commander.Command (this.name);
			this.program.description (this.description);
			command = this.program.version (this.VERSION);

			let hotsiteExists: boolean = false;
			let foundHotsitePath: string = "";

			/// @fixme Temporary hack to find a HotSite.json file. Come up with a better 
			/// solution for this.
			if (await HotIO.exists ("./HotSite.json") === true)
			{
				hotsiteExists = true;
				foundHotsitePath = ppath.normalize ("./HotSite.json");
			}

			if (hotsiteExists === false)
			{
				if (await HotIO.exists ("./HotSite.yaml") === true)
				{
					hotsiteExists = true;
					foundHotsitePath = ppath.normalize ("./HotSite.yaml");
				}
			}

			if (hotsiteExists === false)
			{
				if (await HotIO.exists ("./hotsite.json") === true)
				{
					hotsiteExists = true;
					foundHotsitePath = ppath.normalize ("./hotsite.json");
				}
			}

			if (hotsiteExists === false)
			{
				if (await HotIO.exists ("./HOTSITE.json") === true)
				{
					hotsiteExists = true;
					foundHotsitePath = ppath.normalize ("./HOTSITE.json");
				}
			}

			if (hotsiteExists === true)
				this.hotsitePath = foundHotsitePath;

			command.option ("--cwd <path>", "Set the current working directory to use.", 
				(path: string, previous: any) =>
				{
					process.chdir (path);
				});
			command.option ("--env-file <path>", "Set the path to the .env file to load.", 
				(path: string, previous: any) =>
				{
					this.envFile = path;
				});
			command.option ("-o, --hotsite <path>", "Specify the HotSite.json to use. This will look in the current directory to find one first.", 
				(path: string, previous: any) =>
				{
					this.hotsitePath = path;
				}, foundHotsitePath);
			command.option ("--not-hot", "Do not use a HotSite.json.", 
				(path: string, previous: any) =>
				{
					this.hotsitePath = "";
				});
			command.option ("--verbose", "Set the logging level to verbose.", 
				(logLevel: string, previous: any) =>
				{
					this.globalLogLevel = HotLogLevel.Verbose;
				});
			command.option ("--show-responses", "If set to true, all responses from each request will be shown.", 
				(logLevel: string, previous: any) =>
				{
					this.processor.logger.showResponses = true;
				});
			command.option ("-l, --log-level <level>", "Set the logging level. Can be (info,warning,error,verbose,all,none)", 
				(logLevel: string, previous: any) =>
				{
					if (logLevel === "info")
						this.globalLogLevel = HotLogLevel.Info;

					if (logLevel === "warning")
						this.globalLogLevel = HotLogLevel.Warning;

					if (logLevel === "error")
						this.globalLogLevel = HotLogLevel.Error;

					if (logLevel === "verbose")
						this.globalLogLevel = HotLogLevel.Verbose;

					if (logLevel === "all")
						this.globalLogLevel = HotLogLevel.All;

					if (logLevel === "none")
						this.globalLogLevel = HotLogLevel.None;
				}, "all");
			command.option ("--dev, --development-mode", "Set to execute in development mode. This will allow for testing data to be collected and executed", 
				(value: string, previous: any) =>
				{
					this.processor.mode = DeveloperMode.Development;
				});
			command.option ("--start-delay <value>", "Set a start delay to use when starting the server. This is useful when debugging and you want to attach a debugger to the process.", 
				(value: string, previous: any) =>
				{
					try
					{
						const tempValue: number = parseInt (value);

						this.processor.startDelay = tempValue;
					}
					catch (ex)
					{
						this.processor.logger.error (`Unable to parse start delay ${value}`);
					}
				});

			let createCmd: commander.Command = await this.handleCreateCommands ();
			command.addCommand (createCmd);

			let moduleCmd: commander.Command = await this.handleModuleCommands ();
			command.addCommand (moduleCmd);

			let runCmd: commander.Command = await this.handleRunCommands ("run");
			command.addCommand (runCmd);

			runCmd = await this.handleRunCommands ("start");
			command.addCommand (runCmd);

			let buildCmd: commander.Command = await this.handleBuildCommands ();
			command.addCommand (buildCmd);

			let generateCmd: commander.Command = await this.handleGenerateCommands ();
			command.addCommand (generateCmd);

			//let deployCmd: commander.Command = await this.handleDeployCommands ();
			//command.addCommand (deployCmd);

			let agentCmd: commander.Command = await this.handleAgentCommands ();
			command.addCommand (agentCmd);

			let healthcheckCmd: commander.Command = await this.handleHealthcheckCommands ();
			command.addCommand (healthcheckCmd);
		}
		catch (ex)
		{
			this.processor.logger.error (ex.stack);
		}

		return ({
				program: this.program,
				mainCommand: command,
				createCmd: createCmd,
				moduleCmd: moduleCmd,
				runCmd: runCmd,
				generateCmd: generateCmd,
				buildCmd: buildCmd,
				agentCmd: agentCmd,
				healthcheckCmd: healthcheckCmd
			});
	}

	/**
	 * Add an existing API thats already been imported.
	 */
	addAPI (exportedClassName: string, importedClass: any): void
	{
		this.apis[exportedClassName] = { importedAPIClass: importedClass, exportedClassName: exportedClassName, path: "" };
	}

	/**
	 * Parse the CLI arguments and start the CLI app.
	 */
	async start (args: string[]): Promise<void>
	{
		if (args.length > 2)
			this.program.parse (args);

		if (this.envFile !== "")
		{
			this.envFile = ppath.normalize (this.envFile);

			if (await HotIO.exists (this.envFile) === true)
			{
				const content: string = await HotIO.readTextFile (this.envFile);
				let envVars = dotenv.parse (content);

				for (let key in envVars)
				{
					const value: any = envVars[key];

					if (value != null)
						process.env[key] = value;
				}
			}
		}

		if (this.globalLogLevel != null)
			this.processor.logger.logLevel = this.globalLogLevel;

		if (this.onModuleInstallAction != null)
			await this.onModuleInstallAction ();

		if (this.onModuleBuildAction != null)
			await this.onModuleBuildAction ();

		if (this.onCreateAction != null)
			await this.onCreateAction ();

		if (this.onRunAction != null)
			await this.onRunAction ();

		if (this.onBuildAction != null)
			await this.onBuildAction ();

		if (this.onGenerateAction != null)
			await this.onGenerateAction ();

		if (this.onAgentAction != null)
			await this.onAgentAction ();

		if (this.onHealthcheckAction != null)
			await this.onHealthcheckAction ();
	}
}
