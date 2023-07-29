import * as fs from "fs";

import fetch from "node-fetch";

import { DeveloperMode, Hot } from "./Hot";
import { HotPage } from "./HotPage";

/**
 * A file to process.
 */
export interface IHotFile
{
	/**
	 * The parent page.
	 */
	page?: HotPage;
	/**
	 * The name of the file.
	 */
	name?: string;
	/**
	 * The url to the file to get.
	 */
	url?: string;
	/**
	 * The path to the local file to get.
	 */
	localFile?: string;
	/**
	 * The content of the file to process.
	 */
	content?: string;
	/**
	 * Force all errors to be thrown.
	 */
	throwAllErrors?: boolean;
}

/**
 * Parser options for when processing a string or file.
 */
export interface ParserOptions
{
	/**
	 * Output the commands generated from processing. Default: true
	 */
	outputCommands?: boolean;
	/**
	 * Allow JSON.stringify to be used during processing. Default: true
	 */
	allowStringify?: boolean;
}

/**
 * A file to process.
 */
export class HotFile implements IHotFile
{
	/**
	 * The parent page.
	 */
	page: HotPage;
	/**
	 * The name of the file.
	 */
	name: string;
	/**
	 * The url to the file to get.
	 */
	url: string;
	/**
	 * The path to the local file to get.
	 */
	localFile: string;
	/**
	 * The content of the file to process.
	 */
	content: string;
	/**
	 * Force all errors to be thrown.
	 */
	throwAllErrors: boolean;

	constructor (copy: IHotFile = {})
	{
		this.page = copy.page || null;
		this.name = copy.name || "";
		this.url = copy.url || "";
		this.localFile = copy.localFile || "";
		this.content = copy.content || "";
		this.throwAllErrors = copy.throwAllErrors || false;
	}

	/**
	 * Set the content of this file.
	 */
	setContent (content: string): void
	{
		this.content = content;
	}

	/**
	 * Get the content of this file.
	 */
	getContent (): string
	{
		return (this.content);
	}

	/**
	 * Make a HTTP get request.
	 */
	static async httpGet (url: string): Promise<string>
	{
		try
		{
			let res = await fetch (url);

			if (res.ok === false)
				throw new Error (`${res.status}: ${res.statusText}`);

			let content: string = await res.text ();

			return (content);
		}
		catch (ex)
		{
			return (JSON.stringify ({ "error": `${ex.message} - Could not fetch ${url}` }));
		}
	}

	/**
	 * Load content from a url.
	 */
	async loadUrl (): Promise<string>
	{
		this.content = await HotFile.httpGet (this.url);

		return (this.content);
	}

	/**
	 * Load content from a local file.
	 */
	async loadLocalFile (): Promise<string>
	{
		let promise: Promise<string> = new Promise (
			(resolve: any, reject: any): void =>
			{
				fs.readFile (this.localFile, (err: NodeJS.ErrnoException, data: Buffer): void =>
					{
						if (err != null)
							throw err;

						let content: string = data.toString ();
						this.content = content;

						resolve (this.content);
					});
			});

		return (promise);
	}

	/**
	 * Load the contents of the file.
	 */
	async load (): Promise<string>
	{
		let content: string = "";

		if (this.url !== "")
			content = await this.loadUrl ();

		if (this.localFile !== "")
			content = await this.loadLocalFile ();

		return (content);
	}

	/**
	 * Process string content. This will take in a regular expression and 
	 * parse the content based on the regex. When the regex content is found 
	 * contentProcessor will be executed with the regex content found. When 
	 * the regex content is not found, offContentProcessor will be called with 
	 * the content outside of the regex.
	 * 
	 * @param content The content to parse.
	 * @param contentRegex The regex to use to parse the content.
	 * @param contentProcessor The content found inside the regex.
	 * @param offContentProcessor The content found outside of the regex.
	 * @param numRemoveFromBeginning The number of characters to remove from the 
	 * beginning of the found content.
	 * @param numRemoveFromEnd The number of characters to remove from the end of 
	 * the found content.
	 */
	static processContent (content: string, contentRegex: RegExp,
		contentProcessor: (regexFound: string) => string,
		offContentProcessor: (offContent: string) => string,
		numRemoveFromBeginning: number = 2,
		numRemoveFromEnd: number = 2): string
	{
		let result: RegExpExecArray = contentRegex.exec (content);
		let previousIndex: number = 0;
		let output: string = "";

		while (result != null)
		{
			let start: number = result.index - numRemoveFromBeginning;
			let end: number = contentRegex.lastIndex + numRemoveFromEnd;

			// Get the previous section.
			let prevContent: string = content.substr (previousIndex, (start - previousIndex));
			previousIndex = end;

			output += offContentProcessor (prevContent);

			// Process the content found from the regex
			let contentFound: string = result[0];
			output += contentProcessor (contentFound);

			// Move on to the next section to parse.
			result = contentRegex.exec (content);
		}

		// Append whatever else is after the last parsed section.
		let lastContent: string = content.substr (previousIndex);

		output += offContentProcessor (lastContent);

		return (output);
	}

