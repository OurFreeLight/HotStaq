class AdminTable extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-table";
		this.title = "";
		this.schema = "";

		/**
		 * The headers are stored in a key/value object.
		 * 
		 * @example { "name": "<th>Name</th>", "email": "<th>Email</th>" }
		 */
		this.headerElements = {};
		/**
		 * The header indicies are stored in a key/value object.
		 * 
		 * @example console.log (this.headerIndicies["name"]); // Outputs 0
		 */
		this.headerIndicies = [];
		/**
		 * The row elements are stored in an array with key/value fields and it's attached html element.
		 * 
		 * @example
		 * {
		 *   "fields": [
		 *       {
		 *         "name": "John Smith",
		 *         "email": "john.smith@test.com"
		 *       }
		 *     ],
		 *   "html": "<tr><td>John Smith</td><td>john.smith@test.com</td></tr>"
		 * }
		 */
		this.rowElements = [];
	}

	/**
	 * Add a header to the table.
	 */
	addHeader (tableFieldElement)
	{
		let header = this.htmlElements[0].getElementsByTagName ("thead")[0];

		this.headerIndicies.push (tableFieldElement.hotComponent.field);
		header.appendChild (tableFieldElement);
	}

	/**
	 * Add a header to the table.
	 */
	addHeaderDataOnly (tableField, htmlElement)
	{
		this.headerIndicies.push (tableField.field);
		this.headerElements[tableField.field] = htmlElement;
	}

	/**
	 * Add a row to the table.
	 * 
	 * @param {Array} fields A list of values to append.
	 */
	addRow (fields)
	{
		let tbody = this.htmlElements[1].getElementsByTagName ("tbody")[0];
		let rowStr = "<tr>";

		for (let iIdx = 0; iIdx < this.headerIndicies.length; iIdx++)
		{
			let key = this.headerIndicies[iIdx];
			let value = fields[key];

			if (this.headerElements[key] != null)
				rowStr += `<td>${value}</td>`;
		}

		rowStr += "</tr>";

		HotStaq.addHtml (tbody, rowStr);
	}

	/**
	 * Clear the list of rows.
	 */
	async clearRows ()
	{
		let tbody = this.htmlElements[1].getElementsByTagName ("tbody")[0];

		tbody.innerHTML = "";
	}

	/**
	 * Refresh the list.
	 */
	async refreshList ()
	{
		let list = await Hot.jsonRequest (`${Hot.Data.baseUrl}/v1/data/list`, {
				schema: this.schema
			});

		this.clearRows ();

		for (let iIdx = 0; iIdx < list.length; iIdx++)
		{
			let fields = list[iIdx];

			this.addRow (fields);
		}
	}

	/**
	 * Get the list of data from the server.
	 */
	async onPostPlace (parentNode, htmlElement)
	{
		setTimeout (async () =>
			{
				await this.refreshList ();
			}, 50);
	}

	async output ()
	{
		return (`
		<div id = "${this.htmlElements[0].id}">
			<h2>${this.title}</h2>
			<div class="table-responsive">
			<table class="table table-striped table-sm">
				<thead hot-place-here = "header">
				</thead>
				<tbody hot-place-here = "results">
				</tbody>
			</table>
			</div>
		</div>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminTable);