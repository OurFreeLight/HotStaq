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

		it ("should load the HotSite and the generator", async () =>
			{
				await processor.loadHotSite (`./tests/hotsite/HotSite.json`);
				await processor.processHotSite ();
				apis = Common.loadAPIs (processor);

				processor.hotSite.version = "100.2.3";

				generator = new HotGenerator (processor.logger);
				generator.hotsites = [processor.hotSite];
				generator.exitOnComplete = false;
			});
		it ("should generate the API", async () =>
			{
				await generator.generateAPI (processor, apis);
			});
		it ("should check the generated API", async () =>
			{
				const hash: string = await HotIO.sha256File (`./build-web/HotStaqTests_HelloWorldAPI.js`);

				expect (hash).to.equal ("b7661b47e20a95cf250c087e2c7cd5ca23fa4721510c6a6ece131bf3140573e3", 
					`The generated API file has changed. Please update the hash in the test.`);
			});
		it ("should generate the API documentation", async () =>
			{
				generator.generateType = "openapi-3.0.0-yaml";

				await generator.generateAPIDocumentation (processor, apis);
			});
		it ("should check the generated API documentation", async () =>
			{
				const hash: string = await HotIO.sha256File (`./build-web/HotStaqTests_HelloWorldAPI_openapi-3.0.0-yaml.yaml`);

				expect (hash).to.equal ("b1c4996318b1ab34735b4dcb4379677705488ef75678c164fbd5acbdc2d250fb", 
					`The generated API documentation file has changed. Please update the hash in the test.`);
			});
		it ("should generate the Async API documentation", async () =>
			{
				generator.generateType = "asyncapi-2.6.0-yaml";

				await generator.generateAPIDocumentation (processor, apis);
			});
		it ("should check the generated Async API documentation", async () =>
			{
				const hash: string = await HotIO.sha256File (`./build-web/HotStaqTests_HelloWorldAPI_asyncapi-2.6.0-yaml.yaml`);

				expect (hash).to.equal ("497cd306142d26d28af6ed1e42cc2bb388098b9ec8102fd1327ec3de9b3cd460", 
					`The generated API documentation file has changed. Please update the hash in the test.`);
			});
	});