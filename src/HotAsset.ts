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