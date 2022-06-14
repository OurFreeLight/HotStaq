import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";

describe ("Component Tests", () =>
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
/**
Execute this code to debug in browser:
(async () =>
{
	var HotStaq = HotStaqWeb.HotStaq;
	var HotClient = HotStaqWeb.HotClient;
	var HelloWorld = HotStaqTests.HelloWorld;
	var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
	var processor = new HotStaq ();
	var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}");
	helloWorldAPI.connection = new HotClient (processor);
	helloWorldAPI.connection.api = helloWorldAPI;
	processor.addComponent (new HelloWorld (processor, helloWorldAPI));
	await HotStaq.displayUrl ("/tests/browser/ComponentTests.hott", processor);
})();
*/
				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				var HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorld = HotStaqTests.HelloWorld;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}", client);
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.addComponent (new HelloWorld (processor, helloWorldAPI));
				await HotStaq.displayUrl ("/tests/browser/ComponentTests.hott", "Hello World Components!", processor);
				done ();`);
			});
		it ("should click the Hello World button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("helloWorld")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked", "Button was not clicked!");

				await common.driver.executeAsyncScript (`
					var done = arguments[0];
					let objHelloWorld = document.getElementById ("helloWorld");
					document.getElementById ("message2").value = objHelloWorld.test ();
					done ();`);

				elm = await common.driver.findElement (By.id ("message2"));
				value = await elm.getAttribute ("value");
				expect (value).to.equal ("bla-test", "Button was not clicked!");
			});
		it ("should dynamically create a Hello World button", async () =>
			{
				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				var HotStaq = HotStaqWeb.HotStaq;
				document.getElementById ("buttonClicked").innerHTML = "";
				HotStaq.addHtml ("body", "<hello-world id = \\"dynamicHelloWorld\\" value = \\"Send\\"></hello-world>");
				done ();`);
			});
		it ("should click the new Hello World button and verify the API call result", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				await elm.sendKeys ("hi");

				elm = await common.driver.wait (until.elementLocated (By.id ("dynamicHelloWorld")));
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked");
			});
	});