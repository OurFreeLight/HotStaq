import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "./Common";

import { APItoLoad, DeveloperMode, HotHTTPServer, HotLogLevel, HotStaq, 
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
				apis = Common.loadAPIs (processor);
			});
		it ("should load the HotSite", async () =>
			{
				generator = new HotGenerator (processor.logger);
				generator.hotsites = [processor.hotSite];
				await generator.generateAPI (processor, apis);
			});
	});