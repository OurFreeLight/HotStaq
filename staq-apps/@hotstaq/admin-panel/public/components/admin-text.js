class AdminText extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-text";
		this.field = "";
	}

	/**
	 * Corrects the placement of the text elements for modals.
	 */
	async onParentPlace (parentNode, htmlElement)
	{
		let placeHereArray = parentNode.querySelectorAll (`hot-place-here[type="modal"]`);

		if (placeHereArray.length > 0)
		{
			let placeHere = placeHereArray[0];
			parentNode.removeChild (htmlElement);
			placeHere.appendChild (htmlElement);

			parentNode.hotComponent.fieldElements[this.field] = htmlElement.querySelector ("input");
		}
	}

	async output ()
	{
		return (`<div>
			<label class="form-label">${this.inner}</label><input class="form-control" type = "text" value = "" />
		</div>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminText);