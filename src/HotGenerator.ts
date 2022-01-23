import * as ppath from "path";
import { HotIO } from "./HotIO";

import { HotStaq, HotSite } from "./HotStaq";
import { HotLog } from "./HotLog";
import { HotHTTPServer } from "./HotHTTPServer";
import { APItoLoad, HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod } from "./HotRouteMethod";

/**
 * Generates stuff like API 
 */
export class HotGenerator
{
	/**
	 * The HotSites to build from.
	 */
	hotsites: HotSite[];
	/**
	 * Generate the API for the client web browser.
	 */
	api: boolean;
	/**
	 * The type of code to generate. Can be:
	 * * typescript
	 * * javascript
	 */
	generateType: string;
	/**
	 * Compile the typescript using Webpack.
	 */
	compileTS: boolean;
	/**
	 * Specify a custom tsconfig path.
	 */
	tsconfigPath: string;
	/**
	 * Specify a custom webpack config path.
	 */
	webpackConfigPath: string;
	/**
	 * Optimize the compiled JavaScript.
	 */
	optimizeJS: boolean;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The output directory.
	 */
	outputDir: string;

	constructor (logger: HotLog)
	{
		this.hotsites = [];
		this.api = true;
		this.generateType = "javascript";
		this.compileTS = true;
		this.tsconfigPath = ppath.normalize(`${__dirname}/../../tsconfig-generator.json`);
		this.webpackConfigPath = ppath.normalize(`${__dirname}/../../webpack.config.generator.js`);
		this.optimizeJS = false;
		this.logger = logger;
		this.outputDir = ppath.normalize (`${process.cwd ()}/build-web/`);
	}

	/**
	 * Get the base url from the HotSite.
	 */
	getBaseUrlFromHotSite (processor: HotStaq, apiServer: HotHTTPServer, 
			loadedAPI: APItoLoad, baseAPIUrl: string = ""): string
	{
		if (baseAPIUrl === "")
			baseAPIUrl = `http://127.0.0.1:${apiServer.ports.http}`;

		let foundAPIUrl: string = baseAPIUrl;

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
						if (tempAPI.apiName === loadedAPI.exportedClassName)
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
	}

	/**
	 * Start the API server.
	 */
	protected async startAPIServer (processor: HotStaq, loadedAPI: APItoLoad): Promise<{ api: HotAPI; baseAPIUrl: string; }>
	{
		let server: HotHTTPServer = new HotHTTPServer (processor);
		let baseAPIUrl: string = this.getBaseUrlFromHotSite (processor, server, loadedAPI);

		process.chdir (process.cwd ());
		let foundModulePath = require.resolve (loadedAPI.path, { paths: [process.cwd ()] });
		let apiJS = require (foundModulePath);
		let apiClass: any = apiJS[loadedAPI.exportedClassName];
		let api: HotAPI = new apiClass (baseAPIUrl, server);

		server.logger.verbose (`Loaded API class: ${loadedAPI.exportedClassName}`);

		server.processor.api = api;
		server.api = api;

		// Add this since this is an API server only.
		server.addRoute ("/", async (req: any, res: any) =>
			{
				res.json ({ "status": "ok" });
			});

		//server.serverType = "API Server";
		//await server.listen ();

		return ({ api: api, baseAPIUrl: baseAPIUrl });
	}

