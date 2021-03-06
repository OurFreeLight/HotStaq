import { HotStaq } from "./HotStaq";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, TestCaseObject } from "./HotRouteMethod";
import { HotTestDriver } from "./HotTestDriver";
import { HotTestDestination, HotTestMap, HotTestPage, HotTestPath } from "./HotTestMap";

/**
 * The test stop that is executed as either a destination or 
 * a path.
 */
export interface HotTestStop
{
	/**
	 * A command to execute. Can be:
	 * * print(x)
	 *   * Print a message to the server's console.
	 * * println(x)
	 *   * Print a message with a new line to the server's console.
	 * * url(x)
	 *   * Open a url. Must be an absolute url.
	 * * waitForTesterAPIData
	 *   * This will wait for the tester API to receive data.
	 * * wait(x)
	 *   * This will wait for x number of milliseconds.
	 * * waitForTestObject(x)
	 *   * This will wait for a test object to be loaded.
	 */
	cmd: string;
	/**
	 * The destination to execute.
	 */
	dest: string;
	/**
	 * The path to execute.
	 */
	path: string;
}

/**
 * The destination for a test to take.
 */
export interface HotDestination
{
	/**
	 * The name of the map.
	 */
	mapName: string;
	/**
	 * The page to start at.
	 */
	page: string;
	/**
	 * The API route to start using.
	 */
	api: string;
	/**
	 * The paths to take on the page.
	 */
	paths: HotTestStop[];
}

/**
 * Executes tests.
 */
export abstract class HotTester
{
	/**
	 * The tester name.
	 */
	name: string;
	/**
	 * The base url that will construct future urls.
	 */
	baseUrl: string;
	/**
	 * The associated processor.
	 */
	processor: HotStaq;
	/**
	 * The test maps to test.
	 */
	testMaps: { [name: string]: HotTestMap; };
	/**
	 * The driver to use when running tests.
	 */
	driver: HotTestDriver;
	/**
	 * Has this tester finished loading?
	 */
	finishedLoading: boolean;
	/**
	 * Has this tester finished setting up?
	 */
	hasBeenSetup: boolean;
	/**
	 * Has this tester finished setting up?
	 */
	hasBeenDestroyed: boolean;

	constructor (processor: HotStaq, name: string, baseUrl: string, 
		driver: HotTestDriver, testMaps: { [name: string]: HotTestMap; } = {})
	{
		this.processor = processor;
		this.name = name;
		this.baseUrl = baseUrl;
		this.testMaps = testMaps;
		this.driver = driver;
		this.finishedLoading = false;
		this.hasBeenSetup = false;
		this.hasBeenDestroyed = false;
	}

	/**
	 * Executed when setting up the tester.
	 */
	abstract setup (isWebRoute: boolean, url: string, destinationKey?: string): Promise<void>;
	/**
	 * Executed when destroying up the tester.
	 */
	abstract destroy (): Promise<void>;

	/**
	 * Executed when tests are started. If this returns true, it will 
	 * continue and execute all test paths. If this returns it will 
	 * skip all test paths and execute onTestEnd instead.
	 */
	async onTestStart? (destination: HotDestination, url: string, destinationKey?: string): Promise<boolean>;
	/**
	 * Executed when an API test path has started. If this returns false, 
	 * the testPath will not be immediately executed afterwards.
	 */
	async onTestAPIPathStart? (destination: HotDestination, method: HotRouteMethod, 
		testName: string, continueWhenTestIsComplete?: boolean): Promise<boolean>;
	/**
	 * Executed when an API test path has ended.
	 */
	async onTestAPIPathEnd? (destination: HotDestination, method: HotRouteMethod, 
		testName: string, result: any, continueWhenTestIsComplete?: boolean): Promise<void>;
	/**
	 * Executed when page tests are started. If this returns false, the testPath will not be 
	 * immediately executed afterwards.
	 */
	async onTestPagePathStart? (destination: HotDestination, page: HotTestPage, 
		stop: HotTestStop, continueWhenTestIsComplete?: boolean): Promise<boolean>;
	/**
	 * Executed when a page test has ended.
	 */
	async onTestPagePathEnd? (destination: HotDestination, testPath: HotTestPath, 
		result: any, continueWhenTestIsComplete?: boolean): Promise<void>;
	/**
	 * Executed when a command is executed.
	 */
	async onCommand? (destination: HotDestination, page: HotTestPage, stop: HotTestStop, 
		cmd: string, args: string[], cmdFunc: ((cmdArgs: string[]) => Promise<void>)): Promise<void>;
	/**
	 * Executed when tests are finished.
	 */
	async onTestEnd? (destination: HotDestination): Promise<void>;

	/**
	 * Executed when this tester has been executed from the API.
	 */
	async onExecute? (): Promise<void>;
	/**
	 * Executed when this tester has finished loading all data from the API.
	 */
	async onFinishedLoading? (): Promise<void>;