	/**
	 * Process any content that could have nested values. This will 
	 * take in a regular expression and 
	 * parse the content based on the regex. When the regex content is found 
	 * contentProcessor will be executed with the regex content found. When 
	 * the regex content is not found, offContentProcessor will be called with 
	 * the content outside of the regex.
	 * 
	 * @fixme Needs to be able to ignore any characters found inside comments 
	 * or a string. For example, if the following is used ```${"Test }"}``` It 
	 * will error out.
	 * 
	 * @param content The content to parse.
	 * @param startChars The starting characters to search for.
	 * @param endChars The ending characters to search for.
	 * @param triggerChar The found character where parsing will start from.
	 * @param contentProcessor The content found inside the regex.
	 * @param offContentProcessor The content found outside of the regex.
	 * @param numRemoveFromBeginning The number of characters to remove from the 
	 * beginning of the found content.
	 * @param numRemoveFromEnd The number of characters to remove from the end of 
	 * the found content.
	 */
	static processNestedContent (content: string, startChars: string, endChars: string, 
		triggerChar: string, contentProcessor: (regexFound: string, startPos: number, endPos: number) => string,
		offContentProcessor: (offContent: string) => string,
		numRemoveFromBeginning: number = 2,
		numRemoveFromEnd: number = 1): string
	{
		let pos: number = content.indexOf (startChars);
		let previousIndex: number = 0;
		let startTriggerPos: number = content.indexOf (triggerChar, pos);
		let output: string = "";

		while (pos > -1)
		{
			let end: number = content.indexOf (endChars, pos);
			let nestedCounter: number = 0;

			if (triggerChar !== "")
			{
				// Reverse search the trigger characters and count the number of 
				// occurrences.
				let rpos: number = content.lastIndexOf (triggerChar, end - numRemoveFromEnd);

				while (rpos > -1)
				{
					if (rpos === startTriggerPos)
						break;

					rpos = content.lastIndexOf (triggerChar, rpos - numRemoveFromEnd);
					nestedCounter++;
				}
			}

			// If there's nested trigger characters, get the last occurrence of 
			// the end character.
			if (nestedCounter > 0)
			{
				let epos: number = content.indexOf (endChars, end + numRemoveFromEnd);
				let tempepos: number = epos;

				while ((epos > -1) && (nestedCounter > 0))
				{
					if (tempepos < 0)
						break;

					// Make sure we aren't discovering endChars that we shouldn't be.
					let posOutsideOfContent: number = content.lastIndexOf (startChars, tempepos - numRemoveFromEnd);

					if (posOutsideOfContent > epos)
						break;

					epos = tempepos;

					tempepos = content.indexOf (endChars, epos + numRemoveFromEnd);
					nestedCounter--;
				}

				end = epos;
			}

			let offContentStr: string = content.substr (previousIndex, (pos - previousIndex));
			output += offContentProcessor (offContentStr);

			let foundContent: string = content.substr (
				pos + numRemoveFromBeginning, (end - (pos + numRemoveFromBeginning)));
			output += contentProcessor (foundContent, pos, end);

			// Get the next content
			pos = content.indexOf (startChars, end + numRemoveFromEnd);
			startTriggerPos = content.indexOf (triggerChar, pos);
			previousIndex = end + numRemoveFromEnd;
		}

		// Append whatever else is after the last parsed section.
		let lastContent: string = content.substr (previousIndex);

		output += offContentProcessor (lastContent);

		return (output);
	}

