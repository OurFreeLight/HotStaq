import ts from "typescript";

import { InterfaceProperty, ITypeScriptConversionOptions, ParsedInterface } from "./HotStaq";

/**
 * Parse an interface from a TypeScript source file, and return a ParsedInterface object.
 */
export function parseInterface (tempFileLocation: string, sourceCode: string, 
	interfaceName: string, options: ITypeScriptConversionOptions): ParsedInterface | null
{
	const possibleRawTypes = [
		"string",
		"number",
		"integer",
		"boolean",
		"array",
		"object"
	];

	// Parse the source code into an AST using the TypeScript compiler API
	const sourceFile: ts.SourceFile = ts.createSourceFile (
			tempFileLocation,
			sourceCode,
			ts.ScriptTarget.Latest,
			/*setParentNodes*/ false
		);

	// Find the interface node in the AST
	let interfaceNode: ts.InterfaceDeclaration | null = null;
	let visit = (node: ts.Node) =>
	{
		if (ts.isInterfaceDeclaration(node))
		{
			if (node.name.getText (sourceFile) === interfaceName)
				interfaceNode = node;
		}

		ts.forEachChild(node, visit);
	};

	ts.forEachChild(sourceFile, visit);

	if (interfaceNode == null)
		return null;

	let getComments = (node: ts.Node) =>
		{
			const leadingComments = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
			let comments: string[] = [];

			if (leadingComments)
			{
				comments = leadingComments.map((commentRange) => sourceFile.text.substring(commentRange.pos, commentRange.end)
						.replace(/(^\/\*\*|\*\/|\*|\s*\/\/\/?|\s*\/\*|\s*\*\/)/gm, '') // Remove /**, */, *, ///, /*, and */
						.trim() // Trim whitespace
					);
			}

			return (comments);
		};

	let traverseInterface = (interfaceNode2: ts.Node, interfaceName2: string): ParsedInterface | null =>
	{
		let interfaceComments = getComments(interfaceNode2);

		// Extract information about the interface properties
		let properties: InterfaceProperty[] = [];

		ts.forEachChild (interfaceNode2, (childNode: ts.Node) =>
			{
				if (ts.isPropertySignature(childNode))
				{
					const propertyName = childNode.name.getText(sourceFile);
					let propertyType = childNode.type ? childNode.type.getText(sourceFile) : "any";
					const propertyComments = getComments(childNode);
					let propertyOptional: boolean = false;
					let propertyReadOnly: boolean = false;
					let propertyIsArray: boolean = false;

					if (childNode.questionToken != null)
						propertyOptional = true;

					let childInterface = null;

					// @ts-ignore
					if (ts.isTypeLiteralNode (childNode.type))
					{
						// @ts-ignore
						childInterface = traverseInterface (childNode.type, propertyName);
						propertyType = "object";
					}

					if (options.typeConversions != null)
					{
						if (options.typeConversions[propertyType] != null)
							propertyType = options.typeConversions[propertyType];
					}

					if (ts.isUnionTypeNode(childNode.type))
					{
						let unionTypes: string[] = [];

						childNode.type.types.forEach((type) =>
							{
								let pushType = true;
								let typeText = type.getText(sourceFile);

								if (options.typeConversions[typeText] != null)
									typeText = options.typeConversions[typeText];

								if ((options.returnFirstUnionType === true) && (unionTypes.length > 0))
									pushType = false;

								if (pushType === true)
									unionTypes.push(typeText);
							});

						propertyType = unionTypes.join(" | ");
					}

					if (ts.isArrayTypeNode(childNode.type))
						propertyIsArray = true;

					childNode.type.modifiers?.forEach((modifier) =>
						{
							if (modifier.kind === ts.SyntaxKind.ReadonlyKeyword)
								propertyReadOnly = true;

							if (ts.isArrayTypeNode(childNode.type))
								propertyIsArray = true;
						});

					if (options.unknownTypeDefaultsToType != null)
					{
						if (options.unknownTypeDefaultsToType !== "")
						{
							let foundType = false;

							for (let iIdx = 0; iIdx < possibleRawTypes.length; iIdx++)
							{
								if (propertyType === possibleRawTypes[iIdx])
								{
									foundType = true;

									break;
								}
							}

							if (foundType === false)
								propertyType = options.unknownTypeDefaultsToType;
						}
					}

					properties.push({
						name: propertyName,
						type: propertyType,
						isOptional: propertyOptional,
						readOnly: propertyReadOnly,
						isArray: propertyIsArray,
						comments: propertyComments,
						child: childInterface
					});
				}
			});

		return ({
				name: interfaceName2,
				comments: interfaceComments,
				properties: properties
			});
	};

	let newInterface: ParsedInterface | null = traverseInterface (interfaceNode, interfaceName);

	return (newInterface);
}