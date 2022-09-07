class AdminDashboard extends HotComponent
{
	constructor (copy, api)
	{
		super (copy, api);

		this.tag = "admin-dashboard";
		this.title = "";
	}

	async output ()
	{
		return (`
		<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
			<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
				<h1 class="h2">${this.title}</h1>
			</div>
			<hotstaq-place-here></hotstaq-place-here>
		</main>`);
	}
}

Hot.CurrentPage.processor.addComponent (AdminDashboard);