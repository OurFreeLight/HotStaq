import * as ppath from "path";

import fetch from "node-fetch";
import validateModuleName from "validate-npm-package-name";
import DOMPurify from "dompurify";

import { HotPage } from "./HotPage";
import { HotFile } from "./HotFile";

import { HotComponent, IHotComponent } from "./HotComponent";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotAPI } from "./HotAPI";
import { HotServer } from "./HotServer";
import { DeveloperMode, Hot } from "./Hot";
import { HotAsset } from "./HotAsset";
import { HotModule } from "./HotModule";
import { HotClient } from "./HotClient";

import { HotTester } from "./HotTester";
import { HotTesterAPI } from "./HotTesterAPI";
import { HotTestMap } from "./HotTestMap";
import { HotTestDestination} from "./HotTestDestination";

import { HotSite, HotSiteRoute } from "./HotSite";

import { registerComponent } from "./HotStaqRegisterComponent";
import { hotStaqWebStart } from "./HotStaqWebStart";
import { HotRouteMethodParameter, HotValidation, HotValidationType, ServerRequest } from "./HotRouteMethod";
import { validateRecursively, ValidationOptions } from "./HotProcessInput";
import { HttpError } from "./HotHttpError";

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
 * TypeScript conversion options for converting interfaces into usable parameters.
 */
export interface ITypeScriptConversionOptions
{
	/**
	 * The type conversions to use when converting TypeScript types into 
	 * parameter types.
	 */
	typeConversions?: { [typeName: string]: string; };
	/**
	 * If set to true, the first union type will be returned. If set to false,
	 * the entire union will be returned.
	 */
	returnFirstUnionType?: boolean;
	/**
	 * The default type to use when the available OpenAPI type is unknown or 
	 * is not a raw data type.
	 */
	unknownTypeDefaultsToType?: string;
	/**
	 * The path to the TypeScript config file to use when parsing the interface.
	 * The interfaces must be in the project that the config file points to.
	 */
	tsconfigPath?: string;
}

export type HotValidatorFunction = (((options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest) => IHotValidReturn) | 
	((options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest) => Promise<IHotValidReturn>));

export type HotRouteMethodParameterMap = { [propertyName: string]: HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>); };

export enum HotValidReturnType
{
	/**
	 * Indicates that the value should be deleted.
	 */
	Delete,
	/**
	 * Indicates that the value should be kept. This is the default value.
	 */
	Return,
	/**
	 * Indicates that the value should be ignored.
	 */
	Ignore
}

export interface IHotValidReturn
{
	/**
	 * How this return should be handled.
	 */
	type?: HotValidReturnType;
	/**
	 * If set to any value, this will change the return type of the validation.
	 */
	validationType?: HotValidationType;
	/**
	 * The value to be returned. This will only be used if the type is set to 
	 * Return or Ignore.
	 */
	value?: any;
}

export interface ParsedInterface
{
	type: string;
	typeName?: string;
	description: string;
	required: boolean;
	isReadOnly: boolean;
	isArray: boolean;
	parameters: { [propName: string]: ParsedInterface };
	valids?: HotValidation[];
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
	 * The imported modules.
	 */
	modules?: { [name: string]: HotModule };
	/**
	 * The components that can be constructed.
	 * 
	 * @fixme Rename this to componentTags.
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
	static version: string = "0.8.124";
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
	 * Executes this event when this page has received output for processing.
	 * 
	 * @param output The output that is about to be used to generate the current page.
	 */
	static onOutputReceived: (output: string) => void = null;
	/**
	 * Executes this event when this page is ready for testing.
	 * 
	 * @param output The output that was used to generate the current page.
	 */
	protected static onReadyEvent: (output: string) => void = null;
	/**
	 * If set to false, the page will not emit DOMContentLoaded or window.load.
	 */
	static dispatchReadyEvents: boolean = true;
	/**
	 * Errors to execute when something goes wrong.
	 */
	static errors: { [name: string]: { redirectToUrl?: string; func?: (errType: string) => void; }; } = {};
	/**
	 * The function to execute before validating any input. This is good for ensuring certain 
	 * users such as admins are allowed to skip validations when necessary.
	 */
	static preValidate: ((options: ValidationOptions, key: string, validation: HotValidation, 
		value: any, request: ServerRequest) => Promise<IHotValidReturn>) = null;
	/**
	 * The validations to perform on data.
	 */
	static valids: { [name: string]: HotValidatorFunction | HotRouteMethodParameterMap; } = {};
	/**
	 * The function to execute after validating any input. This will not execute if a validation 
	 * has failed.
	 */
	static postValidate: ((options: ValidationOptions, key: string, validation: HotValidation, 
		value: any, request: ServerRequest) => Promise<IHotValidReturn>) = null;
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
	 * The imported modules.
	 */
	modules: { [name: string]: HotModule };
	/**
	 * The components that can be constructed.
	 * 
	 * @fixme Rename this to componentTags.
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
	 * Add a start delay before starting. This is for debugging purposes mostly.
	 */
	startDelay: number;
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
		this.logger = new HotLog (HotLogLevel.All);
		this.startDelay = 0;
		this.api = copy.api || null;
		this.testerAPI = copy.testerAPI || null;
		this.mode = copy.mode || DeveloperMode.Production;
		this.pages = copy.pages || {};
		this.modules = copy.modules || {};
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
		window.hotstaqStartingApp = true;

