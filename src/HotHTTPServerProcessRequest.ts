import express from "express";
import { v4 as uuidv4 } from "uuid";

import * as ppath from "path";

import { HotLog } from "./HotLog";
import { HotEventMethod, HotRouteMethod, HotRouteMethodParameter, HotValidation, 
	HotValidationType, InputValidationType, PassType, ServerRequest } from "./HotRouteMethod";
import { HotRoute } from "./HotRoute";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotIO } from "./HotIO";
import { HotAPI, EventExecutionType } from "./HotAPI";
import { HotRouteMethodParameterMap, HotStaq } from "./HotStaq";

// Helper function to resolve nested parameter definitions.
// If a nested parameter is provided as a string, we assume a default parameter expecting text.
async function resolveParameters(
		nested: { [name: string]: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>) }
	): Promise<HotRouteMethodParameterMap>
{
	const result: HotRouteMethodParameterMap = {};

	for (const key in nested)
	{
		const val = nested[key];
		if (typeof val === "string")
			result[key] = { validations: [{ type: HotValidationType.Text }] };
		else if (typeof (val) === "function")
			result[key] = await val();
		else
			result[key] = val;
	}
	return result;
}

// Recursive helper that validates a single value through its entire validation chain.
async function validateRecursively(strictInput: boolean, key: string, value: any, 
	request: ServerRequest, validation?: HotValidation): Promise<{ deleteValue: boolean; value: any; }>
{
	if (HotStaq.preValidate != null)
	{
		const preValidation = await HotStaq.preValidate (strictInput, key, validation, value, request);

		if (preValidation != null)
		{
			if (preValidation.deleteValue === true)
				return { deleteValue: true, value: null };

			if (preValidation.returnValue === true)
				return { deleteValue: false, value: value };

			if (preValidation.changeValidationType != null)
				validation.type = preValidation.changeValidationType;
		}
	}

	if (!validation)
		return { deleteValue: false, value: value };

	const validType = validation.type;

	if (validType === HotValidationType.Ignore)
		return { deleteValue: false, value: value };

	if (validType === HotValidationType.Delete)
		return { deleteValue: true, value: null };

	const valid = HotStaq.valids[validType];

	if (valid == null)
		throw new Error(`Validation '${validType}' not found.`);

	if (typeof (valid) === "function")
		await valid (strictInput, key, validation, value, request);
	else if (validType === HotValidationType.Array)
	{
		if (Array.isArray (value) === false)
			throw new Error(`Parameter '${key}' must be an array.`);

		if (validation.associatedValid == null)
			throw new Error(`Parameter '${key}' must have an associated type that describes each item.`);

		for (let iIdx = 0; iIdx < value.length; iIdx++)
		{
			const item = value[iIdx];

			await validateRecursively (strictInput, key, item, request, validation.associatedValid);
		}
	}
	else
		await processInput (strictInput, valid, value, request);

	if (HotStaq.postValidate != null)
	{
		const preValidation = await HotStaq.postValidate (strictInput, key, validation, value, request);

		if (preValidation != null)
		{
			if (preValidation.deleteValue === true)
				return { deleteValue: true, value: null };

			if (preValidation.returnValue === true)
				return { deleteValue: false, value: value };
		}
	}

	return validateRecursively(strictInput, key, value, request, validation.next);
}
  
// Main function that validates an input object against a parameters map,
// including nested properties defined via the `parameters` property.
export async function processInput (strictInput: boolean, params: HotRouteMethodParameterMap, input: any, request: ServerRequest): Promise<any>
{
	const validatedInput: any = input;

	if (strictInput === true)
	{
		// Check that every key in input exists in params.
		// @fixme This is only a shallow check....
		for (const key in input) {
			if (!(key in params)) {
				throw new Error(`Unexpected parameter '${key}' provided.`);
			}
		}
	}

	// Process each key defined in the parameters.
	for (const key in params)
	{
		let paramDef: HotRouteMethodParameter;
		const param = params[key];

		if (typeof param === "function") {
			paramDef = await param();
		} else if (typeof param === "string") {
			// When defined as a string, assume a default parameter expecting text.
			paramDef = { validations: [{ type: HotValidationType.Text }] };
		} else {
			paramDef = param;
		}

		// Only validate if the key is present in the input.
		if (key in input)
		{
			let value = input[key];
			let deleteValue: boolean = false;

			// Validate the value using its validation chain, if provided.
			if (paramDef.validations)
			{
				let errMsg = null;

				for (let iIdx = 0; iIdx < paramDef.validations.length; iIdx++)
				{
					const validation = paramDef.validations[iIdx];

					try
					{
						let validValue = await validateRecursively(strictInput, key, value, request, validation);

						deleteValue = validValue.deleteValue;
						value = validValue.value;

						errMsg = null;

						break;
					}
					catch (err: any)
					{
						errMsg = err;
					}
				}

				if (errMsg != null)
					throw errMsg;
			}

			if (deleteValue === true)
			{
				delete validatedInput[key];
				continue;
			}

			// If nested parameters exist, ensure the value is an object and validate recursively.
			if (paramDef.parameters) {
				if (typeof value !== "object" || value === null) {
					throw new Error(`Parameter '${key}' must be an object.`);
				}
				let resolvedParams = await resolveParameters(paramDef.parameters);
				value = await processInput(strictInput, resolvedParams, value, request);
			}

			validatedInput[key] = value;
		}
	}

	return validatedInput;
}

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

			logger.verbose (`Authorization error ${statusCode}: ${ex.message}`);
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

				logger.verbose (`Authorization error ${statusCode}: ${ex.message}`);
				hasAuthorization = false;

				return ({ error: ex.message, errorCode: statusCode });
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
				files: null
			});

		// The validations have to occur after any possible file uploads.
		if (queryObj != null)
		{
			if (Object.keys(queryObj).length > 0)
			{
				if ((method.validateQueryInput === InputValidationType.Strict) || 
					(method.validateQueryInput === InputValidationType.Loose))
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
							{
								if (method.validateQueryInput === InputValidationType.Strict)
									queryObj = await processInput (true, method.parameters, queryObj, request);

								if (method.validateQueryInput === InputValidationType.Loose)
									queryObj = await processInput (false, method.parameters, queryObj, request);
							}
						}
						catch (ex)
						{
							let statusCode = 400;

							if (ex.statusCode != null)
								statusCode = ex.statusCode;

							logger.verbose (`Query validation error ${statusCode}: ${ex.message}`);
							return ({ error: ex.message, errorCode: statusCode });
						}
					}
				}
			}
		}

		if (jsonObj != null)
		{
			if ((method.validateJSONInput === InputValidationType.Strict) || 
				(method.validateJSONInput === InputValidationType.Loose))
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
						{
							if (method.validateJSONInput === InputValidationType.Strict)
								jsonObj = await processInput (true, method.parameters, jsonObj, request);

							if (method.validateJSONInput === InputValidationType.Loose)
								jsonObj = await processInput (false, method.parameters, jsonObj, request);
						}
					}
					catch (ex)
					{
						let statusCode = 400;

						if (ex.statusCode != null)
							statusCode = ex.statusCode;

						logger.verbose (`JSON validation error ${statusCode}: ${ex.message}`);
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
		logger.verbose (`${req.method} ${methodName}, not_authorized`);
		return (route.errors["not_authorized"]);
	}
}