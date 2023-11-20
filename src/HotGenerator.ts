import * as ppath from "path";

import YAML from "yaml";

import { HotIO } from "./HotIO";

import { HotStaq } from "./HotStaq";
import { HotSite } from "./HotSite";
import { HotLog } from "./HotLog";
import { HotHTTPServer } from "./HotHTTPServer";
import { APItoLoad, HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotRouteMethodParameter, HotEventMethod } from "./HotRouteMethod";
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
	 * * asyncapi-2.6.0-json
	 * * asyncapi-2.6.0-yaml
	 */
	generateType: string;
	/**
	 * Compile the typescript. DOES NOT WORK.
	 */
	compileTS: boolean;
	/**
	 * Specify a custom tsconfig path.
	 */
	tsconfigPath: string;
	/**
	 * Optimize the compiled JavaScript.
	 */
	optimizeJS: boolean;
	/**
	 * The routes to skip when generating.
	 */
	skipRoutes: string[];
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The output directory.
	 */
	outputDir: string;
	/**
	 * The directory to copy all built files to.
	 */
	copyTo: string;
	/**
	 * Exit on complete.
	 */
	exitOnComplete: boolean;

	constructor (logger: HotLog)
	{
		this.hotsites = [];
		this.generateType = "javascript";
		this.compileTS = true;
		this.tsconfigPath = ppath.normalize(`${__dirname}/../../tsconfig-generator.json`);
		this.optimizeJS = false;
		this.skipRoutes = [];
		this.logger = logger;
		this.outputDir = ppath.normalize (`${process.cwd ()}/build-web/`);
		this.copyTo = "";
		this.exitOnComplete = true;
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

		server.type = HotServerType.Generate;

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

		if (server.api.onPreRegister != null)
			await server.api.onPreRegister ();

		// Process pre registration for the routes and methods.
		for (let key in server.api.routes)
		{
			let route: HotRoute = server.api.routes[key];

			if (route.onPreRegister != null)
				await route.onPreRegister ();

			for (let iIdx = 0; iIdx < route.methods.length; iIdx++)
			{
				let method: HotRouteMethod = route.methods[iIdx];

				if (method.onPreRegister != null)
					await method.onPreRegister ();
			}
		}

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
			(this.generateType === "openapi-3.0.0-yaml") || 
			(this.generateType === "asyncapi-2.6.0-json") || 
			(this.generateType === "asyncapi-2.6.0-yaml"))
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

				apiFileContent += await this.getAPIContent (this.generateType, "header", 
					{ libraryName: libraryName, apiName: apiName, baseAPIUrl: serverResult.baseAPIUrl });

				let collectedRoutes: { libraryName: string; apiName: string; routeName: string; }[] = [];

				for (let key2 in serverResult.api.routes)
				{
					let route: HotRoute = serverResult.api.routes[key2];
					let routeName: string = route.route;
					let skipThisRoute: boolean = false;

					if (typeof (routeName) !== "string")
						throw new Error (`Provided route name is not a string: ${JSON.stringify (route)}`);

					for (let iIdx = 0; iIdx < this.skipRoutes.length; iIdx++)
					{
						const skipRoute: string = this.skipRoutes[iIdx];

						if (routeName === skipRoute)
						{
							skipThisRoute = true;

							break;
						}
					}

					if (skipThisRoute === true)
						continue;

					apiFileContent += await this.getAPIContent (this.generateType, "class_header", 
						{ routeName: routeName, baseAPIUrl: serverResult.baseAPIUrl, 
							libraryName: libraryName, apiName: apiName });

					for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
					{
						let method: HotRouteMethod = route.methods[iJdx];
						let methodName: string = method.name;
						let methodType: string = "post";
			
						if (method.type === HotEventMethod.GET)
							methodType = "get";
			
						if (method.type === HotEventMethod.POST)
							methodType = "post";
			
						if (method.type === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT)
							methodType = "post";
			
						if (method.type === HotEventMethod.FILE_UPLOAD)
							methodType = "post";

						apiFileContent += await this.getAPIContent (this.generateType, "class_function", 
							{ methodName: methodName, routeVersion: route.version, 
								routeName: routeName, methodType: methodType.toUpperCase (), 
								libraryName: libraryName, apiName: apiName, method: method });
					}

					apiFileContent += await this.getAPIContent (this.generateType, "class_footer", 
						{ libraryName: libraryName, baseAPIUrl: serverResult.baseAPIUrl, apiName: apiName, routeName: routeName });

					collectedRoutes.push ({
							libraryName: libraryName, apiName: apiName, routeName: routeName
						});
				}

				apiFileContent += await this.getAPIContent (this.generateType, "footer", {
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
					this.logger.info (`WARNING: TypeScript support does not entirely work at this time.`);
					this.logger.info (`Compiling TypeScript...`);

					const timestamp: string = Date.now ().toString ();
					let tsconfigObj: any = JSON.parse (await HotIO.readTextFile (this.tsconfigPath));

					tsconfigObj.compilerOptions.outDir = outputDir;
					tsconfigObj.files = [`${outputFile}${outputFileExtension}`];

					const temptsconfig: string = ppath.normalize (`${outputDir}/tsconfig-generator-temp-${timestamp}.json`);
					await HotIO.writeTextFile (temptsconfig, JSON.stringify (tsconfigObj, null, 4));

					/*try
					{
						// Build the TypeScript so it can run in a web browser.
						await HotIO.exec (`cd ${outputDir} && npm run buildweb`);
					}
					catch (ex)
					{
					}*/

					await HotIO.rm (temptsconfig);

					this.logger.info (`Finished compiling TypeScript...`);
				}

				if (this.optimizeJS === true)
				{
					this.logger.info (`Optimizing JavaScript...`);
					await HotIO.exec (`npx google-closure-compiler --js=${outputFile}.js --js_output_file=${outputFile}.min.js`);
					this.logger.info (`Finished optimizing JavaScript...`);
				}

				this.logger.info (`Wrote generated API files to ${this.outputDir}`);

				if (this.copyTo !== "")
				{
					this.copyTo = ppath.normalize (this.copyTo);

					await HotIO.copyFiles (this.outputDir, this.copyTo);

					this.logger.info (`Copied generated API files to ${this.copyTo}`);
				}

				this.logger.info (`Finished generating Web API "${key}" from HotSite "${hotsite.name}"...`);

				if (this.exitOnComplete === true)
					process.exit (0);
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
			(this.generateType === "openapi-3.0.0-yaml") || 
			(this.generateType === "asyncapi-2.6.0-json") || 
			(this.generateType === "asyncapi-2.6.0-yaml")))
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
				let servers: any = null;

				if (serverResult.api.description != null)
					hotsiteDescription = serverResult.api.description;

				if (this.generateType.indexOf ("openapi-3.0.0") > -1)
				{
					jsonObj.openapi = "3.0.0";
					servers = [{ url: serverResult.baseAPIUrl }];
				}

				if (this.generateType.indexOf ("asyncapi-2.6.0-yaml") > -1)
				{
					jsonObj.asyncapi = "2.6.0";
					servers = {
							production: {
								url: serverResult.baseAPIUrl,
								protocol: "ws"
					 		}
						};
				}

				let filename: string = `${libraryName}_${apiName}_${this.generateType}`;
				jsonObj.info = {};
				jsonObj.info.title = hotsite.name;
				jsonObj.info.version = hotsite.name;
				jsonObj.info.description = hotsiteDescription;
				jsonObj.servers = servers;

				if (jsonObj.openapi != null)
					jsonObj.paths = {};

				if (jsonObj.asyncapi != null)
					jsonObj.channels = {};

				for (let key2 in serverResult.api.routes)
				{
					let route: HotRoute = serverResult.api.routes[key2];
					let routeName: string = route.route;
					let routeDescription: string = "";
					let skipThisRoute: boolean = false;

					if (typeof (routeName) !== "string")
						throw new Error (`Provided route name is not a string: ${JSON.stringify (route)}`);

					for (let iIdx = 0; iIdx < this.skipRoutes.length; iIdx++)
					{
						const skipRoute: string = this.skipRoutes[iIdx];

						if (routeName === skipRoute)
						{
							skipThisRoute = true;

							break;
						}
					}

					if (skipThisRoute === true)
						continue;

					if (route.description != null)
						routeDescription = route.description;

					this.logger.verbose (`Generating Route ${routeName}...`);

					for (let iJdx = 0; iJdx < route.methods.length; iJdx++)
					{
						let method: HotRouteMethod = route.methods[iJdx];

						if (jsonObj.openapi != null)
						{
							if (! ((method.type === HotEventMethod.GET) || 
								(method.type === HotEventMethod.POST) || 
								(method.type === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT)))
							{
								this.logger.verbose (`Skipping method ${method.name} because it is not a GET or POST method.`);

								continue;
							}
						}

						if (jsonObj.asyncapi != null)
						{
							if (! ((method.type === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT) || 
								(method.type === HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT)))
							{
								this.logger.verbose (`Skipping method ${method.name} because it is not a POST_AND_WEBSOCKET_CLIENT_PUB_EVENT or WEBSOCKET_CLIENT_PUB_EVENT method.`);

								continue;
							}
						}

						let methodName: string = method.name;
						let path: string = `/${route.version}/${routeName}/${methodName}`;
						let methodDescription: string = "";
						let returnsDescription: any = {
								description: ""
							};
						let component: any = null;
						let componentName: string = "";

						this.logger.verbose (`Generating method ${methodName} at path ${path}`);

						let getChildParameters = async (param: HotRouteMethodParameter): Promise<any> =>
							{
								let createdObj: any = {
										type: param.type || "string",
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
										else if (typeof (param2) === "function")
											tempParam = await param2 ();
										else
											tempParam = param2;
		
										if (tempParam.type === "object")
											createdObj.properties[key3] = await getChildParameters (tempParam.parameters);
										else
										{
											createdObj.properties[key3] = {
													type: tempParam.type || "string",
													description: tempParam.description || ""
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
										description: method.returns.description || "",
										content: {
											"application/json": {
												schema: await getChildParameters (method.returns)
											}
										}
									};
							}
							else
							{
								returnsDescription = {
										description: method.returns.description || "",
										content: {
											"application/json": {
													schema: {
														type: "string", 
														description: method.returns.description || ""
													}
												}
										}
									};
							}
						}

						if (jsonObj.openapi != null)
						{
							jsonObj.paths[path] = {};
							jsonObj.paths[path][method.type.toLowerCase ()] = {
									"summary": methodDescription,
									responses: {
										"200": returnsDescription
									}
								};
						}

						if (jsonObj.asyncapi != null)
						{
							jsonObj.channels[path] = {
									publish: {
										summary: methodDescription,
										message: {
											"payload": returnsDescription
										}
									}
								};
						}

						if (method.parameters != null)
						{
							if (Object.keys (method.parameters).length > 0)
							{
								components[`${routeName}_${methodName}`] = {
									type: "object",
									properties: {}
								};
								component = components[`${routeName}_${methodName}`];
								componentName = `${routeName}_${methodName}`;
							}

							for (let key3 in method.parameters)
							{
								let param = method.parameters[key3];

								if (param.type === "object")
									component.properties[key3] = await getChildParameters (param);
								else
								{
									component.properties[key3] = {
											type: param.type || "string",
											description: param.description || ""
										};
								}

								if (param.required === true)
								{
									if (component.required == null)
										component.required = [];

									component.required.push (key3);
								}
							}
						}

						if (component != null)
						{
							if (jsonObj.openapi != null)
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

							if (jsonObj.asyncapi != null)
							{
								jsonObj.channels[path].publish = { message: { payload: {} } };
								jsonObj.channels[path].publish.message.payload = {
										"$ref": `#/components/schemas/${componentName}`
									};
							}
						}
					}
				}

				jsonObj.components = {
					schemas: components
				};

				const outputFile: string = ppath.normalize (`${outputDir}/${filename}`);
				let outputFileExtension: string = ".json";
				let fileContent: string = "";

				if ((this.generateType === "openapi-3.0.0-json") || 
					(this.generateType === "asyncapi-2.6.0-json"))
				{
					fileContent = JSON.stringify (jsonObj, null, 2);
				}

				if ((this.generateType === "openapi-3.0.0-yaml") || 
					(this.generateType === "asyncapi-2.6.0-yaml"))
				{
					outputFileExtension = ".yaml";

					let yamldoc = new YAML.Document ();
					yamldoc.contents = jsonObj;

					fileContent = yamldoc.toString ();
				}

				this.logger.verbose (`Writing to file ${outputFile}${outputFileExtension}`);
				await HotIO.writeTextFile (`${outputFile}${outputFileExtension}`, fileContent);

				this.logger.info (`Finished generating API Documentation "${key}" from HotSite "${hotsite.name}"...`);

				if (this.exitOnComplete === true)
					process.exit (0);
			});
	}

	/**
	 * Get the content.
	 */
	async getAPIContent (type: string, contentPart: string, data: any): Promise<string>
	{
		let content = "";

		if (type === "javascript")
			content = await this.getJavaScriptContent (contentPart, data);

		if (type === "typescript")
			content = await this.getTypeScriptContent (contentPart, data);

		return (content);
	}

	/**
	 * Get the Typescript content.
	 */
	async getTypeScriptContent (contentPart: string, data: any): Promise<string>
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
	async getJavaScriptContent (contentPart: string, data: any): Promise<string>
	{
		let content = "";

		if (contentPart === "header")
		{
			content = 
`if (typeof (${data.libraryName}) === "undefined")
	var ${data.libraryName} = {};

var HotAPIGlobal = undefined;

if (typeof (HotAPI) !== "undefined")
	HotAPIGlobal = HotAPI;

if (typeof (window) !== "undefined")
{
	if (typeof (window.HotAPI) !== "undefined")
		HotAPIGlobal = window.HotAPI;
}

/**
 * Get the authorization header string.
 */
function HotStaqGetAuthorizationHeaderString ()
{
	const auth = null;

	if (this.authorization != null)
	{
		if (this.authorization.toAuthorizationHeaderString != null)
			auth = this.authorization.toAuthorizationHeaderString ();
	}

	if (auth == null)
	{
		if (Hot != null)
		{
			if (Hot.API != null)
			{
				if (Hot.API.authCredentials != null)
				{
					if (Hot.API.authCredentials.toAuthorizationHeaderString != null)
						auth = Hot.API.authCredentials.toAuthorizationHeaderString ();
				}
			}
		}
	}

	return (auth);
}

/**
 * Process a JSON object, and get it ready to make a request.
 */
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

/**
 * Make a request to the server.
 */
function HotStaqPostJSONObject (methodType, url, jsonObj, auth)
{
	let headers = {
			"Accept": "application/json",
			"Content-Type": "application/json"
		};

	if (auth != null)
		headers["Authorization"] = auth;

	let promise = fetch (url, {
			"method": methodType,
			"headers": headers,
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
		 * The authorization used to connect to the server.
		 */
		this.authorization = null;
		/**
		 * The database connection, if any.
		 */
		this.db = db;

		if (connection != null)
		{
			if (connection.api != null)
			{
				if (connection.api.authCredentials != null)
					this.authorization = connection.api.authCredentials;
			}
		}
	}
`;
		}

		if (contentPart === "class_function")
		{
			let method: HotRouteMethod = data.method;
			let paramsDescription: string = "";
			let jsonParamOutput: string = "";
			let jsonReturnOutput: string = "";
			let getChildParameters = async (param: HotRouteMethodParameter): Promise<any> =>
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
							else if (typeof (param2) === "function")
								tempParam = await param2 ();
							else
								tempParam = param2;

							if (tempParam.type === "object")
								outputParams += await getChildParameters (tempParam.parameters);
							else
							{
								outputParams += `
	 * @property {${tempParam.type || "string"}} ${key3} ${tempParam.description || ""}`;
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
						paramsToOutput += await getChildParameters (param);
					}
					else
					{
						paramsToOutput += `
	 * @property {${param.type || "string"}} ${key} ${param.description || ""}`;
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
					let returnParamsToOutput: string = await getChildParameters (method.returns);

					paramsDescription += `/**
	 * The JSON object returned from the server.
	 * 
	 * @typedef {Object} ${returnObjType}${returnParamsToOutput}
	 */

	`;
					jsonReturnOutput = `
	 * 
	 * @returns {${returnObjType}} ${method.returns.description || ""}`;
				}
				else
				{
					jsonReturnOutput = `
	 * 
	 * @returns {${method.returns.type}} ${method.returns.description || ""}`;
				}
			}

			let uploadFileBegin: string = "";
			let uploadFileEnd: string = "";

			if (method.type === HotEventMethod.FILE_UPLOAD)
			{
				uploadFileBegin = `
				let uploadHeaders = {
						"Content-Type": "multipart/form-data"
					};

				if (auth != null)
					uploadHeaders["Authorization"] = auth;

				fetch (url, {
					"method": "POST",
					"headers": uploadHeaders,
					body: JSON.stringify (jsonObj)
				}).then (() =>
				{
				`;
				uploadFileEnd = `
				});
				`;
			}

			content = `
	${paramsDescription}/**
	 * The ${data.methodName} method.${jsonParamOutput}${jsonReturnOutput}
	 */
	${data.methodName} (jsonObj)
	{
		var promise = new Promise ((resolve, reject) => 
			{
				const url = \`\${this.baseUrl}/${data.routeVersion}/${data.routeName}/${data.methodName}\`;
				const auth = null;

				if (this.authorization != null)
				{
					if (this.authorization.toAuthorizationHeaderString != null)
						auth = this.authorization.toAuthorizationHeaderString ();
				}

				${uploadFileBegin}
				jsonObj = HotStaqProcessJSONObject (jsonObj);
				HotStaqPostJSONObject ("${data.methodType}", url, jsonObj, auth).then (
					function (response)
					{
						var result = response.json ();

						resolve (result);
					});${uploadFileEnd}
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