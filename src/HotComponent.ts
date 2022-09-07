import { HotAPI } from "./HotAPI";
import { HotStaq } from "./HotStaq";

/**
 * A component to preprocess.
 */
export interface IHotComponent
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The associated HTMLElement.
	 */
	htmlElement?: HTMLElement;
	/**
	 * The name of the page.
	 */
	name?: string;
	/**
	 * The name of the tag.
	 */
	tag?: string;
	/**
	 * The connected API.
	 */
	api?: HotAPI;
	/**
	 * The options to include with registering this component.
	 */
	elementOptions?: ElementDefinitionOptions;
	/**
	 * Any extra attributes to register.
	 */
	observedAttributes?: string[];
	/**
	 * The type of component.
	 */
	type?: string;
	/**
	 * The value of the component.
	 */
	value?: any;
	/**
	 * The events to trigger.
	 */
	events?: {
			[name: string]: {
				type: string;
				func: Function;
				options?: any;
			}
		};
}

/**
 * A component to preprocess.
 */
export abstract class HotComponent implements IHotComponent
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The associated HTMLElement.
	 */
	htmlElement: HTMLElement;
	/**
	 * The name of the component.
	 */
	name: string;
	/**
	 * The name of the tag.
	 */
	tag: string;
	/**
	 * The connected API.
	 */
	api: HotAPI;
	/**
	 * The options to include with registering this component.
	 */
	elementOptions: ElementDefinitionOptions;
	/**
	 * Any extra attributes to register.
	 */
	observedAttributes: string[];
	/**
	 * The type of component.
	 */
	type: string;
	/**
	 * The value of the component.
	 */
	value: any;
	/**
	 * The events to trigger.
	 */
	events: {
		[name: string]: {
				type: string;
				func: Function;
				options: any;
			}
		};
	/**
	 * Execute prior to output.
	 * 
	 * @returns If set to false, the component will not be registered.
	 */
	onPreOutput: () => Promise<boolean>;
	/**
	 * Execute after getting the output, but before the DOM parsing.
	 * 
	 * @param output The output from the component to register. Can be manipulated one last time prior to 
	 * being parsed into a DOM element.
	 * 
	 * @returns The final output to be parsed as a DOM element.
	 */
	onPostOutput: (output: (string | {
			html: string;
			addFunctionsTo: string;
		})) => Promise<(string | {
				html: string;
				addFunctionsTo: string;
			})>;
	/**
	 * Execute after the output has been parsed and is ready to be placed into the DOM.
	 */
	onParsed: (output: string) => Promise<string>;
	/**
	 * Execute prior to placing the new DOM element.
	 */
	onPrePlace: (htmlElement: HTMLElement) => Promise<HTMLElement>;
	/**
	 * Execute after placing the new DOM element. Can be manipulated one final time prior to being rendered.
	 */
	onPostPlace: (parentHtmlElement: HTMLElement, htmlElement: HTMLElement) => Promise<HTMLElement>;

	constructor (copy: IHotComponent | HotStaq, api: HotAPI = null)
	{
		if ((copy instanceof HotStaq) || (copy == null))
		{
			// @ts-ignore
			this.processor = copy;
			this.htmlElement = null;
			this.name = "";
			this.tag = "";
			this.api = null;
			this.elementOptions = undefined;
			this.observedAttributes = [];
			this.type = "";
			this.value = null;
			this.events = {};

			this.onPreOutput = null;
			this.onPostOutput = null;
			this.onParsed = null;
			this.onPrePlace = null;
			this.onPostPlace = null;
		}
		else
		{
			this.processor = copy.processor;
			this.htmlElement = copy.htmlElement || null;
			this.name = copy.name || "";
			this.tag = copy.tag || this.name;
			this.api = copy.api || null;
			this.elementOptions = copy.elementOptions || undefined;
			this.observedAttributes = copy.observedAttributes || [];
			this.type = copy.type || "";
			this.value = copy.value || null;
			this.events = {};
		}

		if (api != null)
			this.api = api;
	}

	/**
	 * Event that's called when this component is created. This is 
	 * called before output is called. Right after this is called, 
	 * the attributes from the HTMLElement will be processed. If 
	 * the functionality of the attributes processing need to be 
	 * overwritten, use the handleAttributes method to handle them.
	 */
	async onCreated (element: HTMLElement): Promise<any>
	{
		return (element);
	}

	/**
	 * Handle the attributes manually.
	 */
	async handleAttributes? (attributes: NamedNodeMap): Promise<void>;

	/**
	 * Handle a click event.
	 */
	abstract click? (): Promise<void>;

	/**
	 * Output the component.
	 */
	abstract output (): Promise<string | 
		{
			/**
			 * The HTML to output.
			 */
			html: string;
			/**
			 * The query selector to add this component's functions to.
			 * 
			 * @example #objectId
			 */
			addFunctionsTo: string;
		}>;
}