import "mocha";
import { expect } from "chai";

import { rewritePreamble, partialIdFromPath } from "../../src/hott/rewrite-preamble";

describe ("v0.9.0 parser — rewritePreamble", () =>
{
	it ("leaves preambles without Hot references untouched", () =>
	{
		const r = rewritePreamble ("let x = 1; const y = x + 2;");
		expect (r.source).to.equal ("let x = 1; const y = x + 2;");
		expect (r.partials).to.be.empty;
		expect (r.warnings).to.be.empty;
	});

	it ("rewrites Hot.getJSON to hotCtx.getJSON", () =>
	{
		const r = rewritePreamble ("const cfg = await Hot.getJSON('/config');");
		expect (r.source).to.include ("hotCtx.getJSON(");
		expect (r.source).to.not.include ("Hot.getJSON");
	});

	it ("rewrites Hot.echoUnsafe to hotCtx.echo", () =>
	{
		const r = rewritePreamble ("Hot.echoUnsafe('<b>hi</b>');");
		expect (r.source).to.include ("hotCtx.echo(");
		expect (r.source).to.not.include ("Hot.echoUnsafe");
	});

	it ("collects literal Hot.include() targets and rewrites to ctx.includeStash", () =>
	{
		const r = rewritePreamble (
			"await Hot.include('./components/header.hott');\n" +
			"await Hot.include('./components/footer.hott');"
		);
		expect (r.partials).to.deep.equal ([
			"./components/header.hott",
			"./components/footer.hott"
		]);
		expect (r.source).to.include (
			"hotCtx.includeStash(\"components/header\")"
		);
		expect (r.source).to.include (
			"hotCtx.includeStash(\"components/footer\")"
		);
	});

	it ("dedupes repeated partial targets but keeps both call-site rewrites", () =>
	{
		const r = rewritePreamble (
			"await Hot.include('./x.hott');\nif (c) await Hot.include('./x.hott');"
		);
		expect (r.partials).to.deep.equal (["./x.hott"]);
		// Both call sites rewritten.
		const count = (r.source.match (/includeStash\(/g) || []).length;
		expect (count).to.equal (2);
	});

	it ("warns and emits a runtime-lookup shim for dynamic Hot.include() args", () =>
	{
		const r = rewritePreamble ("await Hot.include(pageName);");
		expect (r.warnings.map (w => w.code)).to.include ("hott/hot-include-dynamic");
		expect (r.source).to.include ("hotCtx.includeStash(pageName)");
	});

	it ("uses custom ctx param name when provided", () =>
	{
		const r = rewritePreamble ("Hot.getJSON('x');", { ctxParam: "ctx" });
		expect (r.source).to.include ("ctx.getJSON(");
		expect (r.source).to.not.include ("hotCtx.getJSON(");
	});

	it ("bails out entirely when preamble declares a local Hot binding", () =>
	{
		const r = rewritePreamble ("const { Hot } = somewhere; Hot.getJSON('/x');");
		expect (r.warnings.map (w => w.code)).to.include ("hott/hot-local-binding");
		// Source should be unchanged (ts-morph may normalise whitespace/
		// quote style but the token text stays identical on this input).
		expect (r.source).to.include ("Hot.getJSON('/x')");
	});

	it ("warns on unknown Hot.* members without rewriting them", () =>
	{
		const r = rewritePreamble ("Hot.totallyNewAPI();");
		expect (r.warnings.map (w => w.code)).to.include ("hott/hot-unknown-member");
		expect (r.source).to.include ("Hot.totallyNewAPI");
	});

	describe ("partialIdFromPath", () =>
	{
		it ("strips leading ./", () =>
		{
			expect (partialIdFromPath ("./card.hott")).to.equal ("card");
		});
		it ("strips .hott extension", () =>
		{
			expect (partialIdFromPath ("components/card.hott")).to.equal ("components/card");
		});
		it ("preserves full path for uniqueness", () =>
		{
			expect (partialIdFromPath ("./a/b/c.hott")).to.equal ("a/b/c");
		});
		it ("normalises backslashes", () =>
		{
			expect (partialIdFromPath ("a\\b\\c.hott")).to.equal ("a/b/c");
		});
	});
});
