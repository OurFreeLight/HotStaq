import { HelloWorldAPI } from "./HelloWorldAPI";
import { HotRoute } from "../../src/HotRoute";
import { ServerRequest } from "../../src/HotRouteMethod";

/**
 * Hello World Second the route.
 */
export class HelloWorldSecond extends HotRoute
{
	constructor (api: HelloWorldAPI)
	{
		super (api.connection, "hello_world_second");

		this.addMethod ({
				name: "hello_again",
				description: "Securely say hello again to the server with authorization and it will respond.",
				onServerAuthorize: api.userAuth,
				onServerExecute: this.complicatedHello,
				parameters: {
					message: {
						type: "string",
						required: true,
						description: "The message to send to the server again. Can be: hi, hello"
					}
				},
				returns: {
					type: "object",
					required: true,
					description: "The message to send to the server again. Can be: hi, hello",
					parameters: {
						type: {
							type: "string",
							required: true,
							description: "The type of message to send."
						},
						value: {
							type: "string",
							required: true,
							description: "The message to send."
						}
					}
				}
			});
	}

	/**
	 * This executes a response saying Hello from the server side.
	 */
	async complicatedHello (req: ServerRequest): Promise<any>
	{
		let message: string = "";

		if (req.jsonObj != null)
		{
			if (req.jsonObj.message != null)
				message = (<string>req.jsonObj.message).toLowerCase ();
		}

		if ((message === "hi") || (message === "hello"))
		{
			return ({
					message: {
						type: "string",
						value: "Hello!"
					}
				});
		}

		return ({ error: "You didn't say hi." });
	}
}