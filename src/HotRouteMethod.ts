import { DeveloperMode } from "./Hot";
import { HotTestDriver } from "./HotTestDriver";
import { HotRoute } from "./HotRoute";
import { HotServer, HotServerType } from "./HotServer";

import express from "express";
import { HotWebSocketServerClient } from "./HotWebSocketServerClient";

/**
 * The available event methods.
 */
export enum HotEventMethod
{
	/**
	 * A HTTP GET request.
	 */
	GET = "get",
	/**
	 * A HTTP POST request.
	 */
	POST = "post",
	/**
	 * This will upload a file, then post the json request afterwards.
	 */
	FILE_UPLOAD = "file_upload_then_post_json",
	/**
	 * A websocket event.
	 */
	WEBSOCKET_CLIENT_PUB_EVENT = "websocket_client_pub_event",
	/**
	 * Handles both a HTTP POST websocket event requests.
	 */
	POST_AND_WEBSOCKET_CLIENT_PUB_EVENT = "post_and_websocket_client_pub_event"
}

/**
 * The request that came from a client.
 */
export interface IServerRequest
{
	/**
	 * The express request received from the client. Will be set to null if using worker 
	 * threads or if this request was received from a websocket connection.
	 */
	req?: express.Request;
	/**
	 * The express response to send to the client. Will be set to null if using worker 
	 * threads or if this request was received from a websocket connection.
	 */
	res?: express.Response;
	/**
	 * The client websocket that was used to send the message. Will be set to null if using worker 
	 * threads or if this request was received from a HTTP connection.
	 */
	wsSocket?: HotWebSocketServerClient;
	/**
	 * The response received from authorizing a client. Can be a JWT token, api key, etc.
	 * Will be null if this request was received from a websocket connection.
	 * DO NOT STORE SENSITIVE INFORMATION HERE SUCH AS PASSWORDS.
	 */
	authorizedValue?: any;
	/**
	 * The JSON received from the client.
	 */
	jsonObj?: any;
	/**
	 * Any query variables received from the client. Will be null if this request was 
	 * received from a websocket connection.
	 */
	queryObj?: any;
	/**
	 * Any files received from the client. Will be null if no files were sent.
	 * Once a file is uploaded, you can access it at the temporary path found in: 
	 * files[uploadId].path
	 */
	files?: {
		[key: string]: {
			name: string;
			size: number;
			path: string;
		}
	};
}

/**
 * The request that came from a client.
 */
export class ServerRequest implements IServerRequest
{
	/**
	 * The express request received from the client. Will be set to null if using worker 
	 * threads or if this request was received from a websocket connection.
	 */
	req: express.Request;
	/**
	 * The express response to send to the client. Will be set to null if using worker 
	 * threads or if this request was received from a websocket connection.
	 */
	res: express.Response;
	/**
	 * The client websocket that was used to send the message. Will be set to null if using worker 
	 * threads or if this request was received from a HTTP connection.
	 */
	wsSocket: HotWebSocketServerClient;
	/**
	 * The response received from authorizing a client. Can be a JWT token, api key, etc.
	 * Will be null if this request was received from a websocket connection.
	 */
	authorizedValue: any;
	/**
	 * The JSON object received from either onServerPreExecute or onServerExecute. If 
	 * returnToClient is set to true, onServerExecute will not be called and the data 
	 * returned from onServerPreExecute will be sent to the client instead. If returnToClient 
	 * is set to either false or undefined, onServerExecute will be called and the data 
	 * will be passed to onServerExecute in passObject.jsonObj.
	 */
	passObject: { returnToClient: boolean, jsonObj: any; };
	/**
	 * The JSON received from the client.
	 */
	jsonObj: any;
	/**
	 * Any query variables received from the client. The object will be in key/value pair.
	 * 
	 * **HTTP Example**
	 * 
	 * In the web browser, the client sends the following query:
	 * ```js
	 * fetch ("http://localhost:3000?name=John&age=30");
	 * ```
	 * 
	 * In the server, the query will be received as:
	 * ```json
	 * {
	 * 		"name": "John",
	 * 		"age": 30
	 * }
	 * ```
	 * 
	 * **WebSocket Example**
	 * 
	 * In the web browser, the client initiates a socket.io connection and 
	 * sends the following query:
	 * ```js
	 * let client = io ("http://localhost:3000", {
	 * 			query: {
	 * 				name: "John",
	 * 				age: 30
	 * 			}
	 * 		});
	 * ```
	 * 
	 * In the server, the query will be received as:
	 * ```json
	 * {
	 * 		"name": "John",
	 * 		"age": 30
	 * }
	 * ```
	 */
	queryObj: any;
	/**
	 * Any files received from the client. Will be null if no files were sent.
	 * Once a file is uploaded, you can access it at the temporary path found in: 
	 * files[uploadId].path
	 */
	files: {
		[key: string]: {
			name: string;
			size: number;
			path: string;
		}
	};

