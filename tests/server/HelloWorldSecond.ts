import { HelloWorldAPI } from "./HelloWorldAPI";
import { HotRoute } from "../../src/HotRoute";

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
				description: "Say hello again to the server and it will respond. Just more complicated.",
				onServerExecute: this.complicatedHello,
				parameters: {
					message: {
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
	async complicatedHello (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let message: string = "";

		if (jsonObj != null)
		{
			if (jsonObj.message != null)
				message = (<string>jsonObj.message).toLowerCase ();
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