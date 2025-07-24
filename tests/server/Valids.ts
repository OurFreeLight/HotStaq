import "mocha";
import { expect, should, assert } from "chai";
import fetch from "node-fetch";

import * as fs from "fs";
import * as ppath from "path";

import { Common } from "../Common";

import { HotRouteMethodParameterMap, HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "./HelloWorldAPI";
import { HotIO } from "../../src/HotIO";
import { HotEventMethod, HotRouteMethodParameter } from "../../src/HotRouteMethod";
import { processInput, ValidationOptions } from "../../src/HotProcessInput";

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

		it ("should ensure OtherInterface returns correct valids", async () =>
			{
				const obj: HotRouteMethodParameterMap = await HotStaq.convertInterfaceToRouteParameters ("OtherInterface");
				await HotStaq.convertInterfaceToRouteParameters ("OtherInterfaceAgain");

				expect ((<HotRouteMethodParameter>obj["anotherString"]).validations.length).to.greaterThanOrEqual (1);
				expect ((<HotRouteMethodParameter>obj["anotherStringObject"]).validations.length).to.greaterThanOrEqual (2);
			});
		it ("should perform a loose processInput on IIssue", async () =>
			{
				const obj: HotRouteMethodParameterMap = await HotIO.readJSONFile ("./tests/server/IIssue.json");
				const params = { "issue": { "type": "object", "required": true, "parameters": obj as HotRouteMethodParameterMap } };
				const payload: any = {"issue":{"projectId":"74ae8d4a-fe69-4c9a-8c41-df7e639167ff","name":"Good Issue","description":"{\"ops\":[{\"insert\":\"Description is here\\n\"}]}","storyPoints":0,"priority":0,"issueStatus":"19433593-864f-476d-aef4-2a2697648730","assignees":[],"reporters":[],"expenses":[]}};

				const result = await processInput (new ValidationOptions (false), params, payload, null);

				expect (result.issue.name).to.equal (payload.issue.name);
				expect (result.issue.description).to.equal (payload.issue.description);
			});
		it ("should perform a loose processInput on IProposal", async () =>
			{
				const obj: HotRouteMethodParameterMap = await HotIO.readJSONFile ("./tests/server/IProposal.json");
				const params = { "proposal": { "type": "object", "required": true, "parameters": obj as HotRouteMethodParameterMap } };
				const payload: any = {"proposal":{"name":"Proposals","priority":0,"description":"{\"ops\":[{\"insert\":\"Description of proposal\\n\"}]}","status":"PublicDraft"}};

				const result = await processInput (new ValidationOptions (false), params, payload, null);

				expect (result.proposal.name).to.equal (payload.proposal.name);
				expect (result.proposal.description).to.equal (payload.proposal.description);
			});
		it ("should fail a loose processInput on IProposal", async () =>
			{
				const obj: HotRouteMethodParameterMap = await HotIO.readJSONFile ("./tests/server/IProposal.json");
				const params = { "proposal": { "type": "object", "required": true, "parameters": obj as HotRouteMethodParameterMap } };
				const payload: any = {"proposal":{"name":"<>Proposals","priority":0,"description":"{\"ops\":[{\"insert\":\"Description of proposal\\n\"}]}","status":"PublicDraft"}};

				let result = null;

				try
				{
					result = await processInput (new ValidationOptions (false), params, payload, null);
				}
				catch (ex)
				{
					expect (ex.message).to.not.be.null;
				}

				assert.isNull (result, "Result should be undefined or null!");
			});
		it ("should validate the OtherInterface object", async () =>
			{
				let result: any = await api.makeCall ("/v1/hello_world/validate_other_interface", 
					{
						anotherString: "test",
						anotherStringObject: "test"
					});

				expect (result.error).to.equal (undefined, "Error while validating OtherInterface!");
				expect (result).to.equal (true);

				result = await api.makeCall ("/v1/hello_world/validate_other_interface", 
					{
						anotherString: "test",
						anotherStringObject: {
							anotherNum: 3
						}
					});

				expect (result.error).to.equal (undefined, "Error while validating OtherInterface again!");
				expect (result).to.equal (true);
			});
		it ("should NOT validate the OtherInterface object", async () =>
			{
				let result: any = await api.makeCall ("/v1/hello_world/validate_other_interface", 
					{
						anotherString: "t",
						anotherStringObject: "test"
					});

				expect (result.error).to.equal ("Text parameter 'anotherString' must be at least 2 characters long.");

				result = await api.makeCall ("/v1/hello_world/validate_other_interface", 
					{
						anotherString: "test",
						anotherStringObject: {
							anotherNum: 11
						}
					});

				expect (result.error).to.equal ("The value of number parameter 'anotherNum' must be less than 10.");
			});
	});