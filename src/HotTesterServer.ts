import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import { F_OK } from "constants";

import express from "express";

import { HotServer } from "./HotServer";
import { HotStaq } from "./HotStaq";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest } from "./HotRouteMethod";
import { HotTesterAPI } from "./HotTesterAPI";
import { DeveloperMode } from "./Hot";
import { HotLogLevel } from "./HotLog";
import { EventExecutionType, HotAPI } from "./HotAPI";
import { HotTester } from "./HotTester";
import { HotHTTPServer } from "./HotHTTPServer";

/**
 * An API server for use during testing.
 */
export class HotTesterServer extends HotServer
{
	/**
	 * The express app to use.
	 */
	expressApp: express.Express;
	/**
	 * The HTTP listener to use.
	 */
	httpListener: http.Server;
	/**
	 * The HTTPS listener to use.
	 */
	httpsListener: https.Server;
	/**
	 * Any non-static routes that need to be added. These 
	 * will be added during the preregistration phase, before 
	 * all API routes are added.
	 */
	routes: {
			/**
			 * The type of route.
			 */
			type: HotEventMethod;
			/**
			 * The type of route.
			 */
			route: string;
			/**
			 * The method to execute when this route is hit.
			 */
			method: (req: express.Request, res: express.Response) => Promise<void>;
		}[];

