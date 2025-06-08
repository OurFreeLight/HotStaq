import { Hot } from "./Hot";
import { HotAPI } from "./HotAPI";
import { HotAsset } from "./HotAsset";
import { HotComponent, IHotComponent } from "./HotComponent";
import { HotStaq } from "./HotStaq";

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
	 * The exported component library that contains all the components to load.
	 */
	componentLibrary?: string;
	/**
	 * The components to load.
	 */
	components?: (new (copy: IHotComponent | HotStaq, api?: HotAPI) => HotComponent)[];

	constructor (name: string)
	{
		this.name = name;
		this.import = [];
		this.html = [];
		this.css = [];
		this.js = [];
		this.componentLibrary = "";
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
			Hot.echoUnsafe (output);

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
			Hot.echoUnsafe (output);

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
	 * Output components assets.
	 */
	outputComponents (echoOut: boolean = true): string
	{
		if (this.components == null)
			return ("");

		if (this.components.length < 1)
			return ("");

		let output: string = `<script type = "text/javascript">`;
		let componentLibrary: string = "";

		if (this.componentLibrary != null)
		{
			if (this.componentLibrary !== "")
				componentLibrary = `${this.componentLibrary}.`;
		}

		for (let iIdx = 0; iIdx < this.components.length; iIdx++)
		{
			let component = this.components[iIdx];

			output += `Hot.CurrentPage.processor.addComponent (${componentLibrary}${component});\n`;
		}

		output += `</script>`;

		if (echoOut === true)
			Hot.echoUnsafe (output);

		return (output);
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