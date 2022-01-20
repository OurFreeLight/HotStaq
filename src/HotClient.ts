import { HotStaq } from "./HotStaq";
import { HotAPI } from "./HotAPI";
import { HotServerType } from "./HotServer";
import { HotLog } from "./HotLog";

/**
 * A client connected to a server.
 */
export class HotClient
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The API to use.
	 */
	api: HotAPI;
	/**
	 * The tester API to use.
	 */
	testerAPI: HotAPI;
	/**
	 * The type of server.
	 */
	type: HotServerType;
	/**
	 * The logger.
	 */
	logger: HotLog;

	constructor (processor: HotStaq)
	{
		this.processor = processor;
		this.api = null;
		this.testerAPI = null;
		this.type = HotServerType.HTTP;
		this.logger = processor.logger;
	}
}