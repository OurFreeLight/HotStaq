import "mocha";
import { expect, should } from "chai";

import { HotStaq } from "../../src/HotStaq";
import { HotPage } from "../../src/HotPage";
import { HotFile } from "../../src/HotFile";

describe ("Echo Tests", () =>
	{
		let processor: HotStaq = null;
		let content: string = `
			<!DOCTYPE html>
			<html>
			
			<*
				Hot.echo (\`
				<head>
					<title>Echo Test</title>
				</head>
			
				<body>
				\`);
			*>
			
				This is the main body!
			
			<*
				Hot.echo (\`
				</body>
				\`);
			*>
			
			</html>`;
		let finalContent: string = `
			<!DOCTYPE html>
			<html>
			
			
				<head>
					<title>Echo Test</title>
				</head>
			
				<body>
				
			
				This is the main body!
			
			
				</body>
				
			
			</html>
			`;

		before (async () =>
			{
				processor = new HotStaq ();
			});

		it ("should add a page and load the content", async () =>
			{
				let file: HotFile = new HotFile ({
						"content": content
					});
				// No need to do "await file.load ();" here since we're loading the HTML
				// directly into the content.
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Echo Test",
						"files": [file]
					});
				processor.addPage (page);
			});
		it ("should process the page", async () =>
			{
				let output: string = await processor.process ("Echo Test");
				const comparison: string = finalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
		it ("should process the content using HotStaq.processContent", async () =>
			{
				let processor: HotStaq = new HotStaq ();
				let output: string = await HotStaq.processContent ({ processor: processor, content: content, name: "Echo Test" });
				const comparison: string = finalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
	});