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
	 * The relative url from the base url to start at.
	 */
	url: string;
	/**
	 * The API route to start using.
	 */
	api: string;
	/**
	 * The paths to take on the page.
	 */
	paths: HotTestStop[];
}