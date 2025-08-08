import { HttpError } from "./HotHttpError";
import { HotRouteMethodParameter, HotValidation, ServerRequest } from "./HotRouteMethod";
import { HotRouteMethodParameterMap, HotStaq, HotValidReturnType, IHotValidReturn } from "./HotStaq";

/**
 * A validation error.
 */
export class ValidationError extends Error
{
	/**
	 * The valid type that threw the error.
	 */
	validType: any;

	constructor (message: string, validType: any)
	{
		super (message);

		this.name = "HttpError";
		this.validType = validType;
	}
}

/**
 * The options for when a falsy is triggered.
 */
export enum FalsyOptions
{
	/**
	 * Throw an error message if its triggered.
	 */
	ThrowError,
	/**
	 * Delete the key/value from the object.
	 */
	Delete,
	/**
	 * Continue on to the next key for validation.
	 */
	Continue
}

/**
 * The validation options available.
 */
export class ValidationOptions
{
	/**
	 * Ensure all parameters exist.
	 * @default false
	 */
	strictInput: boolean;
	/**
	 * How falsies are checked. When this returns true, that means the 
	 * falsy has been triggered. 
	 * @default null
	 */
	falsy: (value: any) => boolean;
	/**
	 * What should happen if a falsy is triggered.
	 * @default FalsyOptions.Continue
	 */
	falsyOptions: FalsyOptions;

	constructor (strictInput: boolean = false)
	{
		this.strictInput = strictInput;
		this.falsy = null;
		this.falsyOptions = FalsyOptions.Continue;
	}
}

// If a nested parameter is provided as a string, we assume a default parameter expecting text.
async function resolveParameters(
		nested: { [name: string]: string | HotRouteMethodParameter | (() => Promise<HotRouteMethodParameter>) }
	): Promise<HotRouteMethodParameterMap>
{
	const result: HotRouteMethodParameterMap = {};

	for (const key in nested)
	{
		const val = nested[key];
		if (typeof val === "string")
			result[key] = { validations: [{ type: "Text" }] };
		else if (typeof (val) === "function")
			result[key] = await val();
		else
			result[key] = val;
	}
	return result;
}

// Recursive helper that validates a single value through its entire validation chain.
export async function validateRecursively(options: ValidationOptions, key: string, input: any, 
	request: ServerRequest, validation?: HotValidation): Promise<IHotValidReturn>
{
	const value = input[key];

	if (HotStaq.preValidate != null)
	{
		const result = await HotStaq.preValidate (options, key, validation, value, request);

		if (result != null)
		{
			if (result.type == null)
				result.type = HotValidReturnType.Return;

			if (result.type === HotValidReturnType.Delete)
				return result;

			if (result.type === HotValidReturnType.Return)
				return result;

			if (result.validationType != null)
				validation.type = result.validationType;
		}
	}

	if (!validation)
		return { value: value };

	if (options.falsy != null)
	{
		if (options.falsy (value) === true)
		{
			if (options.falsyOptions === FalsyOptions.ThrowError)
				throw new Error (`Falsy "${key}" triggered by value ${value}.`);

			if (options.falsyOptions === FalsyOptions.Delete)
				return ({ type: HotValidReturnType.Delete });

			if (options.falsyOptions === FalsyOptions.Continue)
				return ({ type: HotValidReturnType.Ignore });
		}
	}

	const validType = validation.type;

	if (validType === "Ignore")
		return { value: value };

	if (validType === "Delete")
		return { type: HotValidReturnType.Delete };

	const valid = HotStaq.valids[validType];

	if (valid == null)
		throw new ValidationError (`Validation '${validType}' not found.`, validType);

	if (validation.defaultValue != null)
	{
		if (value == null)
			return { value: validation.defaultValue };
	}

	const validCheck = async (value2: any): Promise<any> =>
		{
			let newResult2 = null;

			if (valid instanceof Function)
			{
				newResult2 = await valid (options, key, validation, value2, request);
		
				if (newResult2 != null)
				{
					if (newResult2.type == null)
						newResult2.type = HotValidReturnType.Return;
		
					if (newResult2.type === HotValidReturnType.Delete)
						return { type: HotValidReturnType.Delete };
				}
			}
			else
			{
				const result = await processInput (options, valid, value2, request, key);
				newResult2 = { type: HotValidReturnType.Return, value: result };
				//let foundValid = valid[key];
				/*let foundValid = valid;
				let compValid: HotRouteMethodParameter = null;
		
				if (foundValid instanceof Function)
					compValid = await foundValid ();
				else
					compValid = foundValid;
		
				if (compValid == null)
					throw new HttpError (`Key '${key}' not found in valid '${validType}'`, 403);
		
				const resolvedParams = await resolveParameters(compValid.parameters);
				const result = await processInput (options, resolvedParams, value, request, key);
				newResult2 = { type: HotValidReturnType.Return, value: result };*/
			}

			return (newResult2);
		};

	let newResult: any = { type: HotValidReturnType.Return };

	if (value instanceof Array)
	{
		const resultValues = [];

		for (let iIdx = 0; iIdx < value.length; iIdx++)
		{
			const valueElm = value[iIdx];
			const newResult3 = await validCheck (valueElm);
		
			if (newResult3 != null)
			{
				if (newResult3.type === HotValidReturnType.Delete)
					continue;
			}

			resultValues.push (newResult3.value);
		}

		newResult.value = resultValues;
	}
	else
		newResult = await validCheck (value);

	if (HotStaq.postValidate != null)
	{
		newResult = await HotStaq.postValidate (options, key, validation, newResult.value, request);

		if (newResult != null)
		{
			if (newResult.type === HotValidReturnType.Delete)
				return { type: HotValidReturnType.Delete };

			if (newResult.type === HotValidReturnType.Return)
				return { value: newResult.value };
		}
	}

	if (newResult.type === HotValidReturnType.Return)
		return { value: newResult.value };

	return validateRecursively(options, key, newResult.value, request, validation.next);
}

