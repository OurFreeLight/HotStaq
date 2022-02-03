import { DeveloperMode } from "./Hot";
import { HotTestDriver } from "./HotTestDriver";
import { HotRoute } from "./HotRoute";
import { HotServer } from "./HotServer";

/**
 * Available HTTP methods.
 */
export enum HTTPMethod
{
	GET = "get",
	POST = "post"
}

/**
 * A function that will be executed by the server when first registering with Express.
 * If this returns false, this route method will not be registered.
 */
export type ServerRegistrationFunction = () => Promise<boolean>;
/**
 * A function that will be executed by the server.
 */
export type ServerExecutionFunction = 
	(req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any) => Promise<any>;
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
export type ServerAuthorizationFunction = (req: any, res: any, jsonObj: any, queryObj: any) => Promise<any>;
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
	 * The type of parameter.
	 */
	type: string;
	/**
	 * The description of the parameter.
	 */
	description: string;
	/**
	 * Is this parameter required?
	 */
	required: boolean;
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
	returns?: string;
	/**
	 * The parameters in the api method.
	 */
	parameters?: { [name: string]: string | HotRouteMethodParameter; };
	/**
	 * The api call name.
	 */
	type?: HTTPMethod;
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
	returns: string;
	/**
	 * The parameters in the api method.
	 */
	parameters: { [name: string]: HotRouteMethodParameter; };
	/**
	 * The api call name.
	 */
	type: HTTPMethod;
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
	 * The value returned from here will be passed to onExecute. 
	 * Undefined returning from here will mean the authorization failed.
	 * If any exceptions are thrown from this function, they will be sent 
	 * to the server as an { error: string; } object with the exception 
	 * message as the error.
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

	constructor (route: HotRoute | IHotRouteMethod, name: string = "", 
		onExecute: ServerExecutionFunction | ClientExecutionFunction = null, 
		type: HTTPMethod = HTTPMethod.POST, onServerAuthorize: ServerAuthorizationFunction = null, 
		onRegister: ServerRegistrationFunction = null, authCredentials: any = null, 
		testCases: { [name: string]: TestCaseObject; } | (string | TestCaseFunction)[] | TestCaseFunction[] | TestCaseObject[] = null)
	{
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
				this.description = route.description;

			if (route.returns != null)
				this.returns = route.returns;

			if (route.parameters != null)
			{
				this.parameters = {};

				for (let key in route.parameters)
				{
					let param = route.parameters[key];

					if (typeof (param) === "string")
					{
						this.parameters[key] = {
								"type": param,
								"required": false,
								"description": ""
							};
					}
					else
						this.parameters[key] = param;
				}
			}

			if (route.authCredentials != null)
				authCredentials = route.authCredentials;

			if (route.onServerAuthorize != null)
				onServerAuthorize = route.onServerAuthorize;

			if (route.onRegister != null)
				onRegister = route.onRegister;

			if (route.onPostRegister != null)
				this.onPostRegister = route.onPostRegister;

			if (route.onServerExecute != null)
				this.onServerExecute = route.onServerExecute;

			if (route.onClientExecute != null)
				this.onClientExecute = route.onClientExecute;

			if (route.testCases != null)
				testCases = route.testCases;
		}

		if (name === "")
			throw new Error (`All route methods must have a name!`);

		this.route = newRoute;
		this.name = name;
		this.type = type;
		this.isRegistered = false;
		this.executeSetup = false;
		this.authCredentials = authCredentials;
		this.onServerAuthorize = onServerAuthorize;
		this.onRegister = onRegister;
		this.testCases = {};

		if (this.route.connection.processor.mode === DeveloperMode.Development)
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

							this.addTestCase (testCaseName, func);
							iIdx++;
						}
						else
							this.addTestCase (obj);
					}
				}
				else
				{
					for (let key in testCases)
					{
						let obj = testCases[key];

						this.addTestCase (obj);
					}
				}
			}
		}

		if (this.route.connection instanceof HotServer)
			this.onServerExecute = onExecute;
		//else
			//this.onClientExecute = onExecute;
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
}