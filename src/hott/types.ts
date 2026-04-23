/**
 * Shared types for the v0.9.0 .hott parser + static build pipeline.
 * See design/HS090-parser-split.md and design/HS090-runtime-sketch.md.
 */

export type TokenKind = "template_html" | "preamble" | "inline_script";

export interface Token
{
	kind: TokenKind;
	source: string;
	/** Source offset (inclusive) in the original .hott file. */
	start: number;
	/** Source offset (exclusive) in the original .hott file. */
	end: number;
	/**
	 * For inline_script tokens only: the raw attribute string from the
	 * opening <script ...> tag (excluding the leading/trailing whitespace).
	 * Empty string if no attributes.
	 */
	attrs?: string;
}

export interface CompileWarning
{
	code: string;
	message: string;
	start?: number;
	end?: number;
}

/**
 * One captured literal Hot.include call. `args` is null when the site
 * passed no args or the args weren't a literal; the builder treats null
 * as "fall back to raw-template stash" and non-null as "build-time
 * expand against these args."
 */
export interface PartialCallRecord
{
	path: string;
	args: Record<string, any> | null;
	stashId: string;
}

export interface HottModule
{
	/**
	 * HTML structure that goes into the <template> stash. Template text +
	 * inline <script> tags are kept inline so the runtime can mount them as
	 * one DOM fragment and then re-execute the script bodies.
	 */
	template: string;
	/**
	 * Concatenated preamble source after the Hot.* → hotCtx.* rewrite. The
	 * emitter wraps this in `async (hotCtx) => { ... }` at bundle time.
	 * For SSR mode the legacy HotFile path still composes preambles as-is.
	 */
	preamble: string;
	/** Inline <script> bodies, in source order. */
	scripts: string[];
	/** Literal Hot.include() targets discovered during preamble rewrite. */
	partials: string[];
	/**
	 * Structured record of every literal Hot.include call, including its
	 * args object when the call site passed a literal one. Lets the
	 * builder's HS090-15 stage expand the partial at build time.
	 */
	partialCalls: PartialCallRecord[];
	/** Diagnostic warnings collected during compile; non-fatal by default. */
	warnings: CompileWarning[];
	/**
	 * Optional staticRender hint from HotSite.yaml; set externally by the
	 * CLI driver (HS090-4), not extracted from .hott source.
	 */
	staticRender?: boolean;
}

/**
 * Runtime context passed to every compiled preamble and inline script. The
 * static builder synthesises this per navigation; the SSR emitter constructs
 * an equivalent adapter over the current Hot namespace.
 */
export interface HotCtx
{
	cookies: {
		get (name: string): string | null;
		set (name: string, value: string, opts?: object): void;
		remove (name: string, opts?: object): void;
	};
	search: URLSearchParams;
	pathname: string;
	params: Record<string, string>;
	/** The auto-generated Web API client singleton (HS090-8). */
	api: any;
	getJSON (url: string): Promise<any>;
	import (pkg: string): Promise<any>;
	/** Returns an HTML fragment cloned from the partial stash. */
	includeStash (id: string): string;
	/** Append to the current template's output buffer (SSR + static). */
	echo (html: string): void;
	/**
	 * Fetch a JS file, execute it, and call its default export (or the
	 * first function it assigns to module.exports) with the given args.
	 * Returns whatever the function returns. Used by apps that were
	 * using Hot.includeJS() in SSR mode for bootstrap helpers.
	 */
	includeJS (url: string, args?: any[]): Promise<any>;
}
