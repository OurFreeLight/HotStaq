import { HotStaq } from "./HotStaq";
import { HotLog } from "./HotLog";
import { HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";

/**
 * The type of server.
 */
export enum HotServerType
{
	HTTP,
	WebSockets,
	Generate,
	WebTesting,
	APITesting
}

/**
 * The server.
 */
export interface IHotServer
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The server type.
	 */
	serverType: string;
	/**
	 * The API to use.
	 */
	api: HotAPI;
	/**
	 * The network address to listen on.
	 */
	listenAddress: string;
	/**
	 * The ports to use.
	 */
	ports: {
			http: number;
			https: number;
		};
	/**
	 * SSL settings.
	 */
	ssl: {
			/**
			 * The SSL certificate to use.
			 */
			cert: string;
			/**
			 * The SSL certificate key to use.
			 */
			key: string;
			/**
			 * The SSL certificate CA to use.
			 */
			ca: string;
		};
	/**
	 * Redirect HTTP traffic to HTTPS.
	 */
	redirectHTTPtoHTTPS: boolean;
	/**
	 * The type of server.
	 */
	type: HotServerType;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * Any secrets associated with this server.
	 */
	secrets: any;
}

/**
 * The server.
 */
export class HotServer implements IHotServer
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The server type.
	 */
	serverType: string;
	/**
	 * The API to use.
	 */
	api: HotAPI;
	/**
	 * The network address to listen on.
	 */
	listenAddress: string;
	/**
	 * The ports to use.
	 */
	ports: {
			http: number;
			https: number;
		};
	/**
	 * SSL settings.
	 */
	ssl: {
			/**
			 * The SSL certificate to use.
			 */
			cert: string;
			/**
			 * The SSL certificate key to use.
			 */
			key: string;
			/**
			 * The SSL certificate CA to use.
			 */
			ca: string;
		};
	/**
	 * Redirect HTTP traffic to HTTPS.
	 */
	redirectHTTPtoHTTPS: boolean;
	/**
	 * The type of server.
	 */
	type: HotServerType;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * Any secrets associated with this server.
	 */
	secrets: any;

	constructor (processor: HotStaq | HotServer)
	{
		if (processor instanceof HotStaq)
		{
			this.processor = processor;
			this.serverType = "Server";
			this.api = null;
			this.listenAddress = "0.0.0.0";
			this.ports = {
					http: 5000,
					https: 443
				};
			this.ssl = {
					cert: "",
					key: "",
					ca: ""
				};
			this.redirectHTTPtoHTTPS = true;
			this.type = HotServerType.HTTP;
			this.logger = processor.logger;
			this.secrets = {};
		}
		else
		{
			this.processor = processor.processor;
			this.serverType = processor.serverType || "Server";
			this.api = processor.api || null;
			this.listenAddress = processor.listenAddress || "0.0.0.0";
			this.ports = processor.ports || {
					http: 5000,
					https: 443
				};
			this.ssl = processor.ssl || {
					cert: "",
					key: "",
					ca: ""
				};
			this.redirectHTTPtoHTTPS = processor.redirectHTTPtoHTTPS != null ? processor.redirectHTTPtoHTTPS : true;
			this.type = processor.type || HotServerType.HTTP;
			this.logger = processor.logger;
			this.secrets = processor.secrets || {};
		}
	}

	/**
	 * Set an API to this server. This will also set the associated 
	 * processor to this API as well.
	 */
	async setAPI (api: HotAPI): Promise<void>
	{
		this.processor.api = api;
		this.api = api;

		//if (registerRoutes === true)
			//await this.api.registerRoutes ();
	}

	/**
	 * Register a route with the server.
	 */
	async registerRoute? (route: HotRoute): Promise<void>;

	/**
	 * Start listening for requests.
	 */
	async listen? (): Promise<void>;

	/**
	 * Shutdown the server.
	 */
	async shutdown? (): Promise<void>;
}