	/**
	 * Parse a function from a string. Ex: <(a, b, c)=>{return (a + b + c);}>
	 */
	static parseFunction (str: string, callbackA: (funcArgs: string[]) => void, 
		callbackB: (funcBody: string, endType: string) => string): string
	{
		let startIndex = str.indexOf("<(");

		while (startIndex > -1)
		{
			const endIndex = str.indexOf(")", startIndex);
			const arrowIndex = str.indexOf("=>", endIndex);
			const braceIndex = str.indexOf("{", arrowIndex);
			let nextPos: number = endIndex;

			if ((startIndex !== -1) && 
				(endIndex !== -1) && (arrowIndex !== -1) && 
				(braceIndex !== -1))
			{
				let possibleEnds: string[] = ["}>", "}A>", "}a>", "}R>", "}RA>", "}Ra>"];
				let endPos = -1;
				let foundEnd: string = null;

				// Find the nearest end tag
				for (let i = 0; i < possibleEnds.length; i++)
				{
					let possibleEnd: string = possibleEnds[i];
					let possibleEndPos = str.indexOf(possibleEnd, arrowIndex);

					if (possibleEndPos > -1 && (endPos == -1 || possibleEndPos < endPos)) {
						endPos = possibleEndPos;
						foundEnd = possibleEnd;
					}
				}

				if (endPos > -1)
				{
					const a = str.slice(startIndex + 2, endIndex).trim().split(",").map(arg => arg.trim());
					const b = str.slice(braceIndex + 1, endPos).trim();
					callbackA(a);
					let out = callbackB(b, foundEnd);

					str = str.slice(0, startIndex) + out + str.slice(endPos + foundEnd.length);

					nextPos = endPos;
				}
			}

			startIndex = str.indexOf("<(", nextPos);
		}

		return (str);
	}

