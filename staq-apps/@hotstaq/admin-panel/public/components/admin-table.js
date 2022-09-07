class AdminTable extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-table";
		this.title = "Tets";
        this.schema = "";
	}

    /**
     * Add a header to the table.
     */
    addHeader (tableFieldElement)
    {
        let header = this.htmlElement.getElementsByTagName ("thead")[0];

        header.appendChild (tableFieldElement);
    }

    /**
     * Add a row to the table.
     */
    addRow (tableFieldRowElement)
    {
        let body = this.htmlElement.getElementsByTagName ("tbody")[0];

        body.appendChild (tableFieldRowElement);
    }

	async output ()
	{
		return (`
        <div>
            <h2>${this.title}</h2>
            <div class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                </thead>
                <tbody>
                    <hotstaq-place-here></hotstaq-place-here>
                </tbody>
            </table>
            </div>
        </div>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminTable);