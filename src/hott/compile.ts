/**
 * Phase 2 of the v0.9.0 parser: compose tokens into a HottModule that
 * both emitters (SSR and static) can consume. This is where Hot.*
 * rewrites happen (via rewrite-preamble) and where literal Hot.include
 * targets are hoisted out of the preamble into module.partials.
 */

import { Token, HottModule, CompileWarning, PartialCallRecord } from "./types";
import { tokenize } from "./tokenize";
import { rewritePreamble } from "./rewrite-preamble";
import { HotFile } from "../HotFile";

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
		let deferredCounter: { count: number } = { count: 0 };

		for (const tok of tokens)
		{
			switch (tok.kind)
			{
				case "template_html":
				{
					// Scan the template HTML for legacy deferred-function
					// attribute syntax `<(args)=>{body}[R|A|Ra|RA|a]>`.
					// Each hit emits a local async function in the
					// preamble scope (so it closes over preamble-local
					// vars like `baseUrl`), exposed on window.__hottfn_N.
					// The attribute value becomes a call expression that
					// forwards `arguments` — which is what admin-panel's
					// `new Function(attrValue)` evaluation needs.
					const local: { name: string; args: string[]; body: string; endType: string }[] = [];
					const processed: string = processDeferredFunctions (tok.source, local, deferredCounter);

					for (const fn of local)
					{
						const clean: string = fn.endType.replace (/\}|>/g, "");
						const isAsync: boolean = /A|a/.test (clean);
						const asyncKw: string = isAsync ? "async " : "";
						const argList: string = fn.args.join (", ");
						preambleParts.push (
							`${asyncKw}function ${fn.name}(${argList}) { ${fn.body} }`,
							`if (typeof window !== "undefined") window.${fn.name} = ${fn.name};`
						);
					}
					preambleParts.push (`${ctx}.echo(${JSON.stringify (processed)});`);
					break;
				}

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

/**
 * Scan a template_html chunk for legacy deferred-function attribute
 * syntax `<(args)=>{body}[end]>` and rewrite each to a
 * `Hot.CurrentPage.callFunction('<name>')` reference. Bodies are
 * collected so the compiler can emit `Hot.CurrentPage.addFunction(...)`
 * registrations before the template echoes run.
 *
 * The end-type suffix carries legacy semantics (R = immediate, A = async,
 * Ra/RA = async + immediate-return). For now we emit the stored body
 * verbatim; callFunction just invokes it. Admin-panel's components
 * handle the R / async distinction themselves by awaiting the result.
 */
function processDeferredFunctions (
	source: string,
	collected: { name: string; args: string[]; body: string; endType: string }[],
	counter: { count: number }
): string
{
	let currentArgs: string[] = [];
	return (HotFile.parseFunction (
		source,
		(args: string[]) => { currentArgs = args; },
		(body: string, endType: string): string =>
		{
			const name: string = `__hottfn_${counter.count++}`;
			collected.push ({ name, args: currentArgs.slice (), body, endType });

			// Each replacement forwards `arguments` so admin-panel's
			// `new Function(attrValue)` eval invokes the local fn
			// (declared in the enclosing preamble scope and also
			// mirrored on window for `new Function` visibility).
			// End-type suffixes carry sync / async / return semantics:
			//   }>    immediate call
			//   }A>   awaited call (JS body does `await`)
			//   }a>   returns the Promise (no await)
			//   }R>   returns the call result (sync)
			//   }RA>  awaits and returns
			//   }Ra>  returns the Promise
			switch (endType)
			{
				case "}>":
					return (`window.${name}.apply(this, arguments)`);
				case "}A>":
					return (`await window.${name}.apply(this, arguments)`);
				case "}a>":
					return (`window.${name}.apply(this, arguments)`);
				case "}R>":
					return (`return window.${name}.apply(this, arguments)`);
				case "}RA>":
					return (`return await window.${name}.apply(this, arguments)`);
				case "}Ra>":
					return (`return window.${name}.apply(this, arguments)`);
				default:
					return (`window.${name}.apply(this, arguments)`);
			}
		}
	));
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
