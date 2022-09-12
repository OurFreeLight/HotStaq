class AdminDashboard extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-dashboard";
		this.title = "";
		this.base = "http://localhost:3232";
	}

	/**
	 * Add this table field to the table
	 */
	async onPostPlace (parentNode, htmlElement)
	{
		// Set the base API url to use for this dashboard.
		Hot.Data.baseUrl = this.base;
	}

	async output ()
	{
		return (`
		<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
			<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
				<h1 class="h2">${this.title}</h1>
				<div class="btn-toolbar mb-2 mb-md-0">
					<div class="btn-group me-2">
						<hot-place-here name = "buttons"></hot-place-here>
					</div>
				</div>
			</div>
			<hot-place-here name = "body"></hot-place-here>
		</main>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminDashboard);