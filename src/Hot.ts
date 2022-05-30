import { HotFile } from "./HotFile";
import { HotPage } from "./HotPage";
import { HotStaq } from "./HotStaq";
import { HotAPI } from "./HotAPI";
import { HotTestElement } from "./HotTestElement";

import Cookies from "js-cookie";
import fetch from "node-fetch";

/**
 * The available developer modes.
 */
export enum DeveloperMode
{
	/**
	 * The default developer mode. No tests will be executed and 
	 * any test related data will be ignored.
	 */
	Production,
	/**
	 * For use during development/debugging. All test data will 
	 * be collected and executed if necessary.
	 */
	Development
}

/**
 * A CSS object to embed.
 */
export interface CSSObject
{
	/**
	 * The url to the CSS file to embed.
	 */
	url: string;
	/**
	 * The integrity hash to generate during initial compilation.
	 */
	integrityHash: string;
}

/**
 * The api used during processing.
 */
export class Hot
{
	/**
	 * The currently generated page being displayed. This is cleared between every file processed.
	 */
	static CurrentPage: HotPage = null;
	/**
	 * The arguments passed.
	 */
	static Arguments: any = null;
	/**
	 * The mode in which this application is running. If it's set to development mode, all testing
	 * related data will be collected, parsed, and executed if necessary.
	 */
	static DeveloperMode = DeveloperMode;
	/**
	 * The mode in which this application is running. If it's set to development mode, all testing
	 * related data will be collected, parsed, and executed if necessary.
	 */
	static HotTestElement = HotTestElement;
	/**
	 * The mode in which this application is running. If it's set to development mode, all testing
	 * related data will be collected, parsed, and executed if necessary.
	 */
	static Mode: DeveloperMode = DeveloperMode.Production;
	/**
	 *The current API used on this page. This is cleared between every file processed.
	 */
	static API: HotAPI = null;
	/**
	 * The API being used by the tester.
	 */
	static TesterAPI: HotAPI = null;
	/**
	 * Contains the buffer to output. This is cleared between every file processed.
	 */
	static Output: string = "";
	/**
	 * The data to share across all the different files and pages. This data will be public.
	 */
	static Data: any = {};
	/**
	 * The cookies to use between pages.
	 */
	static Cookies: Cookies.CookiesStatic = Cookies;
	/**
	 * Any public keys that need to be shown. These can be passed from HotSite.json.
	 */
	static PublicKeys: any = {};
	/**
	 * The CSS string to use when echoing out the CSS files.
	 */
	static cssStr: string = `<link rel = "stylesheet" href = "%CSS_FILE%" />`;
	/**
	 * The CSS files to use in the current page being generated.
	 * 
	 * @todo Make this a "string | CSSObject" data type so it can also include 
	 * the integrity hashes as well.
	 */
	static CSS: string[] = [];
	/**
	 * The JavaScript files to use in the current page being generated.
	 * 
	 * @todo Make this a "string | JSFileObject" data type so it can also include 
	 * the integrity hashes as well.
	 */
	static JSFiles: any[] = [];
	/**
	 * The JavaScript inline code to use in the current page being generated.
	 */
	static JSScripts: any[] = [];
	/**
	 * The JavaScript string to use when echoing out the Scripts files.
	 */
	static jsFileStr: string = `<script type = "text/javascript" src = "%JS_FILE%"></script>`;
	/**
	 * The JavaScript string to use when echoing out the Scripts files.
	 */
	static jsScriptsStr: string = `<script type = "text/javascript">%JS_CODE%</script>`;

	/**
	 * Retrieve a file and echo out it's contents.
	 */
	static async include (file: HotFile | string, args: any[] = null): Promise<void>
	{
		if (HotStaq.isWeb === true)
		{
			if (typeof (file) === "string")
			{
				const lowerFile: string = file.toLowerCase ();

				// If the file to be included does not have a nahfam, add it. This 
				// will ensure the server sends only the file content.
				if (lowerFile.indexOf (".hott") > -1)
				{
					if (lowerFile.indexOf ("nahfam") < 0)
						file += "?hstqserve=nahfam";
				}
			}
		}

		Hot.echo (await Hot.getFile (file, args));
	}

