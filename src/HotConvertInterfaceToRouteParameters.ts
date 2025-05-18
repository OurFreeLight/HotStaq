import { IHotValidReturn, ParsedInterface } from "./HotStaq";
import ts from "typescript";
import { Project, InterfaceDeclaration, PropertySignature, TypeLiteralNode } from "ts-morph";
import { HotValidation, HotValidationType } from "./HotRouteMethod";

// Allowed raw types.
const allowedRawTypes = new Set(["string", "number", "integer", "boolean", "array", "object"]);

/**
 * Returns a cleaned-up description for a node.
 * It first checks for JSDoc docs via the node’s structure.
 * If none are found, it falls back to reading leading comments (// or ///) using TypeScript's API.
 */
function getNodeDescription(node: Node): string {
  let description = "";
  const structure: { docs?: { description?: string }[] } = (node as any).getStructure();
  if (structure.docs && structure.docs.length > 0) {
    description = structure.docs.map(doc => doc.description || "").join("\n").trim();
  }
  if (!description) {
	// @ts-ignore
    const sourceFile = node.getSourceFile();
    const fullText = sourceFile.getFullText();
	// @ts-ignore
    const pos = node.getFullStart();
    const commentRanges = ts.getLeadingCommentRanges(fullText, pos);
    if (commentRanges) {
      description = commentRanges
        .map(range => {
          let commentText = fullText.substring(range.pos, range.end);
          commentText = commentText
            .replace(/^\/\/\/?/, "") // remove /// or //
            .replace(/^\/\*+/, "")   // remove starting /*
            .replace(/\*+\/$/, "")   // remove ending */
            .trim();
          return commentText;
        })
        .join("\n")
        .trim();
    }
  }
  return description;
}

function extractValidFromRaw(propName: string, node: Node, rawType: string): HotValidation[]
{
	// @ts-ignore
	const sourceFile = node.getSourceFile();
	const fullText = sourceFile.getFullText();
	// @ts-ignore
	const pos = node.getFullStart();
	const commentRanges = ts.getLeadingCommentRanges(fullText, pos);
	let rawComments = "";

	if (commentRanges) {
		rawComments = commentRanges.map(range => fullText.substring(range.pos, range.end)).join("\n");
	}

	const validRegex = /@valid\s*([^\n]+)/g;
	const matches = [...rawComments.matchAll(validRegex)];

	if (matches.length > 0)
	{
		const validations: HotValidation[] = [];
		
		for (const match of matches)
		{
			if (match[1])
			{
        let validStr = null;

				try
				{
					validStr = match[1].trim();

          const isArray = validStr.endsWith ("[]");
					let parsed: HotValidation = {};

					if (validStr.startsWith("JS:"))
					{
						const jsStr = validStr.substring(3);
						parsed = {
							type: HotValidationType.JS,
							func: (<(input: any) => Promise<IHotValidReturn>>new Function(`return (async (value) => { ${jsStr} })()`))
						};
					} else if (!validStr.startsWith("{")) {
						parsed = { type: validStr as HotValidationType };
					} else if (isArray === true) {
            const parsedTypeStr = validStr.substring(0, validStr.indexOf ("[]"));
            parsed = { type: HotValidationType.Array, associatedValid: { type: parsedTypeStr as HotValidationType } };
          } else {
						parsed = JSON.parse(validStr);
					}

					if (parsed.type == null)
					{
						if (rawType === "string")
							rawType = "Text";
						if (parsed.values)
							rawType = "Enum";

						parsed.type = rawType as HotValidationType;
					}

					validations.push(parsed);
				} catch (e) {
					throw new Error(`In property "${propName}", error parsing @valid ${validStr}: ${e}`);
				}
			}
		}
		return validations;
	}
	return undefined;
}