		for (let key in HotStaqWeb)
			window[key] = HotStaqWeb[key];
	</script>

%apis_to_load%

	<script type = "text/javascript">
		async function hotstaq_startApp ()
		{
			let tempMode = 0;

			if (window["Hot"] != null)
				tempMode = Hot.Mode;

			%start_delay%

			var processor = new HotStaq ();
			processor.logger.logLevel = %logging_level%;

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
		this.publicKeys = {};
		this.testers = {};
	}

	/**
	 * Do a base validation check.
	 */
	static baseValidator (options: ValidationOptions, key: string, validation: HotValidation, value: any): boolean
	{
		// notEmptyOrNull check.
		if (validation.notEmptyOrNull)
		{
			if ((value === undefined) || (value === null))
				throw new Error (`Parameter '${key}' must not be empty or null.`);

			if (typeof (value) === "string")
			{
				if (value === "")
					throw new Error (`Parameter '${key}' must not be empty or null.`);
			}
		}

		// Comparison checks.
		if (validation.comparison)
		{
			const comp = validation.comparison;

			if ((comp.greaterThan !== undefined) && !(value > comp.greaterThan))
				throw new Error (`Parameter '${key}' must be greater than ${comp.greaterThan}.`);

			if ((comp.lessThan !== undefined) && !(value < comp.lessThan))
				throw new Error (`Parameter '${key}' must be less than ${comp.lessThan}.`);

			if ((comp.eq !== undefined) && (value !== comp.eq))
				throw new Error (`Parameter '${key}' must equal ${comp.eq}.`);

			if ((comp.not !== undefined) && (value === comp.not))
				throw new Error (`Parameter '${key}' must not equal ${comp.not}.`);
		}
	
		// Allowed values check.
		if (validation.values)
		{
			if (validation.values.length > 0)
			{
				if (!validation.values.includes (value))
					throw new Error (`Parameter '${key}' must be one of the allowed values.`);
			}
		}

		return (true);
	}

