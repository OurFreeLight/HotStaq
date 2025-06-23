import "mocha";
import { expect, should } from "chai";

import * as fs from "fs";
import * as ppath from "path";

import { HotStaq, HotPage, HotFile, DeveloperMode, HotRouteMethodParameter } from "../../src/api";
import { HotRouteMethodParameterMap } from "../../src/HotStaq";

describe ("Parsing Tests", () =>
	{
		let basePath: string = ppath.normalize (`${process.cwd ()}/tests/parsing/`);

		it ("should execute HotStaq.convertInterfaceToRouteParameters correctly", async () =>
			{
				const obj: HotRouteMethodParameterMap = await HotStaq.convertInterfaceToRouteParameters ("TestInterface");

				expect ((<HotRouteMethodParameter>obj["testString"])).to.not.equal (null);
				expect ((<HotRouteMethodParameter>obj["testString"]).type).to.equal ("string");
				expect ((<HotRouteMethodParameter>obj["testString"]).required).to.equal (true);
				expect ((<HotRouteMethodParameter>obj["testString"]).readOnly).to.equal (true);
				expect ((<HotRouteMethodParameter>obj["testString"]).description.replace (/\s/g, "")).to.equal (`Ateststring.Withanotherlinetoo.`);

				expect ((<HotRouteMethodParameter>obj["baseString"])).to.not.equal (null);
				expect ((<HotRouteMethodParameter>obj["baseString"]).type).to.equal ("string");
				expect ((<HotRouteMethodParameter>obj["baseString"]).required).to.equal (false);
				expect ((<HotRouteMethodParameter>obj["baseString"]).description.replace (/\s/g, "")).to.equal (`Thebasestring.`);

				expect ((<HotRouteMethodParameter>obj["testObject"])).to.not.equal (null);
				expect ((<HotRouteMethodParameter>obj["testObject"]).type).to.equal ("object");
				expect ((<HotRouteMethodParameter>obj["testObject"]).parameters).to.any.keys (["testString2"]);
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
				let output: string = await processor.process ("Test Page", { "testData": "yep" });

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