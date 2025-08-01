import { HotStaq } from "./HotStaq";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest } from "./HotRouteMethod";
import { HotAgentAPI } from "./HotAgentAPI";

import * as fs from "fs";
import * as vm from "vm";

/**
 * Hello world route.
 */
export class HotAgentRoute extends HotRoute
{
    /**
     * Helper to the parent API.
     */
    thisApi: HotAgentAPI;

	constructor (api: HotAgentAPI)
	{
		super (api.connection, "agent");

        this.thisApi = api;

		if (api.userAuth == null)
			throw new Error (`When using the HotAgentRoute, you must provide a userAuth function in the API.`);

		this.addMethod ({
				name: "execute", 
				onServerExecute: this.execute, 
				type: HotEventMethod.POST,
				onServerAuthorize: api.userAuth
			});
	}

	/**
	 * Execute a file.
	 */
	protected async execute (req: ServerRequest): Promise<any>
	{
		const cmd: string = HotStaq.getParamUnsafe ("cmd", req.jsonObj);
		const data: any = HotStaq.getParamDefaultUnsafe ("data", req.jsonObj, undefined);
        let foundCmd: string = this.thisApi.commands[cmd];

        if (foundCmd == null)
            throw new Error (`Command ${cmd} not found!`);

        const cmdData: string = fs.readFileSync (foundCmd).toString ();
        vm.runInNewContext (cmdData, data);

        return (true);
	}
}