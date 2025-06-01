import { HotFile } from "./HotFile";
import { HotPage } from "./HotPage";
import { HotStaq } from "./HotStaq";
import { HotAPI } from "./HotAPI";
import { HotTestElement } from "./HotTestElement";
import { HotEventMethod } from "./HotRouteMethod";
import { HotModule } from "./HotModule";
import { HttpError } from "./HotHttpError";

import EventEmitter from "events";

import Cookies from "js-cookie";
import fetch from "node-fetch";
import FormData from "form-data";
import { EventSourceMessage, fetchEventSource, FetchEventSourceInit } from '@microsoft/fetch-event-source';

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
 * The SSE emitter.
 */
type HotSSEEmitter = {
	"open": [Response];
	"error": [Error];
	"message": [any];
	"close": [];
};

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
	 * Get a validated URL parameter.
	 * 
	 * @example
	 * ```ts
	 * <*
	 * 	const id = Hot.getUrlParam ('id', 'int');
	 * *>
	 * 
	 * <div>The id is: ${id}</div>
	 * ```
	 * 
	 * @param validation This parameter is for validating and sanitizing a URL parameter.
	 * If it's a string, the available options are:
	 * * int
	 *   * This will only allow integers. parseInt will be called and will return an integer.
	 * * float
	 *   * This will only allow floating point numbers. parseFloat will be called and will return a float.
	 * * email
	 *   * Will verify that the string is in the form of an email address.
	 * * phone
	 *   * Will verify that the string is in the form of an email address.
	 * * uuid
	 *   * This will verify that the string is in the form of a UUID. It does not check if the UUID is valid.
	 * * string(number_of_chars)
	 *   * This will only allow a string of the specified number of characters.
	 * 
	 * If this is a function, this will call the supplied function to validate. Validation checks must happen 
	 * in the function and return the sanitized value. It is simply a passthrough, be wise with this. Throw 
	 * an error if the value is not valid.
	 * 
	 * @returns Returns the URL parameter, only if it passes validation. If the parameter is not found,
	 * null will be returned.
	 */
	static getUrlParam (param: string, validation: string | ((param: any) => any)): any
	{
		const urlParams = new URLSearchParams (window.location.search);
		const value = urlParams.get (param);

		if (value == null)
			return (null);

		if (typeof (validation) === "string")
		{
			switch (validation)
			{
				case "int":
					return (parseInt (value));
				case "float":
					return (parseFloat (value));
				case "email":
				{
					const emailRegex = new RegExp ("^\\S+@\\S+\\.\\S+$");

					if (emailRegex.test (value) === true)
						return (value);

					break;
				}
				case "phone":
				{
					const phoneRegex = new RegExp ("^\\+?([0-9 ]?){6,14}[0-9]$");

					if (phoneRegex.test (value) === true)
						return (value);

					break;
				}
				case "uuid":
				{
					const uuidRegex = new RegExp ("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");

					if (uuidRegex.test (value) === true)
						return (value);

					break;
				}
				default:
					if (validation.indexOf ("string") > -1)
					{
						const numChars = parseInt (validation.split ("(")[1].split (")")[0]);

						if (value.length === numChars)
							return (value);
					}
					break;
			}

			throw new Error (`getUrlParam retreiving parameter "${param}" using validation type "${validation}" failed.`);
		}

		return (validation (value));
	}

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
	 * Include and execute JavaScript for use when running the preprocessor.
	 */
	static async includeJS (file: HotFile | string, args: any[] = null, parentObject: any = null): Promise<any>
	{
		const output: string = await Hot.getFile (file);

		if (HotStaq.isWeb === true)
		{
			if (parentObject == null)
				parentObject = window;
		}
		else
		{
			if (parentObject == null)
				parentObject = global;
		}

		let func = new Function (output);

		return (func.apply (parentObject, args));
	}

	/**
	 * Retrieve a file and echo out it's contents.
	 */
	static async import (moduleName: string, args: any[] = null, parentObject: any = null): Promise<any>
	{
		let foundModule: HotModule = Hot.CurrentPage.processor.getModule (moduleName);

		if (foundModule != null)
			return (foundModule);

		const file: string = `./hotstaq_modules/${moduleName}/index.js`;
		const output: string = await Hot.getFile (file, args);

		if (HotStaq.isWeb === true)
		{
			if (parentObject == null)
				parentObject = window;
		}
		else
		{
			if (parentObject == null)
				parentObject = global;
		}

		let newModule = new Function (output).apply (parentObject);

		if (newModule.loadHTML != null)
			await newModule.loadHTML ();

		Hot.CurrentPage.processor.addModule (moduleName, newModule);

		return (newModule);
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
			tempFile.name = path;

			if (HotStaq.isWeb === true)
				tempFile.url = path;
			else
				tempFile.localFile = path;
		}
		else
			tempFile = path;

		let checkFile: HotFile = Hot.CurrentPage.processor.getFile (tempFile.name, false);

		if (checkFile != null)
			tempFile = checkFile;

		await tempFile.load ();

		tempFile.page = this.CurrentPage;
		let content: string = await tempFile.process (args);

		return (content);
	}

	/**
	 * Make an api call. This must include the route version.
	 * 
	 * Simple apiCall:
	 * @example
	 * ```ts
	 * await Hot.apiCall ('/v1/hello_world/echo', { message: "Hello!" });
	 * ```
	 * 
	 * Make an API call and upload a file:
	 * @example
	 * ```ts
	 * let input = document.getElementById ("fileInput");
	 * let file = input.files[0];
	 * 
	 * await Hot.apiCall ('/v1/hello_world/echo',
	 * 		{ message: "Hello!" }, HotEventMethod.POST,
	 * 		{
	 * 			"indexFileKey": file
	 * 		});
	 * ```
	 */
	static async apiCall (route: string, data: any = null, 
		httpMethod: HotEventMethod = HotEventMethod.POST, 
		files: { [name: string]: any } = {}, bearerToken: string = ""): Promise<any>
	{
		let result: any = null;

		if (Hot.CurrentPage == null)
			throw new Error ("Current page is null!");

		if (Hot.CurrentPage.processor == null)
			throw new Error ("Current page's processor is null!");

		if (Hot.CurrentPage.processor.api == null)
			throw new Error ("Current page's processor api is null! Did you forget to set the API name or URL?");

		if (Hot.CurrentPage.processor.api != null)
		{
			result = await Hot.CurrentPage.processor.api.makeCall (route, 
							data, httpMethod, files, bearerToken);
		}

		return (result);
	}

	/**
	 * Make a HTTP SSE JSON request. This will await until a connection is established.
	 * 
	 * @example
	 * ```ts
	 * await Hot.sseRequest ('/v1/hello_world/echo', { message: "Hello!" });
	 * ```
	 * 
	 * @param url The full url to make the HTTP call.
	 * @param data The data to JSON.stringify and send.
	 * @param httpMethod The HTTP method to use to send the data.
	 * 
	 * @returns The parsed JSON object.
	 */
	static sseRequest (request: { url: string; data?: any; bearerToken?: string; 
		httpMethod?: HotEventMethod; ctrl: AbortController;
		autoParseMsgs?: boolean; echoErrorToConsole?: boolean; }): EventEmitter<HotSSEEmitter>
	{
		let statusCode: number = 200;
		const emitter = new EventEmitter<HotSSEEmitter> ();

		try
		{
			if ((request.url == null) || (request.url === ""))
				throw new Error (`A url must be provided to the request.`);

			if (request.ctrl == null)
				throw new Error (`A ctrl AbortController must be provided to the request.`);

			if (request.httpMethod == null)
				request.httpMethod = HotEventMethod.POST;

			if (request.echoErrorToConsole == null)
				request.echoErrorToConsole = true;

			if (request.autoParseMsgs == null)
				request.autoParseMsgs = true;

			let sseObj: FetchEventSourceInit = {
				method: request.httpMethod,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				signal: request.ctrl.signal
			};

			if (request.httpMethod !== HotEventMethod.GET)
				sseObj["body"] = JSON.stringify (request.data);

			if (request.bearerToken != "")
				sseObj.headers["Authorization"] = `Bearer ${request.bearerToken}`;

			fetchEventSource (request.url, {
					...sseObj, 
					onopen: async (res: Response) =>
					{
						statusCode = res.status;

						if (res.ok === false)
						{
							let errorObj = await res.json ();
			
							throw new Error (errorObj.error);
						}
			
						emitter.emit ("open", res);
					},
					onerror: (error: Error) =>
					{
						if (request.echoErrorToConsole === true)
							console.error (`SSE Error: ${error.message}`);

						emitter.emit ("error", error);
					},
					onmessage: async (event: EventSourceMessage) =>
					{
						let msg: any = event.data;

						if (request.autoParseMsgs === true)
							msg = JSON.parse (event.data);

						// @ts-ignore
						emitter.emit (event.event, msg);
					},
					onclose: async () =>
					{
						emitter.emit ("close");
					}
				});
		}
		catch (ex)
		{
			throw new HttpError (ex.message, statusCode);
		}

		return (emitter);
	}

	/**
	 * Get a HTTP JSON file or request using HTTP GET.
	 * 
	 * @example
	 * ```ts
	 * await Hot.getJSON (`http://example.com/example.json`);
	 * ```
	 * 
	 * @param url The full url to make the HTTP call.
	 * 
	 * @returns The parsed JSON object.
	 */
	static async getJSON (url: string, bearerToken: string = ""): Promise<any>
	{
		return (Hot.jsonRequest (url, null, bearerToken, HotEventMethod.GET));
	}

	/**
	 * Make a HTTP JSON request.
	 * 
	 * @example
	 * ```ts
	 * await Hot.jsonRequest ('/v1/hello_world/echo', { message: "Hello!" });
	 * ```
	 * 
	 * @param url The full url to make the HTTP call.
	 * @param data The data to JSON.stringify and send.
	 * @param httpMethod The HTTP method to use to send the data.
	 * 
	 * @returns The parsed JSON object.
	 */
	static async jsonRequest (url: string, data: any = null, bearerToken: string = "", 
		httpMethod: HotEventMethod = HotEventMethod.POST): Promise<any>
	{
		let statusCode: number = 200;

		try
		{
			let fetchObj: any = {
				"method": httpMethod,
				"headers": {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
			}

			if (httpMethod !== HotEventMethod.GET)
				fetchObj["body"] = JSON.stringify (data);

			if (bearerToken != "")
				fetchObj.headers["Authorization"] = `Bearer ${bearerToken}`;

			let res = await fetch (url, fetchObj);

			statusCode = res.status;

			if (res.ok === false)
			{
				let errorObj = await res.json ();

				throw new Error (errorObj.error);
			}

			let result: any = await res.json ();

			return (result);
		}
		catch (ex)
		{
			return ({ "error": ex.message, "errorCode": statusCode });
		}
	}

	/**
	 * Make a HTTP request. This is basically just a wrapper for fetch that can also upload files.
	 * 
	 * @example
	 * HTTP JSON POST
	 * ```ts
	 * await Hot.httpRequest ('http://other-hotstaq-api.com/v1/hello_world/echo', { message: "Hello!" });
	 * ```
	 * 
	 * @example
	 * Upload file using HTTP POST
	 * ```ts
	 * let input = document.getElementById ("fileInput");
	 * let file = input.files[0];
	 * 
	 * await Hot.httpRequest ('http://other-hotstaq-api.com/v1/hello_world/echo', 
	 * 		{ message: "Hello!" }, HotEventMethod.POST, 
	 * 		{
	 * 			"indexFileKey": file
	 * 		});
	 * ```
	 */
	static async httpRequest (url: string, data: any, httpMethod: HotEventMethod = HotEventMethod.POST, 
		files: { [name: string]: any } = {}, bearerToken: string = ""): Promise<any>
	{
		const numFiles: number = Object.keys (files).length;
		let httpMethodLower: string = httpMethod.toLowerCase ();

		if (httpMethod === HotEventMethod.FILE_UPLOAD)
			httpMethodLower = "post";

		let uploadFile: boolean = false;
		const formData: FormData = new FormData ();

		if (numFiles > 0)
		{
			if (httpMethodLower !== "post")
				throw new Error (`To upload files, you must set the httpMethod to POST.`);

			for (let key in files)
			{
				const file = files[key];

				if (file != null)
				{
					formData.append (key, file);
					uploadFile = true;
				}
			}
		}

		if (uploadFile === true)
		{
			let requestInit: RequestInit = {
					method: "POST",
					headers: {
						"HotStaqUpload": "true"
					},
					// @ts-ignore
					body: formData
				};

			if (bearerToken != "")
			{
				requestInit.headers = {
					"Authorization": `Bearer ${bearerToken}`
				};
			}

			// @ts-ignore
			let res = await fetch (url, requestInit);
			let jsonRes: any = await res.json ();

			if (data["hotstaq"] == null)
				data["hotstaq"] = { skipValidation: true };

			if (data["hotstaq"]["uploads"] == null)
				data["hotstaq"]["uploads"] = {};

			data["hotstaq"]["uploads"]["uploadId"] = 
					jsonRes["hotstaq"]["uploads"]["uploadId"];

			// After the upload, make the actual JSON call. Do not pass files again.
			const result: any = await Hot.httpRequest (url, data, HotEventMethod.POST, {}, bearerToken);

			return (result);
		}

		let fetchObj: any = {
				method: httpMethodLower,
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
			};

		if (bearerToken != "")
			fetchObj.headers["Authorization"] = `Bearer ${bearerToken}`;

		if ((httpMethodLower !== "get") && 
			(httpMethodLower !== "head"))
		{
			fetchObj["body"] = JSON.stringify (data);
		}

		let promise = new Promise ((resolve, reject) => 
			{
				fetch (url, fetchObj).then (async (res) =>
					{
						res.json ().then ((jsonObj: any) =>
							{
								resolve (jsonObj);
							})
							.catch ((reason: any) =>
							{
								throw new Error (`${url}: ${reason.message}`);
							});
					})
					.catch ((reason: any) =>
					{
						throw new Error (`${url}: ${reason.message}`);
					});
			});

		return (promise);
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