/**
 * Determines the raw type for a property.
 * It returns one of: string, number, integer, boolean, array, or object.
 * For inline type literals or named interfaces, it returns "object".
 * For arrays, it returns "array". If the type is Date, it returns "string".
 * Otherwise, if the type text (lowercased) matches one of the allowed types, that type is returned;
 * if not, it defaults to "string".
 */
function getRawType(prop: PropertySignature): string {
  const type = prop.getType();
  let typeSymbol = type.getAliasSymbol() || type.getSymbol();

  // Special-case: if the type is Date, return "string".
  if (typeSymbol && typeSymbol.getName() === "Date") {
    return "string";
  }
  // Inline type literal.
  if (prop.getTypeNode() && prop.getTypeNode().getKindName() === "TypeLiteral") {
    return "object";
  }
  // Array types.
  if (type.isArray()) {
    return "array";
  }
  // Named interface => "object".
  if (typeSymbol) {
    const decls = typeSymbol.getDeclarations();
    if (decls && decls.some(d => d.getKindName() === "InterfaceDeclaration")) {
      return "object";
    }
  }
  // Otherwise, check if the type text matches an allowed raw type.
  let text = type.getText().toLowerCase().trim();
  if (allowedRawTypes.has(text)) {
    return text;
  }
  return "string";
}

/**
 * Recursively extracts metadata from an inline type literal node.
 * Returns an ParsedInterface object whose "parameters" property holds the extracted members.
 */
function extractTypeLiteralMetadata(typeLiteralNode: TypeLiteralNode): ParsedInterface {
  let parameters: { [key: string]: ParsedInterface } = {};

  typeLiteralNode.getMembers().forEach(member => {
    if (member.getKindName() === "PropertySignature") {
      const prop = member as PropertySignature;
      const propName = prop.getName();
      let fullType = prop.getType();
      let originalType = fullType.getText();
      let derivedType = "";
      // If the property is an array, extract the element type.
      if (fullType.isArray()) {
        const elementType = fullType.getArrayElementType();
        if (elementType) {
          const elementSymbol = elementType.getAliasSymbol() || elementType.getSymbol();
          if (elementSymbol) {
            derivedType = elementSymbol.getName();
          } else {
            derivedType = elementType.getText();
          }
          originalType = elementType.getText();
        } else {
          derivedType = originalType;
        }
      } else {
        let typeSymbol = fullType.getAliasSymbol() || fullType.getSymbol();
        if (typeSymbol) {
          const decls = typeSymbol.getDeclarations();
          if (decls && decls.some(d => d.getKindName() === "InterfaceDeclaration")) {
            derivedType = typeSymbol.getName();
          } else {
            derivedType = typeSymbol.getName();
          }
        } else {
          derivedType = originalType;
        }
      }
      const rawType = getRawType(prop);
      // @ts-ignore
      const propDescription = getNodeDescription(prop);
      // @ts-ignore
      const valids = extractValidFromRaw(propName, prop, rawType);
      const required = !prop.hasQuestionToken();
      const isReadOnly: boolean = prop.isReadonly();
      const isArray: boolean = prop.getType().isArray();
      let subParameters: { [key: string]: ParsedInterface } = {};

      if (prop.getTypeNode() && prop.getTypeNode().getKindName() === "TypeLiteral") {
        // @ts-ignore
        subParameters = extractTypeLiteralMetadata(prop.getTypeNode()).parameters;
      }
      parameters[propName] = {
        type: rawType,
        typeName: derivedType,
        description: propDescription,
        valids: valids,
        required: required,
        isReadOnly: isReadOnly,
        isArray: isArray,
        parameters: subParameters
      };
    }
  });

  return {
    type: "object",
    typeName: "", // Inline type literals don't have a name.
    description: "",
    required: true,
    isReadOnly: false,
    isArray: false,
    parameters: parameters
  };
}

/**
 * Recursively extracts metadata from an interface declaration.
 * For each property, if its type is an inline type literal, it uses extractTypeLiteralMetadata.
 * Otherwise, it computes the raw type and preserves the original type (or array element type) in typeName.
 */
