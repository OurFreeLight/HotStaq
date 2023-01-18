import * as fs from "fs";
import * as ppath from "path";

import fetch from "node-fetch";
import validateModuleName from "validate-npm-package-name";

import { HotPage } from "./HotPage";
import { HotFile } from "./HotFile";

import { HotComponent, HotComponentOutput, IHotComponent } from "./HotComponent";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotAPI } from "./HotAPI";
import { HotServer } from "./HotServer";
import { DeveloperMode, Hot } from "./Hot";
import { HotClient } from "./HotClient";

import { HotTester } from "./HotTester";
import { HotTesterAPI } from "./HotTesterAPI";
import { HotTestDriver } from "./HotTestDriver";
import { HotTestDestination, HotTestMap } from "./HotTestMap";

import { HotSite, HotSiteRoute } from "./HotSite";

var HotTesterMocha: any = null;
var HotTesterMochaSelenium: any = null;
var HotTestSeleniumDriver: any = null;

/**
 * The options to use when starting a page.
 */
export interface HotStartOptions
{
	/**
	 * The Hott site to load.
	 */
	url?: string;
	/**
	 * The content to display.
	 */
	content?: string;
	/**
	 * The name of the page to load.
	 */
	name?: string;
	/**
	 * The processor to use to load the page.
	 */
	processor?: HotStaq;
	/**
	 * Any arguments to pass to the new page.
	 */
	args?: any;
	/**
	 * The name of the tester to use.
	 */
	testerName?: string;
	/**
	 * The name of the tester map to use.
	 */
	testerMap?: string;
	/**
	 * The base url for the tester api.
	 */
	testerAPIBaseUrl?: string;
	/**
	 * The url to the html that loads the hott file that's 
	 * pointed at the url above.
	 */
	testerLaunchpadUrl?: string;
}

/**
 * The main class that handles all HTML preprocessing, then outputs the 
 * results.
 */
export interface IHotStaq
{
	/**
	 * The api that's used to communicate with.
	 */
	api?: HotAPI;
	/**
	 * The tester api that's used to communicate with.
	 */
	testerAPI?: HotAPI;
	/**
	 * Indicates what type of execution this is.
	 */
	mode?: DeveloperMode;
	/**
	 * The pages that can be constructed.
	 */
	pages?: { [name: string]: HotPage };
	/**
	 * The components that can be constructed.
	 */
	components?: {
		[tagName: string]: {
				componentType: (new  (copy: IHotComponent | HotStaq, api?: HotAPI) => HotComponent), 
				processor: HotStaq, 
				api: HotAPI
			}
		};
	/**
	 * The files that can be stored for later use.
	 */
	files?: { [name: string]: HotFile };
	/**
	 * The loaded hotsite.
	 */
	hotSite?: HotSite;
}

/**
 * The main class that handles all HTML preprocessing, then outputs the 
 * results.
 */
export class HotStaq implements IHotStaq
{
	/**
	 * The current version of HotStaq.
	 */
	static version: string = "0.7.3";
	/**
	 * Indicates if this is a web build.
	 */
	static isWeb: boolean = false;
	/**
	 * Indicates if this is ready for testing.
	 */
	static isReadyForTesting: boolean = false;
	/**
	 * Executes this event when this page is ready for testing.
	 */
	static onReadyForTesting: () => Promise<void> = null;
	/**
	 * Errors to execute when something goes wrong.
	 */
	static errors: { [name: string]: { redirectToUrl?: string; func?: (errType: string) => void; }; } = {};
	/**
	 * Indicates what type of execution this is.
	 */
	mode: DeveloperMode;
	/**
	 * The api that's used to communicate with.
	 */
	api: HotAPI;
	/**
	 * The tester api that's used to communicate with.
	 */
	testerAPI: HotAPI;
	/**
	 * The pages that can be constructed.
	 */
	pages: { [name: string]: HotPage };
	/**
	 * The components that can be constructed.
	 */
	components: {
		[tagName: string]: {
				componentType: (new  (copy: IHotComponent | HotStaq, api?: HotAPI) => HotComponent), 
				processor: HotStaq, 
				api: HotAPI
			}
		};
	/**
	 * The files that can be stored for later use.
	 */
	files: { [name: string]: HotFile };
	/**
	 * The loaded hotsite.
	 */
	hotSite: HotSite;
	/**
	 * The api content to use when about to load HotStaq.
	 */
	apiContent: string;
	/**
	 * The tester api content to use when about to load HotStaq.
	 */
	testerApiContent: string;
	/**
	 * The page content to use when about to load HotStaq.
	 */
	pageContent: string;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The public keys to be exposed.
	 */
	publicKeys: any;
	/**
	 * The testers that will be used to execute tests.
	 */
	testers: { [name: string]: HotTester };

	constructor (copy: IHotStaq = {})
	{
		this.api = copy.api || null;
		this.testerAPI = copy.testerAPI || null;
		this.mode = copy.mode || DeveloperMode.Production;
		this.pages = copy.pages || {};
		this.components = copy.components || {};
		this.files = copy.files || {};
		this.hotSite = copy.hotSite || null;
		this.apiContent = `
			{
				var %api_name% = %api_exported_name%.%api_name%;
				var newHotClient = new HotClient (processor);
				var newapi = new %api_name% (%base_url%, newHotClient);
				newHotClient.api = newapi;
				processor.api = newapi;
			}`;
		this.testerApiContent = `
			var HotTesterAPI = HotStaqWeb.HotTesterAPI;
			var newHotTesterClient = new HotClient (processor);
			var newtesterapi = new HotTesterAPI (%base_tester_url%, newHotTesterClient);
			newHotTesterClient.testerAPI = newtesterapi;
			processor.testerAPI = newtesterapi;`;
		this.pageContent = 
`<!DOCTYPE html>
<html>

<head>
	<title>%title%</title>

	<script type = "text/javascript" src = "%hotstaq_js_src%"></script>
	<script type = "text/javascript">
		window.HotStaq = HotStaqWeb.HotStaq;
		window.HotClient = HotStaqWeb.HotClient;
		window.HotAPI = HotStaqWeb.HotAPI;
		window.Hot = HotStaqWeb.Hot;
	</script>

%apis_to_load%

	<script type = "text/javascript">
		function hotstaq_startApp ()
		{
			let tempMode = 0;

			if (window["Hot"] != null)
				tempMode = Hot.Mode;

			%load_hot_site%

			var processor = new HotStaq ();
			var promises = [];
			%developer_mode%

			%api_code%

			%public_secrets%
			%tester_api%
			%load_files%

			processor.mode = tempMode;

			Promise.all (promises).then (function ()
				{
					HotStaq.displayUrl ({
							url: "%url%",
							name: "%title%",
							processor: processor,
							args: %args%,
							testerName: %tester_name%,
							testerMap: %tester_map%,
							testerAPIBaseUrl: %tester_api_base_url%,
							testerLaunchpadUrl: %tester_launchpad_url%
						});
				});
		}

		hotstaq_startApp ();
	</script>
</head>

<body>
</body>

</html>`;
		this.logger = new HotLog (HotLogLevel.All);
		this.publicKeys = {};
		this.testers = {};
	}