	/**
	 * Parse all the content into a single JavaScript file to be executed. async/await is used 
	 * in the processed JavaScript file, which means the .hott files parsed may use async/await 
	 * within the code.
	 * 
	 * Will parse the following in order:
	 * * <* JavaScript content to execute and output. Will output using Hot.echo. *>
	 * * !{ Execute ONLY JavaScript. This will NOT output anything automatically. If you want it to output, use Hot.echo here. }
	 * * STR{ Execute some JS, and output a string using JSON.stringify. }
	 * * ${ Execute some JS, and output the result. }
	 * * <(arguments)=>{ Some JS to execute at a later time. }>
	 * 	* This entire block will be parsed as a function, and will immediately output "Hot.CurrentPage.callFunction" in its place.
	 * * ?( Execute some JS, must return a string which will be attached to the HTML DOM object it's used on. )
	 * 
	 * @param thisContent The content to parse.
	 * @param throwAllErrors If set to true, any error that occurs will be thrown as an exception.
	 * @param options The options to use when parsing the content.
	 */
	static parseContent (thisContent: string, throwAllErrors: boolean, parserOptions: ParserOptions = null): string
	{
		if (parserOptions == null)
		{
			parserOptions = {
					outputCommands: true,
					allowStringify: true
				};
		}

		let STRINGIFY_START: string = "JSON.stringify (";
		let STRINGIFY_END: string = ")";

		if (parserOptions.allowStringify === false)
		{
			STRINGIFY_START = "";
			STRINGIFY_END = "";
		}

		// Assemble the JS to evaluate. This will take all content outside of 
		// <* and *> and wrap a Hot.echo around it. Any JS found inside of the 
		// <* and *> will be executed as is.
		let output: string = HotFile.processContent (thisContent, 
			new RegExp ("(?=\\<\\*)([\\s\\S]*?)(?=\\*\\>)", "g"), 
			(regexFound: string): string =>
			{
				// A little hack, since I suck at Regex :(
				regexFound = regexFound.substr (2);

				return (`${regexFound}`);
			}, 
			(offContent: string): string =>
			{
				if (offContent === "")
					return ("");

				let tempOutput: string = HotFile.processNestedContent (
					offContent, "!{", "}", "{", 
					(regexFound2: string, startPos: number, endPos: number): string =>
					{
						let out: string = `*&&%*%@#@!${regexFound2}*&!#%@!@*!`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
					});
				let tempOutput2: string = HotFile.processNestedContent (
					tempOutput, "STR{", "}", "{", 
					(regexFound2: string, startPos: number, endPos: number): string =>
					{
						let out: string = "";

						if (parserOptions.outputCommands === true)
							out = `*&&%*%@#@!echoOutput (JSON.stringify(${regexFound2}), ${throwAllErrors});*&!#%@!@*!`;
						else
							out = `*&&%*%@#@!${STRINGIFY_START}${regexFound2}${STRINGIFY_END}, ${throwAllErrors});*&!#%@!@*!`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
					}, 4, 1);

				let funcArgsStr: string = "";

				let tempOutput3 = 
					HotFile.parseFunction (tempOutput2, (funcArgs: string[]) =>
					{
						funcArgsStr = JSON.stringify (funcArgs);
					}, 
					(funcBody: string, endType: string): string =>
					{
						//const escapedBody: string = funcBody.replace(/[\\'"\n\r\t]/g, '\\$&');
						const escapedBody: string = funcBody.replace (/\`/g, "\\`");
						let functionCall: string = "Hot.CurrentPage.callFunction";
						let isAsync: string = "false";

						if (endType === "}A>")
						{
							functionCall = "await Hot.CurrentPage.callAsyncFunction";
							isAsync = "true";
						}

						if (endType === "}a>")
						{
							functionCall = "Hot.CurrentPage.callAsyncFunction";
							isAsync = "true";
						}

						if (endType === "}R>")
							functionCall = "return Hot.CurrentPage.callFunction";

						if (endType === "}RA>")
						{
							functionCall = "return await Hot.CurrentPage.callAsyncFunction";
							isAsync = "true";
						}

						if (endType === "}Ra>")
						{
							functionCall = "return Hot.CurrentPage.callAsyncFunction";
							isAsync = "true";
						}

						let newValue = `*&&%*%@#@!{
const newFuncName = createFunction (null, ${funcArgsStr}, \`${escapedBody}\`, ${isAsync});
Hot.echo (\`${functionCall} (this, '\${newFuncName}', arguments);\`);
}*&!#%@!@*!`;
						// Replace any ${ with ${&&!*#!!
						newValue = newValue.replace (/\$\{/g, "${&&!*#!!");

						return (newValue);
					});

				let tempOutput4: string = HotFile.processNestedContent (
					tempOutput3, "${", "}", "{", 
					(regexFound2: string, startPos: number, endPos: number): string =>
					{
						let out: string = "";
						let outputCmds: boolean = parserOptions.outputCommands;

						if (regexFound2.indexOf ("&&!*#!!") > -1)
						{
							const tempStr: string = regexFound2.replace (/&&\!\*\#\!\!/g, "");

							return (`\${(typeof (${tempStr}) !== "undefined") ? ${tempStr} : "\${${tempStr}}"}`);
						}

						if (outputCmds === true)
						{
							let escapeOutput = (content: string): string =>
								{
									return (content.replace(/[`]/g, '\\`'));
								};

							out = `*&&%*%@#@!try { Hot.echo (${regexFound2}); }catch (ex){Hot.echo (\`\\\${${escapeOutput (regexFound2)}}\`);}*&!#%@!@*!`;

							if (throwAllErrors === true)
								out = `*&&%*%@#@!Hot.echo (${regexFound2});*&!#%@!@*!`;
						}
						else
							out = `*&&%*%@#@!${regexFound2}*&!#%@!@*!`;

						return (out);
					}, 
					(offContent3: string): string =>
					{
						return (offContent3);
						/*let escapedContent: string = JSON.stringify (offContent3);
						let out: string = `echoOutput (${escapedContent}, ${throwAllErrors});\n`;

						return (out);*/
					});

				let tempOutput5: string = "";

				// Any ?() will be ignored in production mode.
				if (Hot.Mode === DeveloperMode.Production)
				{
					tempOutput5 = HotFile.processNestedContent (
						tempOutput4, "?(", ")", "(", 
						(regexFound2: string, startPos: number, endPos: number): string =>
						{
							return ("");
						}, 
						(offContent3: string): string =>
						{
							return (offContent3);
							/*let out: string = `echoOutput (${offContent3}, ${throwAllErrors});\n`;

							return (out);*/
						});
				}

				if (Hot.Mode === DeveloperMode.Development)
				{
					tempOutput5 = HotFile.processNestedContent (
						tempOutput4, "?(", ")", "(", 
						(regexFound2: string, startPos: number, endPos: number): string =>
						{
							let foundStr: string = "";

							try
							{
								// Check to see if it be parsed. If so, stringify it.
								JSON.parse (regexFound2);

								if (parserOptions.allowStringify === true)
									foundStr = JSON.stringify (regexFound2);
								else
									foundStr = `${regexFound2}`;
							}
							catch (ex)
							{
								// If valid JSON is not received, don't worry about it, pass it 
								// along to the function below for it to be parsed in the page.
								// The exception should be thrown there instead.
								foundStr = `${regexFound2}`;
							}

							/// @fixme Make this a callable function and pass foundStr, etc.
							let out: string = "";

							if (parserOptions.outputCommands === true)
							{
								out = `*&&%*%@#@!{
const testElm = createTestElement (${foundStr});
Hot.echo (\`data-test-object-name = "\${testElm.name}" data-test-object-func = "\${testElm.func}" data-test-object-value = "\${testElm.value}"\`);
}*&!#%@!@*!\n`;
							}
							else
							{
								let createTestElement = (foundStr2: any) =>
								{
									let testElm = null;

									try
									{
										let obj = foundStr2;

										if (typeof (foundStr2) === "string")
											obj = JSON.parse (foundStr2);

										if (typeof (obj) === "string")
											testElm = new Hot.HotTestElement (obj);

										if (obj instanceof Array)
											testElm = new Hot.HotTestElement (obj[0], obj[1], obj[2]);

										if (obj["name"] != null)
											testElm = new Hot.HotTestElement (obj);

										if (Hot.CurrentPage.testElements[testElm.name] != null)
											throw new Error (`Test element ${testElm.name} already exists!`);
									}
									catch (ex)
									{
										throw new Error (
								`Error processing test element ${foundStr2} in ${Hot.CurrentPage.name}. Error: ${ex.message}`
											);
									}

									return (testElm);
								}

								const testElm = createTestElement (foundStr);
								out = `*&&%*%@#@!data-test-object-name = "${testElm.name}" data-test-object-func = "${testElm.func}" data-test-object-value = "${testElm.value}"*&!#%@!@*!`;
							}

							return (out);
						}, 
						(offContent3: string): string =>
						{
							return (offContent3);
							/*let out: string = `echoOutput (${offContent3}, ${throwAllErrors});\n`;

							return (out);*/
						});
				}

				let tempOutput6: string = HotFile.processNestedContent (
					tempOutput5, "*&&%*%@#@!", "*&!#%@!@*!", "*&&%*%@#@!", 
					(regexFound: string, startPos: number, endPos: number): string =>
					{
						return (regexFound);
					}, 
					(offContent: string): string =>
					{
						let escapedContent: string = "";

						if (parserOptions.allowStringify === true)
							escapedContent = JSON.stringify (offContent);
						else
							escapedContent = offContent;

						let out: string = "";
						
						if (parserOptions.outputCommands === true)
							out = `echoOutput (${escapedContent}, ${throwAllErrors});\n`;
						else
							out = escapedContent;

						return (out);
					}, 
					"*&&%*%@#@!".length, "*&!#%@!@*!".length);

				/// @fixme Temporary hack. These delimiters should be removed from tempOutput when 
				/// executing processNestedContent.
				tempOutput6 = tempOutput6.replace (/\*\&\&\%\*\%\@\#\@\!/g, "");
				tempOutput6 = tempOutput6.replace (/\*\&\!\#\%\@\!\@\*\!/g, "");

				return (tempOutput6);
			}, 0);

		return (output);
	}

	/**
	 * Process the content in this file. This treats each file as one large JavaScript
	 * file. Any text outside of the <* *> areas will be treated as:
	 * 
	 * 		Hot.echo ("text");
	 * 
	 * @fixme The regex's in the offContent functions need to be fixed. There's several 
	 * test cases where they will fail.
	 */
	async process (args: any = null): Promise<string>
	{
		let thisContent: string = this.content;

		if (args != null)
		{
			if (args instanceof Array)
				throw new Error (`In ${this.name}, the passed arguments received cannot be an array!`);
		}

		let tempArgs = Hot.Arguments;

		Hot.Mode = this.page.processor.mode;
		Hot.Arguments = args;
		Hot.CurrentPage = this.page;
		Hot.PublicKeys = this.page.processor.publicKeys;
		Hot.API = this.page.getAPI ();
		Hot.TesterAPI = this.page.getTesterAPI ();

		let output: string = HotFile.parseContent (thisContent, this.throwAllErrors);

		// Execute the assembled JS file.
		let returnedOutput: any = null;

		try
		{
			let executionContent: string = `
			var Hot = arguments[0];
			var PassedHotFile = arguments[1];

			`;

			// Output the arguments so it's usable in the entire document.
			if (typeof (args) === "string")
				throw new Error (`The passing arguments cannot be a string!`);

			for (let key in args)
			{
				let newVar: string = "";
				let newVarValue: any = args[key];
				let newVarValueStr: string = JSON.stringify (newVarValue);

				newVar = `var ${key} = ${newVarValueStr};\n`;

				executionContent += newVar;
			}

			let contentName: string = this.name;

			if (contentName === "")
				contentName = this.localFile;

			if (contentName === "")
				contentName = this.url;

			executionContent += `
			/**
			 * Helper function to output content.
			 */
			function echoOutput (content, throwErrors)
			{
				if (throwErrors == null)
					throwErrors = true;

				if (throwErrors === true)
				{
					Hot.echo (content);

					return;
				}

				try
				{
					Hot.echo (content);
				}
				catch (ex)
				{
					Hot.echo ("");
				}
			}

			/**
			 * Outputs a \${JS Content} value.
			 */
			function outputStr (value, possibleValue)
			{
				let result = \`\\\${\${value}}\`;

				try
				{
					if (possibleValue != null)
						result = possibleValue;
					else
						result = eval (value);
				}
				catch (ex)
				{
				}

				return (result);
			}

			/**
			 * Create a function for later execution on this page.
			 */
			function createFunction (name, args, funcBody, isAsync)
			{
				return (Hot.CurrentPage.addFunction (name, args, funcBody, isAsync));
			}

			/**
			 * Create a test element.
			 */
			function createTestElement (foundStr)
			{
				let testElm = null;

				try
				{
					let obj = foundStr;

					if (typeof (foundStr) === "string")
						obj = JSON.parse (foundStr);

					if (typeof (obj) === "string")
						testElm = new Hot.HotTestElement (obj);

					if (obj instanceof Array)
						testElm = new Hot.HotTestElement (obj[0], obj[1], obj[2]);

					if (obj["name"] != null)
						testElm = new Hot.HotTestElement (obj);

					if (Hot.CurrentPage.testElements[testElm.name] != null)
						throw new Error (\`Test element \${testElm.name} already exists!\`);

					Hot.CurrentPage.addTestElement (testElm);
				}
				catch (ex)
				{
					throw new Error (
			\`Error processing test element \${foundStr} in \${Hot.CurrentPage.name}. Error: \${ex.message}\`
						);
				}

				return (testElm);
			}

			async function runContent (CurrentHotFile)
			{\n`;
			executionContent += output;
			executionContent += `
			}

			return (runContent (PassedHotFile).then (() =>
			{
				return ({
						hot: Hot,
						output: Hot.Output,
						data: JSON.stringify (Hot.Data)
					});
			}));`;

			/// @fixme Prior to execution compile any TypeScript and make it ES5 compatible.
			let func: Function = new Function (executionContent);
			returnedOutput = await func.apply (this, [Hot, this]);
		}
		catch (ex)
		{
			if (ex instanceof SyntaxError)
			{
				/// @fixme Put what's in the content variable into a prev content variable?
				/// Then once there's no longer any syntax errors being thrown, execute the 
				/// code? This would also require saving any HTML outside of the *> and <* 
				/// then echoing it out. The throw below would have to be removed as well.
				throw ex;
			}
			else
				throw ex;
		}

		Hot.Data = returnedOutput.hot.Data;
		let finalOutput: string = returnedOutput.output;
		Hot.Output = "";
		Hot.Arguments = tempArgs;

		return (finalOutput);
	}
}