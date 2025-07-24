import "mocha";
import { expect, should } from "chai";
import fetch from "node-fetch";

import * as fs from "fs";
import * as ppath from "path";

import { Common } from "../Common";

import { HotRouteMethodParameterMap, HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "./HelloWorldAPI";
import { HotIO } from "../../src/HotIO";
import { HotEventMethod, HotRouteMethodParameter } from "../../src/HotRouteMethod";

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

				api = new HelloWorldAPI (common.getUrl (), server);
				await api.onPreRegister ();
				await server.setAPI (api);
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
		it ("should throw an error", async () =>
			{
				let result: any = await api.makeCall ("/v1/hello_world/error_test", 
					{
						errorTest: "TEST1"
					});

				expect (result.error).to.equal ("TEST1 ERROR");
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

				let jsonRes: any = await api.makeCall ("/v1/hello_world/file_upload", {}, 
					HotEventMethod.FILE_UPLOAD, {
						"indexFileKey": HotIO.readFileStream (filepath)
					});

				const result = fs.existsSync (jsonRes.path);
				expect (result).to.equal (true, "File was not uploaded properly!");
				fs.unlinkSync (jsonRes.path);
			});
		it ("should upload a file to HelloWorldAPI with authentication and delete it", async () =>
			{
				const filepath: string = ppath.normalize (`${process.cwd ()}/tests/browser/index.htm`);

				let jsonRes: any = await api.makeCall ("/v1/hello_world/file_upload_auth", {
						uploadDetails: {
							name: "testName"
						}
					}, HotEventMethod.FILE_UPLOAD, {
							"indexFileKey": HotIO.readFileStream (filepath)
						}, "kjs1he4w57h:3u4j5n978sd");

				expect (fs.existsSync (jsonRes.path)).to.equal (true, "File was not uploaded properly!");
				fs.unlinkSync (jsonRes.path);
			});
		it ("should NOT upload a file to HelloWorldAPI with authentication, but still pass data", async () =>
			{
				let jsonRes: any = await api.makeCall ("/v1/hello_world/file_upload_auth", {
						uploadDetails: {
							name: "testName"
						}
					}, HotEventMethod.FILE_UPLOAD, {
						"indexFileKey": null // There is no file to upload.
					}, "kjs1he4w57h:3u4j5n978sd");

				expect (jsonRes.error).to.equal ("No file uploaded!", "File data was not transferred properly!");
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