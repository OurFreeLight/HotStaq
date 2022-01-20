import { EventExecutionType, HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotClient } from "./HotClient";
import { HotServer } from "./HotServer";
import { HotTestDriver } from "./HotTestDriver";
import { HotTester } from "./HotTester";
import { HotTestMap, HotTestPath, HotTestPage } from "./HotTestMap";

export class HotTesterAPI extends HotAPI
{
	constructor (baseUrl: string, connection: HotServer | HotClient = null, db: any = null)
	{
		super(baseUrl, connection, db);

		this.executeEventsUsing = EventExecutionType.HotAPI;

		let route: HotRoute = new HotRoute (connection, "tester");
		route.addMethod ("pageLoaded", this.pageLoaded);
		route.addMethod ("executeTests", this.executeTests);
		this.addRoute (route);
	}

	/**
	 * This is called when the page has finished loading in development mode.
	 */
	async pageLoaded (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let testerObj: {
				testerName: string;
				testerMap: string;
				pageName: string;
				testElements: any;
				testPathsStrs: any;
			} = {
				testerName: jsonObj["testerName"],
				testerMap: jsonObj["testerMap"],
				pageName: jsonObj["pageName"],
				testElements: jsonObj["testElements"],
				testPathsStrs: jsonObj["testPaths"]
			};

		for (let key in testerObj)
		{
			// @ts-ignore
			let testObj: any = testerObj[key];
			let throwError: boolean = false;

			if (testObj == null)
				throwError = true;

			if ((testerObj.testerName == "") || 
				(testerObj.testerMap === "") || 
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
			throw new Error (`TesterAPI: Tester ${testerObj.testerMap} does not exist!`);

		let testMap: HotTestMap = tester.testMaps[testerObj.testerMap];

		if (testMap == null)
			throw new Error (`TesterAPI: Tester map ${testerObj.testerMap} does not exist!`);

		testMap.pages[testerObj.pageName] = {
				"testElements": {},
				"testPaths": {}
			};
		testMap.pages[testerObj.pageName].testElements = testerObj.testElements;
		testMap.pages[testerObj.pageName].testPaths = testPaths;

		tester.finishedLoading = true;

		if (tester.onFinishedLoading != null)
			await tester.onFinishedLoading ();

		return (true);
	}

	/**
	 * Execute the tests for a page.
	 */
	async executeTests (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let testerName: string = jsonObj["testerName"];
		let testerMap: string = jsonObj["testerMap"];

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
}