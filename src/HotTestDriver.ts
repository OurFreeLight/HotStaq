import { HotStaq } from "./HotStaq";
import { HotTestElement, HotTestElementOptions } from "./HotTestElement";
import { HotTestPage } from "./HotTestPage";

/**
 * This actually executes the tests.
 */
export class HotTestDriver
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
	 * @default 20
	 */
	commandDelay: number;
	/**
	 * The delay in milliseconds between each completed page test.
	 * @default 500
	 */
	pageTestDelay: number;
	/**
	 * Any data that needs to be saved between the different testing runs.
	 */
	persistentData: any;

	constructor (processor: HotStaq, page: HotTestPage | null = null)
	{
		this.processor = processor;
		this.page = page;
		this.commandDelay = 20;
		this.pageTestDelay = 700;
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

		if (name.length > 0)
		{
			if (name[0] === ">")
			{
				name = name.substring (1);
				selector = name;
			}
		}

		return (selector);
	}

	/**
	 * Wait for a number of milliseconds.
	 */
	async wait (numMilliseconds: number): Promise<void>
	{
		return (new Promise ((resolve, reject) =>
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
	async destroy (): Promise<void>
	{
	}

	/**
	 * An expression to test.
	 */
	async assert (value: any, errorMessage: string = ""): Promise<any>
	{
		if (! (value))
			throw new Error (errorMessage);
	}
}