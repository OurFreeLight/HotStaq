import { Hot } from "./Hot";
import { HotFile } from "./HotFile";
import { HotStaq } from "./HotStaq";
import { HotAPI } from "./HotAPI";
import { HotTestElement } from "./HotTestElement";
import { HotTestMap, HotTestPath } from "./HotTestMap";
import { HotComponent } from "./HotComponent";

/**
 * A page to preprocess.
 */
export interface IHotPage
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The name of the page.
	 */
	name?: string;
	/**
	 * The route used to get to this page.
	 */
	route?: string;
	/**
	 * The name of the page. File ordering matters here.
	 * Every file is processed incrementally.
	 */
	files?: HotFile[];
	/**
	 * The associated tester name.
	 */
	testerName?: string;
	/**
	 * The associated tester map.
	 */
	testerMap?: string;
	/**
	 * The elements to test on this page.
	 */
	testElements?: { [name: string]: HotTestElement; };
	/**
	 * The test paths to test on this page.
	 */
	testPaths?: { [name: string]: HotTestPath; };
}

/**
 * A page to preprocess.
 */
export class HotPage implements IHotPage
{
	/**
	 * The processor to use.
	 */
	processor: HotStaq;
	/**
	 * The name of the page.
	 */
	name: string;
	/**
	 * The route used to get to this page.
	 */
	route: string;
	/**
	 * The components added to this page.
	 */
	components: { [name: string]: HotComponent };
	/**
	 * The name of the page. File ordering matters here.
	 * Every file is processed incrementally.
	 */
	files: HotFile[];
	/**
	 * The associated tester name.
	 */
	testerName: string;
	/**
	 * The associated tester map.
	 */
	testerMap: string;
	/**
	 * The elements to test on this page.
	 */
	testElements: { [name: string]: HotTestElement; };
	/**
	 * The test paths to test on this page.
	 */
	testPaths: { [name: string]: HotTestPath; };

	constructor (copy: IHotPage | HotStaq)
	{
		if (copy instanceof HotStaq)
		{
			this.processor = copy;
			this.name = "";
			this.testerName = "HotTesterMochaSelenium";
			this.testerMap = "";
			this.route = "";
			this.files = [];
			this.testElements = {};
			this.testPaths = {};
		}
		else
		{
			this.processor = copy.processor;
			this.name = copy.name || "";
			this.testerName = copy.testerName || "HotTesterMochaSelenium";
			this.testerMap = copy.testerMap || "";
			this.route = copy.route || "";
			this.files = copy.files || [];
			this.testElements = copy.testElements || {};
			this.testPaths = copy.testPaths || {};
		}
	}

	/**
	 * Add a file to process. It's recommend to load the file prior to 
	 * adding it to a page if it's about to be used.
	 */
	async addFile (file: HotFile): Promise<void>
	{
		file.page = this;

		this.files.push (file);
	}

	/**
	 * Get the API associated with this page.
	 */
	getAPI (): HotAPI
	{
		return (this.processor.api);
	}

	/**
	 * Get the tester API associated with this page.
	 */
	getTesterAPI (): HotAPI
	{
		return (this.processor.testerAPI);
	}

	/**
	 * Add all files in the page. Could decrease page loading performance.
	 * It's recommend to load the file prior to adding it to a page.
	 */
	async load (file: HotFile): Promise<void>
	{
		for (let iIdx = 0; iIdx < this.files.length; iIdx++)
		{
			let file: HotFile = this.files[iIdx];

			await file.load ();
		}
	}

	/**
	 * Process a page and get the result.
	 */
	async process (args: any = null): Promise<string>
	{
		let output: string = "";

		for (let iIdx = 0; iIdx < this.files.length; iIdx++)
		{
			let file: HotFile = this.files[iIdx];

			Hot.Output = "";
			file.page = this;

			output += await file.process (args);
		}

		return (output);
	}

	/**
	 * Add a test element.
	 */
	addTestElement (elm: HotTestElement): void
	{
		if (this.testElements[elm.name] != null)
			throw new Error (`Test element ${elm.name} already exists!`);

		this.testElements[elm.name] = elm;
	}

	/**
	 * Get a test element.
	 */
	getTestElement (name: string): HotTestElement
	{
		if (this.testElements[name] == null)
			throw new Error (`Test element ${name} doest not exist!`);

		return (this.testElements[name]);
	}

	/**
	 * Create a test path.
	 */
	createTestPath (pathName: string, driverFunc: HotTestPath): void
	{
		if (this.testPaths[pathName] != null)
			throw new Error (`Test path ${pathName} already exists!`);

		this.testPaths[pathName] = driverFunc;
	}
}