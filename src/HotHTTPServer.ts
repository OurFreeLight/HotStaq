import * as http from "http";
import * as https from "https";
import * as ppath from "path";
import * as fs from "fs";
import { F_OK } from "constants";

import express from "express";
import mimeTypes from "mime-types";
import { Fields, Files, IncomingForm, Options } from "formidable";
import { v4 as uuidv4 } from "uuid";

import { HotServer } from "./HotServer";
import { HotStaq } from "./HotStaq";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HTTPMethod } from "./HotRouteMethod";
import { EventExecutionType, HotAPI } from "./HotAPI";
import { HotIO } from "./HotIO";

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
	 * Default: true
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
			type: HTTPMethod;
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
	 * Serve the following file extensions when requested.
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

	constructor (processor: HotStaq | HotServer, httpPort: number = null, httpsPort: number = null)
	{
		super (processor);

		this.expressApp = express ();
		this.httpListener = null;
		this.httpsListener = null;
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
				res.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

				next ();
			});
		this.expressApp.use (express.urlencoded ({ "extended": true }));
		this.expressApp.use (express.json ({ "limit": JSONLimit }));
	}

	/**
	 * Get the method name to be used with Express.
	 */
	static getExpressMethodName (methodType: HTTPMethod): string
	{
		let expressMethod: string = "post";

		if (methodType === HTTPMethod.GET)
			expressMethod = "get";

		if (methodType === HTTPMethod.POST)
			expressMethod = "post";

		if (methodType === HTTPMethod.FILE_UPLOAD)
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
	addRoute (route: string, method: (req: express.Request, res: express.Response) => Promise<void>, 
				type: HTTPMethod = HTTPMethod.GET): void
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

		this.expressApp.use (route.route, express.static (ppath.normalize (route.localPath)));
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

				let methodName: string = "/";

				if (route.version !== "")
					methodName += `${route.version}/`;

				if (route.prefix !== "")
					methodName += `${route.prefix}/`;

				if (route.route !== "")
					methodName += `${route.route}/`;

				methodName += method.name;
				method.isRegistered = true;

				this.logger.verbose (`Adding route ${method.type} ${methodName}`);

				const expressType: string = HotHTTPServer.getExpressMethodName (method.type);

				// @ts-ignore
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

						this.logger.verbose (`${req.method} ${methodName}, JSON: ${JSON.stringify (jsonObj)}, Query: ${JSON.stringify (queryObj)}`);

						if (method.onServerAuthorize != null)
						{
							try
							{
								authorizationValue = 
									await method.onServerAuthorize.call (thisObj, req, res, jsonObj, queryObj);
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
								try
								{
									authorizationValue = await route.onAuthorizeUser (req, res);
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
						}

						this.logger.verbose (`${req.method} ${methodName}, Authorized: ${hasAuthorization}, Authorization Value: ${authorizationValue}`);

						if (hasAuthorization === true)
						{
							let uploadedFiles: any = await HotHTTPServer.getFileUploads(req);

							if (Object.keys (uploadedFiles).length > 0)
							{
								const hotstaqUploadId: string = uuidv4 ();

								this.uploads[hotstaqUploadId] = {};
								const tempDir: string = process.env["TEMP_UPLOAD_DIR"] || "./temp/";

								try
								{
									await HotIO.mkdir (tempDir);
								}
								catch (ex)
								{
								}

								for (let key in uploadedFiles)
								{
									let uploadedFile: File = uploadedFiles[key];
									/// @ts-ignore
									const newFilePath: string = ppath.normalize (`${tempDir}/${uploadedFile.originalFilename}`);

									/// @ts-ignore
									await HotIO.moveFile (uploadedFile.filepath, newFilePath, { overwrite: true });

									let uploadedObj: any = {
										/// @ts-ignore
										name: uploadedFile.originalFilename,
										size: uploadedFile.size,
										// @ts-ignore
										path: newFilePath
									};

									this.uploads[hotstaqUploadId][key] = uploadedObj;
								}

								this.logger.verbose (`${req.method} ${methodName}, Upload ID: ${hotstaqUploadId}, Received uploads: ${JSON.stringify (this.uploads[hotstaqUploadId])}`);

								res.json ({
										hotstaq: {
											uploads: {
												uploadId: hotstaqUploadId
											}
										}
									});

								return;
							}

							if (method.onServerExecute != null)
							{
								let hotstaq: any = jsonObj["hotstaq"];
								let foundUploadId: string = "";

								if (hotstaq != null)
								{
									if (hotstaq["uploads"] != null)
									{
										if (hotstaq["uploads"]["uploadId"] != null)
										{
											let hotstaqUploadId: string = hotstaq["uploads"]["uploadId"];

											if (this.uploads[hotstaqUploadId] != null)
											{
												hotstaq["uploads"]["files"] = this.uploads[hotstaqUploadId];
												foundUploadId = hotstaqUploadId;
											}
										}
									}
								}

								try
								{
									let files: any = {};

									if (foundUploadId !== "")
										files = this.uploads[foundUploadId];

									let result: any = 
										await method.onServerExecute.call (
											thisObj, req, res, authorizationValue, 
											jsonObj, queryObj, files);

									this.logger.verbose (`${req.method} ${methodName}, Response: ${result}`);

									if (result !== undefined)
										res.json (result);
								}
								catch (ex)
								{
									this.logger.verbose (`Execution error: ${ex.message}`);
									res.json ({ error: ex.message });
								}

								if (foundUploadId !== "")
								{
									if (this.autoDeleteUploadOptions.afterUploadIdUse === true)
										await this.deleteUploads (foundUploadId);
								}
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

			await HotIO.rm (ppath.normalize (upload.path));
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
				this.logger.verbose (`Requested: ${req.method} ${req.httpVersion} ${url}`);

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

		let serveFileExtensions: (string | ServableFileExtension)[] = this.serveFileExtensions;

		if (this.processor.hotSite != null)
		{
			if (this.processor.hotSite.server != null)
			{
				if (this.processor.hotSite.server.serveFileExtensions != null)
					serveFileExtensions = this.processor.hotSite.server.serveFileExtensions;
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

		if (serveFileExtensions.length > 0)
		{
			this.logger.verbose (`Set to serve files: ${JSON.stringify (serveFileExtensions)}`);

			this.expressApp.use ((req: express.Request, res: express.Response, next: any): void =>
				{
					(async () =>
					{
						let bodyObj: any = req.body;
						let queryObj: any = req.query;

						this.logger.verbose (`Method: ${req.method} Requested URL: ${req.originalUrl} Body: ${JSON.stringify (bodyObj)}, Query: ${JSON.stringify (queryObj)}`);

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

								this.logger.verbose (errMsg);
								res.status (500).send ({ error: errMsg });

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
							let sendHottContent = (fullUrl: URL, route: string): void =>
								{
									// Appending hstqserve ensures that the content will not be resent.
									fullUrl.searchParams.append ("hstqserve", "nahfam");

									const content: string = this.processor.generateContent (route, 
										this.hottFilesAssociatedInfo.name,
										fullUrl.toString (),
										this.hottFilesAssociatedInfo.jsSrcPath);
									// The content will be generated and sent to the client. The client 
									// will then request the real page that contains the file.

									res.setHeader ("Content-Type", "text/html");
									res.send (content);
								};
							let sendFileContent = (path: string, fileExt: string, iServableFile: ServableFileExtension): void =>
								{
									if (iServableFile != null)
									{
										if (iServableFile.fileExtension != null)
										{
											if (fileExt === iServableFile.fileExtension)
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

															res.header (httpHeader.type, httpHeader.value);
														}

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

									res.sendFile (path);
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
									let generateContent: boolean = true;
									let foundServableFile: ServableFileExtension = null;

									if (checkDir === "")
										checkDir = process.cwd ();

									if ((checkDir === ".") || (checkDir === "./"))
										checkDir = process.cwd ();

									for (let iJdx = 0; iJdx < serveFileExtensions.length; iJdx++)
									{
										let servableFile: (string | ServableFileExtension) = serveFileExtensions[iJdx];
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

												if (typeof (serveFileExt) !== "string")
													foundServableFile = serveFileExt;

												break;
											}
										}

										if (sendContentFlag === false)
										{
											if (await HotHTTPServer.checkIfFileExists (
												ppath.normalize (`${checkDir}/${tempFilepath}${serveFileExt}`)) === true)
											{
												sendContentFlag = true;

												if (typeof (serveFileExt) !== "string")
													foundServableFile = serveFileExt;

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

												if (typeof (serveFileExt) !== "string")
													foundServableFile = serveFileExt;

												break;
											}
										}
									}

									if (tempFilepath !== urlFilepath)
										url.pathname = tempFilepath;

									if (sendContentFlag === true)
									{
										if (generateContent === true)
											sendHottContent (url, route);
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
		return (await new Promise<Files> ((resolve, reject) =>
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
			}));
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
					this.logger.verbose (`404 ${JSON.stringify (req.url)}`);
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
				try
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

							this.logger.info (`${this.serverType} listening on ${protocol}://${this.listenAddress}:${port}/`);
							this.logger.verbose (`Using HotSite object: ${JSON.stringify (this.processor.hotSite)}`);

							resolve ();
						};

					if (this.processor.hotSite != null)
					{
						let hotsiteServer = this.processor.hotSite.server;

						if (hotsiteServer != null)
						{
							if (hotsiteServer.serveDirectories != null)
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

					this.processor.createExpressRoutes (this.expressApp);

					for (let iIdx = 0; iIdx < this.staticRoutes.length; iIdx++)
					{
						let staticRoute: StaticRoute = this.staticRoutes[iIdx];

						this.registerStaticRoute (staticRoute);
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
				}
				catch (ex)
				{
					let msg: string = ex.message;

					if (ex.stack != null)
						msg = ex.stack;

					this.logger.error (`HotHTTPServer Error: ${msg}`);
					throw (ex);
				}
			})
			.catch ((reason: any) =>
				{
					let msg: string = "";

					if (typeof (reason) === "string")
						msg = reason;

					if (reason.message != null)
						msg = reason.message;

					if (reason.stack != null)
						msg = reason.stack;

					this.logger.error (`HotHTTPServer Error: ${msg}`);
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
		httpPort: number = 80, httpsPort: number = 443, 
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
	 * Shutdown the server.
	 */
	async shutdown (): Promise<void>
	{
		this.logger.verbose (`Shutting down HTTP server...`);
		await new Promise<void> ((resolve, reject) =>
			{
				this.httpListener.close ((err: Error) =>
					{
						this.expressApp = null;

						if (err != null)
							throw err;

						this.logger.verbose (`HTTP server has shut down.`);
						resolve ();
					});
			});
	}
}