import "mocha";
import { expect, should } from "chai";
import fetch from "cross-fetch";
import FormData from "form-data";

import * as fs from "fs";
import * as ppath from "path";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "./HelloWorldAPI";
import { DeveloperMode } from "../../src/Hot";
import { HotTestMap } from "../../src/HotTestMap";
import { HotTesterMocha, HotTestSeleniumDriver } from "../../src/api";

describe ("API Testing Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let api: HelloWorldAPI = null;
		let url: string = "";

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.startServer ();

				let testMap: HotTestMap = new HotTestMap (["api:hello_world -> test_response -> TestAPIResponse -> test_response -> TestAPIResponseAgain"]);
				let tester: HotTesterMocha = new HotTesterMocha (processor, 
					"Tester", common.getUrl (), new HotTestSeleniumDriver (), { testMap: testMap });

				common.testerServer.addTester (tester);

				url = common.getUrl ();
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should execute the hello world tests", async () =>
			{
				await common.testerServer.executeTests ("Tester", "testMap");
			});
	});