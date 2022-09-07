class AdminTableField extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-table-field";
		this.value = "";
	}

	/**
	 * When this element is placed, execute the following.
	 */
	/*async onPostPlacement (parentElement, htmlElement)
	{
		parentElement.addHeader (htmlElement);

		return (htmlElement);
	}*/

	async output ()
	{
		return (`
		<tr>
			<td>
				${this.value}
			</td>
		</tr>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminTableField);