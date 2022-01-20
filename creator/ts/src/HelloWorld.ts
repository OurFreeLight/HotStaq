import { HotRoute, HTTPMethod, HotDBMySQL, MySQLSchema, MySQLResults, 
	MySQLSchemaTable, MySQLSchemaField, ConnectionStatus, HotStaq, 
	HotServer, HotRouteMethod, ServerAuthorizationFunction } from "hotstaq";
import { AppAPI } from "./AppAPI";

/**
 * Hello world route.
 */
export class HelloWorld extends HotRoute
{
	constructor (api: AppAPI)
	{
		super (api.connection, "hello_world");

		this.addMethod (new HotRouteMethod (this, "hi", this._hi, 
			HTTPMethod.POST));
		this.addMethod (new HotRouteMethod (this, "echo", this._echo, 
			HTTPMethod.POST));
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