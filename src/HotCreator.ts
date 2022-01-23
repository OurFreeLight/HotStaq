import * as ppath from "path";

import { HotIO } from "./HotIO";
import { HotStaq, HotSite } from "./HotStaq";
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
		};

	constructor (logger: HotLog, name: string = "")
	{
		this.name = name;
		this.type = "web-api";
		this.language = "ts";
		this.outputDir = "";
		this.logger = logger;
		this.createCommands = {
				init: "git init && npm install",
				transpileTS: "npm run build"
			};
		this.npmCommands = {
				start: "",
				dev: "",
				test: "hotstaq test",
				build: "",
				buildWebAPI: "",
				buildWebAPIDebug: ""
			};
	}

	/**
	 * Copy the libraries over to a new location.
	 */
	async copyLibraries (location: string): Promise<void>
	{
		const buildWebDir: string = ppath.normalize (`${__dirname}/../../build-web`);

		await HotIO.copyFiles (buildWebDir, ppath.normalize (location));
	}

	/**
	 * Create an app.
	 */
	async create (): Promise<void>
	{
		this.logger.info (`Creating "${this.name}" of type ${this.type} for language ${this.language}...`);

		HotStaq.checkHotSiteName (this.name, true);

		this.outputDir = ppath.normalize (`${this.outputDir}`);
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

		let packageJSON: any = {
				"name": this.name,
				"description": "",
				"version": "1.0.0",
				"main": "index.js",
				"scripts": {
				},
				"keywords": [],
				"author": "",
				"license": "ISC",
				"dependencies": {
					"hotstaq": "^0.5.23",
					"copy-webpack-plugin": "^6.0.3"
				}
			};

		if (this.npmCommands.start === "")
			this.npmCommands.start = `hotstaq --hotsite ./HotSite.json run --server-type ${this.type}`;

		if (this.npmCommands.start !== "")
			packageJSON.scripts["start"] = this.npmCommands.start;

		if (this.npmCommands.dev === "")
			this.npmCommands.dev = `hotstaq --hotsite ./HotSite.json --development-mode run --server-type ${this.type} --web-http-port 8080`;

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

		if (this.npmCommands.buildWebAPI === "")
		{
			if (this.language === "ts")
				this.npmCommands.buildWebAPI = "webpack --mode=production --config ./webpack-api.config.js";
		}

		if (this.npmCommands.buildWebAPI !== "")
			packageJSON.scripts["build-web"] = this.npmCommands.buildWebAPI;

		if (this.npmCommands.buildWebAPIDebug === "")
		{
			if (this.language === "ts")
				this.npmCommands.buildWebAPIDebug = "webpack --mode=development --debug --config ./webpack-api.config.js";
		}

		if (this.npmCommands.buildWebAPIDebug !== "")
			packageJSON.scripts["build-web-debug"] = this.npmCommands.buildWebAPIDebug;

		// If this is a web only build, remove the build web scripts from packageJSON.
		if (this.type === "web")
		{
			if (packageJSON.scripts["build-web"] != null)
				delete packageJSON.scripts["build-web"];

			if (packageJSON.scripts["build-web-debug"] != null)
				delete packageJSON.scripts["build-web-debug"];
		}

		if (this.language === "ts")
			packageJSON.main = "build/AppAPI.js";

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
						tester: "HotTesterMochaSelenium",
						testerAPIUrl: "http://127.0.0.1:8183"
					}
				}
			};

		if (this.language === "ts")
		{
			if ((this.type === "web-api") || (this.type === "api"))
			{
				hotSiteJSON.apis = {};
				hotSiteJSON.apis["AppAPI"] = {
						"jsapi": `./js/${this.name}.js`,
						"libraryName": `${this.name}Web`,
						"apiName": "AppAPI",
						"filepath": "./build/AppAPI.js"
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

				await this.replaceKeysInFile (ppath.normalize (`${this.outputDir}/webpack-api.config.js`), {
						"APPNAME": this.name
					});
			}
		}

		this.logger.info (`Finished copying files...`);

		this.logger.info (`Copying HotStaq JS files...`);
		const buildWebDir: string = ppath.normalize (`${__dirname}/../../build-web`);

		await HotIO.copyFiles (buildWebDir, ppath.normalize (`${this.outputDir}/public/js/`));
		this.logger.info (`Finished copying public files...`);

		this.logger.info (`Creating VSCode files...`);

		let launchJSON: any = {
				"version": "0.2.0",
				"configurations": [
					{
						"type": "node",
						"request": "launch",
						"name": "Debug Web Server",
						"program": "${workspaceFolder}/node_modules/hotstaq/build/src/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite",
							"./HotSite.json",
							"run",
							"--web-http-port",
							"8080"
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
						"program": "${workspaceFolder}/node_modules/hotstaq/build/src/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite",
							"./HotSite.json",
							"run",
							"--server-type",
							"web-api",
							"--web-http-port",
							"8080",
							"--api-http-port",
							"8081"
						],
						"env": {
						}
					},
					{
						"type": "node",
						"request": "launch",
						"name": "Debug API Server",
						"program": "${workspaceFolder}/node_modules/hotstaq/build/src/cli.js",
						"skipFiles": [
							"<node_internals>/**"
						],
						"outputCapture": "std",
						"args": [
							"--development-mode",
							"--hotsite",
							"./HotSite.json",
							"run",
							"--server-type",
							"api",
							"--api-http-port",
							"8081"
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
				"program": "${workspaceFolder}/node_modules/hotstaq/build/src/cli.js",
				"args": [
					"--development-mode",
					"--hotsite",
					"./HotSite.json",
					"test",
					"--web-http-port",
					"8080"
				],
				"env": {
				}
			});
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
				"remoteRoot": `/app/${this.name}`
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
						"type": "shell",
						"group": "build",
						"runOptions": {
							"instanceLimit": 1
						},
						"problemMatcher": [],
						"label": "Build Web API Debug",
						"command": "npx webpack --mode=development --config=webpack-api.config.js --debug --watch"
					},
					{
						"type": "typescript",
						"tsconfig": "tsconfig.json",
						"option": "watch",
						"problemMatcher": [
							"$tsc-watch"
						],
						"group": "build",
						"runOptions": {
							"instanceLimit": 1
						},
						"label": "Build Server"
					});
			}
		}

		let tasksJSONstr: string = JSON.stringify (tasksJSON, null, "\t");
		await HotIO.writeTextFile (ppath.normalize (`${this.outputDir}/.vscode/tasks.json`), tasksJSONstr);
		this.logger.info (`Finished creating VSCode files...`);

		this.logger.info (`Creating git repo and installing modules...`);
		await HotIO.exec (`cd ${this.outputDir} && ${this.createCommands.init}`);
		this.logger.info (`Finished creating git repo and installing modules...`);

		if (this.language === "ts")
		{
			this.logger.info (`Transpiling TypeScript...`);
			await HotIO.exec (`cd ${this.outputDir} && ${this.createCommands.transpileTS}`);
			this.logger.info (`Finished transpiling TypeScript...`);
		}

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