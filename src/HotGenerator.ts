import * as ppath from "path";

import YAML from "yaml";

import { HotIO } from "./HotIO";

import { HotStaq, HotSite } from "./HotStaq";
import { HotLog } from "./HotLog";
import { HotHTTPServer } from "./HotHTTPServer";
import { APItoLoad, HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotRouteMethodParameter } from "./HotRouteMethod";
import { HotServerType } from "./HotServer";

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
	 * The type of code or api documentation to generate. Can be:
	 * * typescript
	 * * javascript
	 * * openapi-3.0.0-json
	 * * openapi-3.0.0-yaml
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

		server.type = HotServerType.Generate;
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
	 * Process the APIs for generation.
	 */
	protected async processAPIs (processor: HotStaq, 
		apis: { [name: string]: APItoLoad; }, 
		apiToProcess: 
			(key: string, hotsite: HotSite, loadedAPI: any, 
				libraryName: string, apiName: string, outputDir: string, serverResult: any) => Promise<void>
		): Promise<void>
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

				let serverResult = await this.startAPIServer (processor, loadedAPI);

				await apiToProcess (key, hotsite, loadedAPI, libraryName, apiName, outputDir, serverResult);
			}
		}
	}

	/**
	 * Generate the API.
	 * 
	 * @fixme Needs tests!
	 */
	async generateAPI (processor: HotStaq, apis: { [name: string]: APItoLoad; }): Promise<void>
	{
		if ((this.generateType === "openapi-3.0.0-json") || 
			(this.generateType === "openapi-3.0.0-yaml"))
		{
			await this.generateAPIDocumentation (processor, apis);

			return;
		}

		if (! ((this.generateType === "typescript") || 
			(this.generateType === "javascript")))
		{
			throw new Error (`Unknown API --generate-type: ${this.generateType}`);
		}

		await this.processAPIs (processor, apis, 
			async (key: string, hotsite: HotSite, loadedAPI: any, 
				libraryName: string, apiName: string, outputDir: string, serverResult: any) =>
			{
				this.logger.info (`Generating Web API for ${this.generateType} using "${key}" from HotSite "${hotsite.name}"...`);

				let apiFileContent: string = "";

				apiFileContent += this.getAPIContent (this.generateType, "header", 
					{ libraryName: libraryName, apiName: apiName, baseAPIUrl: serverResult.baseAPIUrl });

				let collectedRoutes: { libraryName: string; apiName: string; routeName: string; }[] = [];

				for (let key2 in serverResult.api.routes)
				{
					let route: HotRoute = serverResult.api.routes[key2];
					let routeName: string = route.route;

					apiFileContent += this.getAPIContent (this.generateType, "class_header", 
						{ routeName: routeName, baseAPIUrl: serverResult.baseAPIUrl, 
							libraryName: libraryName, apiName: apiName });

					for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
					{
						let method: HotRouteMethod = route.methods[iJdx];
						let methodName: string = method.name;

						apiFileContent += this.getAPIContent (this.generateType, "class_function", 
							{ methodName: methodName, routeVersion: route.version, 
								routeName: routeName, methodType: method.type.toUpperCase (), 
								libraryName: libraryName, apiName: apiName, method: method });
					}

					apiFileContent += this.getAPIContent (this.generateType, "class_footer", 
						{ libraryName: libraryName, baseAPIUrl: serverResult.baseAPIUrl, apiName: apiName, routeName: routeName });

					collectedRoutes.push ({
							libraryName: libraryName, apiName: apiName, routeName: routeName
						});
				}

				apiFileContent += this.getAPIContent (this.generateType, "footer", {
						libraryName: libraryName, apiName: apiName, collectedRoutes: collectedRoutes
					});

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

				this.logger.info (`Finished generating Web API "${key}" from HotSite "${hotsite.name}"...`);
			});
	}

	/**
	 * Generate the API documentation.
	 * 
	 * @fixme Needs tests!
	 */
	async generateAPIDocumentation (processor: HotStaq, apis: { [name: string]: APItoLoad; }): Promise<void>
	{
		if (! ((this.generateType === "openapi-3.0.0-json") || 
			(this.generateType === "openapi-3.0.0-yaml")))
		{
			throw new Error (`Unknown API documentation --generate-type ${JSON.stringify (this.generateType)}`);
		}

		await this.processAPIs (processor, apis, 
			async (key: string, hotsite: HotSite, loadedAPI: any, 
				libraryName: string, apiName: string, outputDir: string, serverResult: any) =>
			{
				this.logger.info (`Generating ${this.generateType} Documentation "${key}" from HotSite "${hotsite.name}"...`);

				let jsonObj: any = {};
				let components: any = {};
				let hotsiteDescription: string = "";
				let servers: any[] = [{ url: serverResult.baseAPIUrl }];

				if (hotsite.description != null)
					hotsiteDescription = hotsite.description;

				if (this.generateType.indexOf ("openapi-3.0.0") > -1)
					jsonObj.openapi = "3.0.0";

				jsonObj.info = {};
				jsonObj.info.title = hotsite.name;
				jsonObj.info.version = hotsite.name;
				jsonObj.info.description = hotsiteDescription;
				jsonObj.servers = servers;
				jsonObj.paths = {};

				for (let key2 in serverResult.api.routes)
				{
					let route: HotRoute = serverResult.api.routes[key2];
					let routeName: string = route.route;
					let routeDescription: string = "";

					if (route.description != null)
						routeDescription = route.description;

					for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
					{
						let method: HotRouteMethod = route.methods[iJdx];
						let methodName: string = method.name;
						let path: string = `/${route.version}/${routeName}/${methodName}`;
						let methodDescription: string = "";
						let returnsDescription: any = {
								description: ""
							};
						let component: any = null;
						let componentName: string = "";
						let getChildParameters = (param: HotRouteMethodParameter): any =>
							{
								let createdObj: any = {
										type: param.type,
										description: param.description || "",
										properties: {}
									};
	
								if (param.type != null)
								{
									if (param.type === "object")
									{
										if (param.parameters == null)
											throw new Error (`Missing parameters for an object in ${method.name}`);
									}

									for (let key3 in param.parameters)
									{
										let param2 = param.parameters[key3];
										let tempParam: HotRouteMethodParameter = {
												type: "string",
												required: false,
												description: ""
											};

										if (typeof (param2) === "string")
											tempParam["type"] = param2;
										else
											tempParam = param2;
		
										if (tempParam.type === "object")
											createdObj.properties[key3] = getChildParameters (tempParam.parameters);
										else
										{
											createdObj.properties[key3] = {
													type: tempParam.type,
													description: tempParam.description
												};
										}
									}
								}

								return (createdObj);
							};

						if (method.description != null)
							methodDescription = method.description;

						if (method.returns != null)
						{
							if (method.returns.type === "object")
							{
								returnsDescription = {
										description: method.returns.description,
										content: {
											"application/json": {
												schema: getChildParameters (method.returns)
											}
										}
									};
							}
							else
							{
								returnsDescription = {
										description: method.returns.description,
										content: {
											"application/json": {
													schema: {
														type: "string", 
														description: method.returns.description
													}
												}
										}
									};
							}
						}

						jsonObj.paths[path] = {};
						jsonObj.paths[path][method.type.toLowerCase ()] = {
								"summary": methodDescription,
								responses: {
									"200": returnsDescription
								}
							};

						if (method.parameters != null)
						{
							if (Object.keys (method.parameters).length > 0)
							{
								components[`${routeName}_${methodName}`] = {
									type: "object",
									required: [],
									properties: {}
								};
								component = components[`${routeName}_${methodName}`];
								componentName = `${routeName}_${methodName}`;
							}

							for (let key3 in method.parameters)
							{
								let param = method.parameters[key3];

								if (param.type === "object")
									component.properties[key3] = getChildParameters (param);
								else
								{
									component.properties[key3] = {
											type: param.type,
											description: param.description
										};
								}

								if (param.required === true)
									component.required.push (key3);
							}
						}

						if (component != null)
						{
							jsonObj.paths[path][method.type.toLowerCase ()]["requestBody"] = {
									required: true,
									content: {
										"application/json": {
											schema: {
												"$ref": `#/components/schemas/${componentName}`
											}
										}
									}
								};
						}
					}
				}

				jsonObj.components = {
					schemas: components
				};

				const outputFile: string = ppath.normalize (`${outputDir}/${jsonObj.info.title}`);
				let outputFileExtension: string = ".json";
				let fileContent: string = "";

				if (this.generateType === "openapi-3.0.0-json")
					fileContent = JSON.stringify (jsonObj, null, 2);

				if (this.generateType === "openapi-3.0.0-yaml")
				{
					outputFileExtension = ".yaml";

					let yamldoc = new YAML.Document ();
					yamldoc.contents = jsonObj;

					fileContent = yamldoc.toString ();
				}

				await HotIO.writeTextFile (`${outputFile}${outputFileExtension}`, fileContent);

				this.logger.info (`Finished generating API Documentation "${key}" from HotSite "${hotsite.name}"...`);
			});
	}

	/**
	 * Get the content.
	 */
	getAPIContent (type: string, contentPart: string, data: any): string
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
`;
		}

		if (contentPart === "class_header")
		{
			content = `
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

		if (contentPart === "class_function")
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

		if (contentPart === "class_footer")
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

