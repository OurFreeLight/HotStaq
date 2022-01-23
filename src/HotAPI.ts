import fetch from "cross-fetch";

import { HotServer } from "./HotServer";
import { HotRoute } from "./HotRoute";
import { HotClient } from "./HotClient";
import { HotRouteMethod, ServerAuthorizationFunction } from "./HotRouteMethod";
import { HotDB } from "./HotDB";

import { HotDBSchema } from "./schemas/HotDBSchema";

/**
 * The API to load.
 */
export type APItoLoad = {
	exportedClassName: string;
	path: string;
 };

/**
 * The type of object to use during event executions.
 */
export enum EventExecutionType
{
	HotRoute,
	HotMethod,
	HotAPI
}

/**
 * The API to use.
 */
export abstract class HotAPI
{
	/**
	 * The server connection.
	 */
	connection: HotServer | HotClient;
	/**
	 * The base url for the server.
	 */
	baseUrl: string;
	/**
	 * If set, this will create the route variables and functions for 
	 * easy client/server calling.
	 */
	createFunctions: boolean;
	/**
	 * The database connection.
	 */
	executeEventsUsing: EventExecutionType;
	/**
	 * The database connection.
	 */
	db: HotDB;
	/**
	 * The authorization credentials to use throughout the application.
	 */
	authCredentials: any;
	/**
	 * The function used for user authentication.
	 */
	userAuth: ServerAuthorizationFunction;
	/**
	 * The database connection.
	 */
	routes: { [name: string]: HotRoute };
	/**
	 * Executed when the API is about to start registering routes. If 
	 * this function returns false, the server will not start.
	 */
	onPreRegister: () => Promise<boolean>;
	/**
	 * Executed when the API has finished registering routes. If 
	 * this function returns false, the server will not start.
	 */
	onPostRegister: () => Promise<boolean>;

	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: HotDB = null)
	{
		this.connection = connection;
		this.baseUrl = baseUrl;
		this.createFunctions = true;
		this.executeEventsUsing = EventExecutionType.HotRoute;
		this.db = db;
		this.authCredentials = null;
		this.userAuth = null;
		this.routes = {};
		this.onPreRegister = null;
		this.onPostRegister = null;
	}

	/**
	 * Set the database schema for use.
	 */
	setDBSchema (schema: HotDBSchema): void
	{
		if (this.connection.api == null)
			throw new Error (`No API has been set!`);

		if (this.connection.api.db == null)
			throw new Error (`No database has been set for API base url ${this.connection.api.baseUrl}`);

		this.connection.api.db.schema = schema;
	}

	/**
	 * Get the database being used.
	 */
	getDB (): HotDB
	{
		if (this.connection.api.db == null)
			throw new Error (`No database has been set for API base url ${this.connection.api.baseUrl}`);

		return (this.connection.api.db);
	}

	/**
	 * Get the database schema being used.
	 */
	getDBSchema (): HotDBSchema
	{
		if (this.connection.api.db == null)
			throw new Error (`No database has been set for API base url ${this.connection.api.baseUrl}`);

		return (this.connection.api.db.schema);
	}

	/**
	 * Add a route. If this.createFunctions is set to true, this will take the incoming 
	 * route and create an object in this HotAPI object using the name of the route. If there's 
	 * any HotRouteMethods inside of the incoming HotRoute, it will create the methods 
	 * and attach them to the newly created HotRoute object.
	 * 
	 * Example:
	 * ```
	 * export class Users extends HotRoute
	 * {
	 * 		constructor (api: FreeLightAPI)
	 * 		{
	 * 			super (api.connection, "user");
	 * 
	 * 			this.addMethod ("create", this._create, HTTPMethod.POST);
	 * 		}
	 * 
	 * 		protected async _create (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	 * 		{
	 * 			return (true);
	 * 		}
	 * }
	 * ```
	 * 
	 * This in turn could be used like so:
	 * ```
	 * Hot.API.user.create ({});
	 * ```
	 * 
	 * Additionally it would create the endpoint: ```http://127.0.0.1:8080/v1/user/create```
	 * 
	 * @param route The route to add. Can be either a full HotRoute object, or just 
	 * the route's name. If a HotRoute object is supplied, the rest of the parameters 
	 * will be ignored.
	 * @param routeMethod The route's method to add. If the route parameter is a string, 
	 * it will be interpreted as the route's name, and this will be the method added to 
	 * the new route.
	 * @param executeFunction The function to execute when routeMethod is called by the API.
	 */
	addRoute (
		route: HotRoute | string,
		routeMethod: HotRouteMethod | string = null,
		executeFunction: (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any) => Promise<any> = null
		): void
	{
		let routeName: string = "";

		if (route instanceof HotRoute)
		{
			routeName = route.route;
			this.routes[route.route] = route;
		}
		else
		{
			routeName = route;

			if (this.routes[routeName] == null)
				this.routes[routeName] = new HotRoute (this.connection, routeName);

			if (routeMethod instanceof HotRouteMethod)
				this.routes[routeName].addMethod (routeMethod);
			else
			{
				this.routes[routeName].addMethod (new HotRouteMethod (
					this.routes[routeName], routeMethod, executeFunction));
			}
		}

		this.routes[routeName].connection = this.connection;

		// Create the route functions for the server/client.
		if (this.createFunctions === true)
		{
			// @ts-ignore
			let newRoute: { [name: string]: Function } = this[routeName];

			if (newRoute == null)
				newRoute = {};

			for (let iIdx = 0; iIdx < this.routes[routeName].methods.length; iIdx++)
			{
				let currentRoute: HotRoute = this.routes[routeName];
				let newRouteMethod: HotRouteMethod = this.routes[routeName].methods[iIdx];

				/*
				/// @fixme Is this really necessary? A HTTP call is much more preferable, 
				/// especially for accruate testing.
				if (this.connection instanceof HotServer)
				{
					if (newRouteMethod.onServerExecute != null)
						newRoute[newRouteMethod.name] = newRouteMethod.onServerExecute;
				}
				else*/
				{
					/*
					/// @fixme Is onClientExecute necessary? I'm thinking the dev can just simply create 
					/// their own function to call.
					if (newRouteMethod.onClientExecute != null)
						newRoute[newRouteMethod.name] = newRouteMethod.onClientExecute;
					else
					{*/
						newRoute[newRouteMethod.name] = (data: any): any =>
							{
								let httpMethod: string = newRouteMethod.type;
								// Construct the url here. Base + route + route method
								let routeStr: string = "";

								if (currentRoute.version !== "")
									routeStr += `/${currentRoute.version}`;

								if (currentRoute.route !== "")
									routeStr += `/${currentRoute.route}`;

								if (newRouteMethod.name !== "")
									routeStr += `/${newRouteMethod.name}`;

								let authCredentials: any = null;

								// Getting the authorization credentials from the API is the lowest 
								// priority for getting credentials. The priorities are in this order: 
								// 1. HotRouteMethod
								// 2. HotRoute
								// 3. HotAPI
								if (this.authCredentials != null)
									authCredentials = this.authCredentials;

								// Find the authorization credentials. Prioritize them when they're 
								// in the method. Only add the ones from the route if the ones from 
								// the method are missing.
								if (newRouteMethod.authCredentials != null)
									authCredentials = newRouteMethod.authCredentials;
								else
								{
									if (newRouteMethod.parentRoute.authCredentials != null)
										authCredentials = newRouteMethod.parentRoute.authCredentials;
								}

								if (authCredentials == null)
								{
									// @ts-ignore
									if (typeof (Hot) !== "undefined")
									{
										// @ts-ignore
										if (Hot != null)
										{
											// @ts-ignore
											if (Hot.API != null)
											{
												// @ts-ignore
												if (Hot.API[currentRoute.route] != null)
												{
													// @ts-ignore
													if (Hot.API[currentRoute.route].authCredentials != null)
													{
														// @ts-ignore
														authCredentials = Hot.API[currentRoute.route].authCredentials;
													}
												}
											}
										}
									}
								}

								if (authCredentials != null)
								{
									// Add the authorization credentials to the data being sent.
									for (let key in authCredentials)
									{
										let authCredential: any = authCredentials[key];

										// Do not overwrite any existing keys in the data about 
										// to be sent.
										if (data[key] == null)
											data[key] = authCredential;
									}
								}

								let args: any[] = [routeStr, data, httpMethod];

								return (this.makeCall.apply (this, args));
							};
					//}
				}
			}

			// @ts-ignore
			this[routeName] = newRoute;
		}
	}

	/**
	 * Register a route with the server.
	 */
	async registerRoute (route: HotRoute): Promise<void>
	{
		if (this.connection instanceof HotServer)
			await this.connection.registerRoute (route);
	}

	/**
	 * Register all routes with the server.
	 */
	async registerRoutes (): Promise<void>
	{
		for (let key in this.routes)
		{
			let route: HotRoute = this.routes[key];

			await this.registerRoute (route);
		}
	}

	/**
	 * Make a call to the API.
	 */
	async makeCall (route: string, data: any, httpMethod: string = "POST"): Promise<any>
	{
		let url: string = this.baseUrl;

		if (url[(url.length - 1)] === "/")
			url = url.substr (0, (url.length - 1));

		if (route[0] !== "/")
			url += "/";

		url += route;

		httpMethod = httpMethod.toUpperCase ();

		let fetchObj: any = {
				method: httpMethod,
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
			};

		if ((httpMethod !== "GET") && 
			(httpMethod !== "HEAD"))
		{
			fetchObj["body"] = JSON.stringify (data);
		}

		let res: any = null;
		
		try
		{
			res = await fetch (url, fetchObj);
		}
		catch (ex)
		{
			throw ex;
		}

		let jsonObj: any = await res.json ();

		return (jsonObj);
	}
}
