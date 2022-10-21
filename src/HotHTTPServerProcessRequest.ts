import express from "express";

import { HotLog } from "./HotLog";
import { HotRouteMethod } from "./HotRouteMethod";
import { HotRoute } from "./HotRoute";

export async function processRequest (logger: HotLog, route: HotRoute, 
	method: HotRouteMethod, methodName: string, 
	req: express.Request, res: express.Response): Promise<any>
{
	let hasAuthorization: boolean = true;
	let authorizationValue: any = null;
	let jsonObj: any = req.body;
	let queryObj: any = req.query;
	let api = route.connection.api;
	let thisObj: any = route;

	if (api.executeEventsUsing === 2)
		thisObj = api;

	if (api.executeEventsUsing === 1)
		thisObj = method;

	logger.verbose (`${req.method} ${methodName}, JSON: ${JSON.stringify (jsonObj)}, Query: ${JSON.stringify (queryObj)}`);

	if (method.onServerAuthorize != null)
	{
		try
		{
			authorizationValue = 
				await method.onServerAuthorize.call (thisObj, req, res, jsonObj, queryObj);
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
				authorizationValue = await route.onAuthorizeUser (req, res);
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

	logger.verbose (`${req.method} ${methodName}, Authorized: ${hasAuthorization}, Authorization Value: ${authorizationValue}`);

	if (hasAuthorization === true)
	{
		if (method.onServerExecute != null)
		{
			try
			{
				let result: any = 
					await method.onServerExecute.call (
						thisObj, req, res, authorizationValue, jsonObj, queryObj);

				logger.verbose (`${req.method} ${methodName}, Response: ${result}`);

				if (result !== undefined)
					return (result);
			}
			catch (ex)
			{
				logger.verbose (`Execution error: ${ex.message}`);
				return ({ error: ex.message });
			}
		}
	}
	else
	{
		logger.verbose (`${req.method} ${methodName}, not_authorized`);
		return (route.errors["not_authorized"]);
	}
}