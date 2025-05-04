import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";

describe ("Detailed Component Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;

		before (async () =>
			{
				processor = new HotStaq ();

				common = new Common ();
				await common.load ();

				await common.startServer ();
				await common.driver.sleep (1500);
				await common.driver.get (`${common.getUrl ()}/tests/browser/index.htm`);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});
 
		it ("should load the component tests html", async () =>
			{
/*Execute this code to debug in browser:
(async () =>
{
	var HotStaq = HotStaqWeb.HotStaq;
	var HotClient = HotStaqWeb.HotClient;
	var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
	var processor = new HotStaq ();
	var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}");
	await helloWorldAPI.onPreRegister ();
	helloWorldAPI.connection = new HotClient (processor);
	helloWorldAPI.connection.api = helloWorldAPI;
	processor.api = helloWorldAPI;
	await HotStaq.displayUrl ("/tests/components/ComponentTest.hott", processor);
})();*/

				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				var HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}", client);
				await helloWorldAPI.onPreRegister ();
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				processor.addComponent (HotStaqTests.MainComponent);
				processor.addComponent (HotStaqTests.TableComponent);
				processor.addComponent (HotStaqTests.TableHeader);
				await HotStaq.displayUrl ("/tests/components/ComponentTest.hott", "Hello World Components!", processor);
				done ();`);
			});
		it ("should load the main component", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.css ("main")));
				expect (elm).to.not.equal (null, "Main component did not load!");
			});
		it ("should load the table component", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.css ("table")));
				expect (elm).to.not.equal (null, "table component did not load!");
			});
		it ("should load the table header", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.css ("table > thead > th")));
				expect (elm).to.not.equal (null, "table header did not load!");
			});
		it ("should load the table row", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.css ("table > tbody > tr:nth-child(1) > td")));
				let text = await elm.getText ();
				expect (text).to.equal ("value1", "table row did not load!");
			});
	});