var HotAPIGlobal = undefined;

if (typeof (HotAPI) !== "undefined")
	HotAPIGlobal = HotAPI;

if (typeof (window) !== "undefined")
{
	if (typeof (window.HotAPI) !== "undefined")
		HotAPIGlobal = window.HotAPI;
}

function HotStaqProcessJSONObject (jsonObj)
{
	if (jsonObj != null)
	{
		if (Hot != null)
		{
			if (Hot.API != null)
			{
				if (Hot.API.authCredentials != null)
				{
					for (let key in Hot.API.authCredentials)
					{
						if (jsonObj[key] == null)
							jsonObj[key] = Hot.API.authCredentials[key];
					}
				}
			}
		}
	}

	return (jsonObj);
}

function HotStaqPostJSONObject (methodType, url, jsonObj)
{
	let promise = fetch (url, {
			"method": methodType,
			"headers": {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify (jsonObj)
		});

	return (promise);
}
`;
		}

		if (contentPart === "class_header")
		{
			content = `
/**
 * The ${data.routeName} API route.
 */
class ${data.routeName}
{
	constructor (baseUrl, connection, db)
	{
		if (baseUrl == null)
			baseUrl = "${data.baseAPIUrl}";

		if (connection === undefined)
			connection = null;

		if (db === undefined)
			db = null;

		/**
		 * The base url to make calls to.
		 */
		this.baseUrl = baseUrl;
		/**
		 * The connection to the server/client.
		 */
		this.connection = connection;
		/**
		 * The database connection, if any.
		 */
		this.db = db;
	}
`;
		}

		if (contentPart === "class_function")
		{
			let method: HotRouteMethod = data.method;
			let paramsDescription: string = "";
			let jsonParamOutput: string = "";
			let jsonReturnOutput: string = "";
			let getChildParameters = (param: HotRouteMethodParameter): any =>
				{
					let outputParams: string = "";

					if (param.type != null)
					{
						if (param.type === "object")
						{
							if (param.parameters == null)
								throw new Error (`Missing parameters for an object in ${method.name}`);
						}

						for (let key3 in param.parameters)
						{
							let param2 = param.parameters[key3];
							let tempParam: HotRouteMethodParameter = {
									type: "string",
									required: false,
									description: ""
								};

							if (typeof (param2) === "string")
								tempParam["type"] = param2;
							else
								tempParam = param2;

							if (tempParam.type === "object")
								outputParams += getChildParameters (tempParam.parameters);
							else
							{
								outputParams += `
	 * @property {${tempParam.type}} ${key3} ${tempParam.description}`;
							}
						}
					}

					return (outputParams);
				};

			if (method.parameters != null)
			{
				let paramsObjType: string = "";
				let paramsToOutput: string = "";

				paramsObjType = `${data.routeName}_${data.methodName}_json_object_type`.toUpperCase ();

				for (let key in method.parameters)
				{
					let param: HotRouteMethodParameter = method.parameters[key];

					if (param.type === "object")
					{
						paramsToOutput += getChildParameters (param);
					}
					else
					{
						paramsToOutput += `
	 * @property {${param.type}} ${key} ${param.description}`;
					}
				}

				paramsDescription = `/**
	 * The JSON object to send to the server.
	 * 
	 * @typedef {Object} ${paramsObjType}${paramsToOutput}
	 */

	`;
				jsonParamOutput = `
	 * 
	 * @param {${paramsObjType}} jsonObj`;
			}

			if (method.returns != null)
			{
				if (method.returns.type === "object")
				{
					let returnObjType: string = `${data.routeName}_${data.methodName}_json_return_type`.toUpperCase ();
					let returnParamsToOutput: string = getChildParameters (method.returns);

					paramsDescription += `/**
	 * The JSON object returned from the server.
	 * 
	 * @typedef {Object} ${returnObjType}${returnParamsToOutput}
	 */

	`;
					jsonReturnOutput = `
	 * 
	 * @returns {${returnObjType}} ${method.returns.description}`;
				}
				else
				{
					jsonReturnOutput = `
	 * 
	 * @returns {${method.returns.type}} ${method.returns.description}`;
				}
			}

			content = `
	${paramsDescription}/**
	 * The ${data.methodName} method.${jsonParamOutput}${jsonReturnOutput}
	 */
	${data.methodName} (jsonObj)
	{
		var promise = new Promise ((resolve, reject) => 
			{
				jsonObj = HotStaqProcessJSONObject (jsonObj);
				HotStaqPostJSONObject ("${data.methodType}", 
					\`\${this.baseUrl}/${data.routeVersion}/${data.routeName}/${data.methodName}\`, 
					jsonObj).then (function (response)
						{
							var result = response.json ();

							resolve (result);
						});
			});

		return (promise);
	}
`;
		}

		if (contentPart === "class_footer")
		{
			content = `}

`;
		}

		if (contentPart === "footer")
		{
			let routesOutput: string = "";

			if (data.collectedRoutes.length > 0)
				routesOutput += "\n";

			for (let iIdx = 0; iIdx < data.collectedRoutes.length; iIdx++)
			{
				let collectedRoute = data.collectedRoutes[iIdx];

				routesOutput += `
					this.${collectedRoute.routeName} = new ${collectedRoute.routeName} (baseUrl, connection, db);`;
			}

			content = `if (typeof (${data.libraryName}.${data.apiName}) === "undefined")
{
	if (typeof (HotAPIGlobal) !== "undefined")
	{
		${data.libraryName}.${data.apiName} = class extends HotAPIGlobal
			{
				constructor (baseUrl, connection, db)
				{
					super (baseUrl, connection, db);${routesOutput}
				}
			}
	}
}`;
		}

		return (content);
	}
}