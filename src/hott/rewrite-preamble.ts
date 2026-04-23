/**
 * Rewrite free `Hot.*` references inside a preamble body to equivalent
 * `hotCtx.*` accesses so the compiled preamble runs in the v0.9.0 runtime
 * without relying on the global Hot singleton. Also collects literal
 * Hot.include() targets for build-time partial resolution (HS090-15).
 *
 * Uses ts-morph (already a HotStaq dependency) for a scope-aware pass —
 * this is what lets us skip rewrites when an app locally rebinds `Hot`
 * via `let foo = Hot` or `const { Cookies } = Hot`.
 *
 * See design/HS090-parser-split.md "Preamble rewrite".
 */

import * as crypto from "crypto";
import { Project, SyntaxKind, Node, SourceFile } from "ts-morph";
import { CompileWarning } from "./types";
import { isLiteralAst, materialiseLiteral } from "./build-expand";

export interface RewriteOptions
{
	/** Name of the runtime context parameter. Defaults to "hotCtx". */
	ctxParam?: string;
	/**
	 * Optional absolute file path used for error reporting. The preamble
	 * source is treated as an ambient script, not bound to any specific
	 * file on disk.
	 */
	filename?: string;
}

/**
 * A captured Hot.include() call site with enough info for the builder
 * to resolve and optionally build-time expand the partial.
 */
export interface PartialCall
{
	/** Raw path string as written in the .hott source. */
	path: string;
	/** Literal args object if the call site passed one, else null. */
	args: Record<string, any> | null;
	/**
	 * Stable stash id the compiled preamble references via
	 * hotCtx.includeStash(...). Derived from path for plain literal
	 * includes, or path + args-hash when args are present so that two
	 * call sites with different args get distinct stash entries.
	 */
	stashId: string;
}

export interface RewriteResult
{
	/** Rewritten preamble source. */
	source: string;
	/** Literal Hot.include() targets, deduped, in first-seen order. */
	partials: string[];
	/** Structured record of every literal Hot.include call encountered. */
	partialCalls: PartialCall[];
	warnings: CompileWarning[];
}

/**
 * Mapping from Hot.* member expressions to their hotCtx.* replacements.
 * Keys are the member name after `Hot.`; values produce the replacement
 * expression given the ctx parameter name. A `null` value means: leave
 * the expression alone (either already valid or handled by a specialised
 * rewrite below, e.g. Hot.include / Hot.Cookies.*).
 */
type AccessRewriter = (ctx: string) => string;

const SIMPLE_REWRITES: Record<string, AccessRewriter | null> =
{
	// API / fetch helpers.
	getJSON: (ctx) => `${ctx}.getJSON`,
	echoUnsafe: (ctx) => `${ctx}.echo`,
	echo: (ctx) => `${ctx}.echo`,
	import: (ctx) => `${ctx}.import`,
	includeJS: (ctx) => `${ctx}.includeJS`,
	// URL helpers — forward to the ctx-scoped URLSearchParams.
	getUrlParam: (ctx) => `((n) => ${ctx}.search.get(n))`,
	// Routing context.
	pathname: (ctx) => `${ctx}.pathname`,
	params: (ctx) => `${ctx}.params`,
	// API client (HS090-8). Bundled client is exposed as ctx.api.
	API: (ctx) => `${ctx}.api`,
	// Cookie namespace — Hot.Cookies.get(x) → hotCtx.cookies.get(x).
	Cookies: (ctx) => `${ctx}.cookies`,
	// Left alone deliberately — too broad or runtime-only.
	CurrentPage: null,
	Output: null,
	echoHtmlInput: null,
	sanitizeHTML: null,
	addHtmlUnsafe: null,
	include: null,     // Special-cased: we rewrite call-expressions, not identifier access.
	import_: null,
};

/**
 * Rewrite a preamble source string.
 */
export function rewritePreamble (source: string, opts: RewriteOptions = {}): RewriteResult
{
	const ctx: string = opts.ctxParam || "hotCtx";
	const warnings: CompileWarning[] = [];
	const partials: string[] = [];
	const partialCalls: PartialCall[] = [];
	const seenPartials: Set<string> = new Set ();

	// Fast path: if the preamble never mentions Hot at all, nothing to do.
	if (!/\bHot\b/.test (source))
		return ({ source, partials, partialCalls, warnings });

	const project: Project = new Project ({
		useInMemoryFileSystem: true,
		compilerOptions: {
			allowJs: true,
			noEmit: true,
			target: 99 // ESNext — we don't emit, we only parse.
		}
	});
	const sf: SourceFile = project.createSourceFile (
		opts.filename || "__hott_preamble__.ts",
		source,
		{ overwrite: true }
	);

	// Track local bindings that shadow the free `Hot` identifier so we
	// leave those untouched. Conservative: any `Hot` declared in scope
	// disables rewriting for the entire preamble (matches the design
	// doc's stated limitation and emits a warning).
	if (hasLocalHotBinding (sf))
	{
		warnings.push ({
			code: "hott/hot-local-binding",
			message: "preamble declares a local `Hot` identifier; Hot.* references will not be rewritten. " +
				"Rename the local to keep --static builds working."
		});
		return ({ source: sf.getFullText (), partials, partialCalls, warnings });
	}

	sf.forEachDescendant ((node: Node) =>
	{
		if (node.getKind () !== SyntaxKind.PropertyAccessExpression)
			return;

		const access = node.asKindOrThrow (SyntaxKind.PropertyAccessExpression);
		const expr = access.getExpression ();

		if (expr.getKind () !== SyntaxKind.Identifier || expr.getText () !== "Hot")
			return;

		const name: string = access.getName ();

		// Hot.include(...) — rewrite the whole call expression so we can
		// inspect the argument and collect literal partial targets.
		if (name === "include")
		{
			const parent = access.getParent ();

			if (parent && parent.getKind () === SyntaxKind.CallExpression)
			{
				rewriteIncludeCall (parent, ctx, partials, seenPartials, partialCalls, warnings);
				return;
			}

			warnings.push ({
				code: "hott/hot-include-non-call",
				message: "Hot.include referenced but not called; cannot resolve at build time.",
				start: access.getStart (),
				end: access.getEnd ()
			});
			return;
		}

		const rewriter = SIMPLE_REWRITES[name];
		if (rewriter != null)
		{
			access.replaceWithText (rewriter (ctx));
			return;
		}

		if (rewriter === null)
		{
			// Deliberately left alone (Hot.Cookies, Hot.Output, etc.).
			return;
		}

		// Unknown member — leave it but warn so the migration guide can
		// catch uncovered surface area.
		warnings.push ({
			code: "hott/hot-unknown-member",
			message: `Unknown Hot.${name} reference; not rewritten. Consider porting this call site.`,
			start: access.getStart (),
			end: access.getEnd ()
		});
	});

	return ({ source: sf.getFullText (), partials, partialCalls, warnings });
}

