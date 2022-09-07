import { HotRoute, HTTPMethod, HotDBMySQL, MySQLSchema, MySQLResults, 
	MySQLSchemaTable, MySQLSchemaField, ConnectionStatus, HotStaq, 
	HotServer, HotRouteMethod, ServerAuthorizationFunction, HotTestDriver } from "hotstaq";
import { AppAPI } from "./AppAPI";

/**
 * Hello world route.
 */
export class HelloWorld extends HotRoute
{
	constructor (api: AppAPI)
	{
		super (api.connection, "hello_world");

		this.addMethod ({
			"name": "hi",
			"onServerExecute": this._hi,
			"parameters": {},
			"description": "When called, this simply returns the world \"hello\".",
			"returns": "Returns the string \"hello\".",
			"testCases": [
				"HiTest",
				async (driver: HotTestDriver): Promise<any> =>
				{
					// @ts-ignore
					let resp = await api.hello_world.hi ();

					driver.assert (resp === "hello", "The message \"hello\" was not returned!");
				}
			]
		});
		this.addMethod ({
			"name": "echo",
			"onServerExecute": this._echo,
			"parameters": {
				"message": {
					"type": "string",
					"required": true,
					"description": "The message to echo back as a test."
				}
			},
			"description": "When called this will echo back the message that was sent.",
			"returns": "Returns the message that was sent.",
			"testCases": [
				"EchoTest",
				async (driver: HotTestDriver): Promise<any> =>
				{
					// @ts-ignore
					let resp = await api.users.register ({
							message: "test"
						});

					driver.assert (resp === "test", "The message was not echoed back!");
				}
			]
		});
	}

	/**
	 * Say hi.
	 */
	protected async _hi (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
        return ("hello");
	}

	/**
	 * Will echo whatever message the user sends.
	 */
	protected async _echo (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		if (jsonObj.message == null)
			throw new Error ("No message received!");

        return (jsonObj.message);
	}
}