import { HotStaq } from "../../src/HotStaq";
import { HotComponent, IHotComponent } from "../../src/HotComponent";

import { HelloWorldAPI } from "../server/HelloWorldAPI";

export class TableComponent extends HotComponent
{
	api: HelloWorldAPI;

	constructor (copy: IHotComponent | HotStaq, api: HelloWorldAPI)
	{
		if (api == null)
			throw new Error ("TableComponent: API cannot be null!");

		super (copy, api);

		this.tag = "table-component";
	}


	async click (): Promise<void>
	{
	}

	/**
	 * Add a row to the table.
	 * 
	 * @param {Array} fields A list of values to append.
	 */
	addRow (values: string[])
	{
		let tbody = this.htmlElements[1].getElementsByTagName ("tbody")[0];

		for (let i = 0; i < values.length; i++)
		{
			let value = values[i];

			let rowStr = `
			<tr>
				<td>${value}</td>
			</tr>`;

			HotStaq.addHtmlUnsafe (tbody, rowStr);
		}
	}

	/**
	 * Get the list of data from the server.
	 */
	onPostPlace (parentHtmlElement: HTMLElement, htmlElement: HTMLElement): HTMLElement
	{
		setTimeout (async () =>
			{
				this.addRow (["value1", "value2", "value3"]);
			}, 50);

		return (null);
	}

	output (): string
	{
		return (`
		<table id = "${this.htmlElements[0].id}Table" class="table table-striped table-sm">
			<thead hot-place-here = "header">
			</thead>
			<tbody hot-place-here = "results">
			</tbody>
		</table>`);
	}
}