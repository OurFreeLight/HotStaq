/**
 * Phase 1 of the v0.9.0 parser: walk .hott source once and emit a token
 * stream of { template_html, preamble, inline_script }. No evaluation, no
 * output concatenation. Token boundaries preserve source offsets so later
 * stages can produce precise error messages.
 *
 * This is intentionally simpler than HotFile.processNestedContent: it only
 * has to balance `<* ... *>` at the top level. Nested `${}` inside a
 * preamble stays inside the preamble source — downstream emitters (SSR or
 * static) handle interpolation.
 */

import { Token } from "./types";

const PREAMBLE_OPEN: string = "<*";
const PREAMBLE_CLOSE: string = "*>";

/**
 * Match an inline <script> tag whose body should be extracted as an
 * inline_script token. `src=`-only tags are left in template_html.
 *
 * Case-insensitive, tolerates attributes in any order. Non-greedy body.
 */
const SCRIPT_TAG_RE: RegExp = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;

/**
 * Walk `src` and produce a flat token stream. The tokens partition the
 * input: concatenating `token.source` in order reproduces `src` exactly
 * for template_html/inline_script; preamble tokens carry the body between
 * `<*` and `*>` (the delimiters themselves are dropped from `source`).
 */
export function tokenize (src: string): Token[]
{
	const tokens: Token[] = [];
	const len: number = src.length;
	let cursor: number = 0;

	while (cursor < len)
	{
		const nextOpen: number = src.indexOf (PREAMBLE_OPEN, cursor);

		if (nextOpen === -1)
		{
			// No more preambles — rest is template HTML (with possible inline scripts).
			emitTemplateSpan (src, cursor, len, tokens);
			break;
		}

		// Template span up to the preamble.
		if (nextOpen > cursor)
			emitTemplateSpan (src, cursor, nextOpen, tokens);

		const closePos: number = findPreambleClose (src, nextOpen + PREAMBLE_OPEN.length);

		if (closePos === -1)
		{
			// Unterminated preamble — emit the rest as a preamble token up to EOF
			// so the compiler can surface a clear error instead of a silent split.
			tokens.push ({
				kind: "preamble",
				source: src.substring (nextOpen + PREAMBLE_OPEN.length),
				start: nextOpen,
				end: len
			});
			cursor = len;
			break;
		}

		tokens.push ({
			kind: "preamble",
			source: src.substring (nextOpen + PREAMBLE_OPEN.length, closePos),
			start: nextOpen,
			end: closePos + PREAMBLE_CLOSE.length
		});

		cursor = closePos + PREAMBLE_CLOSE.length;
	}

	return (tokens);
}

/**
 * Find the `*>` that terminates a `<*` that starts at `bodyStart`. Respects
 * a basic string-skipping rule so that `*>` inside a single/double/backtick
 * string literal doesn't prematurely close the preamble. This mirrors the
 * practical behaviour of v0.8.x's processNestedContent without its full
 * ${} reverse-scan complexity, which was designed for template interpolation
 * edge cases that v0.9.0 handles in the compiler.
 */
function findPreambleClose (src: string, bodyStart: number): number
{
	const len: number = src.length;
	let i: number = bodyStart;
	// Tracks the last non-whitespace, non-comment byte seen. Used to
	// disambiguate `/` between division (after ident/number/`)`) and
	// regex literal (after operator / keyword / opening delim). Without
	// this, regexes like `value.replace(/\"/g, ...)` — where the `"`
	// inside the regex looks like a string start — corrupt the preamble
	// close scan.
	let prevSignificant: string = "";

	const markSig = (c: string): void =>
	{
		if (c === " " || c === "\t" || c === "\n" || c === "\r") return;
		prevSignificant = c;
	};

	while (i < len)
	{
		const ch: string = src.charAt (i);

		if (ch === "\"" || ch === "'" || ch === "`")
		{
			i = skipStringLiteral (src, i, ch);
			prevSignificant = ch;
			continue;
		}

		if (ch === "/" && i + 1 < len)
		{
			const n: string = src.charAt (i + 1);

			if (n === "/")
			{
				i = skipUntil (src, i + 2, "\n");
				continue;
			}
			if (n === "*")
			{
				i = skipBlockComment (src, i + 2);
				continue;
			}

			// Regex literal vs division. Regex is valid when the
			// preceding significant char is an operator, delimiter, or
			// empty (start of body).
			if (isRegexAllowedAfter (prevSignificant))
			{
				i = skipRegexLiteral (src, i);
				prevSignificant = "/";
				continue;
			}
		}

		if (ch === "*" && src.charAt (i + 1) === ">")
			return (i);

		markSig (ch);
		i++;
	}

	return (-1);
}

