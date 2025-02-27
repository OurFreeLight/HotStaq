import { HotServer } from "./HotServer";
import { HotRouteMethod, HotEventMethod, IHotRouteMethod, 
	ServerExecutionFunction, TestCaseFunction, TestCaseObject, ServerRequest } from "./HotRouteMethod";
import { HotClient } from "./HotClient";
import { HotLog } from "./HotLog";

/**
 * The route to use.
 */
export class HotRoute
{
	/**
	 * The server that maintains the connections.
	 */
	connection: HotServer | HotClient;
	/**
	 * The associated logger.
	 */
	logger: HotLog;
	/**
	 * The route.
	 */
	route: string;
	/**
	 * The description of the route.
	 */
	description: string;
	/**
	 * Additional OpenAPI information. Anything added here will be automerged in.
	 */
	openAPI: any;
	/**
	 * The version.
	 */
	version: string;
	/**
	 * The prefix to add to the beginning of each route method.
	 */
	prefix: string;
	/**
	 * The calls that can be made.
	 */
	methods: HotRouteMethod[];
	/**
	 * The errors and their JSON that can be thrown. Can be:
	 * * not_authorized
	 * * no_server_execute_function
	 */
	errors: { [error: string]: any };

	constructor (connection: HotServer | HotClient, route: string, methods: HotRouteMethod[] = [])
	{
		this.connection = connection;
		this.logger = null;

		if (this.connection != null)
		{
			if (this.connection.processor != null)
				this.logger = this.connection.processor.logger;
		}

		this.route = route;
		this.description = "";
		this.openAPI = null;
		this.version = "v1";
		this.prefix = "";
		this.methods = methods;
		this.errors = {
				"not_authorized": HotRoute.createError ("Not authorized."),
				"no_server_execute_function": HotRoute.createError ("Missing server execute function.", 500),
			};
	}

	/**
	 * Create an error JSON object.
	 */
	static createError (message: string, errorCode: number = 400): any
	{
		return ({ error: message, errorCode: errorCode });
	}

	/**
	 * Add an API method to this route.
	 * 
	 * @param method The name of the method to add. If a HotRouteMethod is supplied, the 
	 * rest of the arguments supplied will be ignored.
	 */
	addMethod (
		method: HotRouteMethod | IHotRouteMethod | string,
		executeFunction: ServerExecutionFunction = null,
		type: HotEventMethod = HotEventMethod.POST,
		testCases: (string | TestCaseFunction)[] | TestCaseFunction[] | TestCaseObject[] = null
		): HotRouteMethod | IHotRouteMethod
	{
		if (typeof (method) === "string")
			method = HotRouteMethod.create (this, method, executeFunction, type, null, null, testCases);

		if (method instanceof HotRouteMethod)
			this.methods.push (method);
		else
		{
			if (method.route == null)
				method.route = this;

			method = HotRouteMethod.create (method);
			this.methods.push ((<HotRouteMethod>method));
		}

		return (method);
	}

	/**
	 * Get a method by it's name.
	 */
	getMethod (name: string): HotRouteMethod
	{
		let foundMethod: HotRouteMethod = null;

		for (let iIdx = 0; iIdx < this.methods.length; iIdx++)
		{
			let method: HotRouteMethod = this.methods[iIdx];

			if (method.name === name)
			{
				foundMethod = method;

				break;
			}
		}

		return (foundMethod);
	}

	/**
	 * Executes before all routes have been registered.
	 */
	onPreRegister: () => Promise<void> = null;
	/**
	 * Executes when first registering this route with Express. If 
	 * this returns false, the route will not be registered.
	 */
	onRegister: () => Promise<boolean> = null;
	/**
	 * Executes after all routes have been registered.
	 */
	onPostRegister: () => Promise<void> = null;

	/**
	 * Executes when authorizing a called method.
	 * The value returned from here will be passed to onExecute in the 
	 * called HotRouteMethod. Undefined returning from here will mean 
	 * the authorization failed.
	 */
	onAuthorizeUser: (req: ServerRequest) => Promise<any> = null;
}