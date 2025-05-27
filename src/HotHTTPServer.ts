import * as http from "http";
import * as https from "https";
import * as ppath from "path";
import * as fs from "fs";
import { performance } from "perf_hooks";
import { F_OK } from "constants";

import express from "express";
import mimeTypes from "mime-types";
import { Fields, Files, IncomingForm, Options } from "formidable";

import { rateLimit, Options as RateLimitOptions } from "express-rate-limit";
import { RedisStore, Options as RedisRateLimitOptions } from "rate-limit-redis";
import RedisClient, { RedisOptions } from "ioredis";
import * as swaggerUI from "swagger-ui-express";

import { HotServer, HotServerType } from "./HotServer";
import { HotStaq } from "./HotStaq";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod } from "./HotRouteMethod";
import { processRequest } from "./HotHTTPServerProcessRequest";
import { HotIO } from "./HotIO";
import { HotWebSocketServer } from "./HotWebSocketServer";

var Worker: any = null;

/**
 * A static route.
 */
export interface StaticRoute
{
	/**
	 * The route to the files.
	 */
	route?: string;
	/**
	 * The absolute path to the location of the files to 
	 * serve on this machine.
	 */
	localPath?: string;
}

/**
 * A HTTP header to send.
 */
export interface HTTPHeader
{
	/**
	 * The header type. Example: Content-Type
	 */
	type: string;
	/**
	 * The header value. Example: text/html
	 */
	value: string;
}

/**
 * A HTTP error.
 */
export class HttpError extends Error
{
	/**
	 * The status code.
	 */
	statusCode: number;

	constructor (message: string, statusCode: number = 400)
	{
		super (message);

		this.name = "HttpError";
		this.statusCode = statusCode;
	}
}

/**
 * A servable file extension.
 */
export interface ServableFileExtension
{
	/**
	 * The file extension that includes the period at the beginning.
	 * 
	 * @example .hott
	 */
	fileExtension: string;
	/**
	 * If set to true, this will generate the content to serve the file.
	 * Typically used for .hott files.
	 * 
	 * Default: false
	 */
	generateContent?: boolean;
	/**
	 * The headers to send with the file extension.
	 */
	headers?: HTTPHeader[];
}

/**
 * A HTTP server.
 */
