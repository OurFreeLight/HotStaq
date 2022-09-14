class AdminTableField extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-table-field";
		this.field = "";
	}

	/**
	 * Add this table field to the table
	 */
	async onPostPlace (parentNode, htmlElement)
	{
		let hotComponent = parentNode.parentNode.parentNode.parentNode.hotComponent;

		hotComponent.addHeaderDataOnly (this, htmlElement);
	}

	async output ()
	{
		return ([{
			html: `<th>${this.inner}</th>`,
			placeHereParent: "header"
		}]);
	}
}

Hot.CurrentPage.processor.addComponent (AdminTableField);