	/**
	 * Parse a boolean value.
	 */
	static parseBoolean (value: string): boolean
	{
		value = value.toLowerCase ();

		if (value === "true")
			return (true);

		if (value === "false")
			return (false);

		if (value === "yes")
			return (true);

		if (value === "no")
			return (false);

		if (value === "yep")
			return (true);

		if (value === "nah")
			return (false);

		return (false);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value.
	 */
	static getParam (name: string, objWithParam: any, required: boolean = true, throwException: boolean = true): any
	{
		let value: any = objWithParam[name];

		if (value == null)
		{
			if (required === true)
			{
				if (throwException === true)
					throw new Error (`Missing required parameter ${name}.`);
			}
		}

		if (typeof (value) === "string")
		{
			if (required === true)
			{
				if (value === "")
				{
					if (throwException === true)
						throw new Error (`Missing required parameter ${name}.`);
				}
			}
		}

		return (value);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value.
	 * If it does not exist, return a default value instead.
	 */
	static getParamDefault (name: string, objWithParam: any, defaultValue: any): any
	{
		let value: any = objWithParam[name];

		if (value == null)
			return (defaultValue);

		if (typeof (value) === "string")
		{
			if (value === "")
				return (defaultValue);
		}

		return (value);
	}

	/**
	 * Execute an error. This cannot be an async function due to the nature of how this works.
	 */
	static executeError (errType: string)
	{
		if (HotStaq.errors[errType] != null)
		{
			let url: string = HotStaq.errors[errType].redirectToUrl;

			if (url != null)
			{
				if (url !== "")
				{
					window.location.href = url;

					return;
				}
			}

			let func = HotStaq.errors[errType].func;

			if (func != null)
				func (errType);
		}
	}

	/**
	 * Wait for a number of milliseconds.
	 */
	static async wait (numMilliseconds: number): Promise<void>
	{
		return (await new Promise ((resolve, reject) =>
			{
				setTimeout (() =>
					{
						resolve ();
					}, numMilliseconds);
			}));
	}

	/**
	 * Add a page.
	 */
	addPage (page: HotPage): void
	{
		this.pages[page.name] = page;
	}

	/**
	 * Get a page to process.
	 */
	getPage (pageName: string): HotPage
	{
		return (this.pages[pageName]);
	}

	/**
	 * Add a file.
	 */
	addFile (file: HotFile): void
	{
		let name: string = file.name;

		if (name === "")
			name = file.localFile;

		if (name === "")
			name = file.url;

		this.files[name] = file;
	}

	/**
	 * Get a file.
	 */
	getFile (name: string): HotFile
	{
		if (this.files[name] == null)
			throw new Error (`Unable to find file ${name}`);

		return (this.files[name]);
	}

	/** 
	 * Keep the context the object is currently in.
	 * 
	 * @param func The document element's id.
	 * @param context The object to remain in context.
	 * @param [val=undefined] An additional value to pass to the context.
	 * @return The returned result from the function func.
	 */
	static keepContext(func: Function, context: any, val?: any): any
	{
		var objReturn = function()
			{
				var aryArgs = Array.prototype.slice.call(arguments);

				if (val != undefined)
					aryArgs.push(val);

				if (context == null)
					return func.apply(this, aryArgs);
				else
					return func.apply(context, aryArgs);
			};

		return objReturn;
	}

	/**
	 * Add and register a component.
	 */
	addComponent (ComponentType: (new  (copy: IHotComponent | HotStaq, api?: HotAPI) => HotComponent), api: HotAPI = null, 
		elementOptions: ElementDefinitionOptions = undefined): void
	{
		let tempApi = this.api
		
		if (api != null)
			tempApi = api;

		let tempComponentObj = new ComponentType (this, tempApi);

		if (this.components[tempComponentObj.tag] != null)
			throw new Error (`Component ${tempComponentObj.tag} already exists!`);

		this.components[tempComponentObj.tag] = { componentType: ComponentType, processor: this, api: tempApi };
		this.registerComponent (tempComponentObj.tag, elementOptions);
	}

	/**
	 * Correct any HTML prior to DOM parsing. This only accounts for <tr> currently.
	 */
	protected static fixHTML (str: string): { fixedStr: string, querySelector: string; }
	{
		// Take into account the difference between XML and HTML.
		const tempStr: string = str.replace(/ \/>/g, '>').replace(
			/(<(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr).*?>)/g, '$1</$2>');
		const parsedXML = new DOMParser ().parseFromString (`<xml>${tempStr}</xml>`, "text/xml");
		let querySelector: string = "";

		if (parsedXML.documentElement.children.length > 0)
		{
			const tagName: string = parsedXML.documentElement.children[0].tagName.toLowerCase ();

			if (tagName === "tr")
			{
				str = `<table>${str}</table>`;
				querySelector = "tbody";
			}

			if (tagName === "th")
			{
				str = `<table>${str}</table>`;
				querySelector = tagName;
			}
		}

		return ({ fixedStr: str, querySelector: querySelector });
	}

	/**
	 * Register a component for use as a HTML tag.
	 */
	protected registerComponent (tag: string, elementOptions: ElementDefinitionOptions = undefined): void
	{
		if ((tag == null) || (tag === ""))
			throw new Error (`All components must have a tag!`);

		if (customElements.get (tag) !== undefined)
		{
			/// @fixme This element has already been defined. Should this throw an error or warning? I don't think it should...

			return;
		}

		let processorComponents = this.components;

		customElements.define (tag, class extends HTMLElement
			{
				/**
				 * The connected HotComponent.
				 */
				component: HotComponent;
			
				constructor ()
				{
					super ();

					let componentInfo = processorComponents[tag];
					this.component = new componentInfo.componentType (componentInfo.processor, componentInfo.api);
				}
			
				/**
				 * This helps parse <tr> and other tags that do not have a parent.
				 * 
				 * Thanks Brandon McConnell!
				 * 
				 * From: https://stackoverflow.com/questions/67313479/make-parsefromstring-parse-without-validation
				 * 
				 * @todo May remove this as it does not seem to work well in a lot of edge cases.
				 */
				protected looseParseFromString (parser: DOMParser, str: string) {
					str = str.replace(/ \/>/g, '>').replace(/(<(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr).*?>)/g, '$1</$2>');
					const xdom = parser.parseFromString('<xml>'+str+'</xml>', 'text/xml');
					const hdom = parser.parseFromString('', 'text/html');
					for (let elem of Array.from(xdom.documentElement.children)) {
						/// @ts-ignore
						hdom.body.appendChild(elem);
					}
					for (let elem of Array.from(hdom.querySelectorAll('area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'))) {
						/// @ts-ignore
						elem.outerHTML = '<'+elem.outerHTML.slice(1).split('<')[0];
					}
					return hdom;
				}

				get observedAttributes(): string[] /// @fixme Does this REALLY have to be static? Awful if it does...
				{
					return (this.component.observedAttributes);
				}
			
				async connectedCallback ()
				{
					let compHtmlElement = this;
			
					// @ts-ignore
					compHtmlElement.hotComponent = this.component;
			
					this.component.htmlElements = [compHtmlElement];
					this.component.inner = this.innerHTML;
			
					if (this.component.handleAttributes != null)
						await this.component.handleAttributes (this.attributes);
					else
					{
						for (let iIdx = 0; iIdx < this.attributes.length; iIdx++)
						{
							const attr: Attr = this.attributes[iIdx];
							const attrName: string = attr.name.toLowerCase ();
							const attrValue: string = attr.value;
			
							if (attrName === "id")
								this.component.name = attrValue;
			
							if (attrName === "name")
								this.component.name = attrValue;
			
							if (attrName === "value")
								this.component.value = attrValue;
			
							if (attrName.indexOf ("hot-") > -1)
							{
								const attrTempName: string = attrName.substring (4);
			
								/// @ts-ignore
								this.component[attrTempName] = attrValue;
							}
						}
					}
			
					if (this.component.onPreOutput != null)
					{
						if (await this.component.onPreOutput () === false)
							return;
					}
			
					let outputs = await this.component.output ();
			
					if (this.component.onPostOutput != null)
						outputs = await this.component.onPostOutput (outputs);
			
					let componentOutputs: HotComponentOutput[] = [];
			
					if (typeof (outputs) === "string")
						componentOutputs.push ({ html: outputs });
					else
					{
						if (outputs instanceof Array)
							componentOutputs = outputs;
						else
							componentOutputs = [outputs];
					}
			
					for (let iKdx = 0; iKdx < componentOutputs.length; iKdx++)
					{
						let output = componentOutputs[iKdx];
						let htmlStr: string = output.html;
						let addFunctionsTo: string = "";
			
						if (output.addFunctionsTo != null)
							addFunctionsTo = output.addFunctionsTo;
			
						let str: string = HotFile.parseContent (htmlStr, true, { "outputCommands": false });
			
						if (this.component.onParsed != null)
							str = await this.component.onParsed (str);
			
						let htmlHandler: { fixedStr: string, querySelector: string; } = { fixedStr: "", querySelector: "" };
			
						if (this.component.onFixHTML != null)
							htmlHandler = await this.component.onFixHTML (str);
						else
							htmlHandler = HotStaq.fixHTML (str);
			
						let newDOM: Document = null;
						let newObj: HTMLElement = null;
			
						if (this.component.onParseDOM != null)
							newDOM = await this.component.onParseDOM (htmlHandler.fixedStr);
						else
						{
							/// @ts-ignore
							//newDOM = this.looseParseFromString (new DOMParser (), str);
							newDOM = new DOMParser ().parseFromString (htmlHandler.fixedStr, "text/html");
						}
			
						if (newDOM.body.children.length < 1)
							throw new Error (`No component output from ${this.component.name}`);
			
						if (newDOM.body.children.length > 1)
						{
							let throwErr: boolean = true;
			
							for (let iIdx = 0; iIdx < newDOM.body.children.length; iIdx++)
							{
								let child = newDOM.body.children[iIdx];
			
								if (child instanceof HTMLElement)
								{
									if (child.tagName.toLowerCase () === "parsererror")
									{
										newObj = child;
										throwErr = false;
			
										break;
									}
								}
							}
			
							if (throwErr === true)
								throw new Error (`Only a single html element can come from component ${this.component.name}, multiple elements were detected.`);
						}

						if (htmlHandler.querySelector === "")
							newObj = (<HTMLElement>newDOM.body.children[0]);
						else
							newObj = newDOM.querySelector (htmlHandler.querySelector);

						let childrenToReadd: Node[] = [];
			
						// Save the children from being replaced.
						for (let iIdx = (this.children.length - 1); iIdx > -1; iIdx--)
						{
							let child: Node = this.children[iIdx];
			
							childrenToReadd.push (this.removeChild (child));
						}
			
						this.replaceWith (newObj);
			
						if (this.component.click != null)
							newObj.onclick = this.component.click.bind (this.component);
			
						for (let key in this.component.events)
						{
							let event = this.component.events[key];
			
							// @ts-ignore
							newObj.addEventListener (event.type, event.func, event.options);
						}
			
						let objectFunctions: string[] = Object.getOwnPropertyNames (this.component.constructor.prototype);
			
						// Associate any functions to the newly created element.
						for (let iIdx = 0; iIdx < objectFunctions.length; iIdx++)
						{
							let objFunc: string = objectFunctions[iIdx];
			
							if (objFunc === "constructor")
								continue;
			
							// @ts-ignore
							let prop = this.component[objFunc];
			
							if (typeof (prop) === "function")
							{
								let isNewFunction: boolean = true;
			
								// Go through each function in the base HotComponent and see 
								// if there's any matches. If there's a match, that means 
								// we're trying to add an existing function, and we don't
								// wanna do that. Skip it.
								for (let key2 in HotComponent.prototype)
								{
									if (objFunc === key2)
									{
										isNewFunction = false;
			
										break;
									}
								}
			
								if (isNewFunction === true)
								{
									// @ts-ignore
									newObj[objFunc] = HotStaq.keepContext (this.component[objFunc], this.component);
			
									if (addFunctionsTo !== "")
									{
										let query: HTMLElement = document.querySelector (addFunctionsTo);
			
										// @ts-ignore
										query[objFunc] = HotStaq.keepContext (this.component[objFunc], this.component);
									}
								}
							}
						}
			
						if (this.component.onPrePlace != null)
							newObj = await this.component.onPrePlace (newObj);
			
						let compHtmlElement2: HTMLElement = await this.component.onCreated (newObj);
			
						if (this.component.onParentPlace != null)
						{
							// @ts-ignore
							compHtmlElement2.onParentPlace = this.component.onParentPlace;
						}
			
						// @ts-ignore
						compHtmlElement2.hotComponent = this.component;
						this.component.htmlElements.push (compHtmlElement2);
			
						if (output.parentSelector != null)
						{
							let parentNode: Node = document.querySelector (output.parentSelector);
			
							compHtmlElement2.parentElement.removeChild (compHtmlElement2);
							parentNode.appendChild (compHtmlElement2);
			
							// @ts-ignore
							if (compHtmlElement2.onParentPlace != null)
							{
								// @ts-ignore
								await compHtmlElement2.hotComponent.onParentPlace (parentNode, compHtmlElement2);
							}
						}
			
						if (output.placeHereParent != null)
						{
							let parentNodeToCheck = compHtmlElement2.parentNode;
							let parentNodeCheckCounter: number = 0;
			
							while (parentNodeCheckCounter < 10) /// @todo Make this controllable with a variable from the component.
							{
								if (parentNodeToCheck == null)
									break;
			
								if (parentNodeToCheck instanceof HTMLHtmlElement)
									break;
			
								// If the hot-place-here exists, place the children there. If not, place it under the 
								// new element.
								let placeHereArray = parentNodeToCheck.querySelectorAll (`hot-place-here[name="${output.placeHereParent}"]`);
			
								if (placeHereArray.length > 0)
								{
									let placeHere = placeHereArray[0];
			
									compHtmlElement2.parentNode.removeChild (compHtmlElement2);
									placeHere.appendChild (compHtmlElement2);
			
									// @ts-ignore
									if (compHtmlElement2.onParentPlace != null)
									{
										// @ts-ignore
										await compHtmlElement2.hotComponent.onParentPlace (placeHere, compHtmlElement2);
									}
			
									break;
								}
			
								if (placeHereArray.length < 1)
								{
									let placeHereAttrArray = parentNodeToCheck.querySelectorAll (`[hot-place-here="${output.placeHereParent}"]`);
			
									if (placeHereAttrArray.length > 0)
									{
										let placeHere = placeHereAttrArray[0];
										compHtmlElement2.parentNode.removeChild (compHtmlElement2);
										placeHere.appendChild (compHtmlElement2);
			
										// @ts-ignore
										if (compHtmlElement2.onParentPlace != null)
										{
											// @ts-ignore
											await compHtmlElement2.hotComponent.onParentPlace (placeHere, compHtmlElement2);
										}
			
										break;
									}
								}
			
								parentNodeToCheck = parentNodeToCheck.parentNode;
								parentNodeCheckCounter++;
							}
						}
			
						// Append the children to the newly created HTML element.
						for (let iIdx = 0; iIdx < childrenToReadd.length; iIdx++)
						{
							const child: Node = childrenToReadd[iIdx];
			
							compHtmlElement2.appendChild (child);
			
							// @ts-ignore
							if (child.onParentPlace != null)
							{
								// @ts-ignore
								await child.hotComponent.onParentPlace (compHtmlElement2, child);
							}
						}
			
						if (this.component.onPostPlace != null)
						{
							/// @ts-ignore
							compHtmlElement2 = await this.component.onPostPlace (compHtmlElement2.parentNode, compHtmlElement2);
						}
					}
				}
			}, elementOptions);
	}

	/**
	 * Add a new HTML element(s) to the current document.
	 */
	static addHtml (parent: string | HTMLElement, html: string | HTMLElement): HTMLElement | HTMLElement[]
	{
		let foundParent: HTMLElement = null;

		if (typeof (parent) === "string")
			foundParent = document.querySelector (parent);
		else
			foundParent = parent;

		if (foundParent == null)
			throw new Error (`Unable to find parent ${parent}!`);

		let result: HTMLElement = null;

		if (typeof (html) === "string")
		{
			let htmlHandler = HotStaq.fixHTML (html);
			let newDOM: Document = new DOMParser ().parseFromString (htmlHandler.fixedStr, "text/html");
			let children: any = null;

			if (htmlHandler.querySelector === "")
				children = newDOM.body.children;
			else
				children = newDOM.querySelector (htmlHandler.querySelector).children;

			let results: HTMLElement[] = [];

			for (let iIdx = 0; iIdx < children.length; iIdx++)
			{
				let child: HTMLElement = (<HTMLElement>children[iIdx]);

				results.push (foundParent.appendChild (child));
			}

			return (results);
		}
		else
			result = foundParent.appendChild (html);

		return (result);
	}

	/**
	 * Check if a HotSite's name is valid.
	 */
	static checkHotSiteName (hotsiteName: string, throwException: boolean = false): boolean
	{
		let throwTheException = () =>
			{
				if (throwException === true)
					throw new Error (`HotSite ${hotsiteName} has an invalid name! The name cannot be empty and must have a valid NPM module name.`);
			};

		let results = validateModuleName (hotsiteName);

		if (results.errors != null)
		{
			if (results.errors.length > 0)
				throwTheException ();
		}

		return (true);
	}

	/**
	 * In the supplied content, replace a key in a ${KEY} with a value.
	 * 
	 * @returns The content with the correct values.
	 */
	static replaceKey (content: string, key: string, value: string): string
	{
		const finalStr: string = content.replace (new RegExp (`\\$\\{${key}\\}`, "g"), value);

		return (finalStr);
	}

	/**
	 * Get a value from a HotSite object.
	 * 
	 * @returns Returns the value from the hotsite object. Returns null if it doesn't exist.
	 */
	static getValueFromHotSiteObj (hotsite: HotSite, params: string[]): any
	{
		let value: any = null;

		if (hotsite != null)
		{
			let prevValue: any = hotsite;

			// Go through each object in the list of parameters and 
			// get the value of the final parameter.
			for (let iIdx = 0; iIdx < params.length; iIdx++)
			{
				let param: string = params[iIdx];

				if (prevValue[param] == null)
				{
					prevValue = null;

					break;
				}

				prevValue = prevValue[param];
			}

			if (prevValue != null)
				value = prevValue;
		}

		return (value);
	}

	/**
	 * Process a HotSite.
	 */
	async processHotSite (): Promise<void>
	{
		HotStaq.checkHotSiteName (this.hotSite.name, true);

		let routes = this.hotSite.routes;
		let testerUrl: string = "http://127.0.0.1:8182";
		let tester: HotTester = null;
		let driver: HotTestDriver = null;

		if (HotStaq.isWeb === false)
		{
			if (this.mode === DeveloperMode.Development)
			{
				if (this.hotSite.testing != null)
				{
					let setupTester = (parentObj: any) => 
						{
							let createNewTester: boolean = true;
		
							if (parentObj.createNewTester != null)
								createNewTester = parentObj.createNewTester;
		
							let testerName: string = "Tester";
		
							if (parentObj.tester != null)
								testerName = parentObj.tester;
		
							if (parentObj.testerName != null)
								testerName = parentObj.testerName;
		
							if (createNewTester === true)
							{
								/// @fixme Find a way to securely allow devs to use their own drivers and testers...
								/// @fixme Hack for dealing with WebPack's bs.
								HotTesterMocha = require ("./HotTesterMocha").HotTesterMocha;
								HotTesterMochaSelenium = require ("./HotTesterMochaSelenium").HotTesterMochaSelenium;
								HotTestSeleniumDriver = require ("./HotTestSeleniumDriver").HotTestSeleniumDriver;
		
								if (parentObj.testerAPIUrl === "")
									testerUrl = parentObj.testerAPIUrl;
		
								if (parentObj.driver === "HotTestSeleniumDriver")
									driver = new HotTestSeleniumDriver ();
		
								if (parentObj.tester === "HotTesterMocha")
									tester = new HotTesterMocha (this, testerName, testerUrl, driver);
		
								if (parentObj.tester === "HotTesterMochaSelenium")
									tester = new HotTesterMochaSelenium (this, testerName, testerUrl);
							}
							else
								tester = this.testers[testerName];

							if (tester.driver == null)
								throw new Error (`Tester ${testerName} does not have a driver set!`);

							if (parentObj.commandDelay != null)
								tester.driver.commandDelay = parentObj.commandDelay;
						};

					if (this.hotSite.testing.web != null)
						setupTester (this.hotSite.testing.web);

					if (this.hotSite.testing.api != null)
						setupTester (this.hotSite.testing.api);
				}
			}
		}

		if (routes != null)
		{
			for (let key in routes)
			{
				let route: HotSiteRoute = routes[key];
				let file: HotFile = new HotFile (route);
				let page: HotPage = new HotPage ({
						processor: this,
						name: route.name || "",
						route: key,
						files: [file]
					});

				if (tester != null)
				{
					if (this.mode === DeveloperMode.Development)
					{
						let mapName: string = route.name;
						let testMap: HotTestMap = null;

						if (route.map != null)
						{
							if (typeof (route.map) === "string")
							{
								if (tester.testMaps[route.map] == null)
									throw new Error (`Test map ${route.map} does not exist!`);

								tester.testMaps[mapName] = tester.testMaps[route.map];
							}
							else
							{
								testMap = new HotTestMap ();
								let destinations: HotTestDestination[] | { [name: string]: HotTestDestination } = null;

								if (route.map instanceof Array)
								{
									destinations = [];

									for (let iIdx = 0; iIdx < route.map.length; iIdx++)
									{
										let dest = route.map[iIdx];

										destinations.push (new HotTestDestination (dest));
									}
								}
								else
								{
									destinations = {};

									for (let key2 in route.map)
									{
										let dest = route.map[key2];

										destinations[key2] = new HotTestDestination (dest);
									}
								}

								testMap.destinations = destinations;
							}

							tester.testMaps[mapName] = testMap;
						}

						if (route.destinationOrder != null)
							tester.testMaps[mapName].destinationOrder = route.destinationOrder;
					}
				}

				this.addPage (page);
			}
		}

		if (this.hotSite.apis != null)
		{
			for (let key in this.hotSite.apis)
			{
				let api = this.hotSite.apis[key];

				if (api.map == null)
					continue;

				if (HotStaq.isWeb === false)
				{
					if (this.mode === DeveloperMode.Development)
					{
						let mapName: string = key;
						let testMap: HotTestMap = new HotTestMap ();

						testMap.destinations = [];

						for (let iIdx = 0; iIdx < api.map.length; iIdx++)
						{
							let map: string = api.map[iIdx];

							testMap.destinations.push (new HotTestDestination (map));
						}

						if (tester == null)
							throw new Error (`A tester was not created first! You must specify one in the CLI or in HotSite.json.`);

						tester.testMaps[mapName] = testMap;
					}
				}
			}
		}

		/// @fixme Allow this to work for server-side as well...
		if (HotStaq.isWeb === true)
		{
			for (let key in this.hotSite.components)
			{
				let component = this.hotSite.components[key];
				let componentUrl: string = component.url;

				/// @fixme Create unit test for fetching, loading, and registering.
				let res: any = await fetch (componentUrl);
				let ComponentClass = eval (res);

				this.addComponent (ComponentClass);
			}
		}

		if (this.hotSite.routes == null)
			this.hotSite.routes = {};

		let disableFileLoading: boolean = false;

		if (this.hotSite.disableFileLoading != null)
			disableFileLoading = this.hotSite.disableFileLoading;

		if (disableFileLoading === false)
			await this.loadHotFiles (this.hotSite.files);
		else
			this.logger.verbose (`Hotsite has file loading disabled...`);

		if (tester != null)
			this.addTester (tester);

		this.logger.verbose (`Processed HotSite ${this.hotSite.name}`);
	}

	/**
	 * Load from a HotSite.json file. Be sure to load and attach any testers before 
	 * loading a HotSite.
	 */
	async loadHotSite (path: string): Promise<void>
	{
		let jsonStr: string = "";

		if (HotStaq.isWeb === true)
		{
			this.logger.info (`Downloading HotSite ${path}`);

			let res: any = await fetch (path);

			this.logger.info (`Downloaded site ${path}`);

			jsonStr = res.text ();
		}
		else
		{
			path = ppath.normalize (path);

			this.logger.info (`Accessing HotSite ${path}`);

			jsonStr = await new Promise (
				(resolve: any, reject: any): void =>
				{
					fs.readFile (path, (err: NodeJS.ErrnoException, data: Buffer): void =>
						{
							if (err != null)
								throw err;
	
							let content: string = data.toString ();

							this.logger.info (`Accessed site ${path}`);
	
							resolve (content);
						});
				});
		}

		this.hotSite = JSON.parse (jsonStr);
		this.hotSite.hotsitePath = path;
	}

	/**
	 * Load an array of files. If a file already has content, it will not be reloaded 
	 * unless forceContentLoading is set to true.
	 */
	async loadHotFiles (files: { [name: string]: { url?: string; localFile?: string; content?: string; } }, 
			forceContentLoading: boolean = false): Promise<void>
	{
		this.logger.verbose (`Loading Hott files...`);

		for (let key in files)
		{
			let file = files[key];
			let newFile: HotFile = null;

			if (HotStaq.isWeb === true)
			{
				newFile = new HotFile ({
						"name": key
					});
			}
			else
			{
				newFile = new HotFile ({
						"name": key
					});
			}

			if (file.url != null)
				newFile.url = file.url;

			if (HotStaq.isWeb === false)
			{
				if (file.localFile != null)
					newFile.localFile = file.localFile;
			}

			let loadContent: boolean = true;

			if (file.content != null)
			{
				newFile.content = file.content;
				loadContent = false;
			}

			if (forceContentLoading === true)
				loadContent = true;

			if (loadContent === true)
			{
				let filepath: string = "";

				if (newFile.url !== "")
					filepath = newFile.url;

				if (newFile.localFile !== "")
					filepath = newFile.localFile;

				this.logger.verbose (`Loading Hott file: ${filepath}`);
				await newFile.load ();
				this.logger.verbose (`Finished loading Hott file: ${filepath}`);
			}

			this.addFile (newFile);
		}

		this.logger.verbose (`Finished loading Hott files...`);
	}

	/**
	 * Generate the content to send to a client.
	 */
	generateContent (routeKey: string, name: string = "", url: string = "./",
			jsSrcPath: string = "./js/HotStaq.min.js", passArgs: boolean = true, 
			args: any = null): string
	{
		let apiScripts: string = "";
		let apiCode: string = "";
		let publicKeys: string = "";

		/// @todo Optimize this function as much as possible.

		// Load the API string.
		if (this.hotSite != null)
		{
			if (this.hotSite.server.globalApi != null)
			{
				if (this.hotSite.server.globalApi !== "")
				{
					const globalApi = this.hotSite.apis[this.hotSite.server.globalApi];

					if (globalApi == null)
						this.logger.warning (`API with name ${this.hotSite.server.globalApi} doesn't exist!`);
					else
					{
						let sendJSContent: boolean = true;

						if (globalApi.jsapi == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${this.hotSite.server.globalApi} doesn't have a jsapi set. Will not send js content to client.`);
						}

						if (globalApi.libraryName == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${this.hotSite.server.globalApi} doesn't have a libraryName set. Will not send js content to client.`);
						}

						if (globalApi.apiName == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${this.hotSite.server.globalApi} doesn't have a apiName set. Will not send js content to client.`);
						}

						if (sendJSContent === true)
						{
							apiScripts += `\t<script type = "text/javascript" src = "${globalApi.jsapi}"></script>\n`;

							let baseUrl: string = "\"\"";

							if (globalApi.url != null)
								baseUrl = `\"${globalApi.url}\"`;

							if (this.api != null)
								baseUrl = `\"${this.api.baseUrl}\"`;

							let tempAPIContent: string = this.apiContent;
							tempAPIContent = tempAPIContent.replace (/\%api\_name\%/g, globalApi.apiName);
							tempAPIContent = tempAPIContent.replace (/\%api\_exported\_name\%/g, globalApi.libraryName);
							tempAPIContent = tempAPIContent.replace (/\%base\_url\%/g, baseUrl);

							apiCode += tempAPIContent;
						}
					}
				}
			}

			if (this.hotSite.apis != null)
			{
				let route = this.hotSite.routes[routeKey];

				if (route != null)
				{
					if (route.api != null)
					{
						let api = this.hotSite.apis[route.api];

						if (api == null)
							throw new Error (`Unable to find API ${route.api}`);

						let sendJSContent: boolean = true;

						if (api.jsapi == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${route.api} doesn't have a jsapi set. Will not send js content to client.`);
						}

						if (api.libraryName == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${route.api} doesn't have a libraryName set. Will not send js content to client.`);
						}

						if (api.apiName == null)
						{
							sendJSContent = false;
							this.logger.warning (`API with name ${route.api} doesn't have a apiName set. Will not send js content to client.`);
						}

						if (sendJSContent === true)
						{
							let jsapipath = api.jsapi;
							apiScripts += `\t<script type = "text/javascript" src = "${jsapipath}"></script>\n`;

							let baseUrl: string = "\"\"";

							if (api.url != null)
								baseUrl = `\"${api.url}\"`;

							if (this.api != null)
								baseUrl = `\"${this.api.baseUrl}\"`;

							let tempAPIContent: string = this.apiContent;
							tempAPIContent = tempAPIContent.replace (/\%api\_name\%/g, api.apiName);
							tempAPIContent = tempAPIContent.replace (/\%api\_exported\_name\%/g, api.libraryName);
							tempAPIContent = tempAPIContent.replace (/\%base\_url\%/g, baseUrl);

							apiCode += tempAPIContent;
						}
					}
				}
			}

			if (this.hotSite.server != null)
			{
				if (this.hotSite.server.jsSrcPath != null)
					jsSrcPath = this.hotSite.server.jsSrcPath;
			}

			if (this.hotSite.publicKeys != null)
			{
				for (let key in this.hotSite.publicKeys)
				{
					let secret = this.hotSite.publicKeys[key];
					let value: string = undefined;

					if (typeof (secret) === "string")
						value = JSON.stringify (secret);
					else
					{
						if (HotStaq.isWeb === false)
						{
							if (this.api != null)
							{
								if (this.api.connection == null)
									throw new Error (`Cannot pass secrets from the API if there's no connection!`);

								let serverConn: HotServer = (<HotServer>this.api.connection);

								if (secret.passSecretFromAPI != null)
									value = JSON.stringify (serverConn.secrets[key]);
							}

							if (secret.env != null)
							{
								/// @fixme @secvul Is this a security vulnerability? Need to verify that 
								/// only the server has access to this. At this point, I think only the 
								/// server has access.
								const envKey: string = secret.env;

								value = JSON.stringify (process.env[envKey]);
							}
						}
					}

					publicKeys += `processor.publicKeys["${key}"] = ${value};\n`;
				}
			}
		}

		let content: string = this.pageContent;
		let fixContent = (tempContent: string) =>
			{
				let developerModeStr: string = "";
				let testerAPIStr: string = "";

				if (this.mode === DeveloperMode.Development)
				{
					developerModeStr = `tempMode = HotStaqWeb.DeveloperMode.Development;`;

					if (this.hotSite != null)
					{
						if (this.hotSite.testing != null)
						{
							if (this.hotSite.testing.web != null)
							{
								testerAPIStr = this.testerApiContent;

								if (this.hotSite.testing.web.testerAPIUrl == null)
									this.hotSite.testing.web.testerAPIUrl = "http://127.0.0.1:8182";

								testerAPIStr = testerAPIStr.replace (/\%base\_tester\_url\%/g, `\"${this.hotSite.testing.web.testerAPIUrl}\"`);
							}
						}
					}
				}

				let loadFiles: string = "";

				if (Object.keys (this.files).length > 0)
				{
					loadFiles += `var files = {};\n\n`;

					for (let key in this.files)
					{
						let file = this.files[key];
						let fileUrl: string = `"${file.url}"`;
						let fileContent: string = "";

						if (file.content !== "")
						{
							let escapedContent: string = JSON.stringify (file.content);

							// Find any script tags and interrupt them so the HTML parsers 
							// don't get confused.
							escapedContent = escapedContent.replace (new RegExp ("\\<script", "gmi"), "<scr\" + \"ipt");
							escapedContent = escapedContent.replace (new RegExp ("\\<\\/script", "gmi"), "</scr\" + \"ipt");

							fileContent = `, "content": ${escapedContent}`;
						}

						loadFiles += `\t\t\tfiles["${key}"] = { "url": ${fileUrl}${fileContent} };\n`;
					}

					loadFiles += `\t\t\tpromises.push (processor.loadHotFiles (files));\n`;
				}

				tempContent = tempContent.replace (/\%title\%/g, name);

				if (passArgs === true)
					tempContent = tempContent.replace (/\%args\%/g, "Hot.Arguments");

				if (args != null)
					tempContent = tempContent.replace (/\%args\%/g, JSON.stringify (args));

				let testerMap: string = routeKey;
				let testerUrl: string = "";
				let testerLaunchpadUrl: string = "";
				let testerName: string = "Tester";

				if (this.hotSite != null)
				{
					if (this.hotSite.testing != null)
					{
						if (this.hotSite.testing.web != null)
						{
							if (this.hotSite.testing.web.tester != null)
								testerName = this.hotSite.testing.web.tester;

							if (this.hotSite.testing.web.testerName != null)
								testerName = this.hotSite.testing.web.testerName;

							if (this.hotSite.testing.web.testerAPIUrl != null)
								testerUrl = this.hotSite.testing.web.testerAPIUrl;

							if (this.hotSite.testing.web.launchpadUrl != null)
								testerLaunchpadUrl = this.hotSite.testing.web.launchpadUrl;
						}
					}

					if (this.hotSite.routes != null)
					{
						if (this.hotSite.routes[routeKey] != null)
						{
							let route = this.hotSite.routes[routeKey];
							testerMap = route.name;
						}
					}
				}

				tempContent = tempContent.replace (/\%hotstaq\_js\_src\%/g, jsSrcPath);
				tempContent = tempContent.replace (/\%developer\_mode\%/g, developerModeStr);
				tempContent = tempContent.replace (/\%tester\_api\%/g, testerAPIStr);
				tempContent = tempContent.replace (/\%apis\_to\_load\%/g, apiScripts);
				tempContent = tempContent.replace (/\%load\_hot\_site\%/g, ""); /// @fixme Should this only be done server-side?
				tempContent = tempContent.replace (/\%load\_files\%/g, loadFiles);
				tempContent = tempContent.replace (/\%api\_code\%/g, apiCode);
				tempContent = tempContent.replace (/\%public\_secrets\%/g, publicKeys);
				tempContent = tempContent.replace (/\%url\%/g, url);
				tempContent = tempContent.replace (/\%tester\_name\%/g, `"${testerName}"`);
				tempContent = tempContent.replace (/\%tester\_map\%/g, `"${testerMap}"`);
				tempContent = tempContent.replace (/\%tester\_api\_base\_url\%/g, `"${testerUrl}"`);
				tempContent = tempContent.replace (/\%tester\_launchpad\_url\%/g, `"${testerLaunchpadUrl}"`);

				return (tempContent);
			};
		content = fixContent (content);

		return (content);
	}

	/**
	 * Create the Express routes from the given pages. Be sure to load the 
	 * pages first before doing this. This method is meant to be used for 
	 * customized Express applications. If you wish to use the loaded routes 
	 * from this HotStaq object with HotHTTPServer, be sure to use 
	 * the loadHotSite method in HotHTTPServer.
	 */
	createExpressRoutes (expressApp: any, jsSrcPath: string = "./js/HotStaq.min.js"): void
	{
		for (let key in this.pages)
		{
			let page: HotPage = this.pages[key];
			const content: string = this.generateContent (page.route, page.name, page.files[0].url, jsSrcPath);

			expressApp.get (page.route, (req: any, res: any) =>
				{
					this.logger.verbose (`Sending custom Express content.`);
					res.status (200).send (content);
				});
		}
	}

	/**
	 * Add a tester for use later.
	 */
	addTester (tester: HotTester): void
	{
		this.testers[tester.name] = tester;
	}

	/**
	 * Get the list of maps for testing from the HotSite.
	 */
	getWebTestingMaps (): string[]
	{
		if (this.hotSite == null)
			throw new Error ("No HotSite was loaded!");

		if (this.hotSite.testing == null)
			throw new Error ("The HotSite does not have a testing object!");

		if (this.hotSite.testing.web == null)
			throw new Error ("The HotSite does not have a testing web object!");

		if (this.hotSite.testing.web.maps == null)
			throw new Error ("The HotSite testing object does not have any maps!");

		return (this.hotSite.testing.web.maps);
	}

	/**
	 * Get the list of maps for testing from the HotSite.
	 */
	getAPITestingMaps (): string[]
	{
		if (this.hotSite == null)
			throw new Error ("No HotSite was loaded!");

		if (this.hotSite.testing == null)
			throw new Error ("The HotSite does not have a testing object!");

		if (this.hotSite.testing.api == null)
			throw new Error ("The HotSite does not have a testing api object!");

		if (this.hotSite.testing.api.maps == null)
			throw new Error ("The HotSite testing object does not have any maps!");

		return (this.hotSite.testing.api.maps);
	}

	/**
	 * Get a route's key from a route's name.
	 */
	getRouteKeyFromName (name: string): string
	{
		let foundKey: string = "";

		if (this.hotSite != null)
		{
			if (this.hotSite.routes != null)
			{
				for (let key in this.hotSite.routes)
				{
					let route: HotSiteRoute = this.hotSite.routes[key];

					if (route.name === name)
					{
						foundKey = key;

						break;
					}
				}
			}
		}

		return (foundKey);
	}

	/**
	 * Get a route from a route's name.
	 */
	getRouteFromName (name: string): HotSiteRoute
	{
		let foundRoute: HotSiteRoute = null;
		let foundKey: string = this.getRouteKeyFromName (name);

		if (foundKey !== "")
			foundRoute = this.hotSite.routes[foundKey];

		return (foundRoute);
	}

	/**
	 * Execute tests.
	 * 
	 * @param testerName The tester to use to execute tests.
	 * @param mapName The map or maps to use to navigate through tests.
	 */
	async executeTests (testerName: string, mapName: string): Promise<void>
	{
		let tester: HotTester = this.testers[testerName];

		if (tester == null)
			throw new Error (`Unable to execute tests. Tester ${testerName} does not exist!`);

		return (tester.execute (mapName));
	}

	/**
	 * Execute all web tests from the HotSite testing web object.
	 * 
	 * @param testerName The tester to use to execute tests.
	 */
	async executeAllWebTests (testerName: string): Promise<void>
	{
		let maps: string[] = this.getWebTestingMaps ();
		let tester: HotTester = this.testers[testerName];

		if (tester == null)
			throw new Error (`Unable to execute tests. Tester ${testerName} does not exist!`);

		for (let iIdx = 0; iIdx < maps.length; iIdx++)
		{
			let mapName: string = maps[iIdx];

			await this.executeTests (testerName, mapName);
		}
	}

	/**
	 * Execute all api tests from the HotSite testing api object.
	 * 
	 * @param testerName The tester to use to execute tests.
	 */
	async executeAllAPITests (testerName: string): Promise<void>
	{
		let maps: string[] = this.getAPITestingMaps ();
		let tester: HotTester = this.testers[testerName];

		if (tester == null)
			throw new Error (`Unable to execute tests. Tester ${testerName} does not exist!`);

		for (let iIdx = 0; iIdx < maps.length; iIdx++)
		{
			let mapName: string = maps[iIdx];

			await this.executeTests (testerName, mapName);
		}
	}

	/**
	 * Process a page and get the result.
	 */
	async process (pageName: string, args: any = null): Promise<string>
	{
		let page: HotPage = this.getPage (pageName);
		let result: string = await page.process (args);

		return (result);
	}

	/**
	 * Process a local file and get the result.
	 */
	static async processLocalFile (localFilepath: string, name: string = localFilepath, args: any = null): Promise<string>
	{
		let processor: HotStaq = new HotStaq ();
		let file: HotFile = new HotFile ({
			"localFile": localFilepath
		});
		await file.load ();
		let page: HotPage = new HotPage ({
				"processor": processor,
				"name": name,
				"files": [file]
			});
		processor.addPage (page);
		let result: string = await processor.process (name, args);

		return (result);
	}

	/**
	 * Process a url and get the result.
	 */
	static async processUrl (options: HotStartOptions): Promise<string>
	{
		let file: HotFile = new HotFile ({
			"url": options.url
		});

		await file.load ();
		let page: HotPage = new HotPage ({
				"processor": options.processor,
				"name": options.name,
				"files": [file],
				"testerName": options.testerName,
				"testerMap": options.testerMap
			});
		options.processor.addPage (page);
		let result: string = await options.processor.process (options.name, options.args);

		return (result);
	}

	/**
	 * Process content and get the result.
	 */
	static async processContent (options: HotStartOptions): Promise<string>
	{
		let file: HotFile = new HotFile ({
			"content": options.content
		});
		await file.load ();
		let page: HotPage = new HotPage ({
				"processor": options.processor,
				"name": options.name,
				"files": [file]
			});
		options.processor.addPage (page);
		let result: string = await options.processor.process (options.name, options.args);

		return (result);
	}

	/**
	 * When the window has finished loading, execute the function.
	 * This is meant for web browser use only.
	 */
	static onReady (readyFunc: () => void): void
	{
		if ((document.readyState === "complete") || (document.readyState === "interactive"))
			readyFunc ();
		else
			window.addEventListener ("load", readyFunc);
	}

	/**
	 * Replace the current HTML page with the output.
	 * This is meant for web browser use only.
	 */
	static async useOutput (output: string): Promise<void>
	{
		let parser = new DOMParser ();
		let child = parser.parseFromString (output, "text/html");
		let htmlObj: HTMLHtmlElement = document.getElementsByTagName('html')[0];

		htmlObj.innerHTML = child.getElementsByTagName('html')[0].innerHTML;

		// Thanks to newfurniturey at: 
		// https://stackoverflow.com/questions/22945884/domparser-appending-script-tags-to-head-body-but-not-executing
		let tmpScripts = document.getElementsByTagName('script');
		if (tmpScripts.length > 0) {
			// push all of the document's script tags into an array
			// (to prevent dom manipulation while iterating over dom nodes)
			let scripts: HTMLScriptElement[] = [];
			for (let i = 0; i < tmpScripts.length; i++) {
				scripts.push(tmpScripts[i]);
			}

			// iterate over all script tags and create duplicate tags for each
			for (let i = 0; i < scripts.length; i++) {
				let s: HTMLScriptElement = document.createElement('script');

				// add the new node to the page
				scripts[i].parentNode.appendChild(s);

				// remove the original (non-executing) node from the page
				scripts[i].parentNode.removeChild(scripts[i]);

				await new Promise<void> ((resolve2, reject2) =>
					{
						s.onload = () =>
							{
								resolve2 ();
							};

						let hasSrc: boolean = false;

						if (scripts[i].getAttribute ("src") != null)
						{
							if (scripts[i].getAttribute ("src") !== "")
							{
								s.setAttribute ("src", scripts[i].getAttribute ("src"));
								hasSrc = true;
							}
						}

						if (scripts[i].getAttribute ("type") != null)
						{
							if (scripts[i].getAttribute ("type") !== "")
								s.setAttribute ("type", scripts[i].getAttribute ("type"));
						}

						s.innerHTML = scripts[i].innerHTML;

						if (hasSrc === false)
							resolve2 ();
					});
			}
		}
	}

	/**
	 * Wait for testers to load.
	 * 
	 * @fixme This does not wait for ALL testers to finish loading. Only 
	 * the first one.
	 */
	static async waitForTesters (): Promise<void>
	{
		while (HotStaq.isReadyForTesting === false)
			await HotStaq.wait (10);

		if (HotStaq.onReadyForTesting != null)
			await HotStaq.onReadyForTesting ();
	}

	/**
	 * Setup the testers api, if any.
	 */
	static setupTesters (processor: HotStaq, options: HotStartOptions)
	{
		if (processor.mode === DeveloperMode.Development)
		{
			if (processor.testerAPI == null)
			{
				if (options.testerAPIBaseUrl == null)
					options.testerAPIBaseUrl = "";

				if (options.testerAPIBaseUrl === "")
					options.testerAPIBaseUrl = "http://127.0.0.1:8182";

				let client: HotClient = new HotClient (processor);
				let testerAPI: HotTesterAPI = new HotTesterAPI (options.testerAPIBaseUrl, client);
				testerAPI.connection.api = testerAPI;
				processor.testerAPI = testerAPI;
			}
		}
	}

	/**
	 * Setup the testers api on the client, if needed.
	 */
	static setupClientTesters (processor: HotStaq): string
	{
		let output: string = "";

		if (processor.mode === DeveloperMode.Development)
		{
			output += 
`<script type = "text/javascript">
function hotstaq_isDocumentReady ()
{
if (window["Hot"] != null)
{
if (Hot.Mode === HotStaqWeb.DeveloperMode.Development)
{
let func = function ()
	{
		if (Hot.TesterAPI != null)
		{
			let testPaths = {};
			let testElements = JSON.stringify (Hot.CurrentPage.testElements);
			let testMaps = JSON.stringify (Hot.CurrentPage.testMaps);

			for (let key in Hot.CurrentPage.testPaths)
			{
				let testPath = Hot.CurrentPage.testPaths[key];

				testPaths[key] = testPath.toString ();
			}

			let testPathsStr = JSON.stringify (testPaths);

			Hot.TesterAPI.tester.pageLoaded ({
					testerName: Hot.CurrentPage.testerName,
					testerMap: Hot.CurrentPage.testerMap,
					pageName: Hot.CurrentPage.name,
					testElements: testElements,
					testPaths: testPathsStr
				}).then (function (resp)
					{
						if (resp.error != null)
						{
							if (resp.error !== "")
								throw new Error (resp.error);
						}

						HotStaqWeb.HotStaq.isReadyForTesting = true;
					});
		}
	};

if ((document.readyState === "complete") || (document.readyState === "interactive"))
	func ();
else
	document.addEventListener ("DOMContentLoaded", func);
}
}
}

hotstaq_isDocumentReady ();
</script>`;
		}

		return (output);
	}

	/**
	 * Process and replace the current HTML page with the hott script from the given url.
	 * This is meant for web browser use only.
	 */
	static async displayUrl (url: string | HotStartOptions, name: string = null, 
		processor: HotStaq = null, args: any = null): Promise<HotStaq>
	{
		return (new Promise<HotStaq> ((resolve, reject) =>
			{
				HotStaq.onReady (async () =>
					{
						let options: HotStartOptions = {
								"url": ""
							};

						if (name == null)
						{
							if (typeof (url) === "string")
								options.name = url;
							else
								options.name = url.name;
						}
						else
							options.name = name;

						if (options.name === "")
						{
							if (typeof (url) === "string")
								options.name = url;
							else
								options.name = url.name;
						}

						if (typeof (url) === "string")
							options.url = url;
						else
						{
							options.url = url.url;

							if (processor == null)
							{
								if (url.processor != null)
									processor = url.processor;
							}

							if (args == null)
							{
								if (url.args != null)
									args = url.args;
							}

							if (url.testerMap != null)
								options.testerMap = url.testerMap;

							if (url.testerName != null)
								options.testerName = url.testerName;

							if (url.testerAPIBaseUrl != null)
								options.testerAPIBaseUrl = url.testerAPIBaseUrl;
						}

						if (processor == null)
							processor = new HotStaq ();

						HotStaq.setupTesters (processor, options);

						options.processor = processor;
						options.args = args;

						if (options.url.indexOf ("hstqserve") < 0)
							options.url += "?hstqserve=nahfam";

						let output: string = await HotStaq.processUrl (options);

						output += HotStaq.setupClientTesters (processor);

						await HotStaq.useOutput (output);
						resolve (processor);
					});
			}));
	}

	/**
	 * Process and replace the current HTML page with the hott script.
	 * This is meant for web browser use only.
	 */
	static async displayContent (content: string | HotStartOptions, name: string = null, 
			processor: HotStaq = null, args: any = null): Promise<HotStaq>
	{
		return (new Promise<HotStaq> ((resolve, reject) =>
			{
				HotStaq.onReady (async () =>
					{
						let options: HotStartOptions = {
								"content": ""
							};

						if (name == null)
						{
							if (typeof (content) === "string")
								options.name = "";
							else
								options.name = content.name;
						}
						else
							options.name = name;

						if (options.name === "")
						{
							if (typeof (content) === "string")
								options.name = ""; /// @fixme Is this ok to do?
							else
								options.name = content.name;
						}

						if (typeof (content) === "string")
							options.content = content;
						else
						{
							options.content = content.content;

							if (processor == null)
							{
								if (content.processor != null)
									processor = content.processor;
							}

							if (args == null)
							{
								if (content.args != null)
									args = content.args;
							}

							if (content.testerMap != null)
								options.testerMap = content.testerMap;

							if (content.testerName != null)
								options.testerName = content.testerName;

							if (content.testerAPIBaseUrl != null)
								options.testerAPIBaseUrl = content.testerAPIBaseUrl;
						}

						if (processor == null)
							processor = new HotStaq ();

						HotStaq.setupTesters (processor, options);

						options.processor = processor;
						options.args = args;

						let output: string = await HotStaq.processContent (options);

						await HotStaq.useOutput (output);
						resolve (processor);
					});
			}));
	}
}

if (typeof (document) !== "undefined")
{
	let loadHotStaqSite = function ()
	{
		let hotstaqElms = document.getElementsByTagName ("hotstaq");

		// Set this to true, just in case...
		HotStaq.isWeb = true;

			// @ts-ignore
		if (typeof (HotStaqWeb) !== "undefined")
		{
			// @ts-ignore
			window.HotStaq = HotStaqWeb.HotStaq;
			// @ts-ignore
			window.HotClient = HotStaqWeb.HotClient;
			// @ts-ignore
			window.HotAPI = HotStaqWeb.HotAPI;
			// @ts-ignore
			window.Hot = HotStaqWeb.Hot;
			// @ts-ignore
			window.HotComponent = HotStaqWeb.HotComponent;
		}

		if (hotstaqElms.length > 0)
		{
			// @ts-ignore
			let hotstaqElm: HTMLElement = hotstaqElms[0];

			setTimeout (async function ()
				{
					let getAttr = (elm: HTMLElement, attrNames: string[]) =>
						{
							for (let iIdx = 0; iIdx < attrNames.length; iIdx++)
							{
								let attrName: string = attrNames[iIdx];

								if (elm.getAttribute (attrName) != null)
									return (elm.getAttribute (attrName));

								if (elm.getAttribute (`data-${attrName}`) != null)
									return (elm.getAttribute (`data-${attrName}`));
							}

							return (undefined);
						};

					let loadPage: string = getAttr (hotstaqElm, ["load-page", "loadPage", "src"]) || "";
					let router: string = getAttr (hotstaqElm, ["router"]) || "";
					let name: string = getAttr (hotstaqElm, ["name"]) || "default";
					let args: string = getAttr (hotstaqElm, ["args"]) || null;
					let apiLibrary: string = getAttr (hotstaqElm, ["api-library", "apiLibrary"]) || null;
					let apiName: string = getAttr (hotstaqElm, ["api-name", "apiName"]) || null;
					let apiUrl: string = getAttr (hotstaqElm, ["api-url", "apiUrl"]) || null;
					let testerName: string = getAttr (hotstaqElm, ["tester-name", "testerName"]) || "HotTesterMochaSelenium";
					let testerMap: string = getAttr (hotstaqElm, ["tester-map", "testerMap"]) || null;
					let testerApiBaseUrl: string = getAttr (hotstaqElm, ["tester-api-base-url", "testerApiBaseUrl"]) || null;
					let testerLaunchpadUrl: string = getAttr (hotstaqElm, ["tester-launchpad-url", "testerLaunchpadUrl"]) || null;
					let dontReuseProcessor: boolean = false;
					let passRawUrl: boolean = false;
					let htmlSource: string = hotstaqElm.innerHTML || "";
					let routerManager: { [path: string]: { redirect: string; baseRedirect: string; base: string; src: string; } } = {};
					let routerWildcards: string[] = [];
					let search: URLSearchParams = new URLSearchParams (window.location.search);

					if (getAttr (hotstaqElm, ["src"]) != null)
						loadPage = getAttr (hotstaqElm, ["src"]);

					if (getAttr (hotstaqElm, ["passRawUrl"]) != null)
						passRawUrl = true;

					if (getAttr (hotstaqElm, ["dont-reuse-processor", "dontReuseProcessor"]) != null)
						dontReuseProcessor = true;

					let hstqbaseredirect: string = search.get ("hstqbaseredirect");

					if (hstqbaseredirect != null)
					{
						hstqbaseredirect = decodeURI (hstqbaseredirect);
						window.history.replaceState ("", "", hstqbaseredirect);
						loadPage = hstqbaseredirect;
					}

					let hotstaqErrors = document.getElementsByTagName ("hotstaq-error");

					for (let iIdx = 0; iIdx < hotstaqErrors.length; iIdx++)
					{
						// @ts-ignore
						let hotstaqErrorElm: HTMLElement = hotstaqErrors[iIdx];
						let errorStatus: string = getAttr (hotstaqErrorElm, ["status"]);
						let unsupportedBrowser: string = getAttr (hotstaqErrorElm, ["unsupported-browser-redirect"]);

						if (unsupportedBrowser != null)
							HotStaq.errors["unsupportedBrowser"] = { redirectToUrl: unsupportedBrowser };
						else
							HotStaq.errors[`${errorStatus}`] = { redirectToUrl: unsupportedBrowser };
					}

					// Check if async/await is available.
					try
					{
						eval ("async () => {}");
					}
					catch (ex)
					{
						HotStaq.executeError ("unsupportedBrowser");
					}

					if (router !== "")
					{
						let hotstaqRouterElms = document.getElementsByTagName ("hotstaq-router");

						for (let iIdx = 0; iIdx < hotstaqRouterElms.length; iIdx++)
						{
							// @ts-ignore
							let hotstaqRouterElm: HTMLElement = hotstaqRouterElms[iIdx];
							let routerName: string = getAttr (hotstaqRouterElm, ["name"]);
							let serveLocally: string = getAttr (hotstaqRouterElm, ["serve-local", "serveLocally"]);

							// @ts-ignore
							if (routerName === router)
							{
								// Load all routes from the router.
								for (let iJdx = 0; iJdx < hotstaqRouterElm.childNodes.length; iJdx++)
								{
									// @ts-ignore
									let routerElm: HTMLElement = hotstaqRouterElm.childNodes[iJdx];

									if (routerElm instanceof HTMLElement)
									{
										if (routerElm.tagName.toUpperCase () === "ROUTE")
										{
											let routerPath: string = getAttr (routerElm, ["path"]);
											let redirect: string = getAttr (routerElm, ["redirect"]);
											let baseRedirect: string = getAttr (routerElm, ["base-redirect", "baseRedirect"]);
											let base: string = getAttr (routerElm, ["base"]);
											let routerSrc: string = getAttr (routerElm, ["src"]);

											if (routerPath.indexOf ("*") > -1)
												routerWildcards.push (routerPath);

											routerManager[routerPath] = {
													redirect: redirect || undefined, 
													baseRedirect: baseRedirect || undefined, 
													base: base || undefined, 
													src: routerSrc || undefined
												};
										}
									}
								}

								let checkPath: string = window.location.pathname;
								let gotoPath: string = window.location.pathname;

								if (serveLocally != null)
								{
									const lowerServeLocally: string = serveLocally.toLowerCase ();

									if ((lowerServeLocally === "true") ||
										(lowerServeLocally === "yes") ||
										(lowerServeLocally === "1"))
									{
										const lastSlashPos: number = checkPath.lastIndexOf ("/");

										if (lastSlashPos > -1)
										{
											checkPath = checkPath.substring (lastSlashPos);
											gotoPath = gotoPath.substring (lastSlashPos);
										}
									}
								}

								if (routerWildcards.length > 0)
								{
									// Serve locally doesn't really work with wildcards
									/// @fixme This isn't actually working like a wildcard should. This needs to be improved.
									for (let iJdx = 0; iJdx < routerWildcards.length; iJdx++)
									{
										let routeWildcard: string = routerWildcards[iJdx];
										let tempRouteWildcard: string = routeWildcard.replace ("*", "");

										if (checkPath.indexOf (tempRouteWildcard) > -1)
										{
											// This simply returns the key in the routerManager to access.
											checkPath = routeWildcard;

											break;
										}
									}
								}

								// Find the correct route and load it.
								if (routerManager[checkPath] != null)
								{
									if (routerManager[checkPath].redirect != null)
									{
										window.location.href = routerManager[checkPath].redirect;

										return;
									}

									if (routerManager[checkPath].baseRedirect != null)
									{
										const searchParams = window.location.search;
										let modifiedSearchParams = "";

										if ((searchParams !== "") && (searchParams !== "?"))
											modifiedSearchParams = `&${searchParams.substring (1)}`;

										window.location.href = `${routerManager[checkPath].baseRedirect}?hstqbaseredirect=${encodeURI (gotoPath + searchParams)}${modifiedSearchParams}`;

										return;
									}

									if (routerManager[checkPath].src != null)
										loadPage = routerManager[checkPath].src;
								}

								break;
							}
						}
					}

					if (args != null)
						args = JSON.parse (args);
					else
						args = Hot.Arguments;

					let hasHtmlSource: boolean = false;

					if (htmlSource !== "")
					{
						const htmlSourceCheck: string = htmlSource.replace (/\s/g,'');

						if (htmlSourceCheck !== "")
							hasHtmlSource = true;
					}

					let tempMode = 0;

					// @ts-ignore
					if (window["Hot"] != null)
						tempMode = Hot.Mode;
			
					let processor: HotStaq = null;

					if (dontReuseProcessor === false)
					{
						if (typeof (Hot) !== "undefined")
						{
							if (Hot.CurrentPage != null)
							{
								if (Hot.CurrentPage.processor != null)
									processor = Hot.CurrentPage.processor;
							}
						}
					}

					if (processor == null)
						processor = new HotStaq ();

					processor.mode = tempMode;

					let options: HotStartOptions = {
							name: name,
							processor: processor,
							args: args
						};

					if (loadPage !== "")
					{
						if (passRawUrl === false)
						{
							if (loadPage.indexOf ("hstqserve") < 0)
								loadPage += "?hstqserve=nahfam";
						}

						options.url = loadPage;
					}

					if (testerMap != null)
					{
						options.testerMap = testerMap;
						options.testerName = testerName;
					}

					if (testerName != null)
						options.testerName = testerName;

					if (testerApiBaseUrl != null)
						options.testerAPIBaseUrl = testerApiBaseUrl;

					if (testerLaunchpadUrl != null)
						options.testerLaunchpadUrl = testerLaunchpadUrl;

					if (apiName != null)
					{
						let client = new HotClient (processor);

						if (apiUrl === "")
							throw new Error (`api-url was not set!`);

						let parentLib: any = window;

						if (apiLibrary != null)
						{
							// @ts-ignore
							parentLib = window[apiLibrary];
						}

						let newAPI = new parentLib[apiName] (apiUrl, client);
						newAPI.connection.api = newAPI;
						processor.api = newAPI;
					}

					if (hasHtmlSource === false)
					{
						if (loadPage === "")
							throw new Error (`The hotstaq tag must have a src, HTML contents inside it, or a router set.`);

						HotStaq.displayUrl (options);
					}
					else
					{
						HotStaq.displayContent (options);
					}
				}, 50);
		}
	};

	/// @ts-ignore
	window.ethereum22 = window.ethereum;
	window.addEventListener ("load", loadHotStaqSite);
}
