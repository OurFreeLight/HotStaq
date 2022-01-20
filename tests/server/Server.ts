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

describe ("Server Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let api: HelloWorldAPI = null;
		let url: string = "";

		before (async () =>
			{
				common = new Common ();

				await common.startServer ();

				processor = common.processor;
				server = common.server;

				url = common.getUrl ();
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should report 404", async () =>
			{
				let res: Response = await fetch (url);

				expect (res.status).to.equal (404);
			});
		it ("should add a static route and get the tests index html", async () =>
			{
				server.addStaticRoute ("/", `${process.cwd ()}/`);
				let res: Response = await fetch (`${url}/tests/browser/index.htm`);

				expect (res.status).to.equal (200);
			});
		it ("should set the HelloWorldAPI then call it without saying hi", async () =>
			{
				api = new HelloWorldAPI (common.getUrl (), server);
				await server.setAPI (api);

				let result: any = await api.call ("/v1/hello_world/hello", {});

				expect (result.error).to.equal ("You didn't say hi.");
			});
		it ("should call the HelloWorldAPI saying hello", async () =>
			{
				let result: any = await api.sayHello ("hi");

				expect (result).to.equal ("Hello!");
			});
		it ("should upload a file to HelloWorldAPI and delete it", async () =>
			{
				const filepath: string = ppath.normalize (`${process.cwd ()}/tests/browser/index.htm`);
				let stream: fs.ReadStream = fs.createReadStream (filepath);
				const formData: FormData = new FormData ();

				formData.append ("index.html", stream);

				let res: Response = await fetch (`${url}/v1/hello_world/file_upload`, {
						method: "POST",
						// @ts-ignore
						body: formData
					});
				let jsonRes = await res.json ();

				expect (fs.existsSync (jsonRes.path)).to.equal (true);
				fs.unlinkSync (jsonRes.path);
			});
	});