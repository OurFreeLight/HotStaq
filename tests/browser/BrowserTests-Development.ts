import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

describe ("Browser Tests - Development Mode", () =>
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
			});

		it ("should load the Hello World html", async () =>
			{
				await HotStaq.wait (3000);

/**
Execute this code to debug in browser:
(async () =>
{
	window.HotStaq = HotStaqWeb.HotStaq;
	var HotClient = HotStaqWeb.HotClient;
	var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
	var processor = new HotStaq ();
	processor.mode = HotStaqWeb.DeveloperMode.Development;
	window.Hot = HotStaqWeb.Hot;
	var client = new HotClient (processor);
	var helloWorldAPI = new HelloWorldAPI ("http://127.0.0.1:3123", client);
	await helloWorldAPI.onPreRegister ();
	helloWorldAPI.connection.api = helloWorldAPI;
	processor.api = helloWorldAPI;
	await HotStaq.displayUrl (
		"./HelloWorld.hott", "Hello World!", processor, { testData: "TESTING" });
})();
*/

				await common.driver.executeAsyncScript (`
				var done = arguments[0];
				window.HotStaq = HotStaqWeb.HotStaq;
				var HotClient = HotStaqWeb.HotClient;
				var HelloWorldAPI = HotStaqTests.HelloWorldAPI;
				var processor = new HotStaq ();
				processor.mode = HotStaqWeb.DeveloperMode.Development;
				window.Hot = HotStaqWeb.Hot;
				var client = new HotClient (processor);
				var helloWorldAPI = new HelloWorldAPI ("${common.getUrl ()}", client);
				await helloWorldAPI.onPreRegister ();
				helloWorldAPI.connection.api = helloWorldAPI;
				processor.api = helloWorldAPI;
				await HotStaq.displayUrl (
					"./HelloWorld.hott", "Hello World!", processor, { testData: "TESTING" });
				done ();`);
			});
		it ("should properly assemble the page", async () =>
			{
				// testButtonFromPage is loaded from TestButton.hott.
				let elm = await common.driver.wait (until.elementLocated (By.id ("testButtonFromPage")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Test Button from Page: TESTING", "Variables not passing properly to components!");

				value = await elm.getAttribute ("data-test");
				expect (value).to.equal ("yay", "Variables not passing properly to components!");
			});
		it ("should have executed the IIFE on the page", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("iifeTest")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("IIFE Worked");
			});
		it ("should have tested onload", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("onload")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("onload Worked");
			});
		it ("should have tested DOMContentLoaded", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("DOMContentLoaded")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("DOMContentLoaded Worked");
			});
		it ("should click the Hello World button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("helloWorld")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked", "Button was not clicked!");
			});
		it ("should click the function test button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("funcClickTest")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				await HotStaq.wait (50);

				elm = await common.driver.findElement (By.id ("funcClickTest"));
				let value: string = await elm.getAttribute ("innerHTML");

				expect (value).to.equal ("ButtonClicked0-TESTING-3", "Function test button was not clicked!");
			});
		it ("should send a hi to the hello world api", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				await elm.sendKeys ("hi");

				// Tests Hot.apiCall
				elm = await common.driver.wait (until.elementLocated (By.id ("testHelloWorldAPI")));
				await elm.click ();

				await HotStaq.wait (100);

				/*elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				let jsonObj = JSON.parse (value);
				expect (jsonObj).to.equal ("Hello!");*/

				elm = await common.driver.findElement (By.id ("APIResponse"));
				let value = await elm.getAttribute ("innerHTML");
				let jsonObj = JSON.parse (value);
				expect (jsonObj.errorCode).to.equal (400);

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
		it ("should test the test2 attribute that uses ${}", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				let value: string = await elm.getAttribute ("data-test2");

				expect (value).to.equal ("test2data", "Test attribute was incorrect!");
			});
		it ("should test the test3 attribute ?() and STR{}", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("message")));
				let value: string = await elm.getAttribute ("data-test-object-name");

				expect (value).to.equal ("messageTestObjectName", "Test object name was incorrect!");
			});
	});