	constructor (obj: IServerRequest = null)
	{
		if (obj == null)
			obj = {};

		this.req = obj.req || null;
		this.res = obj.res || null;
		this.wsSocket = obj.wsSocket || null;
		this.authorizedValue = obj.authorizedValue || null;
		this.jsonObj = obj.jsonObj || null;
		this.queryObj = obj.queryObj || null;
		this.files = obj.files || null;
	}
}

/**
 * A function that will be executed by the server when first registering with Express.
 * If this returns false, this route method will not be registered.
 */
export type ServerRegistrationFunction = () => Promise<boolean>;
/**
 * A function that will be executed by the server.
 */
export type ServerExecutionFunction = (request: ServerRequest) => Promise<any>;
/**
 * A function that will be executed by the client.
 */
export type ClientExecutionFunction = (...args: any[]) => Promise<any>;
/**
 * A function that will be executed by the server for authorization. Any value 
 * returned from this function will be passed to the ServerExecutionFunction.
 * If an undefined value is returned, this indicates the server was not able 
 * to authenticate the user, so the ServerExecutionFunction will not be 
 * executed.
 */
export type ServerAuthorizationFunction = (request: ServerRequest) => Promise<any>;
/**
 * The test case function to execute.
 */
export type TestCaseFunction = ((driver: HotTestDriver) => Promise<any>) | ((driver: HotTestDriver) => any);
/**
 * The test case object to pass.
 */
export interface TestCaseObject
{
	/**
	 * The name of the test case.
	 */
	name: string;
	/**
	 * The function to execute.
	 */
	func: TestCaseFunction;
}

/**
 * A method parameter.
 */
export interface HotRouteMethodParameter
{
	/**
	 * The type of parameter. Default: string
	 * Can be:
	 * * string
	 * * integer
	 * * number
	 * * boolean
	 * * array
	 * * object
	 */
	type?: string;
	/**
	 * The description of the parameter. Default: ""
	 */
	description?: string;
	/**
	 * Is this parameter required? Default: false
	 */
	required?: boolean;
	/**
	 * The parameters in the object. If using the function, the function 
	 * will only execute if the application's connection type is set to generation.
	 */
	parameters?: { [name: string]: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>); };
}

/**
 * An API method to make.
 */
export interface IHotRouteMethod
{
	/**
	 * The parent route.
	 */
	route?: HotRoute;
	/**
	 * The api call name.
	 */
	name: string;
	/**
	 * The description of the api method.
	 */
	description?: string;
	/**
	 * The description of what returns from the api method.
	 */
	returns?: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>);
	/**
	 * The parameters in the api method.
	 */
	parameters?: { [name: string]: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>); };
	/**
	 * The api call name.
	 */
	type?: HotEventMethod;
	/**
	 * The authorization credentials to be used by the client 
	 * when connecting to the server.
	 */
	authCredentials?: any;
	/**
	 * The test case objects to execute during tests.
	 */
	testCases?: {
			[name: string]: TestCaseObject;
		} | (string | TestCaseFunction)[] | TestCaseFunction[] | TestCaseObject[];
	/**
	 * Executes before all routes have been registered.
	 */
	onPreRegister?: () => Promise<void>;
	/**
	 * Executes when first registering this method with Express. If 
	 * this returns false, the method will not be registered.
	 */
	onRegister?: ServerRegistrationFunction;
	/**
	 * Executes after all routes have been registered.
	 */
	onPostRegister?: () => Promise<void>;

	/**
	 * Executes when authorizing a called method. If this method 
	 * is set, this will not call onAuthorize for the parent HotRoute.
	 * The value returned from here will be passed to onExecute. 
	 * Undefined returning from here will mean the authorization failed.
	 * If any exceptions are thrown from this function, they will be sent 
	 * to the server as an { error: string; } object with the exception 
	 * message as the error.
	 * 
	 * Currently this has no effect when using websockets.
	 */
	onServerAuthorize?: ServerAuthorizationFunction;

	/**
	 * Executes when executing a called method from the server side. 
	 * This will stringify any JSON object and send it as a JSON response. 
	 * If undefined is returned no response will be sent to the server. 
	 * So the developer would have to send a response using "res".
	 * If any exceptions are thrown from this function, they will be sent 
	 * to the server as an { error: string; } object with the exception 
	 * message as the error.
	 */
	onServerExecute?: ServerExecutionFunction;
	/**
	 * Executes when executing a called method from the client side.
	 * @fixme Is this necessary?
	 */
	onClientExecute?: ClientExecutionFunction;
}

