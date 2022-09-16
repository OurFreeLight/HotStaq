import { HotStaq } from "./HotStaq";
import { HotTestElement, HotTestElementOptions } from "./HotTestElement";
import { HotTestPage } from "./HotTestMap";

/**
 * This actually executes the tests.
 */
export abstract class HotTestDriver
{
	/**
	 * The current page.
	 */
	processor: HotStaq;
	/**
	 * The current page.
	 */
	page: HotTestPage;
	/**
	 * The delay in milliseconds between each executed command.
	 */
	commandDelay: number;
	/**
	 * Any data that needs to be saved between the different testing runs.
	 */
	persistentData: any;

	constructor (processor: HotStaq, page: HotTestPage = null)
	{
		this.processor = processor;
		this.page = page;
		this.commandDelay = 20;
		this.persistentData = {};
	}

	/**
	 * Get a test object by it's name. If a * is used, it will be used as a 
	 * wildcard for the object's name. If a > is used, then the name will 
	 * be treated as a CSS selector.
	 */
	parseTestObject (name: string): string
	{
		let pos: number = name.indexOf ("*");
		let wildcard: string = "";

		if (pos > -1)
		{
			name = name.replace (/\*/, "");
			wildcard = "*";
		}

		let selector: string = `[data-test-object-name${wildcard}='${name}']`;
		pos = name.indexOf (">");

		if (pos > -1)
		{
			name = name.replace (/\>/, "");
			selector = name;
		}

		return (selector);
	}

	/**
	 * Wait for a number of milliseconds.
	 */
	async wait (numMilliseconds: number): Promise<void>
	{
		return (await new Promise ((resolve, reject) =>
			{
				setTimeout (() =>
					{
						resolve ();
					}, numMilliseconds);
			}));
	}

	/**
	 * Print a message.
	 */
	async print (message: string): Promise<void>
	{
		process.stdout.write (message);
	}

	/**
	 * Print a message line.
	 */
	async println (message: string): Promise<void>
	{
		await this.print (`${message}\n`);
	}

	/**
	 * Disconnect this server or destroy anything associated with this HotTestDriver.
	 */
	abstract destroy (): Promise<void>;

	/**
	 * Navigate to a url.
	 */
	abstract navigateToUrl (url: string): Promise<void>;
	/**
	 * Wait for a HotTestElement to load.
	 */
	abstract waitForTestElement (name: string | HotTestElement, options?: HotTestElementOptions): Promise<any>;
	/**
	 * Find a HotTestElement to utilize.
	 */
	abstract findTestElement (name: string | HotTestElement, options?: HotTestElementOptions): Promise<any>;
	/**
	 * Run a HotTestElement command.
	 */
	abstract runCommand (testElm: string | HotTestElement, funcName?: string, valueStr?: string): Promise<any>;
	/**
	 * An expression to test.
	 */
	abstract assertElementValue (name: string | HotTestElement, value: any, 
		errorMessage?: string, options?: HotTestElementOptions): Promise<any>;
	/**
	 * An expression to test.
	 */
	async assert (value: any, errorMessage: string = ""): Promise<any>
	{
		if (! (value))
			throw new Error (errorMessage);
	}

	/**
	 * Run a series of test elements.
	 */
	async run (executions: string[] | string[][]): Promise<any[]>
	{
		let results: any[] = [];

		for (let iIdx = 0; iIdx < executions.length; iIdx++)
		{
			let execution: any = executions[iIdx];
			let testElm: HotTestElement = null;
			let func: string = "";
			let value: string = "";

			if (typeof (execution) === "string")
			{
				testElm = this.page.testElements[execution];

				/// @fixme This is going to wreck selecting test elements by wildcards.
				if (testElm == null)
					throw new Error (`HotTestDriver: Unable to find test element ${execution}`);

				func = testElm.func;
				value = testElm.value;
			}

			if (execution instanceof Array)
			{
				let name: string = execution[0];
				testElm = this.page.testElements[name];

				// This null catch is specifically to help find wildcard test elements.
				if (testElm == null)
				{
					testElm = new HotTestElement (name);
					func = execution[1];
					value = execution[2];
				}
				else
				{
					func = testElm.func;
					value = testElm.value;

					if (execution.length > 1)
						func = execution[1];

					if (execution.length > 2)
						value = execution[2];
				}
			}

			testElm.func = func;
			testElm.value = value;

			let result = await this.runCommand (testElm);

			await HotStaq.wait (this.commandDelay);

			results.push (result);
		}

		return (results);
	}
}