export class HotHTTPServer extends HotServer
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
	 * If set to true, the websocket server will be started.
	 */
	useWebsocketServer: boolean;
	/**
	 * The websocket server to use.
	 */
	websocketServer: HotWebSocketServer;
	/**
	 * The static files and folders to serve.
	 */
	staticRoutes: StaticRoute[];
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
	/**
	 * Serve the following file extensions when requested. For any of these to be served 
	 * there has to be at least one file extension added prior to starting the server.
	 * Additional file extensions can be added after server start.
	 */
	serveFileExtensions: (string | ServableFileExtension)[];
	/**
	 * Do not serve these hott files.
	 */
	ignoreHottFiles: { [name: string]: boolean };
	/**
	 * The associated info with any hott files served. All values here will be 
	 * overwritten by whatever values are set in the server object in HotSite.json.
	 */
	hottFilesAssociatedInfo: {
			/**
			 * The default name for a served Hott file.
			 */
			name: string;
			/**
			 * The base url for a hott file.
			 */
			url: string;
			/**
			 * The JavaScript source path.
			 */
			jsSrcPath: string;
		};
	/**
	 * The uploads that have been sent to the server. Each key is an upload id that 
	 * has a list of file paths where the files can be retreived.
	 */
	uploads: {
			[uploadId: string]: {
				[key: string]: {
					name: string;
					size: number;
					path: string;
				}
			}
		};
	/**
	 * Auto delete upload options.
	 */
	autoDeleteUploadOptions: {
			afterUploadIdUse: boolean;
		};
	/**
	 * The request reporter interval.
	 */
	requestReporterInterval: NodeJS.Timeout;
	/**
	 * The number of requests served, this will be incremented each time a request is served, 
	 * and if it reaches (Number.MAX_SAFE_INTEGER - 1), it will be reset to 0.
	 */
	numRequestsServed: number;
	/**
	 * The active requests being processed currently.
	 */
	activeRequests: { [requestNum: number]: DOMHighResTimeStamp };
	/**
	 * If set to true, worker threads will be used. NOT WORKING YET. DO NOT USE.
	 */
	useWorkerThreads: boolean;
	/**
	 * The Swagger UI setttings.
	 */
	swaggerUI: {
		/**
		 * If set, this will start Swagger UI from either the JSON or YAML file provided.
		 * If this is set to a file ending with either .yml or .yaml it will be converted to JSON.
		 */
		filepath: string;
		/**
		 * The route to use.
		 * @default /swagger
		 */
		route: string;
		/**
		 * The loaded YAML or JSON.
		 */
		jsonObj: any;
	};
	/**
	 * The options to use when a new client has made a request.
	 */
	options: {
			/**
			 * Executes when the new client has requested the headers.
			 */
			onCall: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
			/**
			 * The headers to send with the response. Default:
			 * [
			 *	 { type: "Access-Control-Allow-Origin", value: "*" },
			 *	 { type: "Access-Control-Allow-Methods", value: "GET,HEAD,PUT,PATCH,POST,DELETE" },
			 *	 { type: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept" }
			 * ]
			 */
			headers: HTTPHeader[];
		};
	/**
	 * The CORS settings. By default the origin will be open to all.
	 * The CORS settings that are set here will also be used for the 
	 * websocket server as well.
	 */
	cors: {
			/**
			 * Executed when a CORS call has been made.
			 */
			onCORSCall: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
			/**
			 * The allowed CORS origins. Default: *
			 */
			origin: string;
			/**
			 * The allowed headers. Default: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
			 */
			allowedHeaders: string[];
		};
	/**
	 * The rate limiter settings. This is a fairly simple rate limiter, for more 
	 * complex scenarios you may have to customize the rate limiter by attaching it to 
	 * this.expressApp directly. This uses express-rate-limit.
	 */
	rateLimiter: {
			/**
			 * If set to true, the rate limiter will be enabled. By default it will be 
			 * true only if there's an API attached. Otherwise false.
			 * 
			 * @default false
			 */
			enabled: boolean;
			/**
			 * The number of milliseconds to remember requests for.
			 * 
			 * @default 60000
			 */
			windowLength: number;
			/**
			 * The number of requests allowed per window.
			 * 
			 * @default 500
			 */
			limit: number;
			/**
			 * The store to use for the rate limiter. For now, this requires Redis.
			 */
			store: {
					/**
					 * The Redis client to use. You can use a custom client here 
					 * or use the default client provided by ioredis by setting 
					 * the redisConfig below.
					 */
					redisClient: RedisClient;
					/**
					 * The Redis config. By default this is null, if a host is 
					 * entered, the default port will be 6379 if left empty.
					 * The username and password will not be used by default.
					 */
					redisConfig: {
							host?: string;
							port?: number;
							username?: string;
							password?: string;
							tls?: boolean;
							tlsInsecure?: boolean;
						};
				};
		};
	/**
	 * The function to execute when handling 404 errors.
	 */
	handle404: (req: express.Request, res: express.Response, next: any) => void;
	/**
	 * The function to execute when handling other errors.
	 */
	handleOther: (err: any, req: express.Request, res: express.Response, next: any) => void;
	/**
	 * The status code to respond with when an API error occurs.
	 */
	errorHandlingResponseCode: number;

	constructor (processor: HotStaq | HotServer, httpPort: number = null, httpsPort: number = null)
	{
		super (processor);

		this.expressApp = express ();
		this.httpListener = null;
		this.httpsListener = null;
		this.useWebsocketServer = false;
		this.websocketServer = null;
		this.staticRoutes = [{
				"localPath": process.cwd (),
				"route": "/"
			}];
		this.routes = [];
		this.serveFileExtensions = HotHTTPServer.getDefaultServableExtensions ();
		this.ignoreHottFiles = {};
		this.hottFilesAssociatedInfo = {
				name: "",
				url: "./",
				jsSrcPath: "./js/HotStaq.min.js"
			};
		this.uploads = {};
		this.autoDeleteUploadOptions = {
				afterUploadIdUse: true
			};
		this.requestReporterInterval = null;
		this.numRequestsServed = 0;
		this.activeRequests = {};
		this.useWorkerThreads = false;
		this.swaggerUI = {
				filepath: "",
				route: "/swagger",
				jsonObj: null
			};
		this.options = {
				onCall: null,
				headers: [
					{ type: "Access-Control-Allow-Origin", value: "*" },
					{ type: "Access-Control-Allow-Methods", value: "GET,HEAD,PUT,PATCH,POST,DELETE" },
					{ type: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept, Authorization" }
				]
			};
		this.cors = {
			onCORSCall: null,
			origin: "*",
			allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
		};
		this.rateLimiter = {
				enabled: false,
				windowLength: 60000,
				limit: 500,
				store: null
			};
		this.handle404 = null;
		this.handleOther = null;
		this.errorHandlingResponseCode = 500;

		if (process.env.LISTEN_ADDR != null)
		{
			if (process.env.LISTEN_ADDR !== "")
				this.listenAddress = process.env.LISTEN_ADDR;
		}

		if (process.env.USE_HTTP != null)
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

		if (process.env.HTTP_PORT != null)
		{
			if (process.env.HTTP_PORT !== "")
				this.ports.http = parseInt (process.env.HTTP_PORT);
		}

		if (process.env.HTTPS_PORT != null)
		{
			if (process.env.HTTPS_PORT !== "")
				this.ports.https = parseInt (process.env.HTTPS_PORT);
		}

		if (process.env.HTTPS_SSL_CERT != null)
		{
			if (process.env.HTTPS_SSL_CERT !== "")
				this.ssl.cert = process.env.HTTPS_SSL_CERT;

			if (process.env.HTTPS_SSL_KEY !== "")
				this.ssl.key = process.env.HTTPS_SSL_KEY;

			if (process.env.HTTPS_SSL_CA !== "")
				this.ssl.ca = process.env.HTTPS_SSL_CA;
		}

		let JSONLimit: string = "1mb";

		if (process.env.JSON_LIMIT != null)
		{
			if (process.env.JSON_LIMIT !== "")
				JSONLimit = process.env.JSON_LIMIT;
		}

		this.expressApp.options ("*", async (req: express.Request, res: express.Response, next: express.NextFunction) =>
			{
				if (this.options.onCall != null)
				{
					await this.options.onCall (req, res, next);

					return;
				}

				for (let iIdx = 0; iIdx < this.options.headers.length; iIdx++)
				{
					let header: HTTPHeader = this.options.headers[iIdx];

					res.header (header.type, header.value);
				}

				res.statusCode = 204;
				res.setHeader ("Content-Length", "0");
				res.end ();
			});
		this.expressApp.use (async (req: express.Request, res: express.Response, next: express.NextFunction) =>
			{
				if (this.cors.onCORSCall != null)
				{
					await this.cors.onCORSCall (req, res, next);

					return;
				}

				res.header ("Access-Control-Allow-Origin", this.cors.origin);
				res.header ("Access-Control-Allow-Headers", this.cors.allowedHeaders);

				next ();
			});
		this.expressApp.use (express.urlencoded ({ "extended": true }));
		this.expressApp.use (express.json ({ "limit": JSONLimit }));

		if (this.api != null)
		{
			if (this.rateLimiter.enabled === true)
			{
				const limiterObj = {
						windowMs: this.rateLimiter.windowLength,
						limit: this.rateLimiter.limit,
						standardHeaders: "draft-7"
					} as Partial<RateLimitOptions>;

				if (this.rateLimiter.store != null)
				{
					let client = this.rateLimiter.store.redisClient;

					if ((process.env["RATE_LIMITER_REDIS_HOST"] != null) || 
						(process.env["RATE_LIMITER_REDIS_PORT"] != null))
					{
						if (this.rateLimiter.store.redisConfig == null)
							this.rateLimiter.store.redisConfig = {};
					}

					this.rateLimiter.store.redisConfig.host = process.env["RATE_LIMITER_REDIS_HOST"] || "localhost";
					this.rateLimiter.store.redisConfig.port = parseInt (process.env["RATE_LIMITER_REDIS_PORT"]) || 6379;
					this.rateLimiter.store.redisConfig.username = process.env["RATE_LIMITER_REDIS_USERNAME"];
					this.rateLimiter.store.redisConfig.password = process.env["RATE_LIMITER_REDIS_PASSWORD"];
					this.rateLimiter.store.redisConfig.tls = false;
					this.rateLimiter.store.redisConfig.tlsInsecure = false;

					const tlsStr = process.env["RATE_LIMITER_REDIS_TLS"] || "0";
					const tlsInsecureStr = process.env["RATE_LIMITER_REDIS_TLS_INSECURE"] || "0";

					if (tlsStr === "1")
						this.rateLimiter.store.redisConfig.tls = true;

					if (tlsInsecureStr === "1")
						this.rateLimiter.store.redisConfig.tlsInsecure = true;

					let tlsObj = undefined;

					if (this.rateLimiter.store.redisConfig.tls === true)
					{
						tlsObj = {
							"rejectUnauthorized": !this.rateLimiter.store.redisConfig.tlsInsecure
						};
					}

					if (this.rateLimiter.store.redisConfig != null)
					{
						let redisOptions = {
								"host": this.rateLimiter.store.redisConfig.host,
								"port": this.rateLimiter.store.redisConfig.port
							} as RedisOptions;

						if (this.rateLimiter.store.redisConfig.username != null)
							redisOptions.username = this.rateLimiter.store.redisConfig.username;

						if (this.rateLimiter.store.redisConfig.password != null)
							redisOptions.password = this.rateLimiter.store.redisConfig.password;

						if (this.rateLimiter.store.redisConfig.tls != null)
							redisOptions.tls = tlsObj;

						client = new RedisClient (redisOptions);
					}

					limiterObj.store = new RedisStore ({
						// @ts-ignore
						sendCommand: (...args: string[]) => client.call (...args)
					});
				}

				const limiter = rateLimit (limiterObj);
				this.expressApp.use (limiter);
				this.logger.info (`Rate limiter enabled with window length ${this.rateLimiter.windowLength} and limit ${this.rateLimiter.limit}`);
			}
			else
				this.logger.info (`No rate limiter set!`);
		}
	}

	/**
	 * Get the method name to be used with Express.
	 */
	static getExpressMethodName (methodType: HotEventMethod): string
	{
		let expressMethod: string = "post";

		if (methodType === HotEventMethod.GET)
			expressMethod = "get";

		if (methodType === HotEventMethod.POST)
			expressMethod = "post";

		if (methodType === HotEventMethod.FILE_UPLOAD)
			expressMethod = "post";

		if (methodType === HotEventMethod.SSE_SUB_EVENT)
			expressMethod = "post";

		if (methodType === HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT)
			expressMethod = "ws_client_pub_event";

		if (methodType === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT)
			expressMethod = "post";

		return (expressMethod);
	}

	/**
	 * Get the default servable file extensions.
	 */
	static getDefaultServableExtensions (): ServableFileExtension[]
	{
		return ([{ fileExtension: ".hott", generateContent: true }, 
			{ fileExtension: ".htm", generateContent: false }, 
			{ fileExtension: ".html", generateContent: false }]);
	}

	/**
	 * Add a static route.
	 */
	addStaticRoute (route: string | StaticRoute, localPath: string = "."): void
	{
		let staticRoute: StaticRoute = null;

		if (typeof (route) === "string")
		{
			staticRoute = {
					"route": route,
					"localPath": localPath
				};
		}
		else
			staticRoute = route;

		this.staticRoutes.push (staticRoute);
		this.registerStaticRoute (staticRoute);
	}

	/**
	 * Add a route. This will be registered before any APIs are registered.
	 */
	addRoute (route: string, 
		method: (req: express.Request, res: express.Response) => Promise<void>, 
		type: HotEventMethod = HotEventMethod.GET): void
	{
		let newRoute = {
				type: type,
				route: route,
				method: method
			};

		this.routes.push (newRoute);
	}

	/**
	 * Serve a directory. This is an alias for addStaticRoute.
	 */
	serveDirectory (route: string | StaticRoute, localPath: string = "."): void
	{
		this.addStaticRoute (route, localPath);
	}

	/**
	 * Register a static route with Express.
	 */
	registerStaticRoute (route: StaticRoute): void
	{
		this.clearErrorHandlingRoutes ();
		this.preregisterRoute ();

		this.expressApp.use (route.route, express.static (ppath.normalize (route.localPath), {
				setHeaders: (res: express.Response, path: string, stat: fs.Stats) =>
				{
					for (let iJdx = 0; iJdx < this.serveFileExtensions.length; iJdx++)
					{
						let servableFile: (string | ServableFileExtension) = this.serveFileExtensions[iJdx];

						if (typeof (servableFile) === "string")
							continue;

						if (servableFile.headers == null)
							continue;

						if (servableFile.headers.length === 0)
							continue;

						if (path.indexOf (servableFile.fileExtension) > -1)
						{
							for (let iIdx = 0; iIdx < servableFile.headers.length; iIdx++)
							{
								let httpHeader: HTTPHeader = servableFile.headers[iIdx];

								if (httpHeader.type == null)
									throw new Error (`Missing HTTP header type on file extension ${servableFile.fileExtension}`);

								if (httpHeader.value == null)
									throw new Error (`Missing HTTP header value on file extension ${servableFile.fileExtension}`);

								res.header (httpHeader.type, httpHeader.value);
							}
						}

						this.logger.verbose (() => `Found file ${path} with headers ${JSON.stringify (res.getHeaders ())}`);
					}
				}
			}));
		this.logger.verbose (`Adding static route ${route.route} at path ${route.localPath}`);

		this.setErrorHandlingRoutes ();
	}

	/**
	 * Get a static route.
	 */
	getStaticRoute (route: string): StaticRoute
	{
		let foundRoute: StaticRoute = null;

		for (let iIdx = 0; iIdx < this.staticRoutes.length; iIdx++)
		{
			let tempRoute: StaticRoute = this.staticRoutes[iIdx];

			if (tempRoute.route === route)
			{
				foundRoute = tempRoute;

				break;
			}
		}

		return (foundRoute);
	}

	/**
	 * Register a route.
	 */
	async registerRoute (route: HotRoute): Promise<void>
	{
		try
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

				if (
						(method.type === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT) || 
						(method.type === HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT)
					)
				{
					if (this.useWebsocketServer === true)
						this.websocketServer.addRoute (route, method);

					if (method.type === HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT)
					{
						method.isRegistered = true;

						continue;
					}
				}

				let methodName: string = method.getRouteUrl ();
				method.isRegistered = true;

				if (typeof (method.type) !== "string")
					throw new Error (`When registering HTTP route, received invalid method type ${JSON.stringify (method.type)}`);

				if (methodName == null)
					throw new Error (`When registering HTTP route, a null/undefined method name was given.`);

				this.logger.verbose (`Adding HTTP route ${method.type} ${methodName}`);

				const expressType: string = HotHTTPServer.getExpressMethodName (method.type);

				// @ts-ignore
				this.expressApp[expressType] (methodName, 
					async (req: express.Request, res: express.Response) =>
					{
						if (method.type === HotEventMethod.SSE_SUB_EVENT)
						{
							this.logger.verbose (`Created SSE event for method: ${method.name}`);
							res.set ({
									'Content-Type': 'text/event-stream',
									'Cache-Control': 'no-cache',
									'Connection': 'keep-alive'
								})
							res.flushHeaders ();
						}

						let sendResponse = (value: any, requestNum: number) =>
							{
								let start = this.activeRequests[requestNum];
								let end = performance.now ();
								let diff = (end - start);

								delete this.activeRequests[requestNum];

								this.logger.verbose (`${methodName} took ${diff}ms`);

								if (value !== undefined)
								{
									if (value != null)
									{
										if (value.error != null)
										{
											let statusCode = this.errorHandlingResponseCode;

											if (value.errorCode != null)
												statusCode = value.errorCode;

											res.status (statusCode).json (value);

											return;
										}
									}

									res.status (200).json (value);
								}
							};

						if (this.useWorkerThreads === false)
						{
							if (this.numRequestsServed >= (Number.MAX_SAFE_INTEGER - 1))
								this.numRequestsServed = 0;

							const requestNum = this.numRequestsServed++;
						
							this.activeRequests[requestNum] = performance.now ();
							let response = await processRequest (this, this.logger, route, method, methodName, req, res);
							sendResponse (response, requestNum);

							return;
						}

						await new Promise<void> (async (resolve, reject) =>
							{
								let resolveIt = () =>
									{
										resolve ();
									};

								try
								{
									if (this.numRequestsServed >= (Number.MAX_SAFE_INTEGER - 1))
										this.numRequestsServed = 0;
		
									const requestNum = this.numRequestsServed++;

									this.activeRequests[requestNum] = performance.now ();

									// workerData.logger, workerData.route, workerData.method, workerData.methodName, workerData.req, workerData.res
									let worker = new Worker (`${__dirname}/HotHTTPServerThread.js`, {
											"workerData": {
													"logger": this.logger,
													"methodName": methodName
												}
										});

									worker.on ("message", function (requestNum2: number, value: any)
										{
											sendResponse (value, requestNum2);
											resolveIt ();
										}.bind (this, requestNum));
									worker.on ("error", (err: Error) =>
										{
											this.logger.error (`Error in worker: ${err.message}`);
											resolveIt ();
										});
									worker.on ("exit", function(requestNum2: number, code: number)
										{
											if (this.activeRequests[requestNum2] != null)
												delete this.activeRequests[requestNum2];

											this.logger.verbose (`Worker exited with code: ${code}`);
											resolveIt ();
										}.bind (this, requestNum));
									worker.postMessage ({});
								}
								catch (ex)
								{
									this.logger.error (`Unable to start worker thread ${ex.message}`);
									resolveIt ();
								}
							});
					});
			}

			this.setErrorHandlingRoutes ();
		}
		catch (ex)
		{
			let msg: string = ex.message;

			if (ex.stack != null)
				msg = ex.stack;

			this.logger.error (`HotHTTPServer error: ${msg}`);
			throw ex;
		}
	}

	/**
	 * Check if a file exists.
	 */
	static async checkIfFileExists (filepath: string): Promise<boolean>
	{
		return (await new Promise<boolean> ((resolve, reject) =>
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
	 * Delete the uploads for a given upload id.
	 */
	async deleteUploads (uploadId: string): Promise<void>
	{
		let uploads = this.uploads[uploadId];

		if (uploads == null)
			return;

		for (let key in uploads)
		{
			let upload = uploads[key];
			const uploadPath: string = ppath.normalize (upload.path);

			if (await HotIO.exists (uploadPath) === true)
				await HotIO.rm (uploadPath);
		}

		delete this.uploads[uploadId];
	}

	/**
	 * The routes to add before registering a route.
	 */
	preregisterRoute (): void
	{
		this.expressApp.use ((req: express.Request, res: express.Response, next: any): void =>
			{
				const url: string = `${req.protocol}://${req.get ("host")}${req.originalUrl}`;
				this.logger.verbose (`IP ${req.ip} initial request: ${req.method} ${req.httpVersion} ${url}`);

				next ();
			});

		for (let iIdx = 0; iIdx < this.routes.length; iIdx++)
		{
			let route = this.routes[iIdx];
			const expressType: string = HotHTTPServer.getExpressMethodName (route.type);

			/// @ts-ignore
			this.expressApp[expressType] (route.route, route.method);
			this.logger.verbose (`Added route ${route.type} ${route.route}`);
		}

		if (this.processor.hotSite != null)
		{
			if (this.processor.hotSite.server != null)
			{
				if (this.processor.hotSite.server.serveFileExtensions != null)
					this.serveFileExtensions = this.processor.hotSite.server.serveFileExtensions;
			}

			if (this.processor.hotSite.routes != null)
			{
				// Ignore any hott files from any routes. The routes will return the 
				// hott files themselves.
				for (let key in this.processor.hotSite.routes)
				{
					let route = this.processor.hotSite.routes[key];
					let filename: string = ppath.basename (route.url);

					this.ignoreHottFiles[filename] = true;
					this.logger.verbose (`Ignoring Hott file ${filename}`);
				}
			}
		}

		if (this.serveFileExtensions.length > 0)
		{
			if (this.isAPIServerOnly () === true)
				return;

			this.logger.verbose (() => `Set to serve files: ${JSON.stringify (this.serveFileExtensions)}`);

			this.expressApp.use ((req: express.Request, res: express.Response, next: any): void =>
				{
					(async () =>
					{
						try
						{
							let bodyObj: any = req.body;
							let queryObj: any = req.query;

							this.logger.verbose (() => `Method: ${req.method} Requested URL: ${req.originalUrl} Body: ${JSON.stringify (bodyObj)}, Query: ${JSON.stringify (queryObj)}`);

							let requestedUrl: string = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
							let foundUrl: string = HotStaq.getValueFromHotSiteObj (this.processor.hotSite, ["server", "url"]);

							if (foundUrl != null)
							{
								if (foundUrl[(foundUrl.length - 1)] === "/")
									foundUrl = foundUrl.substr (0, (foundUrl.length - 1));

								let addSlash: string = "/";

								if (req.originalUrl[0] === "/")
									addSlash = "";

								requestedUrl = `${foundUrl}${addSlash}${req.originalUrl}`;
							}

							let url: URL = new URL (requestedUrl);
							const urlFilepath: string = url.pathname;
							const filepath: string = ppath.basename (urlFilepath);
							const extname: string = ppath.extname (filepath).toLowerCase ();
							let skipSecretFiles: boolean = true;

							// Skip any files that could contain secrets.
							if (this.processor.hotSite != null)
							{
								if (this.processor.hotSite.server != null)
								{
									if (this.processor.hotSite.server.serveSecretFiles === false)
										skipSecretFiles = false;
								}
							}

							if (skipSecretFiles === true)
							{
								let skipCurrentFile: boolean = false;
								const lowerFilePath: string = filepath.toLowerCase ();

								if (lowerFilePath === ".env")
									skipCurrentFile = true;

								if ((lowerFilePath === ".npmrc") || (lowerFilePath === ".yarnrc"))
									skipCurrentFile = true;

								if (lowerFilePath === "hotsite.json")
									skipCurrentFile = true;

								if (extname === ".pem")
									skipCurrentFile = true;

								if (skipCurrentFile === true)
								{
									const errMsg: string = `Refused to serve file ${filepath}. Could contain secrets.`;

									this.handleOther (new Error (errMsg), req, res, next);

									return;
								}
							}

							// This if statement ensures the requested file is not on the ignore list.
							if (this.ignoreHottFiles[filepath] != null)
							{
								// Ignore the file.
							}
							else
							{
								let sendHottContent = async (fullUrl: URL, route: string): Promise<void> =>
									{
										// Appending hstqserve ensures that the content will not be resent.
										fullUrl.searchParams.append ("hstqserve", "nahfam");

										const content: string = await this.processor.generateContent (route, 
											this.hottFilesAssociatedInfo.name,
											fullUrl.toString (),
											this.hottFilesAssociatedInfo.jsSrcPath);
										// The content will be generated and sent to the client. The client 
										// will then request the real page that contains the file.

										res.setHeader ("Content-Type", "text/html");
										this.logger.verbose (() => `Sending generated hott content with headers ${JSON.stringify (res.getHeaders ())}`);
										res.status (200).send (content);
									};
								let sendFileContent = (path: string, fileExt: string, iServableFile: ServableFileExtension): void =>
									{
										if (iServableFile != null)
										{
											if (iServableFile.fileExtension != null)
											{
												if (path.indexOf (iServableFile.fileExtension) > -1)
												{
													if (iServableFile.headers != null)
													{
														if (iServableFile.headers.length > 0)
														{
															for (let iIdx = 0; iIdx < iServableFile.headers.length; iIdx++)
															{
																let httpHeader: HTTPHeader = iServableFile.headers[iIdx];

																if (httpHeader.type == null)
																	throw new Error (`Missing HTTP header type on file extension ${fileExt}`);

																if (httpHeader.value == null)
																	throw new Error (`Missing HTTP header value on file extension ${fileExt}`);

																res = res.header (httpHeader.type, httpHeader.value);
															}

															if (ppath.isAbsolute (path) === false)
																path = ppath.normalize (`${process.cwd ()}/${path}`);

															this.logger.verbose (() => `Sending file ${path} with headers ${JSON.stringify (res.getHeaders ())}`);
															res = res.status (200);
															res.sendFile (path);

															return;
														}
													}
												}
											}
										}

										if (fileExt === ".hott")
											res.setHeader ("Content-Type", "text/html");
										else
										{
											let mimeType = mimeTypes.lookup (fileExt);

											if (typeof (mimeType) === "string")
												res.setHeader ("Content-Type", mimeType);
										}

										if (ppath.isAbsolute (path) === false)
											path = ppath.normalize (`${process.cwd ()}/${path}`);

										this.logger.verbose (() => `Sending file ${path} with headers ${JSON.stringify (res.getHeaders ())}`);
										res.status (200).sendFile (path);
									};

								let result: string = "";
								let hstqserve = url.searchParams.get ("hstqserve");

								if (hstqserve != null)
									result = hstqserve;

								// Make sure we're not accidentally resending the content.
								if (result !== "nahfam")
								{
									for (let iIdx = 0; iIdx < this.staticRoutes.length; iIdx++)
									{
										let staticRoute: StaticRoute = this.staticRoutes[iIdx];
										let checkDir: string = staticRoute.localPath;
										const route: string = urlFilepath;
										let tempFilepath: string = urlFilepath;
										let sendContentFlag: boolean = false;
										let generateContent: boolean = false;
										let foundServableFile: ServableFileExtension = null;

										if (checkDir === "")
											checkDir = process.cwd ();

										if ((checkDir === ".") || (checkDir === "./"))
											checkDir = process.cwd ();

										for (let iJdx = 0; iJdx < this.serveFileExtensions.length; iJdx++)
										{
											let servableFile: (string | ServableFileExtension) = this.serveFileExtensions[iJdx];
											let serveFileExt: string = "";

											if (typeof (servableFile) === "string")
												serveFileExt = servableFile;
											else
											{
												serveFileExt = servableFile.fileExtension;

												if (servableFile.generateContent != null)
													generateContent = servableFile.generateContent;
											}

											if (tempFilepath.indexOf (serveFileExt) > -1)
											{
												if (await HotHTTPServer.checkIfFileExists (
													ppath.normalize (`${checkDir}/${tempFilepath}`)) === true)
												{
													sendContentFlag = true;

													if (typeof (servableFile) !== "string")
														foundServableFile = servableFile;

													break;
												}
											}

											if (sendContentFlag === false)
											{
												if (await HotHTTPServer.checkIfFileExists (
													ppath.normalize (`${checkDir}/${tempFilepath}${serveFileExt}`)) === true)
												{
													sendContentFlag = true;

													if (typeof (servableFile) !== "string")
														foundServableFile = servableFile;

													url.pathname += serveFileExt;

													break;
												}
											}

											if (sendContentFlag === false)
											{
												if (await HotHTTPServer.checkIfFileExists (
													ppath.normalize (`${checkDir}/${tempFilepath}index${serveFileExt}`)) === true)
												{
													// If no content has been found, send the index.
													tempFilepath += `index${serveFileExt}`;
													sendContentFlag = true;

													if (typeof (servableFile) !== "string")
														foundServableFile = servableFile;

													break;
												}
											}
										}

										if (tempFilepath !== urlFilepath)
											url.pathname = tempFilepath;

										if (sendContentFlag === true)
										{
											if (generateContent === true)
												await sendHottContent (url, route);
											else
											{
												sendFileContent (
													ppath.normalize (`${checkDir}/${tempFilepath}`),
													extname,
													foundServableFile);
											}

											return;
										}
									}
								}
								else
									this.logger.verbose (`Received nahfam, content has already been sent.`);
							}
						}
						catch (ex)
						{
							this.logger.error (`Middleware error: ${ex.message}`);
						}

						next ();
					})();
				});
		}
	}

	/**
	 * Get all files uploaded.
	 */
	static async getFileUploads (req: express.Request, 
		options: Options = {
				multiples: true, 
				enabledPlugins: ["octetstream", "multipart"]
			}): Promise<Files>
	{
		return (new Promise<Files> ((resolve, reject) =>
			{
				let resolveIt: boolean = true;

				if (req.headers["content-type"] != null)
				{
					if (req.headers["content-type"].indexOf ("multipart/form-data") > -1)
					{
						const form = new IncomingForm (options);

						form.parse (req, (err: any, fields: Fields, files: Files) =>
							{
								if (err != null)
								{
									/// @fixme Is it ok to ignore this error?
									if (err.message !== "no parser found")
										throw err;
								}
				
								resolve (files);
							});
						resolveIt = false;
					}
				}

				if (resolveIt === true)
					resolve ({});
			}));
	}

	/**
	 * Set the error handlers. This will create two express routes at the bottom of the
	 * route stack. The first will be to capture any 404 errors, the second would be to 
	 * catch any remaining errors.
	 */
	setErrorHandlingRoutes (): void
	{
		if (this.handle404 == null)
		{
			this.handle404 = (req: express.Request, res: express.Response, next: any): void =>
				{
					this.logger.verbose (() => `404 ${JSON.stringify (req.url)}`);

					let on404: string = HotStaq.getValueFromHotSiteObj (this.processor.hotSite, ["server", "errors", "on404"]);

					if (on404 != null)
						res.status (404).sendFile (on404);
					else
						res.status (404).send ({ error: "404" });
				};
		}

		if (this.handleOther == null)
		{
			this.handleOther = (err: any, req: express.Request, res: express.Response, next: any): void =>
				{
					let stack: string = "";
					let msg: string = "";

					if (err != null)
					{
						stack = err.stack;
						msg = err.message;
					}

					this.logger.verbose (() => `500 Server error ${JSON.stringify (stack)}`);

					let onOther: string = HotStaq.getValueFromHotSiteObj (this.processor.hotSite, ["server", "errors", "onOther"]);

					if (onOther != null)
						res.status (500).sendFile (onOther);
					else
						res.status (500).send ({ error: `Server error: ${msg}` });
				};
		}

		// This is a hack to force the function names, so we can find them and delete them later.
		Object.defineProperty (this.handle404, "name", 
			{
				value: "handle404"
			});
		Object.defineProperty (this.handleOther, "name", 
			{
				value: "handleOther"
			});

		this.expressApp.use (this.handle404);
		this.expressApp.use (this.handleOther);
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
				try
				{
					if (this.swaggerUI.filepath !== "")
					{
						const fileExt: string = ppath.extname (this.swaggerUI.filepath).toLowerCase ();

						this.logger.info (`Starting Swagger UI on route "${this.swaggerUI.route}" from ${this.swaggerUI.filepath}`);

						if ((fileExt === ".yml") || (fileExt === ".yaml"))
						{
							this.logger.verbose (() => `Reading YAML file ${this.swaggerUI.filepath}`);
							this.swaggerUI.jsonObj = await HotIO.readYAMLFile (this.swaggerUI.filepath);
						}
						else
						{
							this.logger.verbose (() => `Reading JSON file ${this.swaggerUI.filepath}`);
							this.swaggerUI.jsonObj = await HotIO.readJSONFile (this.swaggerUI.filepath);
						}

						this.logger.verbose (() => `Finished parsing file ${this.swaggerUI.filepath}`);


						let protocol: string = "http";
						let port: number = this.ports.http;

						if (this.ssl.cert !== "")
						{
							protocol = "https";
							port = this.ports.https;
						}

						let listenStr = this.listenAddress;

						if (listenStr === "0.0.0.0")
							listenStr = "localhost";

						const baseUrl = `${protocol}://${listenStr}:${port}/`;

						if (this.swaggerUI.jsonObj.servers == null)
							this.swaggerUI.jsonObj.servers = [];

						this.swaggerUI.jsonObj.servers.unshift ({ url: baseUrl });

						this.expressApp.use (this.swaggerUI.route, swaggerUI.serve, swaggerUI.setup(this.swaggerUI.jsonObj));
					}

					let JSONLimit: string = "1mb";

					if (process.env.JSON_LIMIT != null)
					{
						if (process.env.JSON_LIMIT !== "")
							JSONLimit = process.env.JSON_LIMIT;
					}

					this.logger.info (`Access-Control-Allow-Origin: ${this.cors.origin}`);
					this.logger.info (`Access-Control-Allow-Headers: ${this.cors.allowedHeaders}`);
					this.logger.info (`JSON limit: ${JSONLimit}`);

					if (this.useWorkerThreads === true)
					{
						Worker = require ("node:worker_threads").Worker;
						this.logger.info (`WARNING: WORKER THREADS ENABLED. THIS IS AN EXPERIMENTAL FEATURE AND IS MOST LIKELY NOT WORKING YET.`);
					}

					if (this.useWebsocketServer === true)
						this.websocketServer = new HotWebSocketServer (this);

					let completedSetup = () =>
						{
							let protocol: string = "http";
							let port: number = this.ports.http;

							if (this.ssl.cert !== "")
							{
								protocol = "https";
								port = this.ports.https;
							}

							this.logger.info (`HotStaq Version ${HotStaq.version}`);
							this.logger.info (`${this.serverType} listening on ${protocol}://${this.listenAddress}:${port}/`);

							if (this.processor.hotSite != null)
								this.logger.verbose (() => `Using HotSite object: ${JSON.stringify (this.processor.hotSite)}`);

							resolve ();
						};

					if (this.processor.hotSite != null)
					{
						let hotsiteServer = this.processor.hotSite.server;

						if (hotsiteServer != null)
						{
							if (hotsiteServer.serveDirectories != null)
							{
								if (this.isAPIServerOnly () === false)
								{
									for (let iIdx = 0; iIdx < hotsiteServer.serveDirectories.length; iIdx++)
									{
										let directory = hotsiteServer.serveDirectories[iIdx];
						
										this.staticRoutes.push ({
												"route": directory.route,
												"localPath": ppath.normalize (directory.localPath)
											});
									}
								}
							}

							if (hotsiteServer.ports != null)
							{
								if (hotsiteServer.ports.http != null)
									this.ports.http = hotsiteServer.ports.http;

								if (hotsiteServer.ports.https != null)
									this.ports.https = hotsiteServer.ports.https;

								if (hotsiteServer.ports.redirectHTTPtoHTTPS != null)
									this.redirectHTTPtoHTTPS = hotsiteServer.ports.redirectHTTPtoHTTPS;
							}
						}
					}

					if (this.isAPIServerOnly () === false)
					{
						await this.processor.createExpressRoutes (this.expressApp);

						for (let iIdx = 0; iIdx < this.staticRoutes.length; iIdx++)
						{
							let staticRoute: StaticRoute = this.staticRoutes[iIdx];

							this.registerStaticRoute (staticRoute);
						}
					}

					if (this.api != null)
					{
						if (this.api.onPreRegister != null)
						{
							let continueRegistering: boolean = await this.api.onPreRegister ();

							if (continueRegistering === false)
								return;
						}

						// Process pre registration for the routes and methods.
						for (let key in this.api.routes)
						{
							let route: HotRoute = this.api.routes[key];

							if (route.onPreRegister != null)
								await route.onPreRegister ();

							for (let iIdx = 0; iIdx < route.methods.length; iIdx++)
							{
								let method: HotRouteMethod = route.methods[iIdx];

								if (method.onPreRegister != null)
									await method.onPreRegister ();
							}

							this.api.createAPIRouteMethods (route.route);
						}

						// Register all the routes.
						await this.api.registerRoutes ();

						// Process post registration for the API.
						if (this.api.onPostRegister != null)
						{
							let continueOn: boolean = await this.api.onPostRegister ();

							if (continueOn === false)
								return;
						}

						// Process post registration for the routes and methods.
						for (let key in this.api.routes)
						{
							let route: HotRoute = this.api.routes[key];

							if (route.onPostRegister != null)
								await route.onPostRegister ();

							for (let iIdx = 0; iIdx < route.methods.length; iIdx++)
							{
								let method: HotRouteMethod = route.methods[iIdx];

								if (method.onPostRegister != null)
									await method.onPostRegister ();
							}
						}
					}

					let requestReporter = () =>
					{
						let numRequests: number = Object.keys(this.activeRequests).length;

						if (numRequests < 1)
						{
							clearInterval (this.requestReporterInterval);

							this.logger.info (`Finished processing all requests...`);

							return;
						}

						this.logger.info (`Still processing ${numRequests} requests...`);
					};
					let sigHandler = (typeReceived: string, serverType: string, listener: any) =>
						{
							this.logger.info (`${typeReceived} signal received: Stopping ${serverType} server. Data loss and partial database writes can occur if this is stopped prematurely.`);

							listener.close (() => {
								this.logger.info(`${serverType} server stopped. No longer listening for any new incoming requests...`);

								this.requestReporterInterval = setInterval (() =>
								{
									requestReporter ();
								}, 2000);
							});
						};

					if (this.ssl.cert === "")
					{
						this.httpListener = http.createServer (this.expressApp);

						this.logger.info (`HTTP Listening on address: ${this.listenAddress}`);
						this.httpListener.listen (this.ports.http, this.listenAddress, completedSetup);

						process.on ('SIGTERM', sigHandler.bind (this, "SIGTERM", "HTTP", this.httpListener));
						process.on ('SIGINT', sigHandler.bind (this, "SIGINT", "HTTP", this.httpListener));
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
							this.logger.info (`HTTP Listening on address: ${this.listenAddress}`);		
							this.httpListener.listen (this.ports.http, this.listenAddress, () =>
								{
									this.logger.info (`Redirecting HTTP(${this.ports.http}) traffic to HTTPS(${this.ports.https})`);
								});

							let stopRedirectServer = () => 
								{
									this.logger.info (`SIGTERM signal received: Stopping HTTP redirect server. Data loss and partial database writes can occur if this is stopped prematurely.`);
		
									this.httpListener.close (() => {
										this.logger.info(`HTTP redirect server stopped`);
									});
								};

							process.on ('SIGTERM', stopRedirectServer);
							process.on ('SIGINT', stopRedirectServer);
						}

						this.httpsListener = https.createServer ({
								cert: this.ssl.cert,
								key: this.ssl.key,
								ca: this.ssl.ca
							}, this.expressApp);
						this.logger.info (`HTTPS Listening on address: ${this.listenAddress}`);
						this.httpsListener.listen (this.ports.https, this.listenAddress, completedSetup);

						process.on ('SIGTERM', sigHandler.bind (this, "SIGTERM", "HTTPS", this.httpsListener));
						process.on ('SIGINT', sigHandler.bind (this, "SIGINT", "HTTPS", this.httpsListener));
					}

					if (this.useWebsocketServer === true)
						this.websocketServer.setup ();
				}
				catch (ex)
				{
					let msg: string = "";

					if (ex != null)
					{
						msg = ex.message;

						if (ex.stack != null)
							msg = ex.stack;
					}

					this.logger.error (`HotHTTPServer Error: ${msg}`);

					if (ex != null)
						throw (ex);
				}
			})
			.catch ((reason: any) =>
				{
					let msg: string = "";

					if (reason != null)
					{
						if (typeof (reason) === "string")
							msg = reason;

						if (reason.message != null)
							msg = reason.message;

						if (reason.stack != null)
							msg = reason.stack;
					}

					this.logger.error (`HotHTTPServer Error: ${msg}`);

					if (reason != null)
						throw reason;
				});

		return (promise);
	}

	/**
	 * Start the server.
	 * 
	 * @param localStaticPath The public path that contains the HTML, Hott files, images, and 
	 * all public content. This can also be an array of StaticRoutes.
	 * @param httpPort The HTTP port to listen on .
	 * @param httpsPort The HTTPS port to listen on.
	 * @param processor The HotStaq or parent server being used for communication.
	 */
	static async startServer (localStaticPath: string | StaticRoute[] = null, 
		httpPort: number = 5000, httpsPort: number = 443, 
		processor: HotServer | HotStaq = null,): 
			Promise<{ processor: HotServer | HotStaq; server: HotHTTPServer; }>
	{
		if (processor == null)
			processor = new HotStaq ();

		let webServer: HotHTTPServer = new HotHTTPServer (processor, httpPort, httpsPort);

		if (localStaticPath == null)
			localStaticPath = process.cwd ();

		if (typeof (localStaticPath) === "string")
			webServer.addStaticRoute ("/", localStaticPath);
		else
		{
			for (let iIdx = 0; iIdx < localStaticPath.length; iIdx++)
			{
				let staticRoute: StaticRoute = localStaticPath[iIdx];

				webServer.addStaticRoute (staticRoute);
			}
		}

		await webServer.listen ();

		return ({ processor: processor, server: webServer });
	}

	/**
	 * Is this server running with an API server?
	 */
	isAPIServerOnly (): boolean
	{
		if (this.serverType === "API Server")
			return (true);

		return (false);
	}

	/**
	 * Is this server running with an API server?
	 */
	isAPIServerRunning (): boolean
	{
		if ((this.serverType === "Web-API Server") || 
			(this.serverType === "API Server"))
		{
			return (true);
		}

		return (false);
	}

	/**
	 * Shutdown the server.
	 */
	async shutdown (): Promise<void>
	{
		this.logger.verbose (`Shutting down HTTP server...`);
		await new Promise<void> (async (resolve, reject) =>
			{
				let promises: Promise<void>[] = [];

				if (this.websocketServer != null)
					promises.push (this.websocketServer.stop ());

				if (this.httpListener != null)
				{
					promises.push (new Promise<void> ((resolve2, reject) =>
						{
							this.httpListener.close ((err: NodeJS.ErrnoException) =>
								{
									this.expressApp = null;

									if (err != null)
									{
										if (err.code != null)
										{
											if (err.code !== "ERR_SERVER_NOT_RUNNING")
												throw err;
										}
									}

									this.logger.verbose (`HTTP server has shut down.`);
									resolve2 ();
								});
						}));
				}

				if (this.httpsListener != null)
				{
					promises.push (new Promise<void> ((resolve2, reject) =>
						{
							this.httpsListener.close ((err: NodeJS.ErrnoException) =>
								{
									this.expressApp = null;

									if (err != null)
									{
										if (err.code != null)
										{
											if (err.code !== "ERR_SERVER_NOT_RUNNING")
												throw err;
										}
									}

									this.logger.verbose (`HTTPS server has shut down.`);
									resolve2 ();
								});
						}));
				}

				await Promise.all (promises);

				this.logger.verbose (`All servers have shut down.`);
				resolve ();
			});
	}
}