import { HotStaq } from "./HotStaq";
import { HotTestDriver } from "./HotTestDriver";
import { HotTestElement, HotTestElementOptions } from "./HotTestElement";
import { HotTestPage } from "./HotTestPage";

/**
 * This actually executes the tests.
 */
export abstract class HotTestUIDriver extends HotTestDriver
{
	constructor (processor: HotStaq, page: HotTestPage | null = null)
	{
        super (processor, page);
	}

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
	 * An expression to test.
	 */
	abstract assertElementValue (name: string | HotTestElement, value: any, 
		errorMessage?: string, options?: HotTestElementOptions): Promise<any>;
}