import "mocha";
import { expect, should } from "chai";

import * as fs from "fs";
import * as ppath from "path";

import { HotFile } from "../../src/HotFile";

describe ("Parsing Tests", () =>
	{
		let basePath: string = ppath.normalize (`${process.cwd ()}/tests/parsing/`);

		it ("should parse a Hott file correctly", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/hott-files/CorrectHottParsingTest.hott`)).toString ();
				let content: string = fs.readFileSync (
					ppath.normalize (`${basePath}/hott-files/HottParsingTest.hott`)).toString ();
				let output: string = HotFile.processContent (content, 
					new RegExp ("(?<=\\<\\*)([\\s\\S]*?)(?=\\*\\>)", "g"), 
					(regexFound: string): string =>
					{
						return (`${regexFound}`);
					}, 
					(offContent: string): string =>
					{
						return (offContent);
					});

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content display JS, ex: ${JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-display-js/CorrectOffContentDisplayJS.hott`)).toString ();
				let content: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-display-js/OffContentDisplayJS.hott`)).toString ();
				let output: string = HotFile.processNestedContent (content, "${", "}", "{", 
					(regexFound2: string): string =>
					{
						let out: string = `${regexFound2}`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
					});

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content straight JS, ex: STR{JS_Content}", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-str-js/CorrectOffContentSTRJS.hott`)).toString ();
				let content: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-str-js/OffContentSTRJS.hott`)).toString ();
				let output: string = HotFile.processNestedContent (
					content, "STR{", "}", "{", 
					(regexFound2: string): string =>
					{
						let out: string = `\${JSON.stringify(${regexFound2})}`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
					}, 4, 1);

				expect (output).to.equal (correctContent);
			});
		it ("should parse off content test element, ex: ?(Test_Element)", async () =>
			{
				let correctContent: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-test-element/CorrectOffContentTestElement.hott`)).toString ();
				let content: string = fs.readFileSync (
					ppath.normalize (`${basePath}/off-content-test-element/OffContentTestElement.hott`)).toString ();
				let output: string = HotFile.processNestedContent (content, "?(", ")", "(", 
					(regexFound2: string): string =>
					{
						let out: string = `${regexFound2}`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
					});

				expect (output).to.equal (correctContent);
			});
	});