/**
 * Main function that validates an input object against a parameters map,
 * including nested properties defined via the `parameters` property.
 * Unfortunately this is a shallow check, so if you have an object with
 * deeply nested properties, issues may arise. This feature is still 
 * considered experimental.
 * 
 * @experimental
 */
export async function processInput (options: ValidationOptions, params: HotRouteMethodParameterMap, 
	input: any, request: ServerRequest, parentKey: string = ""): Promise<any>
{
	const validatedInput: any = input;

	if (! (input instanceof Object))
		throw new Error(`Parameter '${parentKey}' must be an object.`);

	if (options.strictInput === true)
	{
		// Check that every key in input exists in params.
		// @fixme This is only a shallow check....
		for (const key in input) {
			if (!(key in params)) {
				throw new Error(`Unexpected parameter '${key}' provided.`);
			}
		}
	}

	// Process each key defined in the parameters.
	for (const key in params)
	{
		let paramDef: HotRouteMethodParameter;
		const param = params[key];

		if (typeof param === "function") {
			paramDef = await param();
		} else if (typeof param === "string") {
			paramDef = { validations: [{ type: param }] };
		} else {
			paramDef = param;
		}

		// Only validate if the key is present in the input.
		if (key in input)
		{
			let value = input[key];
			let validReturnType: HotValidReturnType = null;

			// Validate the value using its validation chain, if provided.
			if (paramDef.validations)
			{
				let errMsg = null;
				let isRequired = paramDef.required;

				for (let iIdx = 0; iIdx < paramDef.validations.length; iIdx++)
				{
					const validation = paramDef.validations[iIdx];

					try
					{
						let validValue = await validateRecursively(options, key, input, request, validation);

						validReturnType = validValue.type;
						value = validValue.value;

						errMsg = null;

						break;
					}
					catch (err: any)
					{
						// ValidationErrors should always be thrown no matter what.
						if (err instanceof ValidationError)
							throw err;

						errMsg = err;
					}
				}

				if (errMsg != null)
					throw errMsg;
			}

			if (validReturnType != null)
			{
				if (validReturnType === HotValidReturnType.Delete)
				{
					delete validatedInput[key];
					continue;
				}
			}

			// If nested parameters exist, ensure the value is an object and validate recursively.
			if (paramDef.parameters) {
				if (typeof value !== "object" || value === null) {
					throw new Error(`Parameter '${key}' must be an object.`);
				}
				let resolvedParams = await resolveParameters(paramDef.parameters);
				value = await processInput(options, resolvedParams, value, request, key);
			}

			validatedInput[key] = value;
		}
		else
		{
			if (paramDef.required === true)
			{
				let parentKeyStr = "";

				if (parentKey !== "")
					parentKeyStr = ` Parent Key: '${parentKey}'`;

				throw new HttpError(`Parameter '${key}' is required but not provided.${parentKeyStr}`, 400);
			}
		}
	}

	return validatedInput;
}