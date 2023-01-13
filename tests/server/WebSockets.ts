import "mocha";
import { expect } from "chai";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "./HelloWorldAPI";
import { DeveloperMode } from "../../src/Hot";
import { HotWebSocketServer } from "../../src/HotWebSocketServer";

describe ("WebSocket Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let webSocketServer: HotWebSocketServer = null;
		let api: HelloWorldAPI = null;
		let futureResult: any = null;

		before (async () =>
			{
				processor = new HotStaq ();
				processor.mode = DeveloperMode.Development;

				common = new Common (processor);
				await common.setupServer ();
				common.server.useWebsocketServer = true;
				await common.startServer ();

				server = common.server;
				webSocketServer = common.server.websocketServer;
			});
		after (async () =>
			{
				await common.shutdown ();
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
		it ("should connect to the HelloWorldAPI via WebSocket", async () =>
			{
				await common.clientConnectToWebSocket ({
						"ApiKey": "kjs1he4w57h",
						"ApiSecret": "3u4j5n978sd"
					});
				const numClients: number = Object.keys (webSocketServer.clients).length;
				expect (numClients).to.eq (1);
			});
		it ("should say hi via WebSocket", async () =>
			{
				let result: string = null;

				await new Promise<void> ((resolve, reject) =>
					{
						common.socket.on ("sub/hello_world/ws_hello_event", (data: any) =>
							{
								result = data;
								resolve ();
							});

						common.socket.emit ("pub/hello_world/ws_hello_event", { "message": "hi" });
					});

				expect (result).to.equal ("Hello!");
			});
		it ("should successfully test a response via WebSocket", async () =>
			{
				let result: string = null;

				await new Promise<void> ((resolve, reject) =>
					{
						common.socket.on ("sub/hello_world/ws_test_response", (data: any) =>
							{
								result = data;
								futureResult = data;
								resolve ();
							});

						common.socket.emit ("pub/hello_world/ws_test_response", { "message": "YAY!" });
					});

				expect (result).to.equal ("received");
			});
		it ("should fail testing a response via WebSocket", async () =>
			{
				let result: any = null;

				await new Promise<void> ((resolve, reject) =>
					{
						common.socket.on ("sub/hello_world/ws_test_response", (data: any) =>
							{
								result = data;
								resolve ();
							});

						common.socket.emit ("pub/hello_world/ws_test_response", { "message": "FAIL BOAT" });
					});

				expect (result.error).to.equal ("You did not yay me bro.");
			});
		it ("should tag the connected client", async () =>
			{
				for (let clientId in webSocketServer.clients)
				{
					let client = webSocketServer.clients[clientId];

					client.tag ("test");
				}

				let testClients = webSocketServer.getTaggedClients ("test");
				const numClients: number = Object.keys (testClients).length;
				expect (numClients).to.eq (1);
			});
		it ("should send a message to the tagged client that has subscribed to sub/hello_world/ws_test_response", async () =>
			{
				webSocketServer.sendToTaggedClients ("test", "sub/hello_world/ws_test_response", 
					{ "message": "This bypasses the HotRoute for the connected HotAPI entirely. This is just a direct message." });

				await HotStaq.wait (50);

				expect (futureResult.message).to.eq ("This bypasses the HotRoute for the connected HotAPI entirely. This is just a direct message.");
			});
		it ("should disconnect from the websocket", async () =>
			{
				common.disconnectFromWebSocket ();

				await HotStaq.wait (200);

				const numClients: number = Object.keys (webSocketServer.clients).length;
				expect (numClients).to.eq (0);
			});
		it ("should attempt to connect to the HelloWorldAPI via WebSocket with the wrong password", async () =>
			{
				let errorMsg: string = await common.clientConnectToWebSocket ({
							"ApiKey": "kjs1he4w57h",
							"ApiSecret": "bad_password"
						});

				expect (errorMsg).to.eq ("Incorrect API key or secret!");
			});
	});