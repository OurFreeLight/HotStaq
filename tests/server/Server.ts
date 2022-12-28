import "mocha";
import { expect, should } from "chai";
import fetch from "node-fetch";
import FormData from "form-data";

import * as fs from "fs";
import * as ppath from "path";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "./HelloWorldAPI";
import { DeveloperMode } from "../../src/Hot";
import { HotIO } from "../../src/HotIO";
import { HotLogLevel } from "../../src/HotLog";

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
				let res = await fetch (url);

				expect (res.status).to.equal (404);
			});
		it ("should add a static route and get the tests index html", async () =>
			{
				server.addStaticRoute ("/", `${process.cwd ()}/`);
				let res = await fetch (`${url}/tests/browser/index.htm`);

				expect (res.status).to.equal (200);
			});
		it ("should try to get a file from the static route that doesn't exist", async () =>
			{
				let res = await fetch (`${url}/baddir/file\\that<doesnt-exist.badexttoo`);

				expect (res.status).to.equal (404);
			});
		it ("should set the HelloWorldAPI then call it without saying hi", async () =>
			{
				api = new HelloWorldAPI (common.getUrl (), server);
				await server.setAPI (api);

				let result: any = await api.makeCall ("/v1/hello_world/hello", {});

				expect (result.error).to.equal ("You didn't say hi.");
			});
		it ("should call the HelloWorldAPI saying hello", async () =>
			{
				let result: any = await api.sayHello ("hi");

				expect (result).to.equal ("Hello!");
			});
		it ("should call the HelloWorldAPI forcing it to throw an exception", async () =>
			{
				let result: any = await api.makeCall ("/v1/hello_world/hello", { throwError: "34598has98ehw3794" });

				expect (result.error).to.equal ("Error has been thrown!");
			});
		it ("should upload a file to HelloWorldAPI and delete it", async () =>
			{
				const filepath: string = ppath.normalize (`${process.cwd ()}/tests/browser/index.htm`);

				let jsonRes: any = await api.makeCall ("/v1/hello_world/file_upload", {}, "POST", {
						"indexFileKey": HotIO.readFileStream (filepath)
					});

				expect (fs.existsSync (jsonRes.path)).to.equal (true, "File was not uploaded properly!");
				fs.unlinkSync (jsonRes.path);
			});
		it ("should add a file extension to serve with a header set", async () =>
			{
				server.serveFileExtensions.push ({
					fileExtension: ".pika.pika", headers: [
						{ "type": "Content-Type", "value": "application/wasm" }
					] });

				/// @todo Needs test case to ensure headers are sent for static files served.

				let res = await fetch (`${url}/tests/browser/headers-test.pika.pika`);
				let contentType: string = res.headers.get ("content-type");

				expect (contentType).to.equal ("application/wasm");
			});
	});