	/**
	 * Generate the API.
	 * 
	 * @fixme Needs tests!
	 */
	async generateAPI (processor: HotStaq, apis: { [name: string]: APItoLoad; }): Promise<void>
	{
		if (this.api === true)
		{
			let outputDir: string = ppath.normalize (`${this.outputDir}/`);

			if (await HotIO.exists (outputDir) === false)
				await HotIO.mkdir (outputDir);

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				if (hotsite.apis === null)
				{
					this.logger.info (`HotSite "${hotsite.name}" contains no APIs. Skipping...`);

					continue;
				}

				let numAPIs: number = Object.keys (hotsite.apis).length;

				if (numAPIs < 1)
				{
					this.logger.info (`HotSite "${hotsite.name}" contains no APIs. Skipping...`);

					continue;
				}

				for (let key in hotsite.apis)
				{
					let loadedAPI = apis[key];
					let libraryName: string = hotsite.apis[key].libraryName;
					let apiName: string = hotsite.apis[key].apiName;

					if (libraryName == null)
					{
						this.logger.info (`Web API "${key}" from HotSite "${hotsite.name}" does not have a libraryName!`);

						continue;
					}

					if (apiName == null)
					{
						this.logger.info (`Web API "${key}" from HotSite "${hotsite.name}" does not have an apiName!`);

						continue;
					}

					this.logger.info (`Generating Web API "${key}" from HotSite "${hotsite.name}"...`);

					let serverResult = await this.startAPIServer (processor, loadedAPI);
					let apiFileContent: string = "";

					for (let key2 in serverResult.api.routes)
					{
						let route: HotRoute = serverResult.api.routes[key2];
						let routeName: string = route.route;

						apiFileContent += this.getContent (this.generateType, "header", 
							{ routeName: routeName, baseAPIUrl: serverResult.baseAPIUrl, 
								libraryName: libraryName, apiName: apiName });

						for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
						{
							let method: HotRouteMethod = route.methods[iJdx];
							let methodName: string = method.name;

							apiFileContent += this.getContent (this.generateType, "function", 
								{ methodName: methodName, routeVersion: route.version, 
									routeName: routeName, methodType: method.type.toUpperCase (), 
									libraryName: libraryName, apiName: apiName });
						}

						apiFileContent += this.getContent (this.generateType, "footer", 
							{ libraryName: libraryName, apiName: apiName, routeName: routeName });

						const outputFile: string = ppath.normalize (`${outputDir}/${libraryName}_${apiName}`);
						let outputFileExtension: string = ".ts";

						if (this.generateType === "javascript")
						{
							this.compileTS = false;
							outputFileExtension = ".js";
						}

						await HotIO.writeTextFile (`${outputFile}${outputFileExtension}`, apiFileContent);

						if (this.compileTS === true)
						{
							this.logger.info (`Compiling TypeScript...`);

							const timestamp: string = Date.now ().toString ();
							let tsconfigObj: any = JSON.parse (await HotIO.readTextFile (this.tsconfigPath));

							tsconfigObj.compilerOptions.outDir = outputDir;
							tsconfigObj.files = [`${outputFile}${outputFileExtension}`];

							const temptsconfig: string = ppath.normalize (`${outputDir}/tsconfig-generator-temp-${timestamp}.json`);
							await HotIO.writeTextFile (temptsconfig, JSON.stringify (tsconfigObj, null, 4));

							let content: string = await HotIO.readTextFile (this.webpackConfigPath);
							const tempWebpackConfig: string = ppath.normalize (
									`${outputDir}/webpack.config.generator-temp-${timestamp}.js`);

							content = HotStaq.replaceKey (content, "WEBPACK_VERSION", "1.0.0");
							content = HotStaq.replaceKey (content, "WEBPACK_ENTRY", `${outputFile}${outputFileExtension}`);
							content = HotStaq.replaceKey (content, "WEBPACK_TSCONFIG", temptsconfig);
							content = HotStaq.replaceKey (content, "WEBPACK_IGNORE_PLUGINS_REGEX", "null");
							content = HotStaq.replaceKey (content, "WEBPACK_OUTPUT_FILE", `${libraryName}_${apiName}.js`);
							content = HotStaq.replaceKey (content, "WEBPACK_OUTPUT_PATH", outputDir);
							content = HotStaq.replaceKey (content, "WEBPACK_LIBRARY_NAME", `${libraryName}_${apiName}`);

							await HotIO.writeTextFile (tempWebpackConfig, content);

							try
							{
								// Build the TypeScript so it can run in a web browser.
								await HotIO.exec (`cd ${outputDir} && webpack --mode=production -c ${tempWebpackConfig}`);
							}
							catch (ex)
							{
							}

							await HotIO.rm (temptsconfig);
							await HotIO.rm (tempWebpackConfig);

							this.logger.info (`Finished compiling TypeScript...`);
						}

						if (this.optimizeJS === true)
						{
							this.logger.info (`Optimizing JavaScript...`);
							await HotIO.exec (`npx google-closure-compiler --js=${outputFile}.js --js_output_file=${outputFile}.min.js`);
							this.logger.info (`Finished optimizing JavaScript...`);
						}
					}

					this.logger.info (`Finished generating Web API "${key}" from HotSite "${hotsite.name}"...`);
				}
			}
		}
	}

	/**
	 * Get the content.
	 */
	getContent (type: string, contentPart: string, data: any): string
	{
		let content = "";

		if (type === "javascript")
			content = this.getJavaScriptContent (contentPart, data);

		if (type === "typescript")
			content = this.getTypeScriptContent (contentPart, data);

		return (content);
	}

	/**
	 * Get the Typescript content.
	 */
	getTypeScriptContent (contentPart: string, data: any): string
	{
		let content = "";

		if (contentPart === "header")
		{
			content = `
import { HotAPI } from "HotStaq";

/**
 * The ${data.routeName} API route.
 */
export class ${data.routeName} extends HotAPI
{
	/**
	 * The base url to make calls to.
	 */
	baseUrl: string;

	constructor (baseUrl: string = "${data.baseAPIUrl}")
	{
		this.baseUrl = baseUrl;
	}

`;
		}

		if (contentPart === "function")
		{
			content = `
	/**
	 * The ${data.methodName} method.
	 */
	async ${data.methodName} (jsonObj: any): Promise<any>
	{
		const response = await fetch (\`\${this.baseUrl}/${data.routeVersion}/${data.route}/${data.methodName}\`, {
				"method": "${data.methodType}",
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify (jsonObj)
			});
		const result = response.json ();

		return (result);
	}

`;
		}

		if (contentPart === "footer")
		{
			content = `
}
`;
		}

		return (content);
	}

	/**
	 * Get the JavaScript content.
	 */
	getJavaScriptContent (contentPart: string, data: any): string
	{
		let content = "";

		if (contentPart === "header")
		{
			content = 
`if (typeof (${data.libraryName}) === "undefined")
	${data.libraryName} = {};

var HotAPIGlobal = HotAPI;

if (typeof (HotAPIGlobal) === "undefined")
	HotAPIGlobal = window.HotAPI;

/**
 * The ${data.routeName} API route.
 */
class ${data.routeName} extends HotAPIGlobal
{
	constructor (baseUrl, connection, db)
	{
		if (baseUrl == null)
			baseUrl = "${data.baseAPIUrl}";

		super (baseUrl, connection, db);

		/**
		 * The base url to make calls to.
		 */
		this.baseUrl = baseUrl;
	}
`;
		}

		if (contentPart === "function")
		{
			content = `
	/**
	 * The ${data.methodName} method.
	 */
	${data.methodName} (jsonObj)
	{
		var promise = new Promise (function (resolve, reject)
			{
				fetch (\`\${this.baseUrl}/${data.routeVersion}/${data.routeName}/${data.methodName}\`, {
						"method": "${data.methodType}",
						"headers": {
							"Accept": "application/json",
							"Content-Type": "application/json"
						},
						body: JSON.stringify (jsonObj)
					}).then (function (response)
						{
							var result = response.json ();

							resolve (result);
						});
			});

		return (promise);
	}

`;
		}

		if (contentPart === "footer")
		{
			content = 
`
}

${data.libraryName}.${data.apiName} = ${data.routeName};
`;
		}

		return (content);
	}
}