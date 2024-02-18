import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "./Common";

import { HotHTTPServer, HotLogLevel, HotStaq } from "../../src/api";
import { HelloWorldAPI } from "../server/HelloWorldAPI";

describe ("Hotsite Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;

		before (async () =>
			{
				processor = new HotStaq ();
			});
		after (async () =>
			{
				await common.driver.quit ();
				await server.shutdown ();
			});

		it ("should load the HotSite", async () =>
			{
				server = new HotHTTPServer (processor);
		
				server.logger.logLevel = HotLogLevel.All;
				await processor.loadHotSite (`./tests/hotsite/HotSite.json`);
				await processor.processHotSite ();

				common = new Common (processor);
				await common.load ();

				let api: HelloWorldAPI = new HelloWorldAPI (common.getUrl (server), server);
				await server.setAPI (api);
				await server.listen ();

				await common.driver.get (`${common.getUrl (server)}/tests/hotsite/index.htm`);
			});
		it ("should have loaded /tests/hotsite/HelloWorld.hott", async () =>
			{
				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = hello_world;
				var processor = new HotStaq ();
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl (server)}", client);
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl ({
						url: "/tests/hotsite/HelloWorld.hott",
						name: "Hello World",
						processor: processor
					});
				done ();`);

				let elm = await common.driver.wait (until.elementLocated (By.id ("test")));
				expect (elm).to.not.equal (null, "Page did not load!");

				elm = await common.driver.wait (until.elementLocated (By.id ("helloWorld")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked", "Button was not clicked!");
			});
		it ("should send a hi to the hello world api", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				await elm.sendKeys ("hi");

				// Tests Hot.apiCall
				elm = await common.driver.wait (until.elementLocated (By.id ("testHelloWorldAPI")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				let jsonObj = JSON.parse (value);

				expect (jsonObj).to.equal ("Hello!");

				// Tests the constructed API call route method functions
				elm = await common.driver.wait (until.elementLocated (By.id ("testHelloWorldAPI2")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				value = await elm.getAttribute ("innerHTML");
				jsonObj = JSON.parse (value);

				expect (jsonObj).to.equal ("Hello!");
			});
		it ("should test the test attribute that uses a JS executor ${}", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				let value: string = await elm.getAttribute ("data-test");

				expect (value).to.equal ("TESTING", "Test attribute was incorrect!");
			});
		it ("should test the test2 attribute that uses ${} and !{}", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				let value: string = await elm.getAttribute ("data-test2");

				expect (value).to.equal ("test2data", "Test attribute was incorrect!");
			});
		it ("should test the test3 attribute ?() and STR{}", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				let value: string = await elm.getAttribute ("data-test-object-name");

				expect (value).to.equal (null, "Test object name was incorrect!");
			});
		it ("should have loaded the /hello_world route", async () =>
			{
				await common.driver.get (`${common.getUrl (server)}/tests/hotsite/index.htm`);

				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = hello_world;
				var processor = new HotStaq ();
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl (server)}", client);
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl ({
						url: "/hello_world",
						name: "Hello World",
						processor: processor
					});
				done ();`);

				let elm = await common.driver.wait (until.elementLocated (By.id ("test")));
				expect (elm).to.not.equal (null, "Page did not load!");

				elm = await common.driver.wait (until.elementLocated (By.id ("helloWorld")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked", "Button was not clicked!");
			});
	});