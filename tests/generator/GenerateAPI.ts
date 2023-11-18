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

				expect (hash).to.equal ("ab450f646cecffb05b71632bbf1ad42f55fea19d2678454d6adb3ead89500c0e", 
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

				expect (hash).to.equal ("f5309c6015e117f4317ad209d884e5092ac657d3ad48515a407079ef78c5d39f", 
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

				expect (hash).to.equal ("2e8f20c672d4ea649ceb3fcf3b0081b487ca15a2ba90865d37064e2d76aaf6d7", 
					`The generated API documentation file has changed. Please update the hash in the test.`);
			});
	});