/**
 * An API method to make.
 */
export class HotRouteMethod implements IHotRouteMethod
{
	/**
	 * The parent route.
	 */
	route: HotRoute;
	/**
	 * The api call name.
	 */
	name: string;
	/**
	 * The description of the api method.
	 */
	description: string;
	/**
	 * The description of what returns from the api method.
	 */
	returns: HotRouteMethodParameter;
	/**
	 * The parameters in the api method.
	 */
	parameters: { [name: string]: HotRouteMethodParameter; };
	/**
	 * The api call name.
	 */
	type: HotEventMethod;
	/**
	 * Has this method been registered with the server? This 
	 * prevents the method from being reregistered.
	 */
	isRegistered: boolean;
	/**
	 * Has this method been registered with the server? This 
	 * prevents the method from being reregistered.
	 */
	executeSetup: boolean;
	/**
	 * The authorization credentials to be used by the client 
	 * when connecting to the server.
	 */
	authCredentials: any;
	/**
	 * The test case objects to execute during tests.
	 */
	testCases: {
			[name: string]: TestCaseObject;
		};
	/**
	 * Executes before all routes have been registered.
	 */
	onPreRegister?: () => Promise<void>;
	/**
	 * Executes when first registering this method with Express. If 
	 * this returns false, the method will not be registered.
	 */
	onRegister?: ServerRegistrationFunction;
	/**
	 * Executes after all routes have been registered.
	 */
	onPostRegister?: () => Promise<void>;

	/**
	 * Executes when authorizing a called method. If this method 
	 * is set, this will not call onAuthorize for the parent HotRoute.
	 * The value returned from here will be passed to onServerExecute. 
	 * Undefined returning from here will mean the authorization failed.
	 * If any exceptions are thrown from this function, they will be sent 
	 * to the client as an { error: string; } object with the exception 
	 * message as the error.
	 */
	onServerAuthorize?: ServerAuthorizationFunction;

	/**
	 * Executes before executing onServerExecute. Anything that returns 
	 * from this will be passed onto onServerExecute via request.previousJsonObj.
	 * Any exceptions thrown from this function will be sent to the client in 
	 * the form of an error message object.
	 */
	onServerPreExecute?: ServerExecutionFunction;
	/**
	 * Executes when executing a called method from the server side. 
	 * This will stringify any JSON object and send it as a JSON response. 
	 * If undefined is returned no response will be sent to the server. 
	 * So the developer would have to send a response using "res".
	 * If any exceptions are thrown from this function, they will be sent 
	 * to the server as an { error: string; } object with the exception 
	 * message as the error.
	 */
	onServerExecute?: ServerExecutionFunction;
	/**
	 * Executes after executing onServerExecute. If this returns anything 
	 * other than undefined, the response will be sent to the client.
	 */
	onServerPostExecute?: ServerExecutionFunction;
	/**
	 * Executes when executing a called method from the client side.
	 * @fixme Is this necessary?
	 */
	onClientExecute?: ClientExecutionFunction;

	private constructor ()
	{
		this.route = null;
		this.name = "";
		this.description = "";
		this.returns = null;
		this.parameters = {};
		this.type = HotEventMethod.POST;
		this.isRegistered = false;
		this.executeSetup = true;
		this.authCredentials = null;
		this.testCases = {};
		this.onPreRegister = null;
		this.onRegister = null;
		this.onPostRegister = null;

		this.onServerAuthorize = null;
		this.onServerExecute = null;
		this.onClientExecute = null;
	}