	/**
	 * Setup the initial validators.
	 */
	static setupValidators (): void
	{
		HotStaq.valids["undefined"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (value !== undefined)
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be undefined.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["null"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (value !== null)
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be null.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["Text"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				// Minimum length check.
				if (validation.min !== undefined)
				{
					if (value.length < validation.min)
						throw new HttpError (`Text parameter '${key}' must be at least ${validation.min} characters long.`, 400);
				}

				// Maximum length check.
				if (validation.max !== undefined)
				{
					if (value.length > validation.max)
						throw new HttpError (`Text parameter '${key}' must be at most ${validation.max} characters long.`, 400);
				}

				// Regex check.
				if (validation.regex)
				{
					const regex = typeof (validation.regex) === "string" ? new RegExp(validation.regex) : validation.regex;

					if (regex.test(value) === false)
						throw new HttpError(`Text parameter '${key}' does not match the required regex pattern ${validation.regex}`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["number"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "number")
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be a number.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				// Minimum value check.
				if (validation.min !== undefined)
				{
					if (value < validation.min)
						throw new HttpError (`The value of number parameter '${key}' must be greater than ${validation.min}.`, 400);
				}

				// Maximum value check.
				if (validation.max !== undefined)
				{
					if (value > validation.max)
						throw new HttpError (`The value of number parameter '${key}' must be less than ${validation.max}.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["Number"] = HotStaq.valids["number"];
		HotStaq.valids["Integer"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "number")
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be a number.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const testNum = parseInt (value);

				if (isNaN (testNum) === true)
					throw new HttpError (`The value of number parameter '${key}' must be an integer.`, 400);

				// Minimum value check.
				if (validation.min !== undefined)
				{
					if (value < validation.min)
						throw new HttpError (`The value of number parameter '${key}' must be greater than ${validation.min}.`, 400);
				}

				// Maximum value check.
				if (validation.max !== undefined)
				{
					if (value > validation.max)
						throw new HttpError (`The value of number parameter '${key}' must be less than ${validation.max}.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["Float"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "number")
				{
					if (options.strictInput === true)
						throw new HttpError (`Parameter '${key}' must be a number.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const testNum = parseFloat (value);

				if (isNaN (testNum) === true)
					throw new HttpError (`The value of number parameter '${key}' must be an float.`, 400);

				// Minimum value check.
				if (validation.min !== undefined)
				{
					if (value < validation.min)
						throw new HttpError (`The value of number parameter '${key}' must be greater than ${validation.min}.`, 400);
				}

				// Maximum value check.
				if (validation.max !== undefined)
				{
					if (value > validation.max)
						throw new HttpError (`The value of number parameter '${key}' must be less than ${validation.max}.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["boolean"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "boolean")
				{
					if (options.strictInput === true)
						throw new HttpError (`Boolean parameter '${key}' must be a boolean.`, 400);
				}

				return ({ value: value });
			};
		HotStaq.valids["Boolean"] = HotStaq.valids["boolean"];
		HotStaq.valids["UUID"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`UUID parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

				if (uuidRegex.test (value) === false)
					throw new HttpError(`UUID parameter '${key}' must be a valid UUID.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["URL"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`URL parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

				if (regex.test (value) === false)
					throw new HttpError(`URL parameter '${key}' must be a valid http or https url.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["Email"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`Email parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

				if (emailRegex.test (value) === false)
					throw new HttpError(`Email parameter '${key}' must be a valid email.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["Phone"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`Phone parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				const phoneRegex = /^\+?[1-9]\d{1,14}$/;

				if (phoneRegex.test(value) === false)
					throw new HttpError(`Phone parameter '${key}' must be a valid phone number using regex /^\\+?[1-9]\\d{1,14}$/.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["IPv4"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`Phone parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				// Test if value is a valid IPv4 string
				const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

				if (ipRegex.test(value) === false)
					throw new HttpError(`IPv4 parameter '${key}' must be a valid IPv4 address.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["IPv6"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (typeof (value) !== "string")
				{
					if (options.strictInput === true)
						throw new HttpError (`Phone parameter '${key}' must be a string.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				// Test if value is a valid IPv6 string
				const ipRegex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:/;

				if (ipRegex.test(value) === false)
					throw new HttpError(`IPv4 parameter '${key}' must be a valid IPv4 address.`, 400);

				return ({ value: value });
			};
		HotStaq.valids["Date"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if ((! (value instanceof Date)) && (typeof (value) !== "string"))
				{
					if (options.strictInput === true)
						throw new HttpError (`Date parameter '${key}' must be a string or Date.`, 400);
				}

				HotStaq.baseValidator (options, key, validation, value);

				if (isNaN (Date.parse(value)))
					throw new HttpError(`Date parameter '${key}' must be a valid date.`);

				return ({ value: value });
			};
		HotStaq.valids["Object"] = async function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): Promise<IHotValidReturn>
			{
				if (typeof (value) !== "object")
				{
					if (options.strictInput === true)
						throw new HttpError (`Object parameter '${key}' must be an object.`, 400);
				}

				if (validation.properties)
				{
					for (let propKey in validation.properties)
					{
						const propValid = validation.properties[propKey];

						const valueUnsafe = HotStaq.getParamUnsafe (propKey, value, true, true);
						const validResult = await validateRecursively (options, propKey, valueUnsafe, request, propValid);
					}
				}

				return ({ value: value });
			};
		HotStaq.valids["Array"] = async function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): Promise<IHotValidReturn>
			{
				if ((value instanceof Array) === false)
				{
					if (options.strictInput === true)
						throw new HttpError (`Array parameter '${key}' must be a string.`, 400);
				}

				if (Array.isArray (value) === false)
					throw new HttpError(`Parameter '${key}' must be an array.`, 400);
		
				if (validation.associatedValids == null)
					throw new HttpError(`Parameter '${key}' must have an associated type(s) that describes each item.`, 400);

				if (validation.notEmptyOrNull != null)
				{
					if (value.length === 0)
						throw new HttpError(`Array parameter '${key}' must not be empty or null.`, 400);
				}

				if (validation.min != null)
				{
					if (value.length < validation.min)
						throw new HttpError (`Array parameter '${key}' must have at least ${validation.min} items.`, 400);
				}

				if (validation.max != null)
				{
					if (value.length > validation.max)
						throw new HttpError (`Array parameter '${key}' must have at most ${validation.max} items.`, 400);
				}
		
				for (let iIdx = 0; iIdx < value.length; iIdx++)
				{
					const item = value[iIdx];
		
					for (let iJdx = 0; iJdx < validation.associatedValids.length; iJdx++)
					{
						const associatedValid = validation.associatedValids[iJdx];

						await validateRecursively (options, key, item, request, associatedValid);
					}
				}

				return ({ value: value });
			};
		HotStaq.valids["Map"] = async function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): Promise<IHotValidReturn>
			{
				if (typeof (value) !== "object")
				{
					if (options.strictInput === true)
						throw new HttpError (`Map parameter '${key}' must be an object or map.`, 400);
				}
		
				if (validation.associatedValids == null)
					throw new HttpError(`Parameter '${key}' must have an associated type that describes each map property.`, 400);
		
				for (let key2 in value)
				{
					const item = value[key2];

					for (let iJdx = 0; iJdx < validation.associatedValids.length; iJdx++)
					{
						const associatedValid = validation.associatedValids[iJdx];

						await validateRecursively (options, key2, item, request, associatedValid);
					}
				}

				return ({ value: value });
			};
		HotStaq.valids["Enum"] = function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): IHotValidReturn
			{
				if (! ((typeof (value) === "string") || (typeof (value) === "number")))
				{
					if (options.strictInput === true)
						throw new HttpError (`Enum parameter '${key}' must be a string or number.`, 400);
				}

				if (validation.values && !validation.values.includes(value))
					throw new HttpError(`Enum parameter '${key}' must be one of the allowed enum values: ${validation.values.join(", ")}`, 400);

				return ({ value: value });
			};
		HotStaq.valids["JS"] = async function (options: ValidationOptions, key: string, validation: HotValidation, value: any, request: ServerRequest): Promise<IHotValidReturn>
			{
				if ((! (value instanceof Function)) && (typeof (value) !== "string"))
				{
					if (options.strictInput === true)
						throw new HttpError (`JS parameter '${key}' must be a string or Function.`, 400);
				}

				if (validation.func == null)
					throw new HttpError (`JS parameter '${key}' must be a valid JS function.`, 400);

				const valid = await validation.func (options, key, value);

				return (valid);
			};
	}

	/**
	 * Set a validator to be used.
	 */
	static setValid (validName: string, validator: HotValidatorFunction | HotRouteMethodParameterMap): void
	{
		HotStaq.valids[validName] = validator;
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
	 * Sanitize an HTML string.
	 */
	static sanitizeHTML (html: string): string
	{
		return (DOMPurify.sanitize (html));
	}

	/**
	 * Sanitize a JSON object by recursively encoding string values that are present 
	 * in the JSON to prevent XSS attacks.
	 */
	static sanitizeJSON<T> (obj: T): T
	{
		if (Array.isArray (obj))
			return (obj.map (HotStaq.sanitizeJSON) as T);
	
		if (obj !== null)
		{
			if (typeof (obj) === "object")
			{
				return (Object.fromEntries (
						Object.entries(obj).map(([key, value]) => [key, HotStaq.sanitizeJSON (value)])
					) as T);
			}
		}
	
		// Sanitize string values
		if (typeof (obj) === "string")
			return (HotStaq.sanitizeHTML (obj) as T);
	
		// Leave numbers, booleans, null, etc. untouched
		return (obj);
	}

	/**
	 * Recursively converts a ParsedInterface's parameters into a deep parameters map.
	 * For an array property, the returned schema will have "type": "array" and an "items" property.
	 * For object properties with nested parameters, a "properties" key is added.
	 */
	static convertParsedInterfaceToParameters(parsed: ParsedInterface): HotRouteMethodParameterMap
	{
		const result: HotRouteMethodParameterMap = {};

		for (const key in parsed.parameters)
		{
			const prop: ParsedInterface = parsed.parameters[key];

			// Build the base mapping for the property.
			const param: HotRouteMethodParameter = {
					type: prop.type, // one of your allowed raw types ("string", "number", "object", etc.)
					required: prop.required,
					description: prop.description || ""
				};

			if (prop.isReadOnly)
				param.readOnly = true;

			if (prop.valids)
				param.validations = prop.valids;

			// If the property is an array, set type to "array" and compute its items schema.
			if (prop.isArray)
			{
				param.type = "array";
				// If there are nested parameters (e.g. an inline object as the array element),
				// recursively process them; otherwise, use the element type.
				if (prop.parameters && Object.keys(prop.parameters).length > 0)
				{
					// Wrap the nested parameters into an object schema.
					param.items = HotStaq.convertParsedInterfaceToParameters({
							type: "object",
							typeName: "",
							description: "",
							required: true,
							isReadOnly: false,
							isArray: false,
							parameters: prop.parameters
						});
				}
				else
				{
					// If no nested parameters, use the typeName for the element.
					param.items = { type: prop.typeName || prop.type };
				}
			}
			else
			{
				// If not an array and there are nested parameters,
				// add them under a "properties" key.
				if (prop.parameters && Object.keys(prop.parameters).length > 0)
				{
					param.parameters = HotStaq.convertParsedInterfaceToParameters({
							type: "object",
							typeName: "",
							description: "",
							required: true,
							isReadOnly: false,
							isArray: false,
							parameters: prop.parameters
						});
				}
			}

			result[key] = param;
		}

		return result;
	}

	/**
	 * Convert a TypeScript interface to a route parameter. This is experimental, but still works decently.
	 * 
	 * @param addToValids If this is set to true, the converted interface will be added to the valids list so it can be used to 
	 * help validate future data.
	 */
	static async convertInterfaceToRouteParameters (interfaceName: string | { name: string; }, 
			addToValids: boolean = true,
			options: ITypeScriptConversionOptions = null
		): Promise<HotRouteMethodParameterMap>
	{
		let parameters: HotRouteMethodParameterMap = {};

		if (HotStaq.isWeb === true)
			throw new Error (`HotStaq.convertInterfaceToRouteParameters is not supported in the browser.`);

		if (options == null)
		{
			options = {
					typeConversions: { "Date": "string" }, 
					returnFirstUnionType: true,
					unknownTypeDefaultsToType: "string",
					tsconfigPath: null
				};
		}

		let ifaceName: string = "";

		if (typeof (interfaceName) === "string")
			ifaceName = interfaceName;
		else
			ifaceName = interfaceName.name;

		let generateParsedInterface: (
			interfaceName: string,
			tsConfigFilePath: string
		  ) => Promise<ParsedInterface> = eval ("require")("./HotConvertInterfaceToRouteParameters").generateParsedInterface;
		let tsConfigPath = ppath.join(process.cwd(), "tsconfig.json");

		if (options.tsconfigPath != null)
			tsConfigPath = options.tsconfigPath;

		const output: ParsedInterface = await generateParsedInterface (ifaceName, tsConfigPath);

		if (output == null)
			throw new Error (`Interface ${ifaceName} not found.`);

		parameters = HotStaq.convertParsedInterfaceToParameters (output);

		if (addToValids === true)
			HotStaq.setValid (ifaceName, parameters);

		return (parameters);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value.
	 */
	static async getParam (validate: HotValidationType | HotValidation, name: string, objWithParam: any, request: ServerRequest, required: boolean = true, 
		throwException: boolean = true, options: ValidationOptions = new ValidationOptions ()): Promise<any>
	{
		if (typeof (validate) === "string")
		{
			validate = {
					type: validate
				} as HotValidation;
		}

		const result = await validateRecursively (options, name, objWithParam, request, validate);

		return (result.value);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value, ensure the 
	 * number returned is within a certain range.
	 * 
	 * The value retrieved must be a number.
	 */
	static async getParamRange (validate: HotValidationType | HotValidation, name: string, objWithParam: any, 
		min: number, max: number, request: ServerRequest, required: boolean = true, 
		throwException: boolean = true, options: ValidationOptions = new ValidationOptions ()): Promise<any>
	{
		if (typeof (validate) === "string")
		{
			validate = {
					type: validate
				} as HotValidation;
		}

		const result = await validateRecursively (options, name, objWithParam, request, validate);

		return (result.value);
	}

	static async getParamDefault (validate: HotValidationType | HotValidation, name: string, objWithParam: any, 
		defaultValue: any, request: ServerRequest, options: ValidationOptions = new ValidationOptions ()): Promise<any>
	{
		if (typeof (validate) === "string")
		{
			validate = {
					type: validate
				} as HotValidation;
		}

		const result = await validateRecursively (options, name, objWithParam, request, validate);

		return (result.value);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value, ensure the 
	 * number returned is within a certain range. If it does not exist, return a default value instead.
	 * 
	 * The value retrieved must be a number.
	 */
	static async getParamDefaultRange (validate: HotValidationType | HotValidation, name: string, objWithParam: any, 
		defaultValue: any, min: number, max: number, request: ServerRequest, options: ValidationOptions = new ValidationOptions ()): Promise<any>
	{
		if (typeof (validate) === "string")
		{
			validate = {
					type: validate
				} as HotValidation;
		}

		const result = await validateRecursively (options, name, objWithParam, request, validate);

		return (result.value);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value.
	 */
	static getParamUnsafe (name: string, objWithParam: any, required: boolean = true, throwException: boolean = true): any
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
	 * Check if a required parameter exists inside an object. If it exists, return the value, ensure the 
	 * number returned is within a certain range.
	 * 
	 * The value retrieved must be a number.
	 */
	static getParamRangeUnsafe (name: string, objWithParam: any, min: number, max: number, required: boolean = true, throwException: boolean = true): any
	{
		const value = HotStaq.getParamUnsafe (name, objWithParam, required, throwException);

		if (value < min)
			throw new Error (`Parameter ${name} must be greater than or equal to ${min}.`);

		if (value > max)
			throw new Error (`Parameter ${name} must be less than or equal to ${max}.`);

		return (value);
	}

	/**
	 * Check if a required parameter exists inside an object. If it exists, return the value.
	 * If it does not exist, return a default value instead.
	 */
	static getParamDefaultUnsafe (name: string, objWithParam: any, defaultValue: any): any
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
	 * Check if a required parameter exists inside an object. If it exists, return the value, ensure the 
	 * number returned is within a certain range. If it does not exist, return a default value instead.
	 * 
	 * The value retrieved must be a number.
	 */
	static getParamDefaultRangeUnsafe (name: string, objWithParam: any, defaultValue: any, min: number, max: number): any
	{
		const value = HotStaq.getParamDefaultUnsafe (name, objWithParam, defaultValue);

		if (value < min)
			throw new Error (`Parameter ${name} must be greater than or equal to ${min}.`);

		if (value > max)
			throw new Error (`Parameter ${name} must be less than or equal to ${max}.`);

		return (value);
	}

	/**
	 * Check if a value is null or empty.
	 * 
	 * @returns Returns true if the value is an empty string, null, undefined, 0, etc.
	 */
	static checkIfEmpty (value: any): boolean
	{
		if (!value)
			return (true);

		return (false);
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
		return (new Promise ((resolve, reject) =>
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
	 * Add an imported module.
	 */
	addModule (name: string, module: HotModule): void
	{
		this.modules[name] = module;
	}

	/**
	 * Get an imported module.
	 */
	getModule (name: string): HotModule
	{
		return (this.modules[name]);
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
	getFile (name: string, throwEx: boolean = true): HotFile
	{
		if (this.files[name] == null)
		{
			let pos: number = name.indexOf ("?hstqserve=");
			let tempName: string = name;

			if (pos > -1)
				tempName = name.substring (0, pos);

			if (this.files[tempName] != null)
				return (this.files[tempName]);

			if (throwEx === true)
				throw new Error (`Unable to find file ${name}`);

			return (null);
		}

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
	addComponent (ComponentType: (new (copy: IHotComponent | HotStaq, api?: HotAPI) => HotComponent), api: HotAPI = null, 
		elementOptions: ElementDefinitionOptions = undefined): void
	{
		let tempApi = this.api

		if (api != null)
			tempApi = api;

		let tempComponentObj = new ComponentType (this, tempApi);

		if (this.components[tempComponentObj.tag] != null)
			throw new Error (`Component ${tempComponentObj.tag} already exists!`);

		this.components[tempComponentObj.tag] = { componentType: ComponentType, processor: this, api: tempApi };
		registerComponent.call (this, tempComponentObj.tag, elementOptions);
	}

	/**
	 * Correct any HTML prior to DOM parsing. This only accounts for <tr> currently.
	 */
	static fixHTML (str: string): { fixedStr: string, querySelector: string; }
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
	 * Add a new HTML element(s) to the current document. THIS IS UNSAFE TO DO DIRECTLY.
	 */
	static addHtmlUnsafe (parent: string | HTMLElement | null, html: string | HTMLElement): HTMLElement | HTMLElement[]
	{
		let foundParent: HTMLElement = null;

		if (typeof (parent) === "string")
			foundParent = document.querySelector (parent);
		else
			foundParent = parent;

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

				if (foundParent != null)
					foundParent.appendChild (child);

				results.push (child);
			}

			return (results);
		}
		else
		{
			if (foundParent != null)
				foundParent.appendChild (html);

			result = html;
		}

		return (result);
	}

	/**
	 * Check if a HotSite's name is valid.
	 */
	static checkHotSiteName (hotsiteName: string, throwException: boolean = false): boolean
	{
		let results = validateModuleName (hotsiteName);
		let isValid: boolean = true;

		if (results.validForNewPackages === false)
			isValid = false;

		if (results.errors != null)
		{
			if (results.errors.length > 0)
				isValid = false;
		}

		if (isValid === false)
		{
			if (throwException === true)
				throw new Error (`HotSite ${hotsiteName} has an invalid name! The name cannot be empty and must have a valid NPM module name.`);
		}

		return (isValid);
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
	async processHotSite (tester: HotTester = null): Promise<void>
	{
		HotStaq.checkHotSiteName (this.hotSite.name, true);

		let routes = this.hotSite.routes;

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

		if (this.hotSite.web != null)
		{
			for (let key in this.hotSite.web)
			{
				const web = this.hotSite.web[key];

				if (web.map == null)
					continue;

				if (HotStaq.isWeb === false)
				{
					if (this.mode === DeveloperMode.Development)
					{
						let mapName: string = key;
						let testMap: HotTestMap = new HotTestMap ();

						testMap.destinations = [];

						for (let iIdx = 0; iIdx < web.map.length; iIdx++)
						{
							let map: string = web.map[iIdx];

							testMap.destinations.push (new HotTestDestination (map));
						}

						if (tester != null)
							tester.testMaps[mapName] = testMap;
						else
							this.logger.warning ("A tester was not created first! You must specify one in the CLI.");
					}
				}
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

						if (tester != null)
							tester.testMaps[mapName] = testMap;
						else
							this.logger.warning ("A tester was not created first! You must specify one in the CLI.");
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
			await this.loadHotFiles (this.hotSite.files, false, false);
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
		const ext: string = ppath.extname (path).toLowerCase ();

		if (HotStaq.isWeb === true)
		{
			this.logger.verbose (`Downloading HotSite ${path}`);

			let res: any = await fetch (path);

			this.logger.verbose (`Downloaded site ${path}`);

			jsonStr = res.text ();
		}
		else
		{
			path = ppath.normalize (path);

			this.logger.verbose (`Accessing HotSite ${path}`);

			let HotIO = eval ("require")("./HotIO").HotIO; // Hack to get around Webpack.

			if (await HotIO.exists (path) === false)
				throw new Error (`HotSite ${path} does not exist!`);

			jsonStr = await HotIO.readTextFile (path);
			this.logger.verbose (`Accessed site ${path}`);
		}

		if ((ext === ".yaml") || (ext === ".yml"))
		{
			if (HotStaq.isWeb === true)
				throw new Error (`YAML support for HotSites is not available on the web yet!`);

			let yaml = eval ("require")("yaml"); // Hack to get around Webpack.
			this.hotSite = yaml.parse (jsonStr);
		}
		else
			this.hotSite = JSON.parse (jsonStr);

		if (this.hotSite == null)
			throw new Error (`HotSite ${path} cannot be null!`);

		this.hotSite.hotsitePath = path;
	}

	/**
	 * Save the current HotSite to a file.
	 */
	async saveHotSite (path: string): Promise<void>
	{
		if (HotStaq.isWeb === true)
			throw new Error (`Cannot save a HotSite on the web!`);

		const ext: string = ppath.extname (path).toLowerCase ();
		let hotsiteStr: string = "";

		if ((ext === ".yaml") || (ext === ".yml"))
		{
			let yaml = eval ("require")("yaml"); // Hack to get around Webpack.
			hotsiteStr = yaml.stringify (this.hotSite);
		}
		else
			hotsiteStr = JSON.stringify (this.hotSite, null, 2);

		let HotIO = eval ("require")("./HotIO").HotIO; // Hack to get around Webpack.
		await HotIO.writeTextFile (path, hotsiteStr);
		this.logger.verbose (`Saved site ${path}`);
	}

	/**
	 * Load an array of files. If a file already has content, it will not be reloaded 
	 * unless forceContentLoading is set to true.
	 */
	async loadHotFiles (files: { [name: string]: { url?: string; localFile?: string; content?: string; } }, 
			forceContentLoading: boolean = false, loadUrlContent: boolean = true): Promise<void>
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
			{
				if (HotStaq.isWeb === true)
					newFile.url = `${file.url}?hstqserve=nahfam`;
				else
					newFile.url = file.url;
			}

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

			if (loadUrlContent === false)
			{
				if (newFile.url !== "")
					loadContent = false;
			}

			if (loadContent === true)
			{
				this.logger.verbose (`Loading Hott file: ${newFile.url}`);
				await newFile.load ();
				this.logger.verbose (`Finished loading Hott file: ${newFile.url}`);
			}

			this.addFile (newFile);
		}

		this.logger.verbose (`Finished loading Hott files...`);
	}

	/**
	 * Generate the content to send to a client.
	 */
	async generateContent (routeKey: string, name: string = "", url: string = "./",
			jsSrcPath: string = "./js/HotStaq.min.js", passArgs: boolean = true, 
			args: any = null): Promise<string>
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

						if (route.api !== this.hotSite.server.globalApi)
						{
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
		let fixContent = async (tempContent: string) =>
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
						let asset: HotAsset = new HotAsset ("html", key);

						if (file.localFile !== "")
							asset.path = file.localFile;

						if (file.url !== "")
							asset.path = file.url;

						if (file.content !== "")
						{
							asset.path = "";
							asset.content = file.content;
						}

						let output = await asset.output ();

						if (typeof (output) === "string")
							throw new Error (`During initial load, HTML assets cannot be outputted using only a string!`);

						let fileUrl: string = "";
						let fileContent: string = "";

						if (output.url != null)
							fileUrl = `"url": "${output.url}", `;

						if (output.content != null)
							fileContent = `"content": ${output.content}`; // May have to escape the content?

						loadFiles += `\t\t\tfiles["${output.name}"] = { ${fileUrl}${fileContent} };\n`;
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
				let testerName: string = "HotTesterMochaSelenium";

				for (let key in this.testers)
				{
					testerName = key;
					break;
				}

				if (this.hotSite != null)
				{
					if (this.hotSite.testing != null)
					{
						if (this.hotSite.testing.web != null)
						{
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

				let startDelayStr: string = "";

				if (this.startDelay !== 0)
					startDelayStr = `await HotStaq.wait (${this.startDelay});`;

				tempContent = tempContent.replace (/\%start\_delay\%/g, startDelayStr);
				tempContent = tempContent.replace (/\%logging\_level\%/g, `HotLogLevel.${HotLogLevel[this.logger.logLevel]}`);
				tempContent = tempContent.replace (/\%hotstaq\_js\_src\%/g, jsSrcPath);
				tempContent = tempContent.replace (/\%developer\_mode\%/g, developerModeStr);
				tempContent = tempContent.replace (/\%tester\_api\%/g, testerAPIStr);
				tempContent = tempContent.replace (/\%apis\_to\_load\%/g, apiScripts);
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
		content = await fixContent (content);

		return (content);
	}

	/**
	 * Create the Express routes from the given pages. Be sure to load the 
	 * pages first before doing this. This method is meant to be used for 
	 * customized Express applications. If you wish to use the loaded routes 
	 * from this HotStaq object with HotHTTPServer, be sure to use 
	 * the loadHotSite method in HotHTTPServer.
	 */
	async createExpressRoutes (expressApp: any, jsSrcPath: string = "./js/HotStaq.min.js"): Promise<void>
	{
		for (let key in this.pages)
		{
			let page: HotPage = this.pages[key];
			const content: string = await this.generateContent (page.route, page.name, page.files[0].url, jsSrcPath);

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

			if (this.hotSite.web != null)
			{
				for (let key in this.hotSite.web)
				{
					let web = this.hotSite.web[key];

					if (web != null)
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

		this.logger.verbose (() => `Executing all API tests for tester ${testerName}. Maps: ${JSON.stringify (maps)}`);

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
	static onReady (readyFunc: (output: string) => void): void
	{
		HotStaq.onReadyEvent = readyFunc;
	}

	/**
	 * Replace the current HTML page with the output.
	 * This is meant for web browser use only.
	 */
	static async useOutput (output: string): Promise<void>
	{
		if (HotStaq.onOutputReceived != null)
			HotStaq.onOutputReceived (output);

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

		if (HotStaq.dispatchReadyEvents === true)
		{
			document.dispatchEvent (new Event ("DOMContentLoaded"));
			window.dispatchEvent (new Event("load"));
		}

		if (HotStaq.onReadyEvent != null)
			HotStaq.onReadyEvent (output);
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
			window.addEventListener ("beforeunload",
				(event) =>
				{
					HotStaqWeb.HotStaq.isReadyForTesting = false;

					Hot.TesterAPI.tester.pageUnloaded ({
							testerName: Hot.CurrentPage.testerName
						}).then (function (resp)
							{
								if (resp.error != null)
								{
									if (resp.error !== "")
										throw new Error (resp.error);
								}
							});
				});

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
	 * When the window has finished loading, execute the function. This 
	 * is meant to start executing HotStaq.
	 */
	static onInitalLoad (readyFunc: () => void): void
	{
		if ((document.readyState === "complete") || (document.readyState === "interactive"))
			readyFunc ();
		else
			window.addEventListener ("load", readyFunc, { "once": true });
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
				HotStaq.onInitalLoad (async () =>
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

						if (processor.mode === DeveloperMode.Development)
							Hot.Debugger.benchmark = true;

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
				HotStaq.onInitalLoad (async () =>
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

HotStaq.setupValidators ();

if (typeof (document) !== "undefined")
{
	// @ts-ignore
	window.HotAPI = HotAPI;
	window.addEventListener ("load", hotStaqWebStart);
}
