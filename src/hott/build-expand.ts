/**
 * Build-time expansion of Hot.include(path, literalArgs) calls.
 *
 * Given a partial path and a JSON-serializable args object, this module
 * compiles the partial via the legacy HotFile.parseContent pipeline and
 * executes it inside a Node-side sandbox with a minimal Hot global that
 *
 *   - echoUnsafe(str) / echo(str): appends to an Output buffer
 *   - include(path, args): recursive, reuses the same sandbox
 *   - Cookies, CurrentPage, Data: no-op stubs
 *   - getJSON / fetch / anything network: throws so the caller can
 *     detect "this partial has runtime dependencies" and fall back.
 *
 * The output HTML is fully static: interleaved `<* for/if *>` control
 * flow unrolled, `${TITLE}` substitutions resolved, nested partials
 * expanded recursively. Matches the admin-panel shape end to end.
 *
 * When execution throws, the caller falls back to the HS090-15 raw-
 * template-inline behaviour and emits a warning so the site author can
 * refactor or declare the route as staticRender: true.
 */

import * as fs from "fs";
import * as fsp from "fs/promises";
import * as ppath from "path";
import { Node, SyntaxKind } from "ts-morph";

import { HotFile } from "../HotFile";

export interface ExpandPartialOptions
{
	/** Absolute path of the partial .hott file. */
	absPath: string;
	/** Args object — must already be JSON-serialisable. */
	args: Record<string, any>;
	/**
	 * Resolver for nested Hot.include calls. Receives the nested path
	 * exactly as written (module-prefix, ./rel, etc.) and returns the
	 * resolved absolute path, or throws if it can't be resolved.
	 */
	resolve: (requestedPath: string, fromFile: string) => string;
}

/** One completed expansion. */
export interface ExpandResult
{
	/** Rendered HTML. */
	html: string;
	/** Partials transitively visited. */
	visited: string[];
}

/**
 * Render a partial at build time with the given literal args bound.
 *
 * Throws (with a descriptive message) when the partial's preamble
 * touches a runtime-only API (getJSON, fetch, Hot.API.*, etc.), when
 * the sandbox exceeds a cycle limit, or when the compiled .hott raises
 * a SyntaxError the sandbox can't wrap.
 */
export async function expandPartial (opts: ExpandPartialOptions): Promise<ExpandResult>
{
	const visited: string[] = [];
	const inflightCycleGuard: Set<string> = new Set ();
	const html: string = await renderOne (opts.absPath, opts.args, opts.resolve, visited, inflightCycleGuard);
	return ({ html, visited });
}

const MAX_DEPTH: number = 16;

async function renderOne (
	absPath: string,
	args: Record<string, any>,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>
): Promise<string>
{
	if (inflight.has (absPath))
		throw new Error (`[hs090] cycle detected in Hot.include: ${absPath}`);
	if (inflight.size >= MAX_DEPTH)
		throw new Error (`[hs090] Hot.include depth exceeded ${MAX_DEPTH} (runaway recursion?)`);

	inflight.add (absPath);
	visited.push (absPath);

	if (!fs.existsSync (absPath))
	{
		inflight.delete (absPath);
		throw new Error (`[hs090] partial file not found: ${absPath}`);
	}

	const source: string = await fsp.readFile (absPath, "utf8");
	const parsedJs: string = HotFile.parseContent (source, false);

	const result: string = await runCompiledPartial (parsedJs, args, absPath, resolve, visited, inflight);

	inflight.delete (absPath);
	return (result);
}

