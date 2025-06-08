import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "../Common";

import { APItoLoad, DeveloperMode, HotHTTPServer, HotIO, HotLogLevel, HotStaq, 
	HotTester, HotTesterMochaSelenium, HotTesterServer, HotTestMap } from "../../src/api";
import { HotBuilder } from "../../src/HotBuilder";
import { HotCreator } from "../../src/HotCreator";

describe ("Builder Tests", function ()
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let creator: HotCreator = null;
		let builder: HotBuilder = null;
		let baseDir: string = `${process.cwd ()}/temp/app/`;
		let apis: { [name: string]: APItoLoad; } = {};

		this.timeout (240000);

		before (async () =>
			{
				processor = new HotStaq ();
			});
		after (async () =>
			{
			});

		it ("should create the app for the builder", async () =>
			{
				if (await HotIO.exists (baseDir) === true)
					await HotIO.rm (baseDir, { recursive: true });

				creator = new HotCreator (processor.logger, "app");
				creator.outputDir = baseDir;
				creator.hotstaqVersion = `latest`; // Be sure to set the previous version for testing
				await creator.create ();
			});
		it ("should check that package.json and HotSite.json exists", async () =>
			{
				let value = await HotIO.exists (`${baseDir}/package.json`);
				expect (value).to.equal (true, `package.json does not exist!`);
				value = await HotIO.exists (`${baseDir}/HotSite.json`);
				expect (value).to.equal (true, `HotSite.json does not exist!`);
			});
		it ("should load the HotSite", async () =>
			{
				await processor.loadHotSite (`${baseDir}/HotSite.json`);
				await processor.processHotSite ();
			});
		it ("should build the app's dockerfiles", async () =>
			{
				builder = new HotBuilder (processor.logger);
				builder.dockerFiles = true;
				builder.outputDir = baseDir;
				builder.hotsites = [processor.hotSite];
				builder.hotstaqVersion = `latest`; // Be sure to set the previous version for testing
				await builder.build ();
			});
		it ("should build the app's docker dev containers", async () =>
			{
				await HotIO.copyFile (`${baseDir}/env-skeleton`, `${baseDir}/.env`);

				let value = await HotIO.exec (`cd ${baseDir} && ./build.sh 0`);
				console.log (value);

				value = await HotIO.exec (`docker images | grep ourfreelight/app`);
				let index = value.indexOf ("ourfreelight/app");

				// Obviously not a very good test, this needs to be improved.
				expect (index).to.greaterThan (-1, `Docker image ourfreelight/app does not exist!`);
			});
	});