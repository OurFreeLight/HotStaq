import express from "express";
import { v4 as uuidv4 } from "uuid";

import * as ppath from "path";

import { HotLog } from "./HotLog";
import { HotEventMethod, HotRouteMethod, HotRouteMethodParameter, HotValidation, 
	HotValidationType, PassType, ServerRequest } from "./HotRouteMethod";
import { HotRoute } from "./HotRoute";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotIO } from "./HotIO";
import { HotAPI, EventExecutionType } from "./HotAPI";
import { HotRouteMethodParameterMap, HotStaq } from "./HotStaq";
import { processInput } from "./HotProcessInput";

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
				bearerToken: "",
				authorizedValue: authorizationValue,
				jsonObj: jsonObj,
				queryObj: queryObj,
				files: null
			});

			if (req.headers.authorization != null)
			{
				request.bearerToken = req.headers.authorization;
				request.bearerToken = request.bearerToken.substring (7);
			}

			authorizationValue = await method.onServerAuthorize.call (thisObj, request);
		}
		catch (ex)
		{
			let statusCode = 401;

			if (ex.statusCode != null)
				statusCode = ex.statusCode;

			logger.error (`Authorization error ${statusCode}: ${ex.message}`);
			hasAuthorization = false;

			return ({ error: ex.message, errorCode: statusCode });
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
						res: res,
						bearerToken: "",
						authorizedValue: null,
						jsonObj: jsonObj,
						queryObj: queryObj,
						files: null
					});

				if (req.headers.authorization != null)
				{
					request.bearerToken = req.headers.authorization;
					request.bearerToken = request.bearerToken.substring (7);
				}

				authorizationValue = await route.onAuthorizeUser (request);
			}
			catch (ex)
			{
				let statusCode = 401;
	
				if (ex.statusCode != null)
					statusCode = ex.statusCode;

				logger.error (`Authorization error ${statusCode}: ${ex.message}`);
				hasAuthorization = false;

				return ({ error: ex.message, errorCode: statusCode });
			}

			if (authorizationValue === undefined)
				hasAuthorization = false;
		}
	}

	logger.verbose (() => `${req.method} ${methodName}, Authorized: ${hasAuthorization}`);

	if (hasAuthorization === true)
	{
		let uploadedFiles: any = await HotHTTPServer.getFileUploads (logger, req);

		if (Object.keys (uploadedFiles).length > 0)
		{
			if (method.type !== HotEventMethod.FILE_UPLOAD)
				return ({ error: `Cannot upload files to a non-file upload method. When registering the route be sure to use HotEventMethod.FILE_UPLOAD.`, errorCode: 400 });

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
				let uploadedFile: any = uploadedFiles[key][0];
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

			return ({
				hotstaq: {
					uploads: {
						uploadId: hotstaqUploadId
					}
				}
			});
		}

		let request = new ServerRequest ({
				req: req,
				res: res,
				bearerToken: "",
				authorizedValue: authorizationValue,
				jsonObj: jsonObj,
				queryObj: queryObj,
				files: null,
				onClose: null
			});

		res.on ("close", () => {
				if (request.onClose != null)
					request.onClose.call (thisObj, request);
			});

		// The validations have to occur after any possible file uploads.
		if (queryObj != null)
		{
			if (Object.keys(queryObj).length > 0)
			{
				if (method.validateQueryInput != null)
				{
					let skipValidation: number = 0;
	
					if (queryObj["hotstaq_skip_validation"] != null)
						skipValidation = queryObj["hotstaq_skip_validation"];
	
					if (skipValidation === 0)
					{
						try
						{
							if (method.onValidateQueryInput != null)
								await method.onValidateQueryInput.call (thisObj, queryObj);
							else
								queryObj = await processInput (method.validateQueryInput, method.parameters, queryObj, request);
						}
						catch (ex)
						{
							let statusCode = 400;

							if (ex.statusCode != null)
								statusCode = ex.statusCode;

							logger.error (`Query validation error ${statusCode}: ${ex.message}`);
							return ({ error: ex.message, errorCode: statusCode });
						}
					}
				}
			}
		}

		if (jsonObj != null)
		{
			if (method.validateJSONInput != null)
			{
				let skipValidation: boolean = false;

				if (jsonObj["hotstaq"] != null)
				{
					if (jsonObj["hotstaq"]["skipValidation"] != null)
						skipValidation = jsonObj["hotstaq"]["skipValidation"];
				}

				if (skipValidation === false)
				{
					try
					{
						if (method.onValidateJSONInput != null)
							await method.onValidateJSONInput.call (thisObj, jsonObj);
						else
							jsonObj = await processInput (method.validateJSONInput, method.parameters, jsonObj, request);
					}
					catch (ex)
					{
						let statusCode = 400;

						if (ex.statusCode != null)
							statusCode = ex.statusCode;

						logger.error (`JSON validation error ${statusCode}: ${ex.message}`);
						return ({ error: ex.message, errorCode: statusCode });
					}
				}
			}
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

				request.authorizedValue = authorizationValue;
				request.jsonObj = jsonObj;
				request.queryObj = queryObj;
				request.files = files;

				if (req.headers.authorization != null)
				{
					request.bearerToken = req.headers.authorization;
					request.bearerToken = request.bearerToken.substring (7);
				}

				let result: any = null;

				request.passObject = { passType: PassType.Ignore, jsonObj: null };

				if (method.onServerPreExecute != null)
				{
					result = await method.onServerPreExecute.call (thisObj, request);

					if (logger.showHTTPEvents === true)
					{
						logger.verbose ((result2: any) => {
								let resultStr: string = "";

								if (logger.showResponses === true)
									resultStr = JSON.stringify (result2);

								return (`${req.method} ${methodName}, PreExecute: ${resultStr}`);
							}, result);
					}

					if (request.passObject.passType != null)
					{
						if (request.passObject.passType === PassType.Update)
							request.passObject.jsonObj = result;

						if (request.passObject.passType === PassType.ReturnToClient)
							return (request.passObject.jsonObj);
					}
				}

				result = await method.onServerExecute.call (thisObj, request);

				if (method.onServerPostExecute != null)
				{
					if (request.passObject.passType != null)
					{
						if (request.passObject.passType === PassType.Update)
							request.passObject.jsonObj = result;

						if (request.passObject.passType === PassType.ReturnToClient)
							return (request.passObject.jsonObj);
					}

					result = await method.onServerPostExecute.call (thisObj, request);

					if (logger.showHTTPEvents === true)
					{
						logger.verbose ((result2: any) => {
								let resultStr: string = "";

								if (logger.showResponses === true)
									resultStr = JSON.stringify (result2);

								return (`${req.method} ${methodName}, PostExecute: ${resultStr}`);
							}, result);
					}

					if (result !== undefined)
						return (result);
				}

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
				let statusCode = 400;

				if (ex.statusCode != null)
					statusCode = ex.statusCode;

				logger.error (`HTTP Execution Error ${statusCode}: ${ex.message}`);
				return ({ error: ex.message, errorCode: statusCode });
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
		logger.error (`${req.method} ${methodName}, not_authorized`);
		return (route.errors["not_authorized"]);
	}
}