	constructor (processor: HotStaq | HotServer, httpPort: number = null, httpsPort: number = null)
	{
		super (processor);

		this.listenAddress = "127.0.0.1";
		this.expressApp = express ();
		this.httpListener = null;
		this.httpsListener = null;
		this.routes = [];

		if (process.env.TESTER_LISTEN_ADDR != null)
		{
			if (process.env.TESTER_LISTEN_ADDR !== "")
				this.listenAddress = process.env.TESTER_LISTEN_ADDR;
		}

		if (process.env.TESTER_USE_HTTP != null)
		{
			this.ssl = {
					cert: "",
					key: "",
					ca: ""
				};
		}

		if (httpPort != null)
			this.ports.http = httpPort;

		if (httpsPort != null)
			this.ports.https = httpsPort;

		if (process.env.TESTER_HTTP_PORT != null)
		{
			if (process.env.TESTER_HTTP_PORT !== "")
				this.ports.http = parseInt (process.env.TESTER_HTTP_PORT);
		}

		if (process.env.TESTER_HTTPS_PORT != null)
		{
			if (process.env.TESTER_HTTPS_PORT !== "")
				this.ports.https = parseInt (process.env.TESTER_HTTPS_PORT);
		}

		if (process.env.TESTER_HTTPS_SSL_CERT != null)
		{
			if (process.env.TESTER_HTTPS_SSL_CERT !== "")
				this.ssl.cert = process.env.TESTER_HTTPS_SSL_CERT;

			if (process.env.TESTER_HTTPS_SSL_KEY !== "")
				this.ssl.key = process.env.TESTER_HTTPS_SSL_KEY;

			if (process.env.TESTER_HTTPS_SSL_CA !== "")
				this.ssl.ca = process.env.TESTER_HTTPS_SSL_CA;
		}

		let testerJSONLimit: string = "1mb";

		if (process.env.TESTER_JSON_LIMIT != null)
		{
			if (process.env.TESTER_JSON_LIMIT !== "")
				testerJSONLimit = process.env.TESTER_JSON_LIMIT;
		}

		this.expressApp.options ("*", (req: express.Request, res: express.Response, next: express.NextFunction) =>
			{
				res.header ("Access-Control-Allow-Origin", "*");
				res.header ("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
				res.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

				res.statusCode = 204;
				res.setHeader ("Content-Length", "0");
				res.end ();
			});
		this.expressApp.use ((req: express.Request, res: express.Response, next: express.NextFunction) =>
			{
				res.header ("Access-Control-Allow-Origin", "*");
				res.header ("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
				res.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

				next ();
			});
		this.expressApp.use (express.urlencoded ({ "extended": true }));
		this.expressApp.use (express.json ({ "limit": testerJSONLimit }));
	}

	/**
	 * Add a tester for use later.
	 */
	addTester (tester: HotTester): void
	{
		this.processor.logger.verbose (`Added tester ${tester.name}`);
		this.processor.addTester (tester);
	}

	/**
	 * Execute tests.
	 */
	async executeTests (testerName: string, mapName: string): Promise<void>
	{
		this.processor.logger.verbose (`Executing tests ${testerName} using map name ${mapName}`);
		return (this.processor.executeTests (testerName, mapName));
	}

	/**
	 * Execute all web tests for all maps in the HotSite testing web object.
	 */
	async executeAllWebTests (testerName: string): Promise<void>
	{
		return (this.processor.executeAllWebTests (testerName));
	}

	/**
	 * Execute all api tests for all maps in the HotSite testing api object.
	 */
	async executeAllAPITests (testerName: string): Promise<void>
	{
		return (this.processor.executeAllAPITests (testerName));
	}

	/**
	 * Add a route. This will be registered before any APIs are registered.
	 */
	addRoute (route: string, method: (req: express.Request, res: express.Response) => Promise<void>, 
				type: HotEventMethod = HotEventMethod.GET): void
	{
		let newRoute = {
				type: type,
				route: route,
				method: method
			};

		this.processor.logger.verbose (`Added route ${route}`);
		this.routes.push (newRoute);
	}

	/**
	 * Register a route.
	 */
	async registerRoute (route: HotRoute): Promise<void>
	{
		if (route.onRegister != null)
		{
			if (await route.onRegister () === false)
				return;
		}

		this.clearErrorHandlingRoutes ();
		this.preregisterRoute ();

		for (let iIdx = 0; iIdx < route.methods.length; iIdx++)
		{
			let method: HotRouteMethod = route.methods[iIdx];

			if (method.isRegistered === true)
				continue;

			if (method.onRegister != null)
			{
				if (await method.onRegister () === false)
					continue;
			}

			let methodName: string = "/";

			if (route.version !== "")
				methodName += `${route.version}/`;

			if (route.prefix !== "")
				methodName += `${route.prefix}/`;

			if (route.route !== "")
				methodName += `${route.route}/`;

			methodName += method.name;
			method.isRegistered = true;
			const expressType: string = HotHTTPServer.getExpressMethodName (method.type);

			/// @ts-ignore
			this.expressApp[expressType] (methodName, 
				async (req: express.Request, res: express.Response) =>
				{
					let hasAuthorization: boolean = true;
					let authorizationValue: any = null;
					let jsonObj: any = req.body;
					let queryObj: any = req.query;
					let api: HotAPI = route.connection.api;
					let thisObj: any = route;

					if (api.executeEventsUsing === EventExecutionType.HotAPI)
						thisObj = api;

					if (api.executeEventsUsing === EventExecutionType.HotMethod)
						thisObj = method;

					this.logger.verbose (() => `${req.method} ${methodName}, JSON: ${JSON.stringify (jsonObj)}, Query: ${JSON.stringify (queryObj)}`);

					if (method.onServerAuthorize != null)
					{
						try
						{
							let request = new ServerRequest ({
									req: req,
									res: res,
									authorizedValue: null,
									jsonObj: jsonObj,
									queryObj: queryObj,
									files: null
								});

							authorizationValue = await method.onServerAuthorize.call (thisObj, request);
						}
						catch (ex)
						{
							this.logger.verbose (`Authorization error: ${ex.message}`);
							res.json ({ error: ex.message });
							hasAuthorization = false;

							return;
						}

						if (authorizationValue === undefined)
							hasAuthorization = false;
					}
					else
					{
						if (route.onAuthorizeUser != null)
						{
							authorizationValue = await route.onAuthorizeUser (new ServerRequest ({ req: req, res: res }));

							if (authorizationValue === undefined)
								hasAuthorization = false;
						}
					}

					this.logger.verbose (`${req.method} ${methodName}, Authorized: ${hasAuthorization}`);

					if (hasAuthorization === true)
					{
						if (method.onServerExecute != null)
						{
							try
							{
								let request = new ServerRequest ({
									req: req,
									res: res,
									authorizedValue: null,
									jsonObj: jsonObj,
									queryObj: queryObj,
									files: null
								});

								let result: any = await method.onServerExecute.call (thisObj, request);

								this.logger.verbose ((result2: any) => {
									let resultStr: string = "";
			
									if (this.logger.showResponses === true)
										resultStr = `, Response: ${JSON.stringify (result2)}`;
									
									return (`${req.method} ${methodName}${resultStr}`);
								}, result);

								if (result !== undefined)
									res.json (result);
							}
							catch (ex)
							{
								this.logger.error (`HTTP Tester Execution Error: ${ex.message}`);
								res.json ({ error: ex.message });
							}
						}
						else
						{
							res.json (route.errors["no_server_execute_function"]);
							this.logger.verbose (`${req.method} ${methodName}, no_server_execute_function`);
						}
					}
					else
					{
						res.json (route.errors["not_authorized"]);
						this.logger.verbose (`${req.method} ${methodName}, not_authorized`);
					}
				});
		}

		this.setErrorHandlingRoutes ();
	}

	/**
	 * Check if a file exists.
	 */
	static async checkIfFileExists (filepath: string): Promise<boolean>
	{
		return (new Promise<boolean> ((resolve, reject) =>
			{
				fs.access (filepath, F_OK, (err: NodeJS.ErrnoException) =>
					{
						if (err != null)
							resolve (false);

						resolve (true);
					});
			}));
	}

	/**
	 * The routes to add before registering a route.
	 */
	preregisterRoute (): void
	{
		this.expressApp.use ((req: express.Request, res: express.Response, next: any): void =>
			{
				const url: string = `${req.protocol}://${req.hostname}${req.originalUrl}`;
				this.logger.verbose (`Tester Server Requested: ${req.method} ${req.httpVersion} ${url}`);

				next ();
			});

		for (let iIdx = 0; iIdx < this.routes.length; iIdx++)
		{
			let route = this.routes[iIdx];
			const expressType: string = HotHTTPServer.getExpressMethodName (route.type);

			/// @ts-ignore
			this.expressApp[expressType] (route.route, route.method);
		}
	}

	/**
	 * Set the error handlers. This will create two express routes at the bottom of the
	 * route stack. The first will be to capture any 404 errors, the second would be to 
	 * catch any remaining errors.
	 */
	setErrorHandlingRoutes (
		handle404: (req: express.Request, res: express.Response, next: any) => void = null, 
		handleOther: (err: any, req: express.Request, res: express.Response, next: any) => void = null
		): void
	{
		if (handle404 == null)
		{
			handle404 = (req: express.Request, res: express.Response, next: any): void =>
				{
					this.logger.verbose (`404 ${JSON.stringify (req.url)} Method: ${req.method}`);
					res.status (404).send ({ error: "404" });
				};
		}

		if (handleOther == null)
		{
			handleOther = (err: any, req: express.Request, res: express.Response, next: any): void =>
				{
					let stack: string = "";
					let msg: string = "";

					if (err != null)
					{
						stack = err.stack;
						msg = err.message;
					}

					this.logger.verbose (`500 Server error ${JSON.stringify (stack)}`);
					res.status (500).send ({ error: `Server error: ${msg}` });
				};
		}

		this.expressApp.use (handle404);
		this.expressApp.use (handleOther);
	}

	/**
	 * Clear the last two express routes, which are reserved for the 
	 * error handlers.
	 */
	clearErrorHandlingRoutes (): void
	{
		if (this.expressApp._router == null)
			return;

		let stackCount: number = this.expressApp._router.stack.length;

		for (let iIdx = 0; iIdx < stackCount; iIdx++)
		{
			let elm: any = this.expressApp._router.stack[iIdx];

			if (elm != null)
			{
				let name: string = elm.name;

				if ((name === "handle404") || (name === "handleOther"))
				{
					(<any[]>this.expressApp._router.stack).splice (iIdx, 1);
					iIdx--;
					stackCount = this.expressApp._router.stack.length;
				}
			}
		}
	}

	/**
	 * Start listening for requests.
	 */
	async listen (): Promise<void>
	{
		let promise: Promise<void> = new Promise<void> (
			async (resolve, reject) =>
			{
				let completedSetup = () =>
					{
						let protocol: string = "http";
						let port: number = this.ports.http;

						if (this.ssl.cert !== "")
						{
							protocol = "https";
							port = this.ports.https;
						}

						this.logger.info (`Tester server running at ${protocol}://${this.listenAddress}:${port}/`);
						resolve ();
					};

				if (this.api != null)
				{
					if (this.api.onPreRegister != null)
					{
						let continueRegistering: boolean = await this.api.onPreRegister ();

						if (continueRegistering === false)
							return;
					}

					await this.api.registerRoutes ();

					if (this.api.onPostRegister != null)
					{
						let continueOn: boolean = await this.api.onPostRegister ();

						if (continueOn === false)
							return;
					}
				}

				if (this.ssl.cert === "")
				{
					this.httpListener = http.createServer (this.expressApp);
					this.httpListener.listen (this.ports.http, this.listenAddress, completedSetup);
				}
				else
				{
					if (this.redirectHTTPtoHTTPS === true)
					{
						this.httpListener = http.createServer ((req: http.IncomingMessage, res: http.ServerResponse) =>
							{
								let host: string = req.headers["host"];

								res.writeHead (301, {
										"Location": `https://${host}${req.url}`
									});
								res.end ();
							});
						this.httpListener.listen (this.ports.http, this.listenAddress, () =>
							{
								this.logger.info (`Redirecting HTTP(${this.ports.http}) traffic to HTTPS(${this.ports.https})`);
							});
					}

					this.httpsListener = https.createServer ({
							cert: this.ssl.cert,
							key: this.ssl.key,
							ca: this.ssl.ca
						}, this.expressApp);
					this.httpsListener.listen (this.ports.https, this.listenAddress, completedSetup);
				}
			});

		return (promise);
	}

	/**
	 * Setup the tester api.
	 */
	async setupTesterAPI (baseUrl: string): Promise<void>
	{
		let api: HotTesterAPI = new HotTesterAPI (baseUrl, this);
		this.processor.testerAPI = api;
		this.api = api;
		await this.api.registerRoutes ();
	}

	/**
	 * Start the server.
	 * 
	 * @param httpPort The HTTP port to listen on.
	 * @param httpsPort The HTTPS port to listen on.
	 * @param processor The HotStaq or parent server being used for communication.
	 */
	static async startServer (baseUrl: string = `http://127.0.0.1:8182`, 
		httpPort: number = 8182, httpsPort: number = 4142, 
		processor: HotServer | HotStaq = null, 
		logLevel: HotLogLevel = HotLogLevel.All): 
			Promise<{ processor: HotServer | HotStaq; server: HotTesterServer; }>
	{
		if (processor == null)
		{
			processor = new HotStaq ();
			processor.mode = DeveloperMode.Development;
		}

		let webServer: HotTesterServer = new HotTesterServer (processor, httpPort, httpsPort);
		webServer.logger.logLevel = logLevel;

		processor.logger.verbose (`Starting tester server...`);

		await webServer.setupTesterAPI (baseUrl);
		await webServer.listen ();

		return ({ processor: processor, server: webServer });
	}

	/**
	 * Shutdown the server.
	 */
	async shutdown (): Promise<void>
	{
		this.logger.verbose (`Shutting down HTTP tester server...`);
		await new Promise<void> (async (resolve, reject) =>
			{
				let promises: Promise<void>[] = [];

				if (this.httpListener != null)
				{
					promises.push (new Promise<void> ((resolve2, reject) =>
						{
							this.httpListener.close ((err: Error) =>
								{
									this.expressApp = null;

									if (err != null)
										throw err;

									this.logger.verbose (`HTTP tester server has shut down.`);
									resolve2 ();
								});
						}));
				}

				if (this.httpsListener != null)
				{
					promises.push (new Promise<void> ((resolve2, reject) =>
						{
							this.httpsListener.close ((err: Error) =>
								{
									this.expressApp = null;

									if (err != null)
										throw err;

									this.logger.verbose (`HTTPS tester server has shut down.`);
									resolve2 ();
								});
						}));
				}

				await Promise.all (promises);

				this.logger.verbose (`All tester servers have shut down.`);
				resolve ();
			});
	}
}