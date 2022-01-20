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

	constructor (copy: IHotComponent | HotStaq, api: HotAPI = null)
	{
		if (copy instanceof HotStaq)
		{
			this.processor = copy;
			this.htmlElement = null;
			this.name = "";
			this.tag = "";
			this.api = null;
			this.elementOptions = undefined;
			this.type = "";
			this.value = null;
			this.events = {};
		}
		else
		{
			this.processor = copy.processor;
			this.htmlElement = copy.htmlElement || null;
			this.name = copy.name || "";
			this.tag = copy.tag || this.name;
			this.api = copy.api || null;
			this.elementOptions = copy.elementOptions || undefined;
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
	abstract click (): Promise<void>;

	/**
	 * Output the component.
	 */
	abstract output (): Promise<string>;
}