import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

describe ("Hot Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;

		before (async () =>
			{
				processor = new HotStaq ();

				common = new Common ();
				await common.load ();

				await common.startServer ();
				await common.driver.get (`${common.getUrl ()}/tests/browser/index.htm`);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("should load the Hello World html", async () =>
			{
				await HotStaq.wait (1000);

/**
Execute this code to debug in browser:
(async () =>
{
	window.HotStaq = HotStaqWeb.HotStaq;
	window.Hot = HotStaqWeb.Hot;
	var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}");
	await helloWorldAPI.onPreRegister ();
	helloWorldAPI.connection = new HotClient (processor);
	helloWorldAPI.connection.api = helloWorldAPI;
	await HotStaq.displayUrl ("/tests/browser/HelloWorld.hott");
})();
*/

				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}", client);
				await helloWorldAPI.onPreRegister ();
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl (
					"./HotTests.hott", "Hello World!", processor, { testData: "TESTING" });
				done ();`);
			});
		it ("should properly assemble the page", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("httpCall1")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("httpCall1", "Page did not load properly!");
			});
		it ("should ensure the copyright is correct", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("testCopyright")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal (`Copyright 2020 - ${new Date ().getFullYear ()}`, "Copyright test didn't work!");
			});
		it ("should click the httpCall1 button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("httpCall1")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("message"));
				let value: string = await elm.getAttribute ("value");
				expect (value).to.equal ("Hello!", "httpCall1 didn't work!");
			});
		it ("should click the httpCall2 button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("httpCall2")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("message"));
				let value: string = await elm.getAttribute ("value");
				expect (value).to.equal ("Hello!", "httpCall2 didn't work!");
			});
		it ("should click the httpCall3 button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("httpCall3")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("message"));
				let value: string = await elm.getAttribute ("value");
				expect (value).to.equal ("Hello!", "httpCall3 didn't work!");
			});
	});