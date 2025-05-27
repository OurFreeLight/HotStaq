import { DeveloperMode } from "./Hot";
import { HotTestDriver } from "./HotTestDriver";
import { HotRoute } from "./HotRoute";
import { HotServer, HotServerType } from "./HotServer";

import express from "express";
import { HotWebSocketServerClient } from "./HotWebSocketServerClient";
import { HotRouteMethodParameterMap, IHotValidReturn } from "./HotStaq";

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
	 * A SSE sub event. This will close the event whenever 
	 */
	SSE_SUB_EVENT = "sse_sub_event",
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
	 * The bearer token being presented from the client requesting access.
	 */
	bearerToken?: string;
	/**
	 * The client websocket that was used to send the message. Will be set to null if using worker 
	 * threads or if this request was received from a HTTP connection.
	 */
	wsSocket?: HotWebSocketServerClient;
	/**
	 * The response received from sucessfully authorizing a client. Can be a JWT token, api key, etc.
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
 * How data should be passed through the server execute process.
 */
export enum PassType
{
	/**
	 * Any data set in jsonObj will immediately be passed to the client when 
	 * this function returns.
	 */
	ReturnToClient,
	/**
	 * Any data being set in jsonObj will be passed to the next step after 
	 * this function returns.
	 */
	Update,
	/**
	 * Ignore any data set in jsonObj.
	 */
	Ignore
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
	 * The bearer token being presented from the client requesting access.
	 */
	bearerToken: string;
	/**
	 * The client websocket that was used to send the message. Will be set to null if using worker 
	 * threads or if this request was received from a HTTP connection.
	 */
	wsSocket: HotWebSocketServerClient;
	/**
	 * The response received from sucessfully authorizing a client. Can be a JWT token, api key, etc.
	 * Will be null if this request was received from a websocket connection.
	 * DO NOT STORE SENSITIVE INFORMATION HERE SUCH AS PASSWORDS.
	 */
	authorizedValue: any;
	/**
	 * The JSON object received from either onServerPreExecute or onServerExecute. If 
	 * returnToClient is set to true, onServerExecute will not be called and the data 
	 * returned from onServerPreExecute will be sent to the client instead. If returnToClient 
	 * is set to either false or undefined, onServerExecute will be called and the data 
	 * will be passed to onServerExecute in passObject.jsonObj.
	 */
	passObject: { passType: PassType; jsonObj: any; };
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
		this.bearerToken = obj.bearerToken || "";
		this.wsSocket = obj.wsSocket || null;
		this.authorizedValue = obj.authorizedValue || null;
		this.jsonObj = obj.jsonObj || null;
		this.queryObj = obj.queryObj || null;
		this.files = obj.files || null;
	}

	/**
	 * Write to the HTTP response. This is mostly intended to be used 
	 * when using SSE. This requires JSON to be sent.
	 */
	async httpWrite (jsonObj: any): Promise<void>
	{
		if (this.res == null)
			throw new Error (`Cannot close HTTP response because it is null!`);

		return (new Promise<void> ((resolve, reject) =>
			{
				this.res.write (JSON.stringify (jsonObj), (err: Error) =>
					{
						if (err != null)
							throw err;

						resolve ();
					});
			}));
	}

	/**
	 * Write to the HTTP response. This is mostly intended to be used 
	 * when using SSE.
	 */
	async httpWriteRaw (data: any): Promise<void>
	{
		if (this.res == null)
			throw new Error (`Cannot close HTTP response because it is null!`);

		return (new Promise<void> ((resolve, reject) =>
			{
				this.res.write (data, (err: Error) =>
					{
						if (err != null)
							throw err;

						resolve ();
					});
			}));
	}

	/**
	 * Close the HTTP response. This is mostly intended to be used when 
	 * using SSE.
	 */
	httpClose (): void
	{
		if (this.res == null)
			throw new Error (`Cannot close HTTP response because it is null!`);

		this.res.end ();
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
 * The type of validator input to check.
 */
export enum HotValidationType
{
	UUID = "UUID",
	Boolean = "boolean",
	Number = "number",
	Text = "Text",
	Email = "Email",
	Phone = "Phone",
	IPv4 = "IPv4",
	IPv6 = "IPv6",
	Date = "Date",
	Enum = "Enum",
	Array = "Array",
	Ignore = "Ignore",
	Delete = "Delete",
	JS = "JS"
}

/**
 * Is chained together to create a validation chain.
 */
export interface HotValidation
{
	/**
	 * The type of validation to perform.
	 * @default Text
	 */
	type?: HotValidationType;
	/**
	 * The default value to set if the incoming input is null or undefined.
	 */
	defaultValue?: any;
	/**
	 * The associated validations for this current validation. This is mostly to be used for the Array or  
	 * Map types when trying to validate each item of an array.
	 * @default Text
	 */
	associatedValids?: HotValidation[];
	/**
	 * The possible properties to check against. Works only with the Object type.
	 */
	properties?: HotValidation[];
	/**
	 * The possible values to check against. Works best using the Enum type.
	 */
	values?: any[];
	/**
	 * The function to use to validate if the input is valid.
	 */
	func?: (strict: boolean, key: string, input: any) => Promise<IHotValidReturn>;
	/**
	 * The regex to use to validate with.
	 */
	regex?: string | RegExp;
	/**
	 * The min text or array length. This can also be the minimum number if the type is number.
	 */
	min?: number;
	/**
	 * The max text or array length. This can also be the maximum number if the type is number.
	 */
	max?: number;
	/**
	 * Ensures that the string or array is not empty or null.
	 */
	notEmptyOrNull?: boolean;
	/**
	 * The value to check against.
	 */
	comparison?: {
		/**
		 * The value to check if greater than.
		 */
		greaterThan?: any;
		/**
		 * The value to check if less than.
		 */
		lessThan?: any;
		/**
		 * The value to check equal to.
		 */
		eq?: any;
		/**
		 * The value to check if its not equal to.
		 */
		not?: any;
	};
	/**
	 * The next type of validation to perform.
	 */
	next?: HotValidation;
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
	 * The item type in the array.
	 * 
	 * @todo This cannot generate objects or nested objects yet :/
	 */
	items?: HotRouteMethodParameter;
	/**
	 * The description of the parameter. Default: ""
	 */
	description?: string;
	/**
	 * Additional OpenAPI information. Anything added here will be automerged in.
	 */
	openAPI?: any;
	/**
	 * Is this parameter required? Default: false
	 */
	required?: boolean;
	/**
	 * Is this parameter read only? Default: false
	 */
	readOnly?: boolean;
	/**
	 * The validation chain to perform on this parameter.
	 */
	validations?: HotValidation[];
	/**
	 * The parameters in the object. If using the function, the function 
	 * will only execute if the application's connection type is set to generation.
	 */
	parameters?: { [name: string]: (string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>)); };
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
	 * Additional OpenAPI information. Anything added here will be automerged in.
	 */
	openAPI?: any;
	/**
	 * The tags for the api method.
	 */
	tags?: string[];
	/**
	 * The description of what returns from the api method.
	 */
	returns?: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>);
	/**
	 * If set to true, this will validate the query input before executing the method.
	 */
	validateQueryInput?: InputValidationType;
	/**
	 * If set to true, this will validate the JSON input before executing the method.
	 */
	validateJSONInput?: InputValidationType;
	/**
	 * The reference name for the parameters when generating documentation.
	 * This is so the generated components all use the same parameters.
	 */
	parametersRefName?: string;
	/**
	 * The parameters in the api method.
	 */
	parameters?: { [name: string]: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>); };
	/**
	 * The query parameters used in the api method.
	 */
	queryParameters?: HotRouteMethodParameterMap;
	/**
	 * The api call name.
	 */
	type?: HotEventMethod;
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
	/**
	 * Executes when validating incoming data.
	 */
	onValidateQueryInput?: ClientExecutionFunction;
	/**
	 * Executes when validating incoming json data.
	 */
	onValidateJSONInput?: ClientExecutionFunction;
}

