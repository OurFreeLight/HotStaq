import "mocha";
import { expect, should } from "chai";
import fetch from "node-fetch";

import { HotStaq } from "../../src/HotStaq";
import { HotIO } from "../../src/HotIO";
import { ChildProcess } from "child_process";

describe ("CLI Tests", () =>
	{
		let url: string = "http://127.0.0.1:3123";
		let randomPort: number = (Math.floor (Math.random () * 1000) + 3500) | 0;
		let urlPort: string = `http://127.0.0.1:${randomPort}`;
		const startUpTime: number = 1000;
		const shutDownTime: number = 1500;
		let endProcess = async (output: ChildProcess): Promise<void> =>
			{
				await new Promise<void> (async (resolve, reject) =>
					{
						output.kill ();

						output.on ("close", async (code: number, signal: NodeJS.Signals) => 
							{
								await HotStaq.wait (shutDownTime);

								resolve ();
							});
					});
			};

		it ("should run the bad hotsite", async () =>
			{
				// Make a spawn version later and have it shutdown when test is complete.
				// As long as there's no JSON parsing issues, it should still run.
                let output = HotIO.spawn ("node", ["./build/src/cli.js", "--dev", "-o", "./tests/hotsite/HotSite-Bad.json", "run"]);

                await HotStaq.wait (startUpTime);

				let res = await fetch (`${url}/tests/browser/HelloWorld`);
                const text = await res.text ();

				await endProcess (output);

				expect (res.status).to.equal (200);
			});
		it ("should run the good hotsite", async () =>
			{
				let output = HotIO.spawn ("node", [
					"./build/src/cli.js",
					"--dev",
					"--cwd", "./tests/hotsite/",
					"-o", "./HotSite.json",
					"run",
					"--disable-file-loading"]);

				await HotStaq.wait (startUpTime);

				let res = await fetch (`${url}/HelloWorld`);
				const text = await res.text ();

				await endProcess (output);

				expect (res.status).to.equal (200);
			});
		it ("should run the good hotsite and get the index from the / route", async () =>
			{
				let output = HotIO.spawn ("node", [
					"./build/src/cli.js",
					"--dev",
					"--cwd", "./tests/hotsite/",
					"run",
					"-o", "./HotSite.json", // Making sure out of order hotsite loading works ok.
					"--disable-file-loading"]);

				await HotStaq.wait (startUpTime);

				let res = await fetch (`${url}/`);
				const text = await res.text ();

				await endProcess (output);

				expect (res.status).to.equal (200);
			});
		it (`should run a api hotsite site on port ${randomPort}`, async () =>
			{
				// Make a spawn version later and have it shutdown when test is complete.
				// As long as there's no JSON parsing issues, it should still run.
				let output = HotIO.spawn ("node", [
						"./build/src/cli.js",
						"--dev",
						"-o", "./tests/hotsite/HotSite.json",
						"run",
						"--server-type", "api",
						"--api-port", randomPort.toString ()
					]);

				await HotStaq.wait (startUpTime);

				let res = await fetch (`${urlPort}/`);
				const text = await res.text ();

				await endProcess (output);

				expect (res.status).to.equal (200);
			});
		it ("should run a web-api hotsite site", async () =>
			{
				// Having issues with this test case shutting down properly. Will have to look into this.

				// Make a spawn version later and have it shutdown when test is complete.
				// As long as there's no JSON parsing issues, it should still run.
				let output = HotIO.spawn ("node", [
						"./build/src/cli.js",
						"--dev",
						"-o", "./tests/hotsite/HotSite.json",
						"run",
						"--server-type", "web-api"
					]);

				await HotStaq.wait (startUpTime);

				let res = await fetch (`${url}/tests/browser/HelloWorld`);

				expect (res.status).to.equal (200);

				res = await fetch (`${url}/`);

				let didFail: boolean = false;

				try
				{
					let jsonObj = await res.json ();
				}
				catch (ex)
				{
					didFail = true;
				}

				await endProcess (output);

				expect (res.status).to.equal (404);
			});
	});