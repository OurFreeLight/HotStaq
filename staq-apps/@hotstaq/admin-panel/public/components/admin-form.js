class AdminForm extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-form";
	}

    async submitForm ()
    {
    }

	async output ()
	{
		return (`<form id = "${this.htmlElement.id}" onsubmit = "this.submitForm (); return (false);" action = "#"></form>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminForm);