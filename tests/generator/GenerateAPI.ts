import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "./Common";

import { APItoLoad, DeveloperMode, HotHTTPServer, HotIO, HotLogLevel, HotStaq, 
	HotTester, HotTesterMochaSelenium, HotTesterServer, HotTestMap } from "../../src/api";
import { HotGenerator } from "../../src/HotGenerator";

describe ("API Generator Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let generator: HotGenerator = null;
		let apis: { [name: string]: APItoLoad; } = {};

		before (async () =>
			{
				processor = new HotStaq ();
			});
		after (async () =>
			{
			});

		it ("should load the HotSite", async () =>
			{
				await processor.loadHotSite (`./tests/hotsite/HotSite.json`);
				await processor.processHotSite ();
				apis = Common.loadAPIs (processor);
			});
		it ("should generate the API", async () =>
			{
				generator = new HotGenerator (processor.logger);
				generator.hotsites = [processor.hotSite];
				await generator.generateAPI (processor, apis);
			});
		it ("should check the generated API", async () =>
			{
				const hash: string = await HotIO.sha256File (`./build-web/HotStaqTests_HelloWorldAPI.js`);

				expect (hash).to.equal ("b2195c0b1685cfeeacbf6f8aca5e21e0e0549021c55b078ac254ff07ab54c4e5", 
					`The generated API file has changed. Please update the hash in the test.`);
			});
		it ("should generate the API documentation", async () =>
			{
				generator.generateType = "openapi-3.0.0-yaml";

				await generator.generateAPIDocumentation (processor, apis);
			});
		it ("should check the generated API documentation", async () =>
			{
				const hash: string = await HotIO.sha256File (`./build-web/hotsitetest.yaml`);

				expect (hash).to.equal ("e6fc00c52361f042211c960e06dbe4d64577d2a4d728d9d3f322772079eb2bfa", 
					`The generated API documentation file has changed. Please update the hash in the test.`);
			});
	});