import "mocha";
import { expect, should } from "chai";

import { HotStaq, HotPage, HotFile } from "../../src/api";

describe ("Local Preprocessor Tests", () =>
	{
		let processor: HotStaq = null;
		let finalContent: string = `<!DOCTYPE html>
			<html>
			
			<head>
				<title>Test Page</title>
			</head>
			
			<body>
				<header>
					Header
				</header>
			
				This is the main body!
			
				<footer>
					Footer
				</footer>
			
			</body>
			
			</html>`;
		let ifFinalContent: string = `<!DOCTYPE html>
		<html>
		
		
		
			This will display only if 1 === 1!
		
		
		
		</html>`;
		let nestedFinalContent: string = `<!DOCTYPE html>
			<html>
			
			<head>
				<title>Test Page</title>
			</head>
			
			<body>
				<header>
					Header
				</header>
			Nested content!
				<footer>
					Footer
				</footer>
			
			</body>
			
			</html>`;

		before (async () =>
			{
				processor = new HotStaq ();
			});

		it ("should test HotStaq.parseBoolean", async () =>
			{
				let trues: string[] = ["true", "yes", "yep"];
				let falses: string[] = ["false", "no", "nah"];

				for (let iIdx = 0; iIdx < trues.length; iIdx++)
					expect (HotStaq.parseBoolean (trues[iIdx])).to.equal (true);

				for (let iIdx = 0; iIdx < falses.length; iIdx++)
					expect (HotStaq.parseBoolean (falses[iIdx])).to.equal (false);
			});
		it ("should test HotStaq.getParam", async () =>
			{
				let obj = {
						"testParameter": "abc"
					};

				expect (HotStaq.getParam ("testParameter", obj)).to.equal ("abc");
				expect (HotStaq.getParam ("missingParameter", obj, true, false)).to.equal (undefined);
			});
		it ("should test HotStaq.getParamDefault", async () =>
			{
				let obj = {
						"testParameter": "abc"
					};

				expect (HotStaq.getParamDefault ("testParameter", obj, "peep")).to.equal ("abc");
				expect (HotStaq.getParamDefault ("missingParameter", obj, "peep")).to.equal ("peep");
			});
		it ("should test HotStaq.checkHotSiteName", async () =>
			{
				expect (HotStaq.checkHotSiteName ("test-hotsite-name")).to.equal (true);
			});
		it ("should add a page and load the file", async () =>
			{
				let file: HotFile = new HotFile ({
						"localFile": "./tests/local/include.hott"
					});
				await file.load ();
				let page: HotPage = new HotPage ({
						"processor": processor,
						"name": "Test Page",
						"files": [file]
					});
				processor.addPage (page);
			});
		it ("should process the page", async () =>
			{
				let output: string = await processor.process ("Test Page");
				const comparison: string = finalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
		it ("HotStaq.processLocalFile: should process content that contains a header and a footer ", async () =>
			{
				let output: string = await HotStaq.processLocalFile ("./tests/local/include.hott");
				const comparison: string = finalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
		it ("HotStaq.processLocalFile: should process content that contains an if statement", async () =>
			{
				let output: string = await HotStaq.processLocalFile ("./tests/local/if.hott");
				const comparison: string = ifFinalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
		it ("HotStaq.processLocalFile: should process nested content", async () =>
			{
				let output: string = await HotStaq.processLocalFile ("./tests/local/nested1.hott");
				const comparison: string = nestedFinalContent.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
		it ("HotStaq.processLocalFile: should process a string placeholder", async () =>
			{
				let output: string = await HotStaq.processLocalFile (
							"./tests/local/placeholder.hott", "Test", { TEST2: "TEST2" });
				const comparison: string = `TEST1\nTEST2\nTEST3`.replace (/\s/g, "");

				output = output.replace (/\s/g, "");

				expect (output).to.equal (comparison);
			});
	});