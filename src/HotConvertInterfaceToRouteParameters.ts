import ts from "typescript";

export interface InterfaceProperty
{
	name: string;
	type: string;
	isOptional: boolean;
	comments: string[];
	child: ParsedInterface | null;
}

export interface ParsedInterface
{
	name: string;
	comments: string[];
	properties: InterfaceProperty[];
}

/**
 * Parse an interface from a TypeScript source file, and return a ParsedInterface object.
 */
export function parseInterface (tempFileLocation: string, sourceCode: string, interfaceName: string): ParsedInterface | null
{
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

					properties.push({
						name: propertyName,
						type: propertyType,
						isOptional: propertyOptional,
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