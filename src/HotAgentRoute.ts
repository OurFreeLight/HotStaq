import { HotRoute, HTTPMethod, HotRouteMethod, HotStaq } from "./api";
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

		this.addMethod (new HotRouteMethod (this, "execute", this.execute, 
			HTTPMethod.POST, api.userAuth));
	}

	/**
	 * Execute a file.
	 */
	protected async execute (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		const cmd: string = HotStaq.getParam ("cmd", jsonObj);
		const data: any = HotStaq.getParamDefault ("data", jsonObj, undefined);
        let foundCmd: string = this.thisApi.commands[cmd];

        if (foundCmd == null)
            throw new Error (`Command ${cmd} not found!`);

        const cmdData: string = fs.readFileSync (foundCmd).toString ();
        vm.runInNewContext (cmdData, data);

        return (true);
	}
}