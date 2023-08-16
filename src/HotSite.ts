import { ServableFileExtension } from "./HotHTTPServer";

/**
 * A map path for testing.
 */
export interface HotSiteMapPath
{
	/**
	 * If set to true, this will start automatically when tests start.
	 * The default is true.
	 */
	autoStart?: boolean;
	/**
	 * The path to the 
	 */
	path?: string;
}

/**
 * A route used in a HotSite.
 */
export interface HotSiteRoute
{
	/**
	 * The name of the route. Will appear in the title.
	 */
	name: string;
	/**
	 * The url to the file to load.
	 */
	url: string;
	/**
	 * The name of the API to interface with.
	 */
	api?: string;
	/**
	 * The order in which destinations are supposed to execute. This is 
	 * ignored if the destinations are an array.
	 */
	destinationOrder?: string[];
	/**
	 * The HotTesterMap to use. This can be the name of an 
	 * existing one attached to the selected tester, or 
	 * can be an array of destinations that will be used to 
	 * create a new map.
	 */
	map?: string | string[] | { [name: string]: string | HotSiteMapPath; } | HotSiteMapPath[];
}

/**
 * A HotSite to load. This SHOULD NOT contain any private secret keys, passwords, 
 * or database connection information related to the server. As such, future 
 * versions of the HotSite interface should not contain any database related 
 * connection info.
 */
export interface HotSite
{
	/**
	 * The name of this HotSite.
	 */
	name: string;
	/**
	 * The version of this HotSite.
	 */
	version?: string;
	/**
	 * The description of this HotSite.
	 */
	description?: string;
	/**
	 * The path to the current HotSite. This is filled in during parsing.
	 */
	hotsitePath?: string;
	/**
	 * Additional web server configuration.
	 */
	server?: {
			/**
			 * The default name for a served Hott file.
			 */
			name?: string;
			/**
			 * If set to true, this will serve ALL files, including potentially secret files.
			 */
			serveSecretFiles?: boolean;
			/**
			 * Serve the following file extensions when requested.
			 */
			serveFileExtensions?: (string | ServableFileExtension)[];
			/**
			 * The name of the API to interface with across all pages.
			 */
			globalApi?: string;
			/**
			 * The base url for the server.
			 */
			url?: string;
			/**
			 * The JavaScript source path.
			 */
			jsSrcPath?: string;
			/**
			 * The ports to use.
			 */
			ports?: {
					/**
					 * The web HTTP port to serve on.
					 */
					http?: number;
					/**
					 * The web HTTPS port to serve on.
					 */
					https?: number;
					/**
					 * If set to true, this will redirect from HTTP to HTTPS for a web and web-api server.
					 */
					redirectHTTPtoHTTPS?: boolean;
					/**
					 * The api HTTP port to serve on.
					 */
					apiHttp?: number;
					/**
					 * The api HTTPS port to serve on.
					 */
					apiHttps?: number;
					/**
					 * If set to true, this will redirect from HTTP to HTTPS for an api server.
					 */
					apiRedirectHTTPtoHTTPS?: boolean;
				};
			/**
			 * The list of directory to serve to the client from the server.
			 */
			serveDirectories?: {
					/**
					 * The web route to take.
					 */
					route: string;
					/**
					 * The local filesystem path to serve pages from.
					 */
					localPath: string;
				}[];
			/**
			 * How to handle errors.
			 */
			errors?: {
				/**
				 * On a 404, serve a local file.
				 */
				on404?: string;
				/**
				 * On an error other than a 404, serve a local file.
				 */
				onOther?: string;
			};
		};
	/**
	 * Testing related functionality.
	 */
	testing?: {
			web?: {
				/**
				 * The name of the tester to use.
				 */
				testerName?: string;
				/**
				 * The url that connects to the tester api server.
				 */
				testerAPIUrl?: string;
				/**
				 * The name of the test driver to use.
				 */
				driver?: string;
				/**
				 * The number of milliseconds to wait before executing the next command.
				 * Default is set to 20.
				 */
				commandDelay?: number;
				/**
				 * The url to the html that loads the hott files.
				 */
				launchpadUrl?: string;
				/**
				 * The maps to test in order.
				 */
				maps?: string[];
			},
			api?: {
				/**
				 * The name of the tester to use.
				 */
				testerName?: string;
				/**
				 * The url that connects to the tester api server.
				 */
				testerAPIUrl?: string;
				/**
				 * The name of the test driver to use.
				 */
				driver?: string;
				/**
				 * The url to the html that loads the hott files.
				 */
				launchpadUrl?: string;
				/**
				 * The maps to test in order.
				 */
				maps?: string[];
			}
		};
	/**
	 * The routes to load. This MAY be deprecated in the future.
	 */
	routes?: {
			[routeName: string]: HotSiteRoute;
		};
	web?: {
			[name: string]: {
				/**
				 * The maps to test in order.
				 */
				map?: string[];
			};
		};
	/**
	 * The available APIs on the server. The server must already have these 
	 * loaded.
	 */
	apis?: {
			[name: string]: {
					/**
					 * The JS API file to load.
					 */
					jsapi?: string;
					/**
					 * The exported JS library name to use.
					 */
					libraryName?: string;
					/**
					 * The name of the api to use.
					 */
					apiName?: string;
					/**
					 * The port to use.
					 */
					port?: number;
					/**
					 * The public base url for the api.
					 */
					url?: string;
					/**
					 * The server-side filepath for the api.
					 */
					filepath?: string;
					/**
					 * The maps to test in order.
					 */
					map?: string[];
				};
		};
	/**
	 * Public keys that are embedded into the page.
	 */
	publicKeys?: {
			[name: string]: string | {
					/**
					 * The key of an API secret to pass to the site to 
					 * be used publicly.
					 */
					passSecretFromAPI?: string;
					/**
					 * Get the public secret from an environment variable.
					 */
					env?: string;
				};
		};
	/**
	 * The components to load and register.
	 */
	components?: {
			[name: string]: {
					/**
					 * The url to the component to load and register.
					 */
					url: string;
				};
		};
	/**
	 * The dependencies used by this application.
	 */
	dependencies?: {
		/**
		 * The web dependencies to load. These are loaded in the browser.
		 */
		web?: {
			/**
			 * The NPM dependency to load. The key is the name of the 
			 * NPM package and the value is the version to load.
			 */
			[name: string]: string;
		};
		/**
		 * The path to the web export that contains the BuildAssets function 
		 * to execute.
		 */
		webExport?: string;
	};
	/**
	 * The files to load and save in memory.
	 */
	files?: {
			[name: string]: {
					/**
					 * The url to the file to load.
					 */
					url: string;
				};
		};
	/**
	 * If set to true, this will disable loading files into memory.
	 */
	disableFileLoading?: boolean;
}