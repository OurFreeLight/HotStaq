import express from "express";
import { v4 as uuidv4 } from "uuid";

import * as ppath from "path";

import { HotLog } from "./HotLog";
import { HotRouteMethod, ServerRequest } from "./HotRouteMethod";
import { HotRoute } from "./HotRoute";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotIO } from "./HotIO";
import { EventExecutionType } from "./HotAPI";

export async function processRequest (server: HotHTTPServer, 
	logger: HotLog, route: HotRoute, 
	method: HotRouteMethod, methodName: string, 
	req: express.Request, res: express.Response): Promise<any>
{
	let hasAuthorization: boolean = true;
	let authorizationValue: any = null;
	let jsonObj: any = req.body;
	let queryObj: any = req.query;
	let api = route.connection.api;
	let thisObj: any = route;

	if (api.executeEventsUsing === EventExecutionType.HotAPI)
		thisObj = api;

	if (api.executeEventsUsing === EventExecutionType.HotMethod)
		thisObj = method;

	logger.verbose (() => `${req.method} ${methodName}, JSON: ${JSON.stringify (jsonObj)}, Query: ${JSON.stringify (queryObj)}`);

	if (method.onServerAuthorize != null)
	{
		try
		{
			let request = new ServerRequest ({
				req: req,
				res: res,
				authorizedValue: authorizationValue,
				jsonObj: jsonObj,
				queryObj: queryObj,
				files: null
			});

			authorizationValue = await method.onServerAuthorize.call (thisObj, request);
		}
		catch (ex)
		{
			logger.verbose (`Authorization error: ${ex.message}`);
			hasAuthorization = false;

			return ({ error: ex.message });
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
				let request = new ServerRequest ({
					req: req,
					res: res
				});

				authorizationValue = await route.onAuthorizeUser (request);
			}
			catch (ex)
			{
				logger.verbose (`Authorization error: ${ex.message}`);
				hasAuthorization = false;

				return ({ error: ex.message });
			}

			if (authorizationValue === undefined)
				hasAuthorization = false;
		}
	}

	logger.verbose (() => `${req.method} ${methodName}, Authorized: ${hasAuthorization}, Authorization Value: ${authorizationValue}`);

	if (hasAuthorization === true)
	{
		let uploadedFiles: any = await HotHTTPServer.getFileUploads (req);

		if (Object.keys (uploadedFiles).length > 0)
		{
			const hotstaqUploadId: string = uuidv4 ();

			server.uploads[hotstaqUploadId] = {};
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
				let uploadedFile: any = uploadedFiles[key];
				const newFilePath: string = ppath.normalize (`${tempDir}/${uploadedFile.originalFilename}`);

				await HotIO.moveFile (uploadedFile.filepath, newFilePath, { overwrite: true });

				let uploadedObj: any = {
					name: uploadedFile.originalFilename,
					size: uploadedFile.size,
					path: newFilePath
				};

				server.uploads[hotstaqUploadId][key] = uploadedObj;
			}

			logger.verbose (() => `${req.method} ${methodName}, Upload ID: ${hotstaqUploadId}, Received uploads: ${JSON.stringify (server.uploads[hotstaqUploadId])}`);

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

						if (server.uploads[hotstaqUploadId] != null)
						{
							hotstaq["uploads"]["files"] = server.uploads[hotstaqUploadId];
							foundUploadId = hotstaqUploadId;
						}
					}
				}
			}

			try
			{
				let files: any = null;

				if (foundUploadId !== "")
				{
					files = {};
					files = server.uploads[foundUploadId];
				}

				let request = new ServerRequest ({
						req: req,
						res: res,
						authorizedValue: authorizationValue,
						jsonObj: jsonObj,
						queryObj: queryObj,
						files: files
					});

				let result: any = await method.onServerExecute.call (thisObj, request);

				if (logger.showHTTPEvents === true)
				{
					logger.verbose ((result2: any) => {
							let resultStr: string = "";

							if (logger.showResponses === true)
								resultStr = `, Response: ${JSON.stringify (result2)}`;

							return (`${req.method} ${methodName}${resultStr}`);
						}, result);
				}

				if (result !== undefined)
					return (result);
			}
			catch (ex)
			{
				logger.error (`Execution error: ${ex.message}`);
				return ({ error: ex.message });
			}

			if (foundUploadId !== "")
			{
				if (server.autoDeleteUploadOptions.afterUploadIdUse === true)
					await server.deleteUploads (foundUploadId);
			}
		}
	}
	else
	{
		logger.verbose (`${req.method} ${methodName}, not_authorized`);
		return (route.errors["not_authorized"]);
	}
}