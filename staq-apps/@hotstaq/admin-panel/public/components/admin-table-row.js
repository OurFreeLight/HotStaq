class AdminTableRow extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-table-row";
		/**
		 * The fields are stored in a key/value object.
		 * 
		 * @example { "name": "John Smith", "email": "john.smith@email.com" }
		 */
		this.fields = [];
	}

	/**
	 * Add this table row to the table
	 */
	async onPostPlace (parentNode, htmlElement)
	{
		parentNode.parentNode.parentNode.parentNode.hotComponent.rowElements.push ({ fields: this.fields, element: htmlElement});
	}

	async output ()
	{
		let rowHtml = "";

		for (let iIdx = 0; iIdx < this.fields.length; iIdx++)
		{
			let fieldObj = this.fields[iIdx];

			for (let key in fieldObj)
			{
				let value = fieldObj[key];

				rowHtml += `<td>${value}</td>`;
			}
		}

		return ([{
			html: `<tr>${rowHtml}</tr>`,
			placeHereParent: "results"
		}]);
	}
}

Hot.CurrentPage.processor.addComponent (AdminTableRow);