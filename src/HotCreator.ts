import * as ppath from "path";

import { HotIO } from "./HotIO";
import { HotStaq } from "./HotStaq";
import { HotSite } from "./HotSite";
import { HotLog } from "./HotLog";

/**
 * Creates stuff for the CLI.
 */
export class HotCreator
{
	/**
	 * The name of the app to create.
	 */
	name: string;
	/**
	 * The type of project to create. Can be:
	 * * web
	 * * web-api
	 * * api
	 */
	type: string;
	/**
	 * The version of HotStaq to use.
	 */
	hotstaqVersion: string;
	/**
	 * The language to use when creating. Default is "ts". Can be:
	 * * ts
	 */
	language: string;
	/**
	 * The output directory.
	 */
	outputDir: string;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The commands used while creating the app.
	 */
	createCommands: {
			/**
			 * The init command to use after the project has been created.
			 */
			init: string;
			/**
			 * The transpile command to use after the project has been initialized.
			 */
			transpileTS: string;
			/**
			 * The generat api command to use when generating the api to use in web.
			 */
			generateAPI: string;
		};
	/**
	 * The NPM commands used.
	 */
	npmCommands: {
			/**
			 * The start command to use.
			 */
			start: string;
			/**
			 * The dev start command to use.
			 */
			dev: string;
			/**
			 * The test command to use.
			 */
			test: string;
			/**
			 * The build command to use.
			 */
			build: string;
			/**
			 * The web api build command to use.
			 */
			buildWebAPI: string;
			/**
			 * The debug web api build command to use.
			 */
			buildWebAPIDebug: string;
			/**
			 * The command to use to build the documentation.
			 */
			buildDoc: string;
		};

	constructor (logger: HotLog, name: string)
	{
		this.name = name;
		this.hotstaqVersion = "";
		this.type = "web-api";
		this.language = "ts";
		this.outputDir = ppath.normalize (`${process.cwd ()}/${name}/`);
		this.logger = logger;
		this.createCommands = {
				init: "npm install",
				transpileTS: "npm run build",
				generateAPI: "node ./build/cli.js generate --copy-to ./public/js/"
			};
		this.npmCommands = {
				start: "",
				dev: "",
				test: "node ./build/cli.js --dev --env-file .env run --server-type api --api-test && node ./build/cli.js --dev --env-file .env run --server-type web --web-test",
				build: "",
				buildWebAPI: "node ./build/cli.js generate --copy-to ./public/js/",
				buildWebAPIDebug: "node ./build/cli.js generate --copy-to ./public/js/",
				buildDoc: "node ./build/cli.js generate --generate-type openapi-3.0.0-yaml"
			};
	}

	/**
	 * Copy the libraries over to a new location.
	 */
	async copyLibraries (location: string): Promise<void>
	{
		const buildWebDir: string = ppath.normalize (`${__dirname}/../../build-web`);

		await HotIO.copyFile (`${buildWebDir}/HotStaq.js`, ppath.normalize (`${location}/HotStaq.js`));
		await HotIO.copyFile (`${buildWebDir}/HotStaq.min.js`, ppath.normalize (`${location}/HotStaq.min.js`));
	}