	/**
	 * Create a new route method.
	 */
	static create (route: HotRoute | IHotRouteMethod, name: string = "", 
			onExecute: ServerExecutionFunction | ClientExecutionFunction = null, 
			type: HotEventMethod = HotEventMethod.POST, onServerAuthorize: ServerAuthorizationFunction = null, 
			onRegister: ServerRegistrationFunction = null, authCredentials: any = null, 
			testCases: { [name: string]: TestCaseObject; } | (string | TestCaseFunction)[] | TestCaseFunction[] | TestCaseObject[] = null
		): HotRouteMethod
	{
		let newMethod: HotRouteMethod = new HotRouteMethod ();
		let newRoute: HotRoute = null;

		if (route instanceof HotRoute)
			newRoute = route;
		else
		{
			newRoute = route.route;

			if (route.type != null)
				type = route.type;

			if (route.name != null)
				name = route.name;

			if (route.description != null)
				newMethod.description = route.description;

			if (route.returns != null)
			{
				if (typeof (route.returns) === "string")
				{
					newMethod.returns = {
							"type": "string",
							"required": true,
							"description": route.returns
						};
				}
				else if (typeof (route.returns) === "function")
				{
					/// @fixme Can't run await here for many reasons. await is required 
					/// to execute HotStaq.convertInterfaceToRouteParameters. Fix later...
					newMethod.returns = null;
				}
				else
					newMethod.returns = route.returns;
			}

			if (route.parameters != null)
			{
				newMethod.parameters = {};

				for (let key in route.parameters)
				{
					let param = route.parameters[key];

					if (typeof (param) === "string")
					{
						newMethod.parameters[key] = {
								"type": "string",
								"required": false,
								"description": param
							};
					}
					else if (typeof (param) === "function")
					{
						/// @fixme Can't run await here for many reasons. await is required 
						/// to execute HotStaq.convertInterfaceToRouteParameters. Fix later...

						newMethod.parameters[key] = {
								"type": "string",
								"required": false,
								"description": ""
							};
					}
					else
					{
						if (param.type == null)
							param.type = "string";

						newMethod.parameters[key] = param;
					}
				}
			}

			if (route.authCredentials != null)
				authCredentials = route.authCredentials;

			if (route.onServerExecute != null)
				onExecute = route.onServerExecute;

			if (route.onServerAuthorize != null)
				onServerAuthorize = route.onServerAuthorize;

			if (route.onRegister != null)
				onRegister = route.onRegister;

			if (route.onPostRegister != null)
				newMethod.onPostRegister = route.onPostRegister;

			if (route.onServerExecute != null)
				newMethod.onServerExecute = route.onServerExecute;

			if (route.onClientExecute != null)
				newMethod.onClientExecute = route.onClientExecute;

			if (route.testCases != null)
				testCases = route.testCases;
		}

		if (name === "")
			throw new Error (`All route methods must have a name!`);

		newMethod.route = newRoute;
		newMethod.name = name;
		newMethod.type = type;
		newMethod.isRegistered = false;
		newMethod.executeSetup = false;
		newMethod.authCredentials = authCredentials;
		newMethod.onServerAuthorize = onServerAuthorize;
		newMethod.onRegister = onRegister;
		newMethod.testCases = {};

		if (newMethod.route.connection.processor.mode === DeveloperMode.Development)
		{
			if (testCases != null)
			{
				if (testCases instanceof Array)
				{
					for (let iIdx = 0; iIdx < testCases.length; iIdx++)
					{
						let obj = testCases[iIdx];

						if (typeof (obj) === "string")
						{
							const testCaseName: string = obj;
							const func: TestCaseFunction = (<TestCaseFunction>testCases[iIdx + 1]);

							newMethod.addTestCase (testCaseName, func);
							iIdx++;
						}
						else
							newMethod.addTestCase (obj);
					}
				}
				else
				{
					for (let key in testCases)
					{
						let obj = testCases[key];

						newMethod.addTestCase (obj);
					}
				}
			}
		}

		if (newMethod.route.connection instanceof HotServer)
			newMethod.onServerExecute = onExecute;
		//else
			//newMethod.onClientExecute = onExecute;

		return (newMethod);
	}

	/**
	 * Add a new test case.
	 */
	addTestCase (newTestCase: TestCaseObject | string | TestCaseFunction, 
			testCaseFunction: TestCaseFunction = null): void
	{
		if (typeof (newTestCase) === "string")
		{
			const name: string = newTestCase;
			const func: TestCaseFunction = testCaseFunction;

			this.testCases[name] = {
					name: name,
					func: func
				};

			return;
		}

		if (typeof (newTestCase) === "function")
		{
			const testCaseId: number = Object.keys (this.testCases).length;
			const name: string = `${this.route.route}/${this.name} test case ${testCaseId}`;
			const func: TestCaseFunction = (<TestCaseFunction>newTestCase);

			this.testCases[name] = {
					name: name,
					func: func
				};

			return;
		}

		const testCase: TestCaseObject = (<TestCaseObject>newTestCase);
		this.testCases[testCase.name] = testCase;
	}

	/**
	 * Get the relative url from this method and its route.
	 */
	getRouteUrl (): string
	{
		if (this.route == null)
			throw new Error (`Route method ${this.name} does not have a parent route!`);

		let methodName: string = "/";

		if (this.route.version !== "")
			methodName += `${this.route.version}/`;

		if (this.route.prefix !== "")
			methodName += `${this.route.prefix}/`;

		if (this.route.route !== "")
			methodName += `${this.route.route}/`;

		methodName += this.name;

		return (methodName);
	}
}