function extractParsedInterface(iface: InterfaceDeclaration): ParsedInterface {
  // @ts-ignore
  const structure: { docs?: { description?: string }[] } = iface.getStructure();
  const description =
    structure.docs && structure.docs.length > 0
      ? structure.docs.map(doc => doc.description || "").join("\n").trim()
      : "";
  let parameters: { [key: string]: ParsedInterface } = {};

  iface.getProperties().forEach(prop => {
    const propName = prop.getName();
    const fullType = prop.getType();
    let originalType = fullType.getText();
    let derivedType = "";
    if (fullType.isArray()) {
      const elementType = fullType.getArrayElementType();
      if (elementType) {
        const elementSymbol = elementType.getAliasSymbol() || elementType.getSymbol();
        if (elementSymbol) {
          derivedType = elementSymbol.getName();
        } else {
          derivedType = elementType.getText();
        }
        originalType = elementType.getText();
      } else {
        derivedType = originalType;
      }
    } else {
      let typeSymbol = fullType.getAliasSymbol() || fullType.getSymbol();
      if (typeSymbol) {
        const decls = typeSymbol.getDeclarations();
        if (decls && decls.some(d => d.getKindName() === "InterfaceDeclaration")) {
          derivedType = typeSymbol.getName();
        } else {
          derivedType = typeSymbol.getName();
        }
      } else {
        derivedType = originalType;
      }
    }
    const rawType = getRawType(prop);
	  // @ts-ignore
    const propDescription = getNodeDescription(prop);
    // @ts-ignore
    const valids = extractValidFromRaw(propName, prop, rawType);
    const required = !prop.hasQuestionToken();
    const isReadOnly: boolean = prop.isReadonly();
    const isArray: boolean = fullType.isArray();
    let subParameters: { [key: string]: ParsedInterface } = {};

    if (prop.getTypeNode() && prop.getTypeNode().getKindName() === "TypeLiteral") {
		// @ts-ignore
		subParameters = extractTypeLiteralMetadata(prop.getTypeNode()).parameters;
    }
    parameters[propName] = {
      type: rawType,
      typeName: derivedType,
      description: propDescription,
	  valids: valids,
      required: required,
      isReadOnly: isReadOnly,
      isArray: isArray,
      parameters: subParameters
    };
  });

  // Process base interfaces (inheritance) and merge their properties.
  const baseTypes = iface.getBaseTypes();
  baseTypes.forEach(baseType => {
    const baseSymbol = baseType.getSymbol();
    if (baseSymbol) {
      const baseDeclarations = baseSymbol.getDeclarations();
      if (baseDeclarations && baseDeclarations.length > 0) {
        const parentDeclaration = baseDeclarations.find(
          decl => decl.getKindName() === "InterfaceDeclaration"
        );
        if (parentDeclaration) {
          const parentIface = parentDeclaration as InterfaceDeclaration;
          const parentMetadata = extractParsedInterface(parentIface);
          parameters = { ...parentMetadata.parameters, ...parameters };
        }
      }
    }
  });

  return {
    type: "object",
    typeName: iface.getName(), // Preserve the interface's original name.
    description: description,
    required: true,
    isReadOnly: false,
    isArray: false,
    parameters: parameters
  };
}

/**
 * Searches the project for an interface by name and generates metadata for it.
 */
export async function generateParsedInterface(
  interfaceName: string,
  tsConfigFilePath: string
): Promise<ParsedInterface> {
  const project = new Project({ tsConfigFilePath });
  const iface = project
    .getSourceFiles()
    .flatMap(sf => sf.getInterfaces())
    .find(iface => iface.getName() === interfaceName);
  if (!iface) {
    throw new Error(`Interface ${interfaceName} not found in the project.`);
  }
  return extractParsedInterface(iface);
}