	/**
	 * Create an app.
	 */
	async create (): Promise<void>
	{
		if ((this.name == null) || (this.name === ""))
			throw new Error ("Name cannot be empty.");

		this.logger.info (`Creating "${this.name}" of type ${this.type} for language ${this.language}...`);

		HotStaq.checkHotSiteName (this.name, true);

		this.outputDir = ppath.normalize (this.outputDir);

		this.logger.info (`Outputting to directory: ${this.outputDir}`);

		await HotIO.mkdir (ppath.join (this.outputDir, "/public/js/"));
		await HotIO.mkdir (ppath.join (this.outputDir, "/.vscode/"));
		await HotIO.mkdir (ppath.join (this.outputDir, "/src/"));

		let readMeBuildSteps: string = "";

		if (this.language === "ts")
		{
			readMeBuildSteps = `
	npm run build

This will transpile the TypeScript into ES6 JavaScript by default. After this is done building, enter: 
			`;
		}

		let hotPackageJSONStr: string = await HotIO.readTextFile (ppath.normalize (`${__dirname}/../../package.json`));
		let hotPackageJSONObj = JSON.parse (hotPackageJSONStr);
		let hotstaqVersion: string = this.hotstaqVersion;

		if (hotstaqVersion === "")
		{
			hotstaqVersion = `^${hotPackageJSONObj.version}`;
			this.hotstaqVersion = hotstaqVersion;
		}

		if (hotstaqVersion === "link")
			hotstaqVersion = "latest";

		this.logger.info (`Generating using NPM HotStaq version: ${hotstaqVersion}`);

		let packageJSON: any = {
				"name": this.name,
				"description": "",
				"version": "1.0.0",
				"main": "./build/index.js",
				"scripts": {
				},
				"keywords": [],
				"author": "",
				"license": "ISC",
				"pkg": {
					"scripts": [
						"node_modules/selenium-webdriver/**/*.js"
					]
				},
				"dependencies": {
					"dotenv": "^10.0.0",
					"hotstaq": `${hotstaqVersion}`
				},
				"devDependencies": {
					"@types/express": "^4.17.13",
					"@types/formidable": "^1.2.4",
					"@types/fs-extra": "^9.0.12",
					"@types/js-cookie": "^2.2.7",
					"@types/mocha": "^10.0.1",
					"@types/node": "^20.11.19",
					"@types/node-fetch": "^2.6.1",
					"@types/selenium-webdriver": "^4.1.5",
					"@types/uuid": "^8.3.4",
					"@types/mime-types": "^2.1.1"
				}
			};

		if (this.language === "ts")
		{
			packageJSON.devDependencies["ts-loader"] = "^7.0.5";
			packageJSON.devDependencies["tslib"] = "^2.6.0";
		}

		if (this.npmCommands.start === "")
			this.npmCommands.start = `node ./build/cli.js --hotsite ./HotSite.json run --server-type ${this.type}`;

		if (this.npmCommands.start !== "")
			packageJSON.scripts["start"] = this.npmCommands.start;

		if (this.npmCommands.dev === "")
			this.npmCommands.dev = `node ./build/cli.js --hotsite ./HotSite.json --development-mode run --server-type ${this.type} --web-http-port 8080`;

		if (this.npmCommands.dev !== "")
			packageJSON.scripts["dev"] = this.npmCommands.dev;

		if (this.npmCommands.test !== "")
			packageJSON.scripts["test"] = this.npmCommands.test;

		if (this.npmCommands.build === "")
		{
			if (this.language === "ts")
				this.npmCommands.build = "tsc --build ./tsconfig.json";
		}

		if (this.npmCommands.build !== "")
			packageJSON.scripts["build"] = this.npmCommands.build;

		if (this.npmCommands.buildWebAPI !== "")
			packageJSON.scripts["build-web"] = this.npmCommands.buildWebAPI;

		if (this.npmCommands.buildWebAPIDebug !== "")
			packageJSON.scripts["build-web-debug"] = this.npmCommands.buildWebAPIDebug;

		if (this.npmCommands.buildDoc !== "")
			packageJSON.scripts["build-doc"] = this.npmCommands.buildDoc;

		// If this is a web only build, remove the build web scripts from packageJSON.
		if (this.type === "web")
		{
			if (packageJSON.scripts["build-web"] != null)
				delete packageJSON.scripts["build-web"];

			if (packageJSON.scripts["build-web-debug"] != null)
				delete packageJSON.scripts["build-web-debug"];
		}

		if (this.language === "ts")
			packageJSON.main = "build/index.js";

		let packageJSONstr: string = JSON.stringify (packageJSON, null, 2);
		await HotIO.writeTextFile (ppath.normalize (`${this.outputDir}/package.json`), packageJSONstr);

		let hotSiteJSON: HotSite = {
				name: this.name,
				server: {
					globalApi: "AppAPI",
					serveDirectories: [{
							route: "/",
							localPath: "./public/"
						}]
				},
				testing: {
					web: {
						testerAPIUrl: "http://127.0.0.1:8182"
					},
					api: {
						maps: [
							"AppAPI"
						]
					}
				}
			};

		if (this.language === "ts")
		{
			if ((this.type === "web-api") || (this.type === "api"))
			{
				hotSiteJSON.apis = {};
				hotSiteJSON.apis["AppAPI"] = {
						"jsapi": `./js/${this.name}Web_AppAPI.js`,
						"libraryName": `${this.name}Web`,
						"apiName": "AppAPI",
						"filepath": "./build/AppAPI.js",
						"map": [
							"api:hello_world -> hi -> HiTest"
						]
					};
			}
		}

		let hotSiteJSONstr: string = JSON.stringify (hotSiteJSON, null, "\t");
		await HotIO.writeTextFile (ppath.normalize (`${this.outputDir}/HotSite.json`), hotSiteJSONstr);

		this.logger.info (`Copying files...`);

		const projectDir: string = ppath.normalize (`${__dirname}/../../creator/project`);
		await HotIO.copyFiles (projectDir, ppath.normalize (`${this.outputDir}/`));
		await HotIO.moveFile (`${this.outputDir}/gitignore`, `${this.outputDir}/.gitignore`);
		await HotIO.moveFile (`${this.outputDir}/npmignore`, `${this.outputDir}/.npmignore`);

		await this.replaceKeysInFile (ppath.normalize (`${this.outputDir}/README.md`), {
				"APPNAME": this.name,
				"BUILDSTEPS": readMeBuildSteps
			});

		if ((this.type === "web") || (this.type === "web-api"))
		{
			const publicDir: string = ppath.normalize (`${__dirname}/../../creator/public`);
			await HotIO.copyFiles (publicDir, ppath.normalize (`${this.outputDir}/public/`));
		}

		if (this.language === "ts")
		{
			if ((this.type === "web-api") || (this.type === "api"))
			{
				const filesDir: string = ppath.normalize (`${__dirname}/../../creator/ts`);
				await HotIO.copyFiles (filesDir, ppath.normalize (`${this.outputDir}/`));
			}
		}

		this.logger.info (`Finished copying files...`);

		this.logger.info (`Copying HotStaq JS files...`);
		await this.copyLibraries (ppath.normalize (`${this.outputDir}/public/js/`));
		this.logger.info (`Finished copying HotStaq JS files...`);

		this.logger.info (`Creating VSCode files...`);

		let launchJSON: any = {
				"version": "0.2.0",
				"configurations": [
					{
						"type": "node",
						"request": "launch",
						"name": "Debug Web Server",
						"program": "${workspaceFolder}/build/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite", "./HotSite.json",
							"run"
						],
						"env": {
						}
					}
				]
			};