	/**
	 * Waits for the API to finish loading all data.
	 */
	async waitForData (): Promise<void>
	{
		while (this.finishedLoading === false)
			await HotStaq.wait (10);
	}

	/**
	 * Get a test page.
	 */
	getTestPage (destination: HotDestination): HotTestPage
	{
		let page = this.testMaps[destination.mapName].pages[destination.page];

		return (page);
	}

	/**
	 * Get a test path.
	 */
	getTestPath (destination: HotDestination, pathName: string): HotTestPath
	{
		let page = this.testMaps[destination.mapName].pages[destination.page];

		return (page.testPaths[pathName]);
	}

	/**
	 * Get a destination JSON object to use.
	 */
	static interpretDestination (mapName: string, testDest: HotTestDestination): HotDestination
	{
		let destination: string = testDest.destination;
		let newDestination: HotDestination = {
				mapName: mapName,
				page: "",
				api: "",
				paths: []
			};
		let strs: string[] = destination.split (/\-\>/g);
		let type: string = strs[0];

		if (type.length < 2)
			return (null);

		if ((type[0] === "/") && (type[1] === "/"))
			return (null);

		let getType: (typeStr: string, typeDelimiter: string) => string = 
			(typeStr: string, typeDelimiter: string): string =>
			{
				let pos: number = typeStr.indexOf (typeDelimiter);
				let typeValue: string = "";
		
				if (pos > -1)
				{
					typeValue = typeStr.substr (pos + typeDelimiter.length);
					typeValue = typeValue.trim ();
				}

				return (typeValue);
			};

		newDestination.page = getType (type, "page:");
		newDestination.api = getType (type, "api:");

		for (let iIdx = 1; iIdx < strs.length; iIdx++)
		{
			let newPathStr: string = strs[iIdx];
			let newPath: HotTestStop = {
					cmd: "",
					dest: "",
					path: ""
				};

			newPathStr = newPathStr.trim ();
			newPath.dest = getType (newPathStr, "dest:");
			newPath.cmd = getType (newPathStr, "cmd:");
			newPath.path = getType (newPathStr, "path:");

			if ((newPath.dest == "") && (newPath.cmd == "") && (newPath.path == ""))
				newPath.path = newPathStr;

			newDestination.paths.push (newPath);
		}

		return (newDestination);
	}

	/**
	 * Execute an API's test path.
	 */
	async executeTestAPIPath (destination: HotDestination, method: HotRouteMethod, 
		testName: string, skipEventCalls: boolean = false, continueWhenTestIsComplete: boolean = false): Promise<any>
	{
		let runTestPath: boolean = true;

		// A dumb hack to prevent any recursion that could occur.
		if (skipEventCalls === false)
		{
			if (this.onTestAPIPathStart != null)
				runTestPath = await this.onTestAPIPathStart (destination, method, testName, continueWhenTestIsComplete);
		}

		let result: any = null;

		if (runTestPath === true)
		{
			let testCaseObject: TestCaseObject = method.testCases[testName];

			if (testCaseObject == null)
				throw new Error (`HotTester: Test case object ${testName} does not exist!`);

			result = await testCaseObject.func (this.driver);
		}

		if (skipEventCalls === false)
		{
			if (this.onTestAPIPathEnd != null)
				await this.onTestAPIPathEnd (destination, method, testName, result, continueWhenTestIsComplete);
		}

		return (result);
	}

	/**
	 * Execute all test paths in an API route.
	 * 
	 * @fixme This needs a better implementation...
	 */
	async executeTestAPIPaths (destination: HotDestination): Promise<any[]>
	{
		let results: any[] = [];
		let testMap: HotTestMap = this.testMaps[destination.mapName];

		if (testMap == null)
			throw new Error (`HotTester: Map ${destination.mapName} does not exist!`);

		if (this.processor.api == null)
			throw new Error (`HotTester: Associated processor does not have an API!`);

		let route: HotRoute = this.processor.api.routes[destination.api];

		if (route == null)
			throw new Error (`HotTester: API does not have route ${destination.api}!`);

		// Iterate through each path in the destination until complete.
		for (let iIdx = 0; iIdx < destination.paths.length; iIdx += 2)
		{
			let stop: HotTestStop = destination.paths[iIdx];
			let pathName: string = stop.path;
			let method: HotRouteMethod = route.getMethod (pathName);
			let nextStop: HotTestStop = destination.paths[iIdx + 1];
			let testName: string = nextStop.path;
			let result: any = await this.executeTestAPIPath (destination, method, testName);

			results.push (result);
		}

		return (results);
	}