function rewriteIncludeCall (
	callNode: Node,
	ctx: string,
	partials: string[],
	seen: Set<string>,
	partialCalls: PartialCall[],
	warnings: CompileWarning[]
): void
{
	const call = callNode.asKindOrThrow (SyntaxKind.CallExpression);
	const args = call.getArguments ();

	if (args.length === 0)
	{
		warnings.push ({
			code: "hott/hot-include-no-arg",
			message: "Hot.include() called with no arguments; skipped.",
			start: call.getStart (),
			end: call.getEnd ()
		});
		return;
	}

	const first = args[0];
	const stringLiteral = asStringLiteralValue (first);

	if (stringLiteral !== null)
	{
		if (!seen.has (stringLiteral))
		{
			seen.add (stringLiteral);
			partials.push (stringLiteral);
		}

		// Check for a second-arg literal object — admin-panel, userroute
		// etc. pass { TITLE, SIDEBAR_ITEMS } here.
		let argsValue: Record<string, any> | null = null;
		if (args.length >= 2)
		{
			const second = args[1];
			if (isLiteralAst (second))
			{
				argsValue = materialiseLiteral (second) as Record<string, any>;
			}
			else
			{
				warnings.push ({
					code: "hott/hot-include-dynamic-args",
					message: "Hot.include() called with a non-literal args object; partial will not be build-time expanded.",
					start: call.getStart (),
					end: call.getEnd ()
				});
			}
		}

		const stashId: string = stashIdFor (stringLiteral, argsValue);
		partialCalls.push ({ path: stringLiteral, args: argsValue, stashId });
		call.replaceWithText (`${ctx}.includeStash(${JSON.stringify (stashId)})`);
		return;
	}

	warnings.push ({
		code: "hott/hot-include-dynamic",
		message: "Hot.include() called with a non-literal argument; cannot resolve at build time. " +
			"Refactor to explicit literal branches before enabling --strict.",
		start: call.getStart (),
		end: call.getEnd ()
	});

	// Rewrite to ctx.includeStash so at least it doesn't reference the
	// global Hot at runtime. The ctx implementation can fall back to a
	// runtime lookup for dynamic ids.
	const argText: string = first.getText ();
	call.replaceWithText (`${ctx}.includeStash(${argText})`);
}

/**
 * Derive a stash id for a (path, args) pair. When args is null, the id is
 * the plain path-based form (stable across calls) so unchanged call sites
 * keep the same key. When args is present, we append a short content hash
 * so call sites with different args get distinct stash entries.
 */
function stashIdFor (path: string, args: Record<string, any> | null): string
{
	const base: string = partialIdFromPath (path);
	if (args == null)
		return (base);
	const hash: string = crypto
		.createHash ("sha256")
		.update (JSON.stringify (args))
		.digest ("hex")
		.substring (0, 10);
	return (`${base}#${hash}`);
}

function asStringLiteralValue (node: Node): string | null
{
	const kind: number = node.getKind ();

	if (kind === SyntaxKind.StringLiteral)
		return (node.asKindOrThrow (SyntaxKind.StringLiteral).getLiteralValue ());

	if (kind === SyntaxKind.NoSubstitutionTemplateLiteral)
		return (node.asKindOrThrow (SyntaxKind.NoSubstitutionTemplateLiteral).getLiteralValue ());

	return (null);
}

/**
 * Derive a stable stash id from a .hott partial path. The full path is
 * preserved (minus the .hott extension) so two different components named
 * "card.hott" in different directories don't collide.
 */
export function partialIdFromPath (path: string): string
{
	let p: string = path.replace (/^\.\/+/, "").replace (/^\/+/, "");
	if (p.toLowerCase ().endsWith (".hott"))
		p = p.substring (0, p.length - 5);
	return (p.replace (/\\/g, "/"));
}

/**
 * True if the preamble declares a local binding named `Hot` at any scope.
 * Conservative — we bail out of rewriting entirely when this is true.
 */
function hasLocalHotBinding (sf: SourceFile): boolean
{
	let found: boolean = false;

	sf.forEachDescendant ((node: Node) =>
	{
		if (found)
			return;

		switch (node.getKind ())
		{
			case SyntaxKind.VariableDeclaration:
			case SyntaxKind.Parameter:
			case SyntaxKind.BindingElement:
			{
				const name = (node as any).getNameNode?.();
				if (name && name.getText && name.getText () === "Hot")
					found = true;
				break;
			}
			default:
				break;
		}
	});

	return (found);
}