	/**
	 * Run an already loaded file and echo out it's contents.
	 */
	static async runFile (fileName: string, args: any[] = null): Promise<void>
	{
		let file: HotFile = Hot.CurrentPage.processor.getFile (fileName);
		/// @fixme Does the file need to be deep cloned first?
		//let clonedFile: HotFile = new HotFile (Object.assign ({}, file));
		let tempFile: HotFile = file;

		tempFile.page = this.CurrentPage;
		let content: string = await tempFile.process (args);

		Hot.echo (content);
	}

	/**
	 * Get the content of a file.
	 */
	static async getFile (path: HotFile | string, args: any[] = null): Promise<string>
	{
		let tempFile: HotFile = null;

		if (typeof (path) === "string")
		{
			tempFile = new HotFile ();

			if (HotStaq.isWeb === true)
				tempFile.url = path;
			else
				tempFile.localFile = path;
		}
		else
			tempFile = path;

		await tempFile.load ();

		tempFile.page = this.CurrentPage;
		let content: string = await tempFile.process (args);

		return (content);
	}

	/**
	 * Make an api call.
	 */
	static async apiCall (route: string, data: any = null, httpMethod: string = "POST"): Promise<any>
	{
		let result: any = null;

		if (Hot.CurrentPage == null)
			throw new Error ("Current page is null!");

		if (Hot.CurrentPage.processor == null)
			throw new Error ("Current page's processor is null!");

		if (Hot.CurrentPage.processor.api == null)
			throw new Error ("Current page's processor api is null! Did you forget to set the API name or URL?");

		if (Hot.CurrentPage.processor.api != null)
			result = await Hot.CurrentPage.processor.api.makeCall (route, data, httpMethod);

		return (result);
	}

	/**
	 * Make a HTTP JSON request.
	 * 
	 * @param url The full url to make the HTTP call.
	 * @param data The data to JSON.stringify and send.
	 * @param httpMethod The HTTP method to use to send the data.
	 * 
	 * @returns The parsed JSON object.
	 */
	static async jsonRequest (url: string, data: any = null, httpMethod: string = "POST"): Promise<any>
	{
		try
		{
			let res = await fetch (url, {
					"method": httpMethod,
					"headers": {
							"Accept": "application/json",
							"Content-Type": "application/json"
						},
					"body": JSON.stringify (data)
				});

			if (res.ok === false)
				throw new Error (`${res.status}: ${res.statusText}`);

			let result: any = await res.json ();

			return (result);
		}
		catch (ex)
		{
			return (JSON.stringify ({ "error": `${ex.message} - Could not fetch ${url}` }));
		}
	}

	/**
	 * Make a HTTP request. This is basically just a wrapper for fetch.
	 * 
	 * @param {string} url The full url to make the HTTP call.
	 * @param {RequestInit} requestInit The request parameters to send.
	 * 
	 * @returns The HTTP response.
	 */
	static async httpRequest (url: string, requestInit: any = undefined): Promise<any>
	{
		let res = await fetch (url, requestInit);

		return (res);
	}

	/**
	 * Echo out some output.
	 */
	static echo (message: string): void
	{
		Hot.Output += message;
	}

	/**
	 * Echo out the CSS for the current page being generated.
	 */
	static displayCSS (): void
	{
		for (let iIdx = 0; iIdx < Hot.CSS.length; iIdx++)
		{
			let cssFile: string = Hot.CSS[iIdx];
			let cssOut: string = Hot.cssStr;

			cssOut = cssOut.replace (/\%CSS_FILE\%/g, cssFile);

			Hot.echo (cssOut);
		}
	}

	/**
	 * Echo out the JS files for the current page being generated.
	 */
	static displayJSFiles (): void
	{
		for (let iIdx = 0; iIdx < Hot.JSFiles.length; iIdx++)
		{
			let jsFile: string = Hot.JSFiles[iIdx];
			let jsFileOut: string = Hot.jsFileStr;

			jsFileOut = jsFileOut.replace (/\%JS_FILE\%/g, jsFile);

			Hot.echo (jsFileOut);
		}
	}

	/**
	 * Echo out the JS scripts for the current page being generated.
	 */
	static displayJSScripts (): void
	{
		for (let iIdx = 0; iIdx < Hot.JSScripts.length; iIdx++)
		{
			let jsScript: string = Hot.JSScripts[iIdx];
			let jsScriptOut: string = Hot.jsScriptsStr;

			jsScriptOut = jsScriptOut.replace (/\%JS_CODE\%/g, jsScript);

			Hot.echo (jsScriptOut);
		}
	}
}