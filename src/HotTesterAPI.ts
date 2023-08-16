import { EventExecutionType, HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotClient } from "./HotClient";
import { HotServer } from "./HotServer";
import { HotTestDriver } from "./HotTestDriver";
import { HotTester } from "./HotTester";
import { HotTestMap, HotTestPath } from "./HotTestMap";
import { HotEventMethod, ServerRequest } from "./HotRouteMethod";
import { HotTestPage } from "./HotTestPage";
import { HotStaq } from "./HotStaq";

export class HotTesterAPI extends HotAPI
{
	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: any = null)
	{
		super(baseUrl, connection, db);

		this.executeEventsUsing = EventExecutionType.HotAPI;

		let route: HotRoute = new HotRoute (connection, "tester");
		route.addMethod ({
				"name": "pageLoaded", 
				"onServerExecute": this.pageLoaded,
				"parameters": {
						"testerName": {
							"required": true,
							"type": "string",
							"description": "The name of the tester executing the test."
						},
						"testerMap": {
							"required": true,
							"type": "string",
							"description": "The tester map executing the test."
						},
						"pageName": {
							"required": true,
							"type": "string",
							"description": "The name of the page executing the test."
						},
						"testElements": {
							"required": true,
							"type": "array",
							"description": "The test elements on the page."
						},
						"testPaths": {
							"required": true,
							"type": "array",
							"description": "The test paths on the page."
						}
					},
				"returns": "Returns true as an acknowledgement."
			});
		route.addMethod ({
				"name": "pageUnloaded", 
				"onServerExecute": this.pageUnloaded,
				"parameters": {
						"testerName": {
							"required": true,
							"type": "string",
							"description": "The name of the tester executing the test."
						}
					},
				"returns": "Returns true as an acknowledgement."
			});
		route.addMethod ({
				"name": "executeTests",
				"onServerExecute": this.executeTests,
				"parameters": {
					"testerName": {
						"required": true,
						"type": "string",
						"description": "The name of the tester executing the test."
					},
					"testerMap": {
						"required": true,
						"type": "object",
						"description": "The tester map to execute."
					}
				},
				"returns": "Returns true when tests are complete."
			});
		route.addMethod ({
				"name": "heartbeat",
				"type": HotEventMethod.GET,
				"onServerExecute": this.heartbeat,
				"returns": "Returns true as an acknowledgement."
			});
		this.addRoute (route);
	}

	/**
	 * This is called when the page has finished loading in development mode.
	 */
	async pageLoaded (request: ServerRequest): Promise<any>
	{
		let testerObj: {
				testerName: string;
				testElements: any;
				testPathsStrs: any;
			} = {
				testerName: request.jsonObj["testerName"],
				testElements: request.jsonObj["testElements"],
				testPathsStrs: request.jsonObj["testPaths"]
			};

		for (let key in testerObj)
		{
			// @ts-ignore
			let testObj: any = testerObj[key];
			let throwError: boolean = false;

			if (testObj == null)
				throwError = true;

			if ((testerObj.testerName == "") || 
				(testerObj.testElements === "") || 
				(testerObj.testPathsStrs === ""))
			{
				throwError = true;
			}

			if (throwError === true)
				throw new Error (`TesterAPI: Object ${key} was not passed.`);
		}

		testerObj.testElements = JSON.parse (testerObj.testElements);
		testerObj.testPathsStrs = JSON.parse (testerObj.testPathsStrs);

		let testPaths: { [name: string]: HotTestPath; } = {};

		for (let key in testerObj.testPathsStrs)
		{
			let testPath: (driver: HotTestDriver, ...args: any) => Promise<any> = 
				eval (testerObj.testPathsStrs[key]);

			testPaths[key] = testPath;
		}

		let tester: HotTester = this.connection.processor.testers[testerObj.testerName];

		if (tester == null)
			throw new Error (`TesterAPI: Tester ${testerObj.testerName} does not exist!`);

		let newPage: HotTestPage = {
				"testElements": testerObj.testElements,
				"testPaths": testPaths
			};

		tester.finishedLoading = true;

		let setAsCurrent: boolean = true;

		if (tester.onFinishedLoading != null)
			setAsCurrent = await tester.onFinishedLoading (newPage);

		if (setAsCurrent === true)
			tester.currentPage = newPage;

		return (true);
	}

	/**
	 * This is called when the page has finished unloading in development mode.
	 */
	async pageUnloaded (request: ServerRequest): Promise<any>
	{
		const testerName: string = HotStaq.getParam ("testerName", request.jsonObj);

		let tester: HotTester = this.connection.processor.testers[testerName];

		if (tester == null)
			throw new Error (`TesterAPI: Tester ${testerName} does not exist!`);

		tester.finishedLoading = false;
		tester.currentPage = null;

		if (tester.onFinishedUnloading != null)
			await tester.onFinishedUnloading ();

		return (true);
	}

	/**
	 * Execute the tests for a page.
	 */
	async executeTests (req: ServerRequest): Promise<any>
	{
		let testerName: string = req.jsonObj["testerName"];
		let testerMap: string = req.jsonObj["testerMap"];

		if ((testerName == null) || (testerMap == null))
			throw new Error ("TesterAPI: Not all required json objects were passed.");

		if ((testerName === "") || (testerMap === ""))
			throw new Error ("TesterAPI: Not all required json objects were passed.");

		let server: HotServer = (<HotServer>this.connection);

		// @ts-ignore
		if (server.executeTests != null)
		{
			// @ts-ignore
			await server.executeTests (testerName, testerMap);
		}

		return (true);
	}

	/**
	 * Responds with true to heartbeat requests.
	 */
	async heartbeat (req: ServerRequest): Promise<any>
	{
		return (true);
	}
}