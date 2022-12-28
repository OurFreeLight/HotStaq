import { HotTestElement } from "./HotTestElement";
import { HotTestDriver } from "./HotTestDriver";
import { HotSiteMapPath } from "./HotSite";

/**
 * Create a test path for later execution.
 */
export type HotTestPath = (driver: HotTestDriver, ...args: any) => Promise<any>;

/**
 * The destination to take in a map.
 */
export class HotTestDestination
{
	/**
	 * The destination to take.
	 */
	destination: string;
	/**
	 * If set to true, this will automatically start executing it's 
	 * tests when it's time.
	 */
	autoStart: boolean;

	constructor (destination: string | HotTestDestination | HotSiteMapPath = "", autoStart: boolean = true)
	{
		if (typeof (destination) === "string")
		{
			this.destination = destination;
			this.autoStart = autoStart;
		}
		else
		{
			if (destination instanceof HotTestDestination)
			{
				this.destination = destination.destination;
				this.autoStart = destination.autoStart;
			}
			else
			{
				this.destination = destination.path;
				this.autoStart = destination.autoStart;
			}
		}
	}
}

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

/**
 * Maps the paths that are taken to complete a test.
 */
export class HotTestMap
{
	/**
	 * The order in which paths are to be taken. Each destination is a string 
	 * in a type -> path order. The type could be either a page or api route. 
	 * For example:
	 * ```
	 * [
	 *      "page:signin_page -> signin_path",
	 *      "page:account_page -> change_username_path",
	 *      "page:account_page -> change_password_path",
	 *      "page:account_page -> change_name_path -> change_address_path",
	 * 		"page:account_page -> signout_path",
	 * 		"api:account_api_route -> signout_route_method -> signout_test_path"
	 * ]
	 * ```
	 * 
	 * The first string to the left of the -> will always be the type, such as a 
	 * page or an api route. Any strings to the right of the -> will be a path, even 
	 * when chaining addtional ->'s.
	 */
	destinations: HotTestDestination[] | { [name: string]: HotTestDestination; };
	/**
	 * The order in which destinations are supposed to execute. This is 
	 * ignored if the destinations are an array.
	 */
	destinationOrder: string[];
	/**
	 * The test pages to execute.
	 */
	pages: {
			[name: string]: HotTestPage
		};

	constructor (destinations: string[] | HotTestDestination[] | { [name: string]: string | HotTestDestination; } = [], 
		pages: { [name: string]: HotTestPage } = {}, destinationOrder: string[] = [])
	{
		// Go through and convert any strings into HotTestDestinations.
		if (destinations instanceof Array)
		{
			this.destinations = [];

			for (let iIdx = 0; iIdx < destinations.length; iIdx++)
			{
				let dest = destinations[iIdx];

				this.destinations.push (new HotTestDestination (dest));
			}
		}
		else
		{
			this.destinations = {};

			for (let key in destinations)
			{
				let dest = destinations[key];

				this.destinations[key] = new HotTestDestination (dest);
			}
		}

		this.destinationOrder = destinationOrder;
		this.pages = pages;
	}
}