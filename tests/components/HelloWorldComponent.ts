import { HotStaq } from "../../src/HotStaq";
import { HotComponent, IHotComponent } from "../../src/HotComponent";

import { HelloWorldAPI } from "../server/HelloWorldAPI";

export class HelloWorld extends HotComponent
{
	api: HelloWorldAPI;
	storedTestValue: string;

	constructor (copy: IHotComponent | HotStaq, api: HelloWorldAPI)
	{
		super (copy, api);

		this.name = "hello-world";
		this.tag = this.name;
		this.value = "Hello World!";
		this.storedTestValue = "bla-test";
	}

	async click (): Promise<void>
	{
		if (this.value === "Hello World!")
			document.getElementById ("buttonClicked").innerHTML = "Clicked";
		else
		{
			let message: string = (<HTMLInputElement>document.getElementById ("message")).value;
			let result: string = await this.api.sayHello (message);
	
			document.getElementById ("buttonClicked").innerHTML = JSON.stringify (result);
		}
	}

	test ()
	{
		// This ensures that when the function is called, it's being called from within 
		// the correct instantiated component.
		return (this.storedTestValue);
	}

	async output (): Promise<string>
	{
		return (`<button id = "${this.htmlElement.id}">
			${this.value}
		</button>`);
	}
}