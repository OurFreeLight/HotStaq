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
 * An API method to make.
 */
export class HotRouteMethod
{
	/**
	 * The parent route.
	 */
	parentRoute: HotRoute;
	/**
	 * The api call name.
	 */
	name: string;
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

	constructor (route: HotRoute, name: string, 
		onExecute: ServerExecutionFunction | ClientExecutionFunction = null, 
		type: HTTPMethod = HTTPMethod.POST, onServerAuthorize: ServerAuthorizationFunction = null, 
		onRegister: ServerRegistrationFunction = null, authCredentials: any = null, 
		testCases: (string | TestCaseFunction)[] | TestCaseFunction[] | TestCaseObject[] = null)
	{
		this.parentRoute = route;
		this.name = name;
		this.type = type;
		this.isRegistered = false;
		this.executeSetup = false;
		this.authCredentials = authCredentials;
		this.onServerAuthorize = onServerAuthorize;
		this.onRegister = onRegister;
		this.testCases = {};

		if (this.parentRoute.connection.processor.mode === DeveloperMode.Development)
		{
			if (testCases != null)
			{
				for (let iIdx = 0; iIdx < testCases.length; iIdx++)
				{
					let obj = testCases[iIdx];

					if (typeof (obj) === "string")
					{
						const name: string = obj;
						const func: TestCaseFunction = (<TestCaseFunction>testCases[iIdx + 1]);

						this.addTestCase (name, func);
						iIdx++;
					}
					else
						this.addTestCase (obj);
				}
			}
		}

		if (this.parentRoute.connection instanceof HotServer)
			this.onServerExecute = onExecute;
		//else
			//this.onClientExecute = onExecute;
	}

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
			const name: string = `${this.parentRoute.route}/${this.name} test case ${testCaseId}`;
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