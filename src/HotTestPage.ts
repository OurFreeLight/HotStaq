import { HotTestElement } from "./HotTestElement";
import { HotTestPath } from "./HotTestMap";

/**
 * A page containing only test related info.
 */
export interface HotTestPage
{
	/**
	 * The elements to test on this map.
	 */
	testElements: { [name: string]: HotTestElement; };
	/**
	 * The test paths to test on this map.
	 */
	testPaths: { [name: string]: HotTestPath; };
}