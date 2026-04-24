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
	const scripts: string[] = [];
	const partials: string[] = [];
	const partialCalls: PartialCallRecord[] = [];
	const seenPartials: Set<string> = new Set ();
	const seenStashIds: Set<string> = new Set ();
	const ctx: string = opts.ctxParam || "hotCtx";

	// If the .hott has preamble blocks, emit a single interleaved
	// compiled preamble that echoes template HTML + inline-script
	// placeholders in source order, so the output order matches the
	// legacy SSR pipeline (admin-panel's header/body/footer layering
	// depends on this). The template stash entry for the route is
	// left empty in that case — the runtime does all the emission
	// via preamble execution.
	const hasPreamble: boolean = tokens.some (t => t.kind === "preamble");

	if (hasPreamble)
	{
		const preambleParts: string[] = [];

		for (const tok of tokens)
		{
			switch (tok.kind)
			{
				case "template_html":
					preambleParts.push (`${ctx}.echo(${JSON.stringify (tok.source)});`);
					break;

				case "inline_script":
				{
					const id: string = `hott-s${scripts.length}`;
					const attrs: string = tok.attrs ? ` ${tok.attrs}` : "";
					preambleParts.push (
						`${ctx}.echo(${JSON.stringify (`<script${attrs} data-hott-script="${id}"></script>`)});`
					);
					scripts.push (tok.source);
					break;
				}

				case "preamble":
				{
					const r = rewritePreamble (tok.source, { ctxParam: ctx, filename: opts.filename });
					preambleParts.push (r.source);
					collectRewriteRecords (r, partials, partialCalls, seenPartials, seenStashIds, warnings);
					break;
				}
			}
		}

		return ({
			template: "",
			preamble: preambleParts.join ("\n"),
			scripts,
			partials,
			partialCalls,
			warnings
		});
	}

	// Pure-static path: no preamble blocks. Template goes into the stash
	// and the runtime clones it directly at mount. Cheap and matches the
	// original HS090-3/5 "zero-fetch clone" model for simple pages.
	const templateParts: string[] = [];

	for (const tok of tokens)
	{
		switch (tok.kind)
		{
			case "template_html":
				templateParts.push (tok.source);
				break;

			case "inline_script":
			{
				const id: string = `hott-s${scripts.length}`;
				const attrs: string = tok.attrs ? ` ${tok.attrs}` : "";
				templateParts.push (`<script${attrs} data-hott-script="${id}"></script>`);
				scripts.push (tok.source);
				break;
			}
		}
	}

	return ({
		template: templateParts.join (""),
		preamble: "",
		scripts,
		partials,
		partialCalls,
		warnings
	});
}

function collectRewriteRecords (
	r: { partials: string[]; partialCalls: PartialCallRecord[]; warnings: CompileWarning[] },
	partials: string[],
	partialCalls: PartialCallRecord[],
	seenPartials: Set<string>,
	seenStashIds: Set<string>,
	warnings: CompileWarning[]
): void
{
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
		if (seenStashIds.has (call.stashId))
			continue;
		seenStashIds.add (call.stashId);
		partialCalls.push (call);
	}
	for (const w of r.warnings)
		warnings.push (w);
}

/**
 * Tokenize + compile a .hott source string in one call. Intended for the
 * common case where callers don't care about the intermediate tokens.
 */
export function compileSource (source: string, opts: CompileOptions = {}): HottModule
{
	return (compile (tokenize (source), opts));
}
