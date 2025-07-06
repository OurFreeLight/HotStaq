import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "../Common";

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

				expect (hash).to.equal ("0f11bb878c9e44ca70cba7d6f83cf1d7402c31307ef2d72bc6a651ab363d542a", 
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

				expect (hash).to.equal ("cf2c048f4cb06c9b3faafebb48c8e852acdfeadd33a986a013b2e698f6cb926d", 
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