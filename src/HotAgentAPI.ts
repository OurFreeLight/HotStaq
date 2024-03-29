import { HotAPI } from "./HotAPI";
import { HotServer } from "./HotServer";
import { HotClient } from "./HotClient";
import { HotAgentRoute } from "./HotAgentRoute";
import { ServerRequest } from "./HotRouteMethod";

/**
 * The App's API and routes.
 */
export class HotAgentAPI extends HotAPI
{
    /**
     * The key to use.
     */
    key: string;
    /**
     * The secret key to use.
     */
    secret: string;
    /**
     * The commands to execute.
     */
    commands: { [name: string]: string };

	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: any = null)
	{
		super(baseUrl, connection, db);

        this.key = "";
        this.secret = "";
        this.commands = {};

        this.userAuth = async (req: ServerRequest): Promise<any> =>
            {
                const apiKey: string = req.jsonObj["key"];
                const apiSecret: string = req.jsonObj["secret"];

                if ((apiKey !== this.key) && (apiSecret !== this.secret))
                    throw new Error ("Incorrect API key or secret!");

                return (true);
            };

		this.addRoute (new HotAgentRoute (this));
	}
}