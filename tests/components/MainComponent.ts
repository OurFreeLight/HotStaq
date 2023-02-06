import { HotStaq } from "../../src/HotStaq";
import { HotComponent, IHotComponent } from "../../src/HotComponent";

import { HelloWorldAPI } from "../server/HelloWorldAPI";

export class MainComponent extends HotComponent
{
	api: HelloWorldAPI;

	constructor (copy: IHotComponent | HotStaq, api: HelloWorldAPI)
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