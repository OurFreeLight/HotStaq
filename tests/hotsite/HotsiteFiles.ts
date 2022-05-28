import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "./Common";

import { DeveloperMode, HotHTTPServer, HotLogLevel, HotStaq, HotTester, HotTesterMochaSelenium, HotTesterServer, HotTestMap } from "../../src/api";
import { HelloWorldAPI } from "../server/HelloWorldAPI";

describe ("Hotsite Files Tests", () =>
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
				await common.shutdown ();
			});

		it ("should load the HotSite", async () =>
			{
				server = new HotHTTPServer (processor);

				server.logger.logLevel = HotLogLevel.All;
				await processor.loadHotSite (`./tests/hotsite/HotSite.json`);
				await processor.processHotSite ();

				common = new Common (processor);
				await common.load ();
				await common.startServer ();

				await common.driver.get (`${common.getUrl (server)}/files`);
			});
		it ("should have loaded the /files route", async () =>
			{
				await HotStaq.wait (100);
				let elm = await common.driver.wait (until.elementLocated (By.css (".btn")));
				expect (elm).to.not.equal (null, "Page did not load!");
			});
		it ("should have loaded /tests/hotsite/HelloWorld", async () =>
			{
				await common.driver.navigate ().to (`${common.getUrl (server)}/tests/hotsite/HelloWorld`);
				await HotStaq.wait (300);
				let elm = await common.driver.wait (until.elementLocated (By.css ("#test")));
				expect (elm).to.not.equal (null, "Page did not load!");
			});
	});