/**
 * How input validation should be handled.
 */
export enum InputValidationType
{
	/**
	 * No validation will be performed.
	 */
	None,
	/**
	 * Validation will be performed according to the specification set in the parameters. 
	 * Any extra keys will be flagged as an error.
	 */
	Strict,
	/**
	 * Validation will be performed according to the specification set in the parameters.
	 */
	Loose
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
	 * Additional OpenAPI information. Anything added here will be automerged in.
	 */
	openAPI: any;
	/**
	 * The tags for the api method.
	 */
	tags: string[];
	/**
	 * The description of what returns from the api method.
	 */
	returns: HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>);
	/**
	 * If set to true, this will validate the query input before executing the method.
	 */
	validateQueryInput: InputValidationType;
	/**
	 * If set to true, this will validate the JSON input before executing the method.
	 */
	validateJSONInput: InputValidationType;
	/**
	 * The reference name for the parameters when generating documentation.
	 * This is so the generated components all use the same parameters.
	 */
	parametersRefName: string;
	/**
	 * The parameters in the api method.
	 */
	parameters: HotRouteMethodParameterMap;
	/**
	 * The query parameters used in the api method.
	 */
	queryParameters: HotRouteMethodParameterMap;
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
	/**
	 * Executes when validating incoming query data.
	 */
	onValidateQueryInput?: ClientExecutionFunction;
	/**
	 * Executes when validating incoming json data.
	 */
	onValidateJSONInput?: ClientExecutionFunction;

	private constructor ()
	{
		this.route = null;
		this.name = "";
		this.description = "";
		this.openAPI = null;
		this.tags = [];
		this.returns = null;
		this.validateQueryInput = InputValidationType.Loose;
		this.validateJSONInput = InputValidationType.Loose;
		this.parametersRefName = "";
		this.parameters = {};
		this.queryParameters = {};
		this.type = HotEventMethod.POST;
		this.isRegistered = false;
		this.executeSetup = true;
		this.testCases = {};
		this.onPreRegister = null;
		this.onRegister = null;
		this.onPostRegister = null;

		this.onServerAuthorize = null;
		this.onServerExecute = null;
		this.onClientExecute = null;
		this.onValidateQueryInput = null;
		this.onValidateJSONInput = null;
	}

	/**
	 * Create a new route method.
	 */
	static create (route: HotRoute | IHotRouteMethod, name: string = "", 
			onExecute: ServerExecutionFunction | ClientExecutionFunction = null, 
			type: HotEventMethod = HotEventMethod.POST, onServerAuthorize: ServerAuthorizationFunction = null, 
			onRegister: ServerRegistrationFunction = null, 
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

			if (route.name != null)
				newMethod.tags = route.tags;

			if (route.description != null)
				newMethod.description = route.description;

			if (route.openAPI != null)
				newMethod.openAPI = route.openAPI;

			if (route.validateQueryInput != null)
				newMethod.validateQueryInput = route.validateQueryInput;

			if (route.validateJSONInput != null)
				newMethod.validateJSONInput = route.validateJSONInput;

			if (route.parametersRefName != null)
				newMethod.parametersRefName = route.parametersRefName;

			if (route.queryParameters != null)
				newMethod.queryParameters = route.queryParameters;

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
					newMethod.returns = route.returns;
				}
				else
					newMethod.returns = route.returns;
			}

			if (route.parameters != null)
			{
				if (route.parameters instanceof Function)
				{
					// @ts-ignore
					newMethod.parameters = route.parameters;
				}
				else
				{
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

							newMethod.parameters[key] = param;
						}
						else
						{
							if (param.type == null)
								param.type = "string";

							newMethod.parameters[key] = param;
						}
					}
				}
			}

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

			if (route.onValidateQueryInput != null)
				newMethod.onValidateQueryInput = route.onValidateQueryInput;

			if (route.onValidateJSONInput != null)
				newMethod.onValidateJSONInput = route.onValidateJSONInput;

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