async function runCompiledPartial (
	parsedJs: string,
	args: Record<string, any>,
	absFrom: string,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>
): Promise<string>
{
	// Build the sandbox Hot shim per invocation so parallel nested
	// renders each get an isolated Output buffer. renderOne's callers
	// see only the final html string.
	const Hot: any = buildSandboxHot (absFrom, resolve, visited, inflight);

	// Declare each arg as a top-level var in the executed scope — matches
	// the legacy HotPage.process() convention of `var ${key} = ${JSON};`
	// so preambles can reference {TITLE, SIDEBAR_ITEMS} by name.
	const argDecls: string[] = [];
	for (const key of Object.keys (args))
		argDecls.push (`var ${key} = ${JSON.stringify (args[key])};`);

	// Minimal helpers the legacy compiler expects in scope.
	const scaffold: string = `
${argDecls.join ("\n")}

function echoOutput (content, throwErrors) {
	if (throwErrors === false) {
		try { Hot.echoUnsafe (content); } catch { Hot.echoUnsafe (""); }
		return;
	}
	Hot.echoUnsafe (content);
}

function outputStr (value, possibleValue) {
	let result = \`\\\${\${value}}\`;
	try {
		if (possibleValue != null) result = possibleValue;
		else result = eval (value);
	} catch (ex) {}
	return (result);
}

function createFunction () { /* no-op at build time */ }
function createTestElement () { /* no-op at build time */ }

async function runContent (CurrentHotFile) {
${parsedJs}
}

return runContent (null).then (() => Hot.Output);
`;

	// eslint-disable-next-line no-new-func
	const fn: Function = new Function ("Hot", scaffold);
	return (await fn (Hot));
}

function buildSandboxHot (
	absFrom: string,
	resolve: (path: string, from: string) => string,
	visited: string[],
	inflight: Set<string>
): any
{
	const runtimeOnly = (name: string) => (): never =>
	{
		throw new Error (
			`[hs090] Hot.${name} called at build time — this partial has runtime dependencies. ` +
			`Refactor to use literal args, or declare the route as staticRender: true.`
		);
	};

	const Hot: any =
	{
		Output: "",
		Mode: 0,
		Arguments: null,
		CurrentPage: null,
		PublicKeys: {},
		API: null,
		TesterAPI: null,
		Data: {},
		Debugger: null,
		echoUnsafe (s: string): void
		{
			if (s == null) return;
			Hot.Output += String (s);
		},
		echo (s: string): void
		{
			if (s == null) return;
			Hot.Output += String (s).replace (/&/g, "&amp;").replace (/</g, "&lt;").replace (/>/g, "&gt;");
		},
		async include (path: string, subArgs: any = {}): Promise<void>
		{
			if (typeof path !== "string")
				throw new Error (`[hs090] Hot.include at build time requires a string path; got ${typeof path}`);
			const nextAbs: string = resolve (path, absFrom);
			const nested: string = await renderOne (nextAbs, subArgs || {}, resolve, visited, inflight);
			Hot.Output += nested;
		},
		async includeJS (_url: string, _args?: any[]): Promise<void>
		{
			throw new Error (`[hs090] Hot.includeJS called at build time — not supported during partial expansion.`);
		},
		async import (pkg: string): Promise<any>
		{
			// Try a straight require first; many @hotstaq/* packages export
			// plain CommonJS. If that fails, return a no-op stub.
			try
			{
				return (require (pkg));
			}
			catch
			{
				return ({});
			}
		},
		async getJSON (_url: string): Promise<any> { return (runtimeOnly ("getJSON") ()); },
		async jsonRequest (_url: string): Promise<any> { return (runtimeOnly ("jsonRequest") ()); },
		Cookies:
		{
			get: (_name: string): string | null => null,
			set: (_name: string, _value: string): void => {},
			remove: (_name: string): void => {}
		},
		getUrlParam: (): string => "",
		sanitizeHTML: (s: string): string => String (s),
		addHtmlUnsafe: (_owner: any, s: string): string => s
	};

	// Keep Hot.echoUnsafe bound so the parser-emitted `Hot.echoUnsafe(...)`
	// call sites don't hit undefined-this issues.
	Hot.echoUnsafe = Hot.echoUnsafe.bind (Hot);
	Hot.echo = Hot.echo.bind (Hot);
	Hot.include = Hot.include.bind (Hot);

	return (Hot);
}

// ── ts-morph argument helpers ──────────────────────────────────────────

/**
 * Determine whether an AST node is a literal JSON-compatible expression.
 * Strings, numbers, booleans, null, arrays of literals, object literals
 * whose values are literals, NoSubstitutionTemplateLiterals.
 */
