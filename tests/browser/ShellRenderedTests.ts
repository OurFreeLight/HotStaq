import "mocha";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

/**
 * Rendered-shell layout mode: the `src` on <hotstaq> is a shell .hott rendered
 * ONCE via useOutput, then routes are injected into its <hot-outlet>. This is
 * the path apps with dynamic chrome use (vs. a static host-HTML shell). Proves
 * the shell renders exactly once, persists across navigation, and never
 * duplicates body-level chrome into the outlet.
 */
describe ("Rendered-Shell SPA Navigation Tests", () =>
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
				await common.driver.get (`${common.getUrl ()}/tests/browser/Shell-Rendered-Host.html`);

				await HotStaq.wait (2500);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("should render the shell .hott once and expose its chrome + outlet", async () =>
			{
				let nav = await common.driver.wait (until.elementLocated (By.id ("rendered-nav")), 5000);
				expect (nav).to.not.equal (null, "Shell chrome should be rendered from the shell .hott");

				let hasOutlet: boolean = await common.driver.executeScript (
					"return document.querySelector ('#hot-outlet') != null;");
				expect (hasOutlet).to.equal (true, "The shell's <hot-outlet> should be present");

				let runs: number = await common.driver.executeScript ("return window.__renderedShellRuns;");
				expect (runs).to.equal (1, "The shell .hott should have rendered exactly once");

				let enabled: boolean = await common.driver.executeScript (
					"return HotStaqWeb.HotStaq.layoutEnabled === true;");
				expect (enabled).to.equal (true, "layoutEnabled should be true in rendered-shell mode");
			});

		it ("should inject route content into the rendered shell's outlet", async () =>
			{
				await navigate ("/tests/browser/ShellPageA");

				let title = await common.driver.wait (until.elementLocated (By.id ("shellPageATitle")), 5000);
				expect (await title.getAttribute ("innerHTML")).to.equal ("Shell Page A");

				let insideOutlet: boolean = await common.driver.executeScript (
					"return document.querySelector ('#hot-outlet #shellPageATitle') != null;");
				expect (insideOutlet).to.equal (true, "Route content should be injected into the shell outlet");
			});

		it ("should keep the rendered shell persistent (rendered once) across navigation", async () =>
			{
				await navigate ("/tests/browser/ShellPageB");
				await navigate ("/tests/browser/ShellPageA");

				let runs: number = await common.driver.executeScript ("return window.__renderedShellRuns;");
				expect (runs).to.equal (1, "The shell must not re-render on navigation");

				let navStillThere: boolean = await common.driver.executeScript (
					"return document.getElementById ('rendered-nav') != null;");
				expect (navStillThere).to.equal (true, "Shell chrome should persist across navigation");
			});

		it ("should not duplicate body-level chrome into the outlet across navigations", async () =>
			{
				await navigate ("/tests/browser/ShellPageA");
				await navigate ("/tests/browser/ShellPageB");
				await navigate ("/tests/browser/ShellPageA");

				let count: number = await common.driver.executeScript (
					"return document.querySelectorAll ('#rendered-modal').length;");
				expect (count).to.equal (1, "Body-level chrome must never duplicate into the swapped outlet");
			});
	});
