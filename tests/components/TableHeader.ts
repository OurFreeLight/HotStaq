import { HotStaq } from "../../src/HotStaq";
import { HotComponent, HotComponentOutput, IHotComponent } from "../../src/HotComponent";

import { HelloWorldAPI } from "../server/HelloWorldAPI";

export class TableHeader extends HotComponent
{
	api: HelloWorldAPI;

	constructor (copy: IHotComponent | HotStaq, api: HelloWorldAPI)
	{
		if (api == null)
			throw new Error ("TableHeader: API cannot be null!");

		super (copy, api);

		this.tag = "table-header";
	}

	async click (): Promise<void>
	{
	}

	output (): string | HotComponentOutput[]
	{
		return ([{ 
			html: `<th>${this.inner}</th>`,
			placeHereParent: "header"
		}]);
	}
}