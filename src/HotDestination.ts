import { HotTestStop } from "./HotTestStop";

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