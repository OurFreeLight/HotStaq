import { HotFile } from "./HotFile";
import { HotPage } from "./HotPage";
import { HotStaq } from "./HotStaq";
import { HotAPI } from "./HotAPI";
import { HotTestElement } from "./HotTestElement";

import Cookies from "js-cookie";
import fetch from "node-fetch";
import { HotEventMethod } from "./HotRouteMethod";

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
 * An asset to load.
 */
export class HotAsset
{
	/**
	 * The type of asset. Can be:
	 * * js
	 * * css
	 * * html
	 * * component
	 */
	type: string;
	/**
	 * The name of the asset to load.
	 */
	name?: string;
	/**
	 * The path to the assets to load.
	 */
	path?: string;
	/**
	 * The preloaded content to load. Requires name to be set.
	 */
	content?: string;

	constructor (type: string, name: string = "")
	{
		this.type = type;
		this.name = name;
		this.path = "";
		this.content = "";
	}

	load (): void
	{
	}

	/**
	 * Load the asset.
	 */
	output (): string | { name: string; url?: string; content?: string; }
	{
		if ((this.path == null) && (this.content == null))
			throw new Error (`HotAsset ${this.name} of type ${this.type} does not have a path or content set!`);

		let output: string | { name: string; url?: string; content?: string; } = "";

		if (this.path != null)
		{
			if (this.path !== "")
			{
				if (this.type === "js")
					output = `<script type = "text/javascript" src = "${this.path}"></script>`;

				if (this.type === "css")
					output = `<link href = "${this.path}" rel = "stylesheet" />`;

				if ((this.type === "html") || 
					(this.type === "component"))
				{
					if (this.name === "")
						throw new Error (`Loading an HTML or component asset requires a name to be set!`);

					let fileUrl: string = `"${this.path}"`;
					output = { name: this.name, url: this.path };
				}
			}
		}

		if (this.content != null)
		{
			if (this.content !== "")
			{
				if (this.type === "js")
					throw new Error (`Loading JS assets using content is not supported yet!`);

				if (this.type === "css")
					throw new Error (`Loading CSS assets using content is not supported yet!`);

				if (this.type === "html")
				{
					if (this.name === "")
						throw new Error (`Loading an HTML asset requires a name to be set!`);

					let escapedContent: string = JSON.stringify (this.content);
					let fileUrl: string = this.path;
					let fileContent: string = "";

					// Find any script tags and interrupt them so the HTML parsers 
					// don't get confused.
					escapedContent = escapedContent.replace (new RegExp ("\\<script", "gmi"), "<scr\" + \"ipt");
					escapedContent = escapedContent.replace (new RegExp ("\\<\\/script", "gmi"), "</scr\" + \"ipt");

					fileContent = escapedContent;

					output = { name: this.name, url: fileUrl, content: escapedContent };
				}
			}
		}

		return (output);
	}
}

/**
 * Load a module that contains the assets to load for the frontend.
 */
export class HotModule
{
	/**
	 * The name of the module.
	 */
	name: string;
	/**
	 * The list of NPM modules to import.
	 */
	import?: string[];
	/**
	 * The HTML files to load.
	 */
	html?: (string | HotAsset)[];
	/**
	 * The CSS files to load.
	 */
	css?: (string | HotAsset)[];
	/**
	 * The JS files to load.
	 */
	js?: (string | HotAsset)[];
	/**
	 * The components to load.
	 */
	components?: (string | HotAsset)[];

	constructor (name: string)
	{
		this.name = name;
		this.import = [];
		this.html = [];
		this.css = [];
		this.js = [];
		this.components = [];
	}

	/**
	 * Output CSS.
	 */
	outputCSS (echoOut: boolean = true): string
	{
		if (this.css == null)
			return;

		let output: string = "";

		this.outputAsset ("css", this.css, (asset: HotAsset) =>
			{
				const content: string | any = asset.output ();
				output += `${content}\n`;
			});

		if (echoOut === true)
			Hot.echo (output);

		return (output);
	}

	/**
	 * Output JS.
	 */
	outputJS (echoOut: boolean = true): string
	{
		if (this.js == null)
			return;

		let output: string = "";

		this.outputAsset ("js", this.js, (asset: HotAsset) =>
			{
				const content: string | any = asset.output ();
				output += `${content}\n`;
			});

		if (echoOut === true)
			Hot.echo (output);

		return (output);
	}

	/**
	 * Output a loaded HTML asset.
	 */
	async output (assetName: string, args: any[] = null): Promise<void>
	{
		await Hot.include (`${this.name}/${assetName}.hott`, args);
	}

	/**
	 * Load HTML assets.
	 */
	async loadHTML (): Promise<void>
	{
		if (this.html == null)
			return;

		let files: any = {};

		this.outputAsset ("html", this.html, (asset: HotAsset) =>
			{
				const file = asset.output ();

				if (typeof (file) === "string")
					throw new Error (`HTML assets cannot be outputted using only a string!`);

				files[file.name] = file;
			});

		await Hot.CurrentPage.processor.loadHotFiles (files);
	}

	/**
	 * Load components assets.
	 */
	async loadComponents (): Promise<void>
	{
		if (this.components == null)
			return;

		let files: any = {};

		this.outputAsset ("component", this.components, (asset: HotAsset) =>
			{
				const file = asset.output ();

				if (typeof (file) === "string")
					throw new Error (`HTML assets cannot be outputted using only a string!`);

				files[file.name] = file;
			});

		await Hot.CurrentPage.processor.loadHotFiles (files);
	}

	/**
	 * Output an asset to HTML.
	 */
	protected outputAsset (assetType: string, assets: (string | HotAsset)[] = [], 
		callback: (asset: HotAsset) => void): void
	{
		for (let iIdx = 0; iIdx < assets.length; iIdx++)
		{
			let asset: string | HotAsset = assets[iIdx];
			let loadAsset: HotAsset = null;
			loadAsset = new HotAsset (assetType);

			if (typeof (asset) === "string")
				loadAsset.path = asset;
			else
			{
				if (asset.name != null)
					loadAsset.name = asset.name;

				if (asset.path != null)
					loadAsset.path = asset.path;

				if (asset.content != null)
					loadAsset.content = asset.content;
			}

			callback (loadAsset);
		}
	}
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
	 * Include and execute JavaScript for use when running the preprocessor.
	 */
	static async includeJS (file: HotFile | string, args: any[] = null, parentObject: any = null): Promise<any>
	{
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

		return (eval.apply (parentObject, [output]));
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

		if (newModule.loadComponents != null)
			await newModule.loadComponents ();

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
	 * Make an api call.
	 */
	static async apiCall (route: string, data: any = null, 
		httpMethod: HotEventMethod = HotEventMethod.POST, 
		files: { [name: string]: any } = {}): Promise<any>
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
							data, httpMethod, files);
		}

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
	static async jsonRequest (url: string, data: any = null, httpMethod: HotEventMethod = HotEventMethod.POST): Promise<any>
	{
		try
		{
			let fetchObj = {
				"method": httpMethod,
				"headers": {
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
			}

			if (httpMethod === HotEventMethod.POST)
			{
				/// @ts-ignore
				fetchObj["body"] = JSON.stringify (data);
			}

			let res = await fetch (url, fetchObj);

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