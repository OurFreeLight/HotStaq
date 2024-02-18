import { HotStaq, HotComponent, IHotComponent, HotComponentOutput } from "../../src/api-web";

export class TableHeader extends HotComponent
{
	api: any;

	constructor (copy: IHotComponent | HotStaq, api: any)
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