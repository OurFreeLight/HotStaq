import "mocha";
import { expect, should } from "chai";
import { By, until, WebDriver } from "selenium-webdriver";

import { Common } from "./Common";

import { APItoLoad, DeveloperMode, HotHTTPServer, HotIO, HotLogLevel, HotStaq, 
	HotTester, HotTesterMochaSelenium, HotTesterServer, HotTestMap } from "../../src/api";
import { HotCreator } from "../../src/HotCreator";

describe ("Create App Tests", function ()
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let creator: HotCreator = null;
		let baseDir: string = `${process.cwd ()}/temp/app`;
		let apis: { [name: string]: APItoLoad; } = {};

		this.timeout (30000);

		before (async () =>
			{
				processor = new HotStaq ();
			});
		after (async () =>
			{
			});

		it ("should create the app", async () =>
			{
				if (await HotIO.exists (baseDir) === true)
					await HotIO.rm (baseDir, { recursive: true });

				creator = new HotCreator (processor.logger, "app");
				creator.outputDir = baseDir;
				creator.hotstaqVersion = `0.8.68`; // Be sure to set the previous version for testing
				await creator.create ();
			});
		it ("should check that the node_modules folder exists", async () =>
			{
				let value = await HotIO.exists (`${baseDir}/node_modules/`);

				expect (value).to.equal (true, `Node modules does not exist!`);
			});
		it ("should check that package.json and HotSite.json exists", async () =>
			{
				let value = await HotIO.exists (`${baseDir}/package.json`);
				expect (value).to.equal (true, `package.json does not exist!`);
				value = await HotIO.exists (`${baseDir}/HotSite.json`);
				expect (value).to.equal (true, `HotSite.json does not exist!`);
			});
		it (`should check that ${baseDir}/build/ exists`, async () =>
			{
				let value = await HotIO.exists (`${baseDir}/build/`);

				expect (value).to.equal (true, `${baseDir}/build/ does not exist!`);
			});
		it (`should check that ${baseDir}/build-web/ exists`, async () =>
			{
				let value = await HotIO.exists (`${baseDir}/build-web/`);

				expect (value).to.equal (true, `${baseDir}/build-web/ does not exist!`);
			});
		it (`should check that ${baseDir}/.vscode/ exists`, async () =>
			{
				let value = await HotIO.exists (`${baseDir}/.vscode/`);

				expect (value).to.equal (true, `${baseDir}/.vscode/ does not exist!`);
			});
		it (`should check that ${baseDir}/public/ exists`, async () =>
			{
				let value = await HotIO.exists (`${baseDir}/public/`);

				expect (value).to.equal (true, `${baseDir}/public/ does not exist!`);
			});
	});