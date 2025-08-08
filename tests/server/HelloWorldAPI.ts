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
import { HotRouteMethodParameterMap, HotStaq, IHotValidReturn } from "../../src/HotStaq";
import { HotTestDriver } from "../../src/HotTestDriver";
import { HotEventMethod, HotRouteMethodParameter, HotValidation, ServerRequest } from "../../src/HotRouteMethod";

import { HelloWorldSecond } from "./HelloWorldSecond";
import { OtherInterface } from "../parsing/TestInterface";
import { HttpError } from "../../src/HotHttpError";
import { ValidationOptions } from "../../src/HotProcessInput";


/**
 * Permissions related to an object being inputed. These should never 
 * be allowed to be passed from the client side.
 */
export interface InputPermission
{
	/**
	 * If set to true, the input must contain an input.
	 */
	cannotBeEmpty?: boolean;
	/**
	 * The maximum length of the input.
	 */
	maxLength?: number;
	/**
	 * If set to true, the object is an rich box and should be accepting valid json.
	 * The input is expected to be validated by an admin, and should still be checked for 
	 * any urls or emails by a user.
	 */
	isRichTextBox?: boolean;
	/**
	 * If set to true, the object needs to be validated.
	 */
	needsValidation?: boolean;
}

export class HelloWorldAPI extends HotAPI
{
	/**
	 * The maximum rich text input length.
	 */
	static maxRichTextLength: number = 2097152;

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

				HotStaq.setValid ("ObjectName", (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn => 
					{
						const result = HelloWorldAPI.checkIfUserInputIsValid (value);
		
						if (result === false)
							throw new HttpError (`Name parameter ${key} is not valid. Valid regex is: ^[a-zA-Z0-9\\$\\:\\+\\-=\\.\\_\\,\\/\\\\\\!\\(\\)\\s]+$`, 400);
		
						return ({ value: value });
					});
				HotStaq.setValid ("RichText", (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn => 
					{
						HelloWorldAPI.checkIfUserRichTextInputIsValidThrow (key, value);
		
						return ({ value: value });
					});
				HotStaq.setValid ("SearchText", (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn => 
					{
						HelloWorldAPI.checkIfUserRichTextInputIsValidThrow (key, value);
		
						return ({ value: value });
					});
				HotStaq.setValid ("MessageText", (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn => 
					{
						HelloWorldAPI.checkIfUserInputIsValidThrow (key, value);
		
						return ({ value: value });
					});

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
						validateJSONInput: new ValidationOptions (true),
						parameters: {
							message: {
								"description": "The message to send to the server. Can be: hi, hello",
								"validations": [{ "type": "Enum", "values": ["hi", "hello"] }]
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
						name: "error_test",
						description: "Throw an error, make sure it's caught properly.",
						onServerExecute: async (req: ServerRequest): Promise<boolean> => 
							{
								const errorTest = HotStaq.getParamUnsafe ("errorTest", req.jsonObj);
						
								await new Promise<void>((resolve, reject) =>
									{
										if (errorTest === "TEST1")
											throw new Error ("TEST1 ERROR");

										resolve ();
									});

								return (true);
							},
						"testCases": {},
						returns: "True if the object is valid."
					});
				route.addMethod ({
						name: "validate_other_interface",
						description: "Validate the OtherInterface object.",
						onServerExecute: this.validateOtherInterface,
						validateJSONInput: new ValidationOptions (true),
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

	/**
	 * Check if the user input is valid. Unfortunately only English is allowed currently :(
	 * Valid characters are a-z, A-Z, 0-9, $:+-=._/\!(), and space. The input cannot contains email, 
	 * urls, or phone numbers.
	 * 
	 * Empty strings are considered valid input.
	 * 
	 * @returns Returns false if the input contains invalid characters, email, url, phone, etc.
	 */
	public static checkIfUserInputIsValid (input: string): boolean
	{
		if ((input == null) || (input === ""))
			return (true);

		let regex = /^[a-zA-Z0-9\$\:\+\-=\.\_\,\/\\\!\(\)\#\s]+$/;
		let result = regex.test (input);

		if (result === false)
			return (false);

		return (true);
	}

	/**
	 * Check if the user input is valid. Unfortunately only English is allowed currently :(
	 * This will throw an error if the user input contains invalid input. Valid characters are 
	 * a-z, A-Z, 0-9, +-=._, and space. The input cannot contains email, urls, or phone numbers.
	 * 
	 * Empty strings are considered valid input.
	 * 
	 * @returns Returns the input if it is valid.
	 */
	public static checkIfUserInputIsValidThrow (inputName: string, input: string, inputPermission: InputPermission = null): string
	{
		if (inputPermission != null)
		{
			if (inputPermission.needsValidation != null)
			{
				if (inputPermission.needsValidation === false)
					return (input);
			}

			if (inputPermission.cannotBeEmpty != null)
			{
				if (inputPermission.cannotBeEmpty === true)
				{
					if ((input == null) || (input === ""))
						throw new HttpError (`Invalid input for ${inputName}! This input cannot be empty.`, 400);
				}
			}

			if ((input == null) || (input === ""))
				return (input);

			if (inputPermission.maxLength != null)
			{
				if (inputPermission.maxLength > 0)
				{
					if (input.length >= inputPermission.maxLength)
						throw new HttpError (`Invalid input for ${inputName}! This input is too long. Maximum length is ${inputPermission.maxLength}.`, 400);
				}
			}

			if (inputPermission.isRichTextBox != null)
			{
				if (inputPermission.isRichTextBox === true)
				{
					try
					{
						JSON.parse (input);
					}
					catch (ex)
					{
						throw new HttpError (`Invalid input for ${inputName}! Contains improper json. Error: ${ex.message}`, 400);
					}

					return (input);
				}
			}
		}

		if (HelloWorldAPI.checkIfUserInputIsValid (input) === false)
			throw new HttpError (`Invalid input for ${inputName}! This input can only contain the characters a-z, A-Z, 0-9, spaces, and the following special characters $+-=._, Additionally, this input cannot contain restricted inputs such as --, //, emails, phone numbers, or urls.`, 400);

		return (input);
	}

	/**
	 * This does the same as `AppAPI.checkIfUserInputIsValidThrow`, but has a wrapper to help ensure rich text editing is done right.
	 */
	public static checkIfUserRichTextInputIsValidThrow (inputName: string, input: string, 
		inputPermission: InputPermission = { "isRichTextBox": true, "maxLength": HelloWorldAPI.maxRichTextLength }): string
	{
		return (HelloWorldAPI.checkIfUserInputIsValidThrow (inputName, input, inputPermission));
	}
}