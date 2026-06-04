import "mocha";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

/**
 * Layout (app-shell) SPA mode: the shell (chrome + <hot-outlet>) renders once
 * and each route .hott is content-only, injected into the outlet. These tests
 * prove the shell persists across navigation, body-level chrome is never
 * duplicated into the outlet (the regression that motivated the feature), and
 * content-only route scripts run on each entry.
 */
describe ("Shell/Outlet SPA Navigation Tests", () =>
	{
		let common: Common = null;

		const navigate = async (path: string): Promise<void> =>
			{
				await common.driver.executeAsyncScript (`
					var done = arguments[arguments.length - 1];
					HotStaqWeb.HotStaq.navigateTo ('${path}').then (function () { done (); });
				`);
				await HotStaq.wait (800);
			};

		before (async () =>
			{
				let processor = new HotStaq ();

				common = new Common (processor);
				await common.load ();

				await common.startServer ();
				await common.driver.get (`${common.getUrl ()}/tests/browser/Shell-Load-Page.html`);

				await HotStaq.wait (2000);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("should boot into layout mode with the outlet selector", async () =>
			{
				let enabled: boolean = await common.driver.executeScript (
					"return HotStaqWeb.HotStaq.layoutEnabled === true;");
				expect (enabled).to.equal (true, "layoutEnabled should be true when an outlet attribute is present");

				let outlet: string = await common.driver.executeScript (
					"return HotStaqWeb.HotStaq.spaOutlet;");
				expect (outlet).to.equal ("#hot-outlet", "spaOutlet should reflect the outlet attribute");
			});

		it ("should inject content-only route content into the outlet", async () =>
			{
				await navigate ("/tests/browser/ShellPageA");

				let title = await common.driver.wait (until.elementLocated (By.id ("shellPageATitle")), 5000);
				expect (await title.getAttribute ("innerHTML")).to.equal ("Shell Page A");

				// The injected content lives INSIDE the outlet, not loose in body.
				let insideOutlet: boolean = await common.driver.executeScript (
					"return document.querySelector ('#hot-outlet #shellPageATitle') != null;");
				expect (insideOutlet).to.equal (true, "Route content should be injected into the outlet");
			});

		it ("should keep the shell (nav) persistent across navigation, not re-rendered", async () =>
			{
				// Mark the live nav element; if the shell were re-rendered the
				// marker would be lost.
				await common.driver.executeScript (
					"document.getElementById ('shell-nav').setAttribute ('data-persist-marker', 'kept');");

				await navigate ("/tests/browser/ShellPageB");
				await navigate ("/tests/browser/ShellPageA");

				let marker: string = await common.driver.executeScript (
					"var n = document.getElementById ('shell-nav'); return n ? n.getAttribute ('data-persist-marker') : null;");
				expect (marker).to.equal ("kept", "The shell nav must be the same persistent element, never re-rendered");
			});

		it ("should NOT duplicate body-level elements into the outlet across navigations", async () =>
			{
				// The exact regression: navigate A -> B -> A and confirm the
				// body-level #shell-modal stays at exactly one copy (the old
				// greedy body.innerHTML fallback duplicated it on the first nav).
				await navigate ("/tests/browser/ShellPageA");
				await navigate ("/tests/browser/ShellPageB");
				await navigate ("/tests/browser/ShellPageA");

				let count: number = await common.driver.executeScript (
					"return document.querySelectorAll ('#shell-modal').length;");
				expect (count).to.equal (1, "Body-level chrome must never be duplicated into the swapped outlet");

				// And the modal must still be a body-level sibling, not pulled
				// inside the outlet.
				let insideOutlet: boolean = await common.driver.executeScript (
					"return document.querySelector ('#hot-outlet #shell-modal') != null;");
				expect (insideOutlet).to.equal (false, "The body-level modal must not be moved into the outlet");
			});

		it ("should run content-only route scripts on each entry", async () =>
			{
				await navigate ("/tests/browser/ShellPageB");

				let first: string = await common.driver.executeScript (
					"var s = document.getElementById ('shellPageBScript'); return s ? s.innerHTML : null;");
				expect (first).to.equal ("shellB-loaded", "Page B's inline script should run on entry");

				// Leave B, return to B — the freshly re-injected script must run again.
				await navigate ("/tests/browser/ShellPageA");
				await navigate ("/tests/browser/ShellPageB");

				let second: string = await common.driver.executeScript (
					"var s = document.getElementById ('shellPageBScript'); return s ? s.innerHTML : null;");
				expect (second).to.equal ("shellB-loaded", "Page B's inline script should re-run when re-navigated to");
			});

		it ("should update the browser URL on navigation", async () =>
			{
				await navigate ("/tests/browser/ShellPageB");

				let url: string = await common.driver.getCurrentUrl ();
				expect (url).to.include ("/tests/browser/ShellPageB", "URL should reflect the navigated route");
			});

		it ("should navigate via shell link clicks (interception)", async () =>
			{
				await navigate ("/tests/browser/ShellPageB");

				let link = await common.driver.findElement (By.id ("navShellA"));
				await link.click ();

				await HotStaq.wait (800);

				let title = await common.driver.wait (until.elementLocated (By.id ("shellPageATitle")), 5000);
				expect (await title.getAttribute ("innerHTML")).to.equal ("Shell Page A");
			});
	});
