import "mocha";
import { expect, should } from "chai";

import * as fs from "fs";
import * as ppath from "path";

import { HotStaq, HotPage, HotFile, DeveloperMode } from "../../src/api";
import { HotRouteMethodParameter } from "../../src/HotRouteMethod";

describe ("Parsing Tests", () =>
	{
		let basePath: string = ppath.normalize (`${process.cwd ()}/tests/parsing/`);

		it ("should execute HotStaq.convertInterfaceToRouteParameters correctly", async () =>
			{
				const obj: any = await HotStaq.convertInterfaceToRouteParameters ("./tests/parsing/TestInterface.ts", "TestInterface");

				expect (obj["testString"]).to.not.equal (null);
				expect (obj["testString"].type).to.equal ("string");
				expect (obj["testString"].required).to.equal (true);
				expect (obj["testString"].description.replace (/\s/g, "")).to.equal (`Ateststring.Withanotherlinetoo.`);
			});
		it ("should parse a Hott file correctly", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/hott-files/CorrectHottParseAndExecuteTest.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/hott-files/HottParseAndExecuteTest.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: !{JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-js/CorrectExecutionOffContentJS.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/off-content-js/ExecutionOffContentJS.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: STR{JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-str-js/CorrectExecutionOffContentSTRJS.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/off-content-str-js/ExecutionOffContentSTRJS.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: ${JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-display-js/CorrectExecutionOffContentDisplayJS.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/off-content-display-js/ExecutionOffContentDisplayJS.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: $(args)=>{JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-func/CorrectExecutionOffContentFUNC.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/off-content-func/ExecutionOffContentFUNC.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: ?(JS_Content)", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-test-element/CorrectExecutionOffContentTestElement.hott`)).toString ();

				let processor: HotStaq = new HotStaq ();
				let file: HotFile = new HotFile ({
					"localFile": ppath.normalize (`${basePath}/off-content-test-element/ExecutionOffContentTestElement.hott`)
				});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
				let output: string = await processor.process ("Test Page");

				expect (output).to.equal (correctContent);
			});
			it ("should parse off content straight JS in development mode, ex: ?(JS_Content)", async () =>
				{
					let correctContent: string = fs.readFileSync (
						ppath.normalize (`${basePath}/off-content-test-element/CorrectExecutionOffContentTestElementDevelopment.hott`)).toString ();
	
					let processor: HotStaq = new HotStaq ();
					processor.mode = DeveloperMode.Development;
					let file: HotFile = new HotFile ({
						"localFile": ppath.normalize (`${basePath}/off-content-test-element/ExecutionOffContentTestElement.hott`)
					});
					await file.load ();
					let page: HotPage = new HotPage ({
							"processor": processor,
							"name": "Test Page",
							"files": [file]
						});
					processor.addPage (page);
					let output: string = await processor.process ("Test Page");
	
					expect (output).to.equal (correctContent);
				});
	});