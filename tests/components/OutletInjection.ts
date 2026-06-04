import "mocha";
import { expect } from "chai";

import { HotStaq } from "../../src/HotStaq";

const { JSDOM } = require ("jsdom");

/**
 * Unit coverage for HotStaq.injectIntoOutlet — the layout-mode content
 * injection that replaces the legacy region-extraction path. Because a route
 * render is content-only, body.innerHTML IS the content; this verifies it lands
 * in the outlet, leaves sibling chrome untouched, and degrades safely.
 */
describe ("HotStaq.injectIntoOutlet", () =>
	{
		let dom: any = null;
		let savedDocument: any = null;
		let savedHTMLElement: any = null;
		let savedDOMParser: any = null;

		beforeEach (() =>
			{
				dom = new JSDOM (`<!DOCTYPE html><html><body></body></html>`);

				savedDocument = (global as any).document;
				savedHTMLElement = (global as any).HTMLElement;
				savedDOMParser = (global as any).DOMParser;
				(global as any).document = dom.window.document;
				(global as any).HTMLElement = dom.window.HTMLElement;
				(global as any).DOMParser = dom.window.DOMParser;
			});
		afterEach (() =>
			{
				(global as any).document = savedDocument;
				(global as any).HTMLElement = savedHTMLElement;
				(global as any).DOMParser = savedDOMParser;
			});

		it ("injects content-only output into the outlet element", () =>
			{
				const doc = dom.window.document;
				doc.body.innerHTML = `<div id="outlet"></div>`;

				const output = `<html><body><h1 id="t">Hello</h1><p id="p">Body</p></body></html>`;
				const el = (HotStaq as any).injectIntoOutlet (output, "#outlet");

				expect (el).to.not.equal (null);
				expect (doc.querySelector ("#outlet #t")).to.not.equal (null);
				expect (doc.querySelector ("#outlet #t").innerHTML).to.equal ("Hello");
				expect (doc.querySelector ("#outlet #p")).to.not.equal (null);
			});

		it ("leaves sibling chrome (e.g. body-level modals) untouched", () =>
			{
				const doc = dom.window.document;
				doc.body.innerHTML =
					`<nav id="chrome">nav</nav>` +
					`<div id="outlet"><span id="old">old</span></div>` +
					`<div id="shell-modal">modal</div>`;

				(HotStaq as any).injectIntoOutlet (`<div id="fresh">new</div>`, "#outlet");

				// Outlet replaced...
				expect (doc.querySelector ("#outlet #fresh")).to.not.equal (null);
				expect (doc.getElementById ("old")).to.equal (null);
				// ...siblings untouched, exactly one copy each.
				expect (doc.getElementById ("chrome")).to.not.equal (null);
				expect (doc.querySelectorAll ("#shell-modal").length).to.equal (1);
				expect (doc.querySelector ("#outlet #shell-modal")).to.equal (null);
			});

		it ("returns null when the outlet is absent", () =>
			{
				const doc = dom.window.document;
				doc.body.innerHTML = `<div id="not-the-outlet"></div>`;

				const el = (HotStaq as any).injectIntoOutlet (`<div>x</div>`, "#outlet");
				expect (el).to.equal (null);
			});
	});
