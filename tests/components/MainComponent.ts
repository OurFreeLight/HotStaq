import { HotStaq, HotComponent, IHotComponent } from "../../src/api-web";

export class MainComponent extends HotComponent
{
	api: any;

	constructor (copy: IHotComponent | HotStaq, api: any)
	{
		if (api == null)
			throw new Error ("MainComponent: API cannot be null!");

		super (copy, api);

		this.tag = "main-component";
	}


	async click (): Promise<void>
	{
	}

	output (): string
	{
		return (`
		<main>
			<hot-place-here name = "mainBody"></hot-place-here>
		</main>`);
	}
}