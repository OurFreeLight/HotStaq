import { HotFile } from "./HotFile";
import { HotComponent, HotComponentOutput } from "./HotComponent";
import { HotStaq } from "./HotStaq";
import { Hot } from "./Hot";

/**
 * Register a component for use as a HTML tag.
 */
export function registerComponent (tag: string, elementOptions: ElementDefinitionOptions = undefined): void
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

				let compHtmlElement = this;
		
				// @ts-ignore
				compHtmlElement.hotComponent = this.component;
		
				this.component.htmlElements = [compHtmlElement];
				this.component.inner = this.innerHTML;
		
				if (this.component.handleAttributes != null)
					this.component.handleAttributes (this.attributes);
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
					if (this.component.onPreOutput () === false)
						return;
				}

				let outputs = this.component.output ();
		
				if (this.component.onPostOutput != null)
					outputs = this.component.onPostOutput (outputs);
		
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
						str = this.component.onParsed (str);
		
					let htmlHandler: { fixedStr: string, querySelector: string; } = { fixedStr: "", querySelector: "" };
		
					if (this.component.onFixHTML != null)
						htmlHandler = this.component.onFixHTML (str);
					else
						htmlHandler = HotStaq.fixHTML (str);

					let childrenToReadd: Node[] = [];
		
					// Save the children from being replaced.
					for (let iIdx = (this.children.length - 1); iIdx > -1; iIdx--)
					{
						let child: Node = this.children[iIdx];
		
						childrenToReadd.push (this.removeChild (child));
					}
		
					let newDOM: Document = null;
					let newObj: HTMLElement = null;
		
					if (this.component.onParseDOM != null)
						newDOM = this.component.onParseDOM (htmlHandler.fixedStr);
					else
					{
						/// @ts-ignore
						//newDOM = this.looseParseFromString (new DOMParser (), str);
						newDOM = new DOMParser ().parseFromString (htmlHandler.fixedStr, "text/html");
					}

					if (newDOM.body.children.length < 1)
						throw new Error (`No component output from ${this.component.name} with tag ${this.component.tag}`);

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
		
					this.replaceWith (newObj);
		
					if (this.component.click != null)
						newObj.addEventListener ("click", this.component.click.bind (this.component));
		
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
						newObj = this.component.onPrePlace (newObj);
		
					let compHtmlElement2: HTMLElement = this.component.onCreated (newObj);
		
					if (this.component.onParentPlace != null)
					{
						// @ts-ignore
						compHtmlElement2.onParentPlace = this.component.onParentPlace;
					}
		
					// @ts-ignore
					compHtmlElement2.hotComponent = this.component;
					this.component.htmlElements.push (compHtmlElement2);
		
					if (output.closestSelector != null)
					{
						let parentElm: HTMLElement = compHtmlElement2;

						while (parentElm)
						{
							let foundNode: Node = parentElm.querySelector (output.closestSelector);

							if (foundNode != null)
							{
								parentElm = (<HTMLElement>foundNode);
								break;
							}

							parentElm = parentElm.parentElement;
						}

						if (parentElm == null)
							throw new Error (`Unable to find closest node with selector '${output.closestSelector}'`);
		
						compHtmlElement2.parentElement.removeChild (compHtmlElement2);
						parentElm.appendChild (compHtmlElement2);
		
						// @ts-ignore
						if (compHtmlElement2.onParentPlace != null)
						{
							// @ts-ignore
							compHtmlElement2.hotComponent.onParentPlace (parentNode, compHtmlElement2);
						}
					}
		
					if (output.documentSelector != null)
					{
						let parentNode: Node = document.querySelector (output.documentSelector);

						if (parentNode == null)
							throw new Error (`Unable to find document node with selector '${output.documentSelector}'`);
		
						compHtmlElement2.parentElement.removeChild (compHtmlElement2);
						parentNode.appendChild (compHtmlElement2);
		
						// @ts-ignore
						if (compHtmlElement2.onParentPlace != null)
						{
							// @ts-ignore
							compHtmlElement2.hotComponent.onParentPlace (parentNode, compHtmlElement2);
						}
					}

					let placeElmInParent = (parentNodeToCheck: ParentNode, placeHereParent: string, childToPlace: Node): ParentNode =>
					{
						let parentNodeCheckCounter: number = 0;
		
						while (parentNodeCheckCounter < 10) /// @todo Make this controllable with a variable from the component.
						{
							if (parentNodeToCheck == null)
								break;
		
							if (parentNodeToCheck instanceof HTMLHtmlElement)
								break;
		
							// If the hot-place-here exists, place the children there. If not, place it under the 
							// new element.
							let placeHereArray = parentNodeToCheck.querySelectorAll (`hot-place-here[name="${placeHereParent}"]`);
		
							if (placeHereArray.length > 0)
							{
								let placeHere = placeHereArray[0];
		
								if (childToPlace.parentNode != null)
									childToPlace.parentNode.removeChild (childToPlace);

								placeHere.appendChild (childToPlace);
		
								// @ts-ignore
								if (childToPlace.onParentPlace != null)
								{
									// @ts-ignore
									childToPlace.hotComponent.onParentPlace (placeHere, childToPlace);
								}
		
								break;
							}
		
							if (placeHereArray.length < 1)
							{
								let placeHereAttrArray = parentNodeToCheck.querySelectorAll (`[hot-place-here="${placeHereParent}"]`);
		
								if (placeHereAttrArray.length > 0)
								{
									let placeHere = placeHereAttrArray[0];

									if (childToPlace.parentNode != null)
										childToPlace.parentNode.removeChild (childToPlace);

									placeHere.appendChild (childToPlace);
		
									// @ts-ignore
									if (childToPlace.onParentPlace != null)
									{
										// @ts-ignore
										childToPlace.hotComponent.onParentPlace (placeHere, childToPlace);
									}
		
									break;
								}
							}
		
							parentNodeToCheck = parentNodeToCheck.parentNode;
							parentNodeCheckCounter++;
						}

						return (parentNodeToCheck);
					};
		
					if (output.placeHereParent != null)
					{
						let parentNodeToCheck = compHtmlElement2.parentNode;
						parentNodeToCheck = placeElmInParent (parentNodeToCheck, output.placeHereParent, compHtmlElement2);

						if (parentNodeToCheck == null)
							throw new Error (`Unable to find parent node with hot-place-here attribute '${output.placeHereParent}'`);
					}
		
					// Append the children to the newly created HTML element.
					for (let iIdx = 0; iIdx < childrenToReadd.length; iIdx++)
					{
						const child: HTMLElement = (<HTMLElement>childrenToReadd[iIdx]);
						let placedChild: boolean = false;

						// Get the attribute hot-place-parent in child.
						if (typeof (child.getAttribute) !== "undefined")
						{
							let placeHereParentAttr = child.getAttribute ("hot-place-parent");

							if ((placeHereParentAttr != null) && (placeHereParentAttr !== ""))
							{
								let parentNodeToCheck: ParentNode = compHtmlElement2;
								parentNodeToCheck = placeElmInParent (parentNodeToCheck, placeHereParentAttr, child);
		
								if (parentNodeToCheck == null)
									throw new Error (`Unable to find parent node with hot-place-here attribute '${output.placeHereParent}'`);
								else
									placedChild = true;
							}
						}
		
						if (placedChild === false)
							compHtmlElement2.appendChild (child);

						// @ts-ignore
						if (child.onParentPlace != null)
						{
							// @ts-ignore
							child.hotComponent.onParentPlace (compHtmlElement2, child);
						}
					}
		
					if (this.component.onPostPlace != null)
					{
						let temp: HTMLElement = this.component.onPostPlace (compHtmlElement2.parentElement, compHtmlElement2);

						if (temp != null)
							compHtmlElement2 = temp;
					}

					if (typeof (Hot) !== "undefined")
					{
						if (Hot.CurrentPage != null)
						{
							let componentName: string = this.component.name;

							if ((componentName == null) || (componentName === ""))
								componentName = this.id;

							if (Hot.CurrentPage.components[componentName] != null)
								throw new Error (`Component with name ${componentName} already exists!`);

							Hot.CurrentPage.components[componentName] = this.component;
						}
					}
				}
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
		}, elementOptions);
}