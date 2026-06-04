import "mocha";
import { expect } from "chai";

import { HotStaq } from "../../src/HotStaq";

const { JSDOM } = require ("jsdom");

/**
 * Unit coverage for HotStaq.removeStaleDuplicateIds — the helper that powers
 * the duplicate-id dedupe in HotStaqRegisterComponent's documentSelector
 * placement. It is what lets a component placed into <body> (e.g. admin-edit's
 * modal) survive SPA navigation without leaving a stale, duplicate-id orphan
 * behind for id lookups to resolve to.
 */
describe ("HotStaq.removeStaleDuplicateIds", () =>
	{
		let dom: any = null;
		let savedDocument: any = null;
		let savedHTMLElement: any = null;

		beforeEach (() =>
			{
				dom = new JSDOM (`<!DOCTYPE html><html><body></body></html>`);

				// removeStaleDuplicateIds reads the module-global `document`;
				// point it (and HTMLElement) at the jsdom instance for the test.
				savedDocument = (global as any).document;
				savedHTMLElement = (global as any).HTMLElement;
				(global as any).document = dom.window.document;
				(global as any).HTMLElement = dom.window.HTMLElement;
			});
		afterEach (() =>
			{
				(global as any).document = savedDocument;
				(global as any).HTMLElement = savedHTMLElement;
			});

		it ("removes a pre-existing element that shares the subtree's id", () =>
			{
				const doc = dom.window.document;

				const orphan = doc.createElement ("div");
				orphan.id = "myModal";
				orphan.textContent = "stale";
				doc.body.appendChild (orphan);

				// The incoming (still-detached) replacement subtree.
				const fresh = doc.createElement ("div");
				fresh.id = "myModal";
				fresh.textContent = "fresh";

				HotStaq.removeStaleDuplicateIds (fresh);

				// The stale orphan is gone; the fresh subtree is untouched and
				// still detached (the caller appends it afterwards).
				expect (doc.getElementById ("myModal")).to.equal (null);
				expect (fresh.parentNode).to.equal (null);
				expect (fresh.textContent).to.equal ("fresh");
			});

		it ("clears multiple accumulated orphans with the same id", () =>
			{
				const doc = dom.window.document;

				for (let iIdx = 0; iIdx < 3; iIdx++)
				{
					const orphan = doc.createElement ("div");
					orphan.id = "dupe";
					doc.body.appendChild (orphan);
				}

				const fresh = doc.createElement ("div");
				fresh.id = "dupe";

				HotStaq.removeStaleDuplicateIds (fresh);

				expect (doc.querySelectorAll ("#dupe").length).to.equal (0);
			});

		it ("also dedupes ids carried by descendants of the subtree", () =>
			{
				const doc = dom.window.document;

				const orphanLabel = doc.createElement ("h5");
				orphanLabel.id = "myModalLabel";
				doc.body.appendChild (orphanLabel);

				const fresh = doc.createElement ("div");
				fresh.id = "myModal";
				const label = doc.createElement ("h5");
				label.id = "myModalLabel";
				fresh.appendChild (label);

				HotStaq.removeStaleDuplicateIds (fresh);

				// The body orphan label is gone; the one inside the fresh subtree
				// (not yet in the document) is preserved.
				expect (doc.getElementById ("myModalLabel")).to.equal (null);
				expect (fresh.querySelector ("#myModalLabel")).to.not.equal (null);
			});

		it ("leaves unrelated ids alone", () =>
			{
				const doc = dom.window.document;

				const keep = doc.createElement ("div");
				keep.id = "keepMe";
				doc.body.appendChild (keep);

				const fresh = doc.createElement ("div");
				fresh.id = "somethingElse";

				HotStaq.removeStaleDuplicateIds (fresh);

				expect (doc.getElementById ("keepMe")).to.not.equal (null);
			});

		it ("no-ops on a null subtree", () =>
			{
				expect (() => HotStaq.removeStaleDuplicateIds (null)).to.not.throw ();
			});
	});

describe ("HotStaq.isUUID", () =>
	{
		it ("accepts valid v1-5 UUIDs", () =>
			{
				expect (HotStaq.isUUID ("51dd2aec-4c64-4cea-a9dc-49243edd9a74")).to.equal (true);
				expect (HotStaq.isUUID ("e5735946-c42b-48e3-a5f3-ea0ea453894f")).to.equal (true);
			});

		it ("rejects non-UUID strings, including the SPA-bug placeholders", () =>
			{
				expect (HotStaq.isUUID ("null")).to.equal (false);
				expect (HotStaq.isUUID ("undefined")).to.equal (false);
				expect (HotStaq.isUUID ("")).to.equal (false);
				expect (HotStaq.isUUID ("not-a-uuid")).to.equal (false);
				// Nil UUID / all-zeros has an invalid version nibble under the
				// strict v1-5 pattern.
				expect (HotStaq.isUUID ("00000000-0000-0000-0000-000000000000")).to.equal (false);
			});

		it ("rejects non-string input", () =>
			{
				expect (HotStaq.isUUID (null)).to.equal (false);
				expect (HotStaq.isUUID (undefined)).to.equal (false);
				expect (HotStaq.isUUID (1234 as any)).to.equal (false);
			});
	});