	/**
	 * Execute a test page path.
	 */
	async executeTestPagePath (destination: HotDestination, stop: HotTestStop, 
		skipEventCalls: boolean = false, continueWhenTestIsComplete: boolean = false): Promise<any>
	{
		let runTestPath: boolean = true;
		let testMap: HotTestMap = this.testMaps[destination.mapName];

		/// @fixme For some reason the errors being thrown here are not being thrown.
		if (testMap == null)
			throw new Error (`HotTester: Map ${destination.mapName} does not exist!`);

		let page: HotTestPage = testMap.pages[destination.page];

		if (page == null)
			throw new Error (`HotTester: Page ${destination.page} does not exist!`);

		this.driver.page = page;

		let testPathName: string = stop.path;
		let testPath: HotTestPath = page.testPaths[testPathName];

		// A dumb hack to prevent any recursion that could occur.
		if (skipEventCalls === false)
		{
			if (this.onTestPagePathStart != null)
				runTestPath = await this.onTestPagePathStart (destination, page, stop, continueWhenTestIsComplete);
		}

		let result: any = null;

		if (runTestPath === true)
		{
			if (testPath == null)
			{
				throw new Error (`HotTester: Test path ${testPathName} does not have a function!`);
			}

			result = await testPath (this.driver);
		}

		if (skipEventCalls === false)
		{
			if (this.onTestPagePathEnd != null)
				await this.onTestPagePathEnd (destination, testPath, result, continueWhenTestIsComplete);
		}

		return (result);
	}

	/**
	 * Execute a command.
	 */
	async executeCommand (destination: HotDestination, page: HotTestPage, stop: HotTestStop, cmd: string): Promise<void>
	{
		/**
		 * Check if the input command matches.
		 */
		let hasCmd: (input: string, cmd: string, hasArguments: boolean) => boolean = 
			(input: string, cmd: string, hasArguments: boolean): boolean =>
			{
				let result: boolean = false;

				if (stop.cmd === cmd)
					result = true;

				const pos: number = stop.cmd.indexOf ("(");

				// If there's parenthesis, get the incoming command.
				if (pos > -1)
				{
					let inputCmd: string = stop.cmd.substr (0, pos);

					if (inputCmd === cmd)
						result = true;
				}

				return (result);
			};
		/**
		 * Get the arguments in a command. This will only return a 
		 * single argument for now.
		 * 
		 * @fixme Add support for multiple arguments.
		 */
		let getCmdArgs: (input: string) => string[] = 
			(input: string): string[] =>
			{
				let results: string[] = [];
				let matches = input.match (/(?=\()(.*?)(?=\))/g);

				if (matches != null)
				{
					let tempMatch = matches[0];

					// A little hack, since I suck at Regex :(
					tempMatch = tempMatch.substr (2, tempMatch.length);

					results.push (tempMatch);
				}

				if (results.length < 1)
					throw new Error (`HotTester: Command ${input} requires arguments, but none were supplied.`);

				return (results);
			};

		let cmdFunc: ((cmdArgs: string[]) => Promise<void>) = null;
		let args: string[] = [];

		if (hasCmd (stop.cmd, "waitForTesterAPIData", false) === true)
		{
			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					this.finishedLoading = false;
					await this.waitForData ();
				};
		}