function isRegexAllowedAfter (c: string): boolean
{
	if (c === "") return (true);
	// Identifier chars / digits / ) ] → division context.
	if (/[A-Za-z0-9_$)\]]/.test (c)) return (false);
	return (true);
}

function skipRegexLiteral (src: string, start: number): number
{
	const len: number = src.length;
	let i: number = start + 1;
	let inClass: boolean = false;
	while (i < len)
	{
		const ch: string = src.charAt (i);
		if (ch === "\\") { i += 2; continue; }
		if (ch === "[") inClass = true;
		else if (ch === "]") inClass = false;
		else if (ch === "/" && !inClass)
		{
			// Consume flags.
			let j: number = i + 1;
			while (j < len && /[gimsuy]/.test (src.charAt (j))) j++;
			return (j);
		}
		else if (ch === "\n") return (i); // unterminated; bail.
		i++;
	}
	return (len);
}

function skipStringLiteral (src: string, start: number, quote: string): number
{
	const len: number = src.length;
	let i: number = start + 1;

	while (i < len)
	{
		const ch: string = src.charAt (i);

		if (ch === "\\")
		{
			i += 2;
			continue;
		}

		if (ch === quote)
			return (i + 1);

		// Template-literal ${ ... } interpolations allow arbitrary JS; the
		// `*>` sequence is extremely unlikely inside one but we play it safe
		// by tracking brace depth back out to the enclosing template string.
		if (quote === "`" && ch === "$" && src.charAt (i + 1) === "{")
		{
			i = skipTemplateInterpolation (src, i + 2);
			continue;
		}

		i++;
	}

	return (len);
}

function skipTemplateInterpolation (src: string, start: number): number
{
	const len: number = src.length;
	let i: number = start;
	let depth: number = 1;

	while (i < len && depth > 0)
	{
		const ch: string = src.charAt (i);

		if (ch === "\"" || ch === "'" || ch === "`")
		{
			i = skipStringLiteral (src, i, ch);
			continue;
		}

		if (ch === "{")
			depth++;
		else if (ch === "}")
			depth--;

		i++;
	}

	return (i);
}

function skipUntil (src: string, start: number, needle: string): number
{
	const idx: number = src.indexOf (needle, start);
	return (idx === -1 ? src.length : idx + needle.length);
}

function skipBlockComment (src: string, start: number): number
{
	const idx: number = src.indexOf ("*/", start);
	return (idx === -1 ? src.length : idx + 2);
}

/**
 * Slice `src[from..to]` into template_html and inline_script tokens by
 * locating `<script>...</script>` blocks with non-empty bodies. Scripts
 * with only a `src=` attribute are kept inline with the surrounding HTML
 * (the runtime will honour them naturally when the template mounts).
 */
function emitTemplateSpan (src: string, from: number, to: number, out: Token[]): void
{
	if (from >= to)
		return;

	const span: string = src.substring (from, to);
	SCRIPT_TAG_RE.lastIndex = 0;

	let cursor: number = 0;
	let match: RegExpExecArray | null = null;

	while ((match = SCRIPT_TAG_RE.exec (span)) !== null)
	{
		const attrs: string = (match[1] || "").trim ();
		const body: string = match[2] || "";
		const matchStart: number = match.index;
		const matchEnd: number = SCRIPT_TAG_RE.lastIndex;

		// Scripts with a src= attribute load external code; leave them in
		// the template so the browser executes them on mount.
		if (hasSrcAttr (attrs) || body.trim () === "")
			continue;

		if (matchStart > cursor)
		{
			out.push ({
				kind: "template_html",
				source: span.substring (cursor, matchStart),
				start: from + cursor,
				end: from + matchStart
			});
		}

		out.push ({
			kind: "inline_script",
			source: body,
			start: from + matchStart,
			end: from + matchEnd,
			attrs: attrs
		});

		cursor = matchEnd;
	}

	if (cursor < span.length)
	{
		out.push ({
			kind: "template_html",
			source: span.substring (cursor),
			start: from + cursor,
			end: to
		});
	}
}

function hasSrcAttr (attrs: string): boolean
{
	// Word-boundary-ish: avoid matching e.g. `data-srcset`.
	return (/(^|\s)src\s*=/.test (attrs));
}
