import "mocha";
import { expect } from "chai";

import { compileSource } from "../../src/hott/compile";

describe ("v0.9.0 parser — compile", () =>
{
	it ("extracts preamble (interleaved), scripts, partials from a realistic .hott file", () =>
	{
		const src = `
<* await Hot.include('./partials/header.hott');
   const cfg = await Hot.getJSON('/config'); *>
<div class="page">
  <h1>Welcome</h1>
  <script>console.log('mounted');</script>
</div>
<* if (cfg.showFooter) await Hot.include('./partials/footer.hott'); *>
`;
		const mod = compileSource (src);

		expect (mod.partials).to.deep.equal ([
			"./partials/header.hott",
			"./partials/footer.hott"
		]);

		expect (mod.scripts).to.have.lengthOf (1);
		expect (mod.scripts[0]).to.equal ("console.log('mounted');");

		// Routes with preamble blocks use interleaved compile — the
		// template stash entry is empty; source order is preserved in
		// the compiled preamble by mixing echo(staticHtml) calls with
		// the rewritten preamble code.
		expect (mod.template).to.equal ("");
		expect (mod.preamble).to.include ("hotCtx.getJSON(");
		expect (mod.preamble).to.include ("hotCtx.echo(hotCtx.includeStash(\"partials/header\"))");
		expect (mod.preamble).to.include ("hotCtx.echo(hotCtx.includeStash(\"partials/footer\"))");
		expect (mod.preamble).to.include ("<h1>Welcome</h1>");
		expect (mod.preamble).to.include ("data-hott-script=\\\"hott-s0\\\"");
		expect (mod.preamble).to.not.include ("console.log");
	});

	it ("produces an empty preamble for template-only files", () =>
	{
		const mod = compileSource ("<h1>Hi</h1>");
		expect (mod.preamble).to.equal ("");
		expect (mod.partials).to.be.empty;
		expect (mod.scripts).to.be.empty;
		expect (mod.template).to.equal ("<h1>Hi</h1>");
	});

	it ("preserves multiple preambles in source order with newline separators", () =>
	{
		const mod = compileSource ("<* a=1; *><p></p><* b=2; *>");
		const idxA = mod.preamble.indexOf ("a=1");
		const idxB = mod.preamble.indexOf ("b=2");
		expect (idxA).to.be.greaterThan (-1);
		expect (idxB).to.be.greaterThan (idxA);
	});

	it ("carries rewrite warnings up to the module", () =>
	{
		const mod = compileSource ("<* await Hot.include(dynamicVar); *>");
		expect (mod.warnings.map (w => w.code))
			.to.include ("hott/hot-include-dynamic");
	});

	it ("numbers placeholder script ids sequentially", () =>
	{
		const src = "<script>a();</script><script>b();</script><script>c();</script>";
		const mod = compileSource (src);
		expect (mod.scripts).to.deep.equal (["a();", "b();", "c();"]);
		expect (mod.template).to.include ("data-hott-script=\"hott-s0\"");
		expect (mod.template).to.include ("data-hott-script=\"hott-s1\"");
		expect (mod.template).to.include ("data-hott-script=\"hott-s2\"");
	});
});
