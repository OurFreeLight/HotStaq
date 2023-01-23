import { HotSiteMapPath } from "./HotSite";

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