export function isLiteralAst (node: Node): boolean
{
	const kind: number = node.getKind ();

	switch (kind)
	{
		case SyntaxKind.StringLiteral:
		case SyntaxKind.NoSubstitutionTemplateLiteral:
		case SyntaxKind.NumericLiteral:
		case SyntaxKind.TrueKeyword:
		case SyntaxKind.FalseKeyword:
		case SyntaxKind.NullKeyword:
			return (true);

		case SyntaxKind.PrefixUnaryExpression:
		{
			// Allow negative numbers: -42
			const pu = node.asKindOrThrow (SyntaxKind.PrefixUnaryExpression);
			if (pu.getOperatorToken () !== SyntaxKind.MinusToken) return (false);
			return (isLiteralAst (pu.getOperand ()));
		}

		case SyntaxKind.ArrayLiteralExpression:
		{
			const arr = node.asKindOrThrow (SyntaxKind.ArrayLiteralExpression);
			return (arr.getElements ().every (isLiteralAst));
		}

		case SyntaxKind.ObjectLiteralExpression:
		{
			const obj = node.asKindOrThrow (SyntaxKind.ObjectLiteralExpression);
			for (const prop of obj.getProperties ())
			{
				if (prop.getKind () !== SyntaxKind.PropertyAssignment)
					return (false);
				const pa = prop.asKindOrThrow (SyntaxKind.PropertyAssignment);
				const nameNode = pa.getNameNode ();
				const nk: number = nameNode.getKind ();
				if (nk !== SyntaxKind.Identifier &&
					nk !== SyntaxKind.StringLiteral &&
					nk !== SyntaxKind.NumericLiteral)
					return (false);
				if (!isLiteralAst (pa.getInitializerOrThrow ()))
					return (false);
			}
			return (true);
		}

		default:
			return (false);
	}
}

/**
 * Materialise a literal-AST node as a plain JS value. Undefined
 * behaviour if `isLiteralAst(node)` is false — callers must gate.
 */
export function materialiseLiteral (node: Node): any
{
	const kind: number = node.getKind ();

	switch (kind)
	{
		case SyntaxKind.StringLiteral:
			return (node.asKindOrThrow (SyntaxKind.StringLiteral).getLiteralValue ());
		case SyntaxKind.NoSubstitutionTemplateLiteral:
			return (node.asKindOrThrow (SyntaxKind.NoSubstitutionTemplateLiteral).getLiteralValue ());
		case SyntaxKind.NumericLiteral:
			return (Number (node.getText ()));
		case SyntaxKind.TrueKeyword:
			return (true);
		case SyntaxKind.FalseKeyword:
			return (false);
		case SyntaxKind.NullKeyword:
			return (null);
		case SyntaxKind.PrefixUnaryExpression:
		{
			const pu = node.asKindOrThrow (SyntaxKind.PrefixUnaryExpression);
			return (-materialiseLiteral (pu.getOperand ()));
		}
		case SyntaxKind.ArrayLiteralExpression:
		{
			const arr = node.asKindOrThrow (SyntaxKind.ArrayLiteralExpression);
			return (arr.getElements ().map (materialiseLiteral));
		}
		case SyntaxKind.ObjectLiteralExpression:
		{
			const obj = node.asKindOrThrow (SyntaxKind.ObjectLiteralExpression);
			const result: Record<string, any> = {};
			for (const prop of obj.getProperties ())
			{
				const pa = prop.asKindOrThrow (SyntaxKind.PropertyAssignment);
				const nameNode = pa.getNameNode ();
				const key: string = nameNode.getKind () === SyntaxKind.StringLiteral
					? nameNode.asKindOrThrow (SyntaxKind.StringLiteral).getLiteralValue ()
					: nameNode.getText ();
				result[key] = materialiseLiteral (pa.getInitializerOrThrow ());
			}
			return (result);
		}
		default:
			throw new Error (`[hs090] materialiseLiteral: unsupported kind ${kind}`);
	}
}
