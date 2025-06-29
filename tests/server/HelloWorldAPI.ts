/**
 * This file can be used for both server/client side at the same time. So because of that, 
 * weird tricks have to be done with WebPack to get it to work properly. Still looking for 
 * ideas on how to make this work more seamlessly.
 */
import { HotAPI } from "../../src/HotAPI";
import { HotRoute } from "../../src/HotRoute";
import { HotClient } from "../../src/HotClient";
import { HotServer, HotServerType } from "../../src/HotServer";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HotRouteMethodParameterMap, HotStaq } from "../../src/HotStaq";
import { HotTestDriver } from "../../src/HotTestDriver";
import { HotEventMethod, HotRouteMethodParameter, HotValidationType, InputValidationType, ServerRequest } from "../../src/HotRouteMethod";

import { HelloWorldSecond } from "./HelloWorldSecond";
import { OtherInterface } from "../parsing/TestInterface";

export class HelloWorldAPI extends HotAPI
{
	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: any = null)
	{
		super(baseUrl, connection, db);

		this.userAuth = async (req: ServerRequest): Promise<any> =>
			{
				const token: string = req.bearerToken;

				if (token === "kjs1he4w57h:3u4j5n978sd")
				{
					return ({ userId: "test-user" });
				}
				else
					throw new Error ("Incorrect API key or secret!");

				return (undefined);
			};
		this.onPreRegister = async (): Promise<boolean> =>
			{
				if ((<HotHTTPServer>connection).useWebsocketServer === true)
				{
					(<HotHTTPServer>connection).websocketServer.onServerAuthorize = 
						async (req: ServerRequest): Promise<any> =>
						{
							const apiKey: string = req.jsonObj["ApiKey"];
							const apiSecret: string = req.jsonObj["ApiSecret"];

							if ((apiKey === "kjs1he4w57h") && (apiSecret === "3u4j5n978sd"))
							{
								return ({ userId: "test-user" });
							}
							else
								throw new Error ("Incorrect API key or secret!");

							return (undefined);
						};
				}

				this.description = "This is the hello world API.";

				let otherInterface: HotRouteMethodParameterMap = undefined;

				/// @fixme This is a hack. This should not be loaded during runtime for web. The generated js file should be used instead.
				if (HotStaq.isWeb === false)
				{
					await HotStaq.convertInterfaceToRouteParameters ("OtherInterfaceAgain")
					otherInterface = await HotStaq.convertInterfaceToRouteParameters ("OtherInterface");
				}

				let route: HotRoute = new HotRoute (connection, "hello_world");
				// @ts-ignore
				route.wsReturnMessage = "Hello!";
				route.description = "This is the hello world route.";
				route.addMethod ({
						name: "hello",
						description: "Say hello to the server and it will respond.",
						onServerExecute: this.helloCalled,
						validateJSONInput: InputValidationType.Strict,
						parameters: {
							message: {
								"description": "The message to send to the server. Can be: hi, hello",
								"validations": [{ "type": HotValidationType.Enum, "values": ["hi", "hello"] }]
							},
							throwError: {
								"description": "Throw an error on the server side.",
								"required": false
							}
						},
						"testCases": {},
						returns: "The server says Hello World!"
					});
				route.addMethod ({
						name: "validate_other_interface",
						description: "Validate the OtherInterface object.",
						onServerExecute: this.validateOtherInterface,
						validateJSONInput: InputValidationType.Strict,
						parameters: otherInterface,
						"testCases": {},
						returns: "True if the object is valid."
					});
				route.addMethod ("is_up", async (req: ServerRequest): Promise<any> =>
					{
						return (true);
					}, HotEventMethod.GET);
				route.addMethod ("file_upload", this.fileUpload, HotEventMethod.FILE_UPLOAD);
				route.addMethod ({
						name: "file_upload_auth",
						onServerExecute: this.fileUploadAuth, 
						type: HotEventMethod.FILE_UPLOAD,
						onServerAuthorize: this.userAuth
					});
				route.addMethod ({
						name: "ws_hello_event",
						type: HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT,
						description: "Say hello to the server and it will respond.",
						onServerExecute: function async (req: ServerRequest)
						{
							const message: string = (<string>req.jsonObj.message).toLowerCase ();

							if ((message === "hi") || (message === "hello"))
								return (this.wsReturnMessage); // In this case, "this" should be the route.

							return ({ error: "You didn't say hi." });
						},
						parameters: {
							message: {
								type: "string",
								required: true,
								description: "The message to send to the server. Can be: hi, hello"
							}
						},
						"testCases": {},
						returns: "The server says Hello World!"
					});
				route.addMethod ({
						name: "ws_test_response_both",
						type: HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT,
						description: "Say hello to the server and it will respond.",
						onServerExecute: this.testResponse,
						parameters: {
							message: "The message to send to the server. It must be: YAY!"
						},
						"testCases": {},
						returns: {
							type: "string",
							description: "The server says received."
						}
					});
				route.addMethod ("ws_test_response", this.testResponse, HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT);
				route.addMethod ("test_response", this.testResponse, HotEventMethod.POST, [
								"TestAPIResponse",
								async (driver: HotTestDriver): Promise<any> =>
								{
									// @ts-ignore
									let resp = await this.hello_world.test_response ({
											message: "YAY!"
										});
									driver.assert (resp === "received", "Response was not received!");
								},
								"TestAPIResponseAgain",
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

				this.addRoute (new HelloWorldSecond (this));

				return (true);
			};
	}

	/**
	 * This executes a response saying Hello from the server side.
	 */
	async helloCalled (req: ServerRequest): Promise<any>
	{
		let message: string = "";

		if (req.jsonObj != null)
		{
			if (req.jsonObj.message != null)
				message = (<string>req.jsonObj.message).toLowerCase ();

			if (req.jsonObj.throwError != null)
			{
				if (req.jsonObj.throwError === "34598has98ehw3794")
					throw new Error (`Error has been thrown!`);
			}
		}

		if ((message === "hi") || (message === "hello"))
			return ("Hello!");

		return ({ error: "You didn't say hi." });
	}

	/**
	 * This accepts a file upload.
	 */
	async fileUpload (req: ServerRequest): Promise<any>
	{
		let filename: string = "";
		let filepath: string = "";

		for (let key in req.files)
		{
			let file = req.files[key];
			filename = file.name;
			filepath = file.path;

			break;
		}

		return ({ msg: `File ${filename} uploaded to ${filepath}!`, path: filepath });
	}

	/**
	 * Validate the OtherInterface object.
	 */
	async validateOtherInterface (req: ServerRequest): Promise<boolean>
	{
		const otherInterface: OtherInterface = req.jsonObj;

		return (true);
	}

	/**
	 * This accepts a file upload requiring authentication.
	 */
	async fileUploadAuth (req: ServerRequest): Promise<any>
	{
		const uploadDetails = HotStaq.getParamUnsafe ("uploadDetails", req.jsonObj);

		if (uploadDetails.name !== "testName")
			throw new Error ("Incorrect upload name!");

		if (req.files == null)
			throw new Error ("No file uploaded!");

		let filename: string = "";
		let filepath: string = "";

		for (let key in req.files)
		{
			let file = req.files[key];
			filename = file.name;
			filepath = file.path;

			break;
		}

		return ({ msg: `File ${filename} uploaded to ${filepath}!`, path: filepath });
	}

	/**
	 * Test a response from the api.
	 */
	async testResponse (req: ServerRequest): Promise<any>
	{
		let message: string = req.jsonObj.message;

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