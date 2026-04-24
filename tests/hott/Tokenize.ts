import "mocha";
import { expect } from "chai";

import { tokenize } from "../../src/hott/tokenize";

describe ("v0.9.0 parser — tokenize", () =>
{
	it ("yields a single template_html token for pure HTML", () =>
	{
		const toks = tokenize ("<div>hello</div>");
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("template_html");
		expect (toks[0].source).to.equal ("<div>hello</div>");
		expect (toks[0].start).to.equal (0);
		expect (toks[0].end).to.equal (16);
	});

	it ("extracts a single preamble block", () =>
	{
		const src = "<* let x = 1; *>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("preamble");
		expect (toks[0].source).to.equal (" let x = 1; ");
		expect (toks[0].start).to.equal (0);
		expect (toks[0].end).to.equal (src.length);
	});

	it ("interleaves template_html and preamble blocks in source order", () =>
	{
		const toks = tokenize ("<h1>Hi</h1><* doThing(); *><p>bye</p>");
		expect (toks.map (t => t.kind)).to.deep.equal ([
			"template_html", "preamble", "template_html"
		]);
		expect (toks[0].source).to.equal ("<h1>Hi</h1>");
		expect (toks[1].source).to.equal (" doThing(); ");
		expect (toks[2].source).to.equal ("<p>bye</p>");
	});

	it ("does not split preambles that contain *> inside a string literal", () =>
	{
		const src = "<* const s = \"not *> closing\"; const t = 1; *>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("preamble");
		expect (toks[0].source).to.equal (" const s = \"not *> closing\"; const t = 1; ");
	});

	it ("does not split preambles that contain *> inside a template literal", () =>
	{
		const src = "<* const s = `val ${1+2} *> tail`; *>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("preamble");
	});

	it ("ignores *> inside line comments", () =>
	{
		const src = "<* let a = 1; // *> not closing\n let b = 2; *>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("preamble");
	});

	it ("ignores *> inside block comments", () =>
	{
		const src = "<* /* not *> yet */ let a = 1; *>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("preamble");
	});

	it ("emits an inline_script token for <script> tags with a body", () =>
	{
		const src = "<div><script>console.log('hi');</script></div>";
		const toks = tokenize (src);
		expect (toks.map (t => t.kind)).to.deep.equal ([
			"template_html", "inline_script", "template_html"
		]);
		expect (toks[1].source).to.equal ("console.log('hi');");
	});

	it ("leaves src= <script> tags in template_html (do not hoist)", () =>
	{
		const src = "<script src=\"./app.js\"></script>";
		const toks = tokenize (src);
		expect (toks).to.have.lengthOf (1);
		expect (toks[0].kind).to.equal ("template_html");
	});

	it ("tolerates an unterminated preamble by emitting it up to EOF", () =>
	{
		const toks = tokenize ("<div></div><* forgot to close");
		expect (toks.map (t => t.kind)).to.deep.equal ([
			"template_html", "preamble"
		]);
	});

	it ("preserves source offsets across all tokens", () =>
	{
		const src = "<h1>A</h1><* x; *><p>B</p>";
		const toks = tokenize (src);
		// Offsets round-trip back to source content (preamble token's start
		// includes the `<*`, end includes the `*>`).
		expect (src.substring (toks[0].start, toks[0].end)).to.equal ("<h1>A</h1>");
		expect (src.substring (toks[1].start, toks[1].end)).to.equal ("<* x; *>");
		expect (src.substring (toks[2].start, toks[2].end)).to.equal ("<p>B</p>");
	});
});