		if (hasCmd (stop.cmd, "wait", true) === true)
		{
			args = getCmdArgs (stop.cmd);

			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					let numMilliseconds: number = parseInt (cmdArgs[0]);

					await HotStaq.wait (numMilliseconds);
				};
		}

		if (hasCmd (stop.cmd, "url", true) === true)
		{
			args = getCmdArgs (stop.cmd);

			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					let input: string = cmdArgs[0];

					await this.driver.navigateToUrl (input);
				};
		}

		if (hasCmd (stop.cmd, "print", true) === true)
		{
			args = getCmdArgs (stop.cmd);

			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					let input: string = cmdArgs[0];

					await this.driver.print (input);
				};
		}

		if (hasCmd (stop.cmd, "println", true) === true)
		{
			args = getCmdArgs (stop.cmd);

			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					let input: string = cmdArgs[0];

					await this.driver.println (input);
				};
		}

		if (hasCmd (stop.cmd, "waitForTestObject", true) === true)
		{
			args = getCmdArgs (stop.cmd);

			cmdFunc = async (cmdArgs: string[]): Promise<void> =>
				{
					let testObject: string = JSON.parse (cmdArgs[0]);

					await this.driver.waitForTestElement (testObject);
				};
		}

		if (cmdFunc == null)
			throw new Error (`HotTester: Command ${stop.cmd} does not exist!`);

		await this.onCommand (destination, page, stop, cmd, args, cmdFunc);
	}

	/**
	 * Execute all test paths in a page.
	 */
	async executeTestPagePaths (destination: HotDestination, continueWhenTestIsComplete: boolean = false): Promise<any[]>
	{
		let results: any[] = [];
		let testMap: HotTestMap = this.testMaps[destination.mapName];

		/// @fixme For some reason the errors being thrown here are not being thrown.
		if (testMap == null)
			throw new Error (`HotTester: Map ${destination.mapName} does not exist!`);

		// Iterate through each path in the destination until complete.
		for (let iIdx = 0; iIdx < destination.paths.length; iIdx++)
		{
			let stop: HotTestStop = destination.paths[iIdx];
			let result: any = null;
			let page: HotTestPage = testMap.pages[destination.page];
	
			if (page == null)
				throw new Error (`HotTester: Page ${destination.page} does not exist!`);

			if (stop.dest !== "")
			{
				if (testMap.destinations instanceof Array)
					throw new Error (`HotTester: When using type 'dest' in a destination string, all destinations in map ${destination.mapName} must be named.`);

				let testDest: HotTestDestination = testMap.destinations[stop.dest];
				let newDestination: HotDestination = HotTester.interpretDestination (
													destination.mapName, testDest);

				if (newDestination != null)
					result = await this.executeTestPagePaths (newDestination);
			}

			if (stop.cmd !== "")
				await this.executeCommand (destination, page, stop, stop.cmd);

			if (stop.path !== "")
				result = await this.executeTestPagePath (destination, stop, false, continueWhenTestIsComplete);

			results.push (result);
		}

		return (results);
	}

	/**
	 * Execute the tests.
	 */
	async execute (mapName: string): Promise<void>
	{
		let map: HotTestMap = this.testMaps[mapName];

		if (map == null)
			throw new Error (`HotTester: Map ${mapName} does not exist!`);

		// Process routes testing first.
		let routeKey: string = this.processor.getRouteKeyFromName (mapName);
		let url: string = "";

		if (routeKey !== "")
			url = `${this.baseUrl}${routeKey}`;

		let executeDestination: (testDest: HotTestDestination, destinationKey?: string) => Promise<void> = 
			async (testDest: HotTestDestination, destinationKey: string = "") =>
			{
				if (testDest.autoStart === false)
					return;

				let destination: HotDestination = HotTester.interpretDestination (mapName, testDest);
				let isWebRoute: boolean = false;
				let runTestPaths: boolean = true;

				if (destination.page !== "")
					isWebRoute = true;
	
				if (this.setup != null)
				{
					if (this.hasBeenSetup === false)
					{
						await this.setup (isWebRoute, url, destinationKey);
						this.hasBeenSetup = true;
						this.hasBeenDestroyed = false;
					}
				}
	
				if (this.onTestStart != null)
					runTestPaths = await this.onTestStart (destination, url, destinationKey);
	
				if (runTestPaths === true)
				{
					if (destination.page !== "")
						await this.executeTestPagePaths (destination);
	
					if (destination.api !== "")
						await this.executeTestAPIPaths (destination);
				}
		
				if (this.onTestEnd != null)
					await this.onTestEnd (destination);
	
				if (this.destroy != null)
				{
					if (this.hasBeenDestroyed === false)
					{
						await this.destroy ();
						this.hasBeenDestroyed = true;
						this.hasBeenSetup = false;
					}
				}
			};

		// If the map destinations are in an array, just execute those in order.
		if (map.destinations instanceof Array)
		{
			for (let iIdx = 0; iIdx < map.destinations.length; iIdx++)
			{
				let testDest: HotTestDestination = map.destinations[iIdx];

				await executeDestination (testDest);
			}
		}
		else
		{
			// If there's a destination order, use that.
			if (map.destinationOrder.length > 0)
			{
				let hasExecutedKeys: string[] = [];

				// Go through the destination order and execute each one.
				for (let iIdx = 0; iIdx < map.destinationOrder.length; iIdx++)
				{
					let orderKey: string = map.destinationOrder[iIdx];
					let testDest: HotTestDestination = map.destinations[orderKey];

					if (testDest == null)
						throw new Error (`HotTester: Destination ${orderKey} does not exist!`);

					hasExecutedKeys.push (orderKey);
					await executeDestination (testDest, orderKey);
				}

				// Execute the rest of the destinations that have not been executed yet.
				for (let key in map.destinations)
				{
					let executeDest: boolean = true;

					for (let iIdx = 0; iIdx < hasExecutedKeys.length; iIdx++)
					{
						let executedKey: string = hasExecutedKeys[iIdx];

						if (executedKey === key)
						{
							executeDest = false;

							break;
						}
					}

					if (executeDest === true)
					{
						let testDest: HotTestDestination = map.destinations[key];

						await executeDestination (testDest, key);
					}
				}
			}
			else
			{
				// Execute the destinations in any order.
				for (let key in map.destinations)
				{
					let testDest: HotTestDestination = map.destinations[key];

					await executeDestination (testDest, key);
				}
			}
		}

		// End of routes testing

		// Start of API testing

	}
}