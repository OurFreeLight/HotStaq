/**
 * This file can be used for both server/client side at the same time. So because of that, 
 * weird tricks have to be done with WebPack to get it to work properly. Still looking for 
 * ideas on how to make this work more seamlessly.
 */
import { HotAPI } from "../../src/HotAPI";
import { HotRoute } from "../../src/HotRoute";
import { HotClient } from "../../src/HotClient";
import { HotServer } from "../../src/HotServer";
import { HotStaq } from "../../src/HotStaq";
import { HotTestDriver } from "../../src/HotTestDriver";
import { HTTPMethod } from "../../src/HotRouteMethod";

/// @fixme This weirdness is due to WebPack. Gotta find another way around this...
var HotHTTPServer: any = null;

// @ts-ignore
if (typeof (HotStaqWeb) === "undefined")
{
	if (HotStaq.isWeb === false)
		HotHTTPServer = require ("../../src/HotHTTPServer").HotHTTPServer;
}

export class HelloWorldAPI extends HotAPI
{
	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: any = null)
	{
		super(baseUrl, connection, db);

		let route: HotRoute = new HotRoute (connection, "hello_world");
		route.addMethod ("hello", this.helloCalled);
		route.addMethod ("is_up", 
			async (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any> =>
			{
				return (true);
			}, HTTPMethod.GET);
		route.addMethod ("file_upload", this.fileUpload);
		route.addMethod ("test_response", this.testResponse, HTTPMethod.POST, [
						"TestAPIResponse",
						async (driver: HotTestDriver): Promise<any> =>
						{
							// @ts-ignore
							let resp = await this.hello_world.test_response ({
									message: "YAY!"
								});
							driver.assert (resp === "received", "Response was not received!");
						}
					]);
		this.addRoute (route);
	}

	/**
	 * This executes a response saying Hello from the server side.
	 */
	async helloCalled (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let message: string = "";

		if (jsonObj != null)
		{
			if (jsonObj.message != null)
				message = (<string>jsonObj.message).toLowerCase ();
		}

		if ((message === "hi") || (message === "hello"))
			return ("Hello!");

		return ({ error: "You didn't say hi." });
	}

	/**
	 * This accepts a file upload.
	 */
	async fileUpload (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let filename: string = "";
		let filepath: string = "";
		let results = await HotHTTPServer.getFileUploads (req);

		for (let key in results)
		{
			let file = results[key];
			filename = file.name;
			filepath = file.path;

			break;
		}

		return ({ msg: `File ${filename} uploaded to ${filepath}!`, path: filepath });
	}

	/**
	 * Test a response from the api.
	 */
	async testResponse (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let message: string = jsonObj.message;

		if (message !== "YAY!")
			throw new Error ("You did not yay me bro.");

		return ("received");
	}

	/**
	 * This should be called from the client side.
	 */
	async sayHello (message: string = "hello"): Promise<string>
	{
		let result: any = await this.connection.api.makeCall ("/v1/hello_world/hello", { message: message });

		if (result.error != null)
			result = result.error;

		return (result);
	}
}