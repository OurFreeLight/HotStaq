import { HttpError } from "./HotHTTPServer";
import { HotRouteMethodParameter, HotValidation, HotValidationType, ServerRequest } from "./HotRouteMethod";
import { HotRouteMethodParameterMap, HotStaq, HotValidReturnType, IHotValidReturn } from "./HotStaq";

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
			result[key] = { validations: [{ type: HotValidationType.Text }] };
		else if (typeof (val) === "function")
			result[key] = await val();
		else
			result[key] = val;
	}
	return result;
}

// Recursive helper that validates a single value through its entire validation chain.
export async function validateRecursively(strictInput: boolean, key: string, input: any, 
	request: ServerRequest, validation?: HotValidation): Promise<IHotValidReturn>
{
	const value = input[key];

	if (HotStaq.preValidate != null)
	{
		const result = await HotStaq.preValidate (strictInput, key, validation, value, request);

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

	const validType = validation.type;

	if (validType === HotValidationType.Ignore)
		return { value: value };

	if (validType === HotValidationType.Delete)
		return { type: HotValidReturnType.Delete };

	const valid = HotStaq.valids[validType];

	if (valid == null)
		throw new HttpError (`Validation '${validType}' not found.`, 500);

	if (validation.defaultValue != null)
	{
		if (value == null)
			return { value: validation.defaultValue };
	}

	let newResult = null;

	if (valid instanceof Function)
	{
		newResult = await valid (strictInput, key, validation, value, request);

		if (newResult != null)
		{
			if (newResult.type == null)
				newResult.type = HotValidReturnType.Return;

			if (newResult.type === HotValidReturnType.Delete)
				return { type: HotValidReturnType.Delete };
		}
	}
	else
	{
		let foundValid = valid[key];
		let compValid: HotRouteMethodParameter = null;

		if (foundValid instanceof Function)
			compValid = await foundValid ();
		else
			compValid = foundValid;

		if (compValid == null)
			throw new HttpError (`Key '${key}' not found in valid '${validType}'`, 403);

		const resolvedParams = await resolveParameters(compValid.parameters);
		const result = await processInput (strictInput, resolvedParams, value, request, key);
		newResult = { type: HotValidReturnType.Return, value: result };
	}

	if (HotStaq.postValidate != null)
	{
		newResult = await HotStaq.postValidate (strictInput, key, validation, newResult.value, request);

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

	return validateRecursively(strictInput, key, newResult.value, request, validation.next);
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
export async function processInput (strictInput: boolean, params: HotRouteMethodParameterMap, input: any, request: ServerRequest, parentKey: string = ""): Promise<any>
{
	const validatedInput: any = input;

	if (! (input instanceof Object))
		throw new Error(`Parameter '${parentKey}' must be an object.`);

	if (strictInput === true)
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
			paramDef = { validations: [{ type: (<HotValidationType>param) }] };
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

				for (let iIdx = 0; iIdx < paramDef.validations.length; iIdx++)
				{
					const validation = paramDef.validations[iIdx];

					try
					{
						let validValue = await validateRecursively(strictInput, key, input, request, validation);

						validReturnType = validValue.type;
						value = validValue.value;

						errMsg = null;

						break;
					}
					catch (err: any)
					{
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
				value = await processInput(strictInput, resolvedParams, value, request, key);
			}

			validatedInput[key] = value;
		}
		else
		{
			if (paramDef.required === true)
				throw new HttpError(`Parameter '${key}' is required but not provided.`, 400);
		}
	}

	return validatedInput;
}