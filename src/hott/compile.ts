/**
 * Phase 2 of the v0.9.0 parser: compose tokens into a HottModule that
 * both emitters (SSR and static) can consume. This is where Hot.*
 * rewrites happen (via rewrite-preamble) and where literal Hot.include
 * targets are hoisted out of the preamble into module.partials.
 */

import { Token, HottModule, CompileWarning, PartialCallRecord } from "./types";
import { tokenize } from "./tokenize";
import { rewritePreamble } from "./rewrite-preamble";

export interface CompileOptions
{
	/**
	 * Runtime context parameter name injected into the rewritten preamble.
	 * The emitter wraps `preamble` in `async (hotCtx) => { ... }`.
	 */
	ctxParam?: string;
	/** Optional filename for better diagnostics. */
	filename?: string;
}

/**
 * Compile a pre-tokenized .hott file into a HottModule. Prefer this entry
 * when the caller has already tokenized (e.g. a build tool that reuses the
 * token stream for additional analysis); otherwise call `compileSource`.
 */
export function compile (tokens: Token[], opts: CompileOptions = {}): HottModule
{
	const warnings: CompileWarning[] = [];
	const templateParts: string[] = [];
	const preambleParts: string[] = [];
	const scripts: string[] = [];
	const partials: string[] = [];
	const partialCalls: PartialCallRecord[] = [];
	const seenPartials: Set<string> = new Set ();
	const seenStashIds: Set<string> = new Set ();

	for (const tok of tokens)
	{
		switch (tok.kind)
		{
			case "template_html":
				templateParts.push (tok.source);
				break;

			case "inline_script":
			{
				// Keep a placeholder in the template so the runtime knows
				// where to insert the re-executed script body on mount.
				// The placeholder is a data-hott-script attribute on an
				// empty <script> tag — harmless if a naive mount drops
				// the script (browser runs an empty body).
				const id: string = `hott-s${scripts.length}`;
				const attrs: string = tok.attrs ? ` ${tok.attrs}` : "";
				templateParts.push (`<script${attrs} data-hott-script="${id}"></script>`);
				scripts.push (tok.source);
				break;
			}

			case "preamble":
			{
				const r = rewritePreamble (tok.source, {
					ctxParam: opts.ctxParam,
					filename: opts.filename
				});

				preambleParts.push (r.source);
				for (const p of r.partials)
				{
					if (!seenPartials.has (p))
					{
						seenPartials.add (p);
						partials.push (p);
					}
				}
				for (const call of r.partialCalls)
				{
					// Dedupe on stashId: same (path, argsHash) only appears once.
					if (seenStashIds.has (call.stashId))
						continue;
					seenStashIds.add (call.stashId);
					partialCalls.push (call);
				}
				for (const w of r.warnings)
					warnings.push (w);
				break;
			}
		}
	}

	return ({
		template: templateParts.join (""),
		preamble: preambleParts.join ("\n"),
		scripts,
		partials,
		partialCalls,
		warnings
	});
}

/**
 * Tokenize + compile a .hott source string in one call. Intended for the
 * common case where callers don't care about the intermediate tokens.
 */
export function compileSource (source: string, opts: CompileOptions = {}): HottModule
{
	return (compile (tokenize (source), opts));
}