		if (this.language === "ts")
		{
			if ((this.type === "web-api") || (this.type === "api"))
			{
				launchJSON["configurations"].push (
					{
						"type": "node",
						"request": "launch",
						"name": "Debug Web/API Server",
						"program": "${workspaceFolder}/build/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite", "./HotSite.json",
							"run",
							"--server-type", "web-api"
						],
						"env": {
						}
					},
					{
						"type": "node",
						"request": "launch",
						"name": "Debug API Server",
						"program": "${workspaceFolder}/build/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite", "./HotSite.json",
							"run",
							"--server-type", "api"
						],
						"env": {
						}
					});
			}
		}

		launchJSON["configurations"].push (
			{
				"type": "node",
				"request": "launch",
				"name": "Run Web Tests",
				"skipFiles": [
					"<node_internals>/**"
				],
				"program": "${workspaceFolder}/build/cli.js",
				"args": [
					"--development-mode",
					"--hotsite", "./HotSite.json",
					"run",
					"--web-test"
				],
				"env": {
				}
			});

		if ((this.type === "web-api") || (this.type === "api"))
		{
			launchJSON["configurations"].push (
				{
					"type": "node",
					"request": "launch",
					"name": "Run API Tests",
					"skipFiles": [
						"<node_internals>/**"
					],
					"program": "${workspaceFolder}/build/cli.js",
					"args": [
						"--development-mode",
						"--hotsite", "./HotSite.json",
						"run",
						"--api-test"
					],
					"env": {
					}
				});
		}

		launchJSON["configurations"].push (
			{
				"type": "pwa-node",
				"request": "attach",
				"name": "Remote Debugger",
				"skipFiles": [
					"<node_internals>/**"
				],
				"localRoot": "${workspaceFolder}",
				"address": "127.0.0.1",
				"port": 9229,
				"remoteRoot": `/app`
			});

		let launchJSONstr: string = JSON.stringify (launchJSON, null, "\t");
		await HotIO.writeTextFile (ppath.normalize (`${this.outputDir}/.vscode/launch.json`), launchJSONstr);
		let tasksJSON: any = {
				"version": "2.0.0",
				"tasks": []
			};

		if (this.language === "ts")
		{
			if ((this.type === "web-api") || (this.type === "api"))
			{
				tasksJSON["tasks"].push (
					{
						"type": "typescript",
						"tsconfig": "tsconfig.json",
						"option": "watch",
						"problemMatcher": [
							"$tsc-watch"
						],
						"group": "build",
						"runOptions": {
							"instanceLimit": 1,
							"runOn": "folderOpen"
						},
						"label": "Build Server"
					});
			}
		}

		let tasksJSONstr: string = JSON.stringify (tasksJSON, null, "\t");
		await HotIO.writeTextFile (ppath.normalize (`${this.outputDir}/.vscode/tasks.json`), tasksJSONstr);
		this.logger.info (`Finished creating VSCode files...`);

		this.logger.info (`Installing modules...`);
		await HotIO.exec (`cd ${this.outputDir} && ${this.createCommands.init}`);

		if (this.hotstaqVersion === "link")
		{
			this.logger.info (`Linking HotStaq...`);
			await HotIO.exec (`cd ${this.outputDir} && npm link hotstaq`);
		}

		this.logger.info (`Finished installing modules...`);

		if (this.language === "ts")
		{
			this.logger.info (`Transpiling TypeScript...`);

			if (this.createCommands.transpileTS !== "")
				await HotIO.exec (`cd ${this.outputDir} && ${this.createCommands.transpileTS}`);

			this.logger.info (`Finished transpiling TypeScript...`);
		}

		this.logger.info (`Generating API JavaScript...`);

		if (this.createCommands.generateAPI !== "")
		{
			await HotIO.exec (`cd ${this.outputDir} && ${this.createCommands.generateAPI}`);
			await HotStaq.wait (1000); /// @fixme Remove this temp hack...
			await HotIO.copyFile (ppath.normalize (`${this.outputDir}/build-web/${this.name}Web_AppAPI.js`), 
				ppath.normalize (`${this.outputDir}/public/js/${this.name}Web_AppAPI.js`));
		}

		this.logger.info (`Finished generating API JavaScript...`);
		this.logger.info (`Finished creating "${this.name}"...`);
	}

	/**
	 * Replace keys in a file.
	 */
	protected async replaceKeysInFile (filepath: string, keys: { [name: string]: string; }): Promise<void>
	{
		let contents: string = await HotIO.readTextFile (filepath);

		for (let key in keys)
		{
			let value: string = keys[key];

			contents = HotStaq.replaceKey (contents, key, value);
		}

		await HotIO.writeTextFile (filepath, contents);
	}
}