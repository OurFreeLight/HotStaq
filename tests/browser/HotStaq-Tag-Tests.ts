import "mocha";
import { expect, should } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "./Common";

import { HotStaq } from "../../src/api";

describe ("HotStaq <hotstaq> Tag Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;

		before (async () =>
			{
				processor = new HotStaq ();

				common = new Common ();
				await common.load ();

				await common.startServer ();
				await common.driver.get (`${common.getUrl ()}/tests/browser/HotStaq-Tag-Load-Page.html`);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("should properly assemble the page", async () =>
			{
				await HotStaq.wait (1000);

				// testButtonFromPage is loaded from TestButton.hott.
				let elm = await common.driver.wait (until.elementLocated (By.id ("testButtonFromPage")));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Test Button from Page: TESTING", "Variables not passing properly to components!");
			});
		it ("should click the Hello World button", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("helloWorld")));
				expect (elm).to.not.equal (null, "Page did not load!");
				await elm.click ();

				elm = await common.driver.findElement (By.id ("buttonClicked"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("Clicked", "Button was not clicked!");

				await HotStaq.wait (100);
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
		it ("should send a bad authorized hi to the hello world api", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("testHelloWorldAPI3")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("testHelloWorldAPI3"));
				let value = await elm.getAttribute ("innerHTML");
				let jsonObj = JSON.parse (value);

				expect (jsonObj.error).to.equal ("Incorrect API key or secret!");
			});
		it ("should send a good authorized hi to the hello world api", async () =>
			{
				let elm = await common.driver.wait (until.elementLocated (By.id ("testHelloWorldAPI4")));
				await elm.click ();

				await HotStaq.wait (100);

				elm = await common.driver.findElement (By.id ("testHelloWorldAPI4"));
				let value = await elm.getAttribute ("innerHTML");
				let jsonObj = JSON.parse (value);

				expect (jsonObj.message.value).to.equal ("Hello!");
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
	});