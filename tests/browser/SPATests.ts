import "mocha";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";

import { Common } from "../Common";

import { HotStaq } from "../../src/api";

describe ("SPA Navigation Tests", () =>
	{
		let common: Common = null;

		before (async () =>
			{
				let processor = new HotStaq ();

				common = new Common (processor);
				await common.load ();

				await common.startServer ();
				await common.driver.get (`${common.getUrl ()}/tests/browser/SPA-Load-Page.html`);

				// Wait for the initial page to load via the <hotstaq> tag.
				await HotStaq.wait (2000);
			});
		after (async () =>
			{
				await common.driver.quit ();
				await common.shutdown ();
				await common.driver.sleep (1000);
			});

		it ("should load the initial SPA page via the hotstaq tag", async () =>
			{
				// The <hotstaq> tag loads SPAPage1.hott into the page.
				let elm = await common.driver.wait (until.elementLocated (By.id ("page1Title")), 5000);
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 1");
			});

		it ("should have SPA mode enabled", async () =>
			{
				let spaEnabled: boolean = await common.driver.executeScript (
					"return (typeof HotStaqWeb !== 'undefined' && HotStaqWeb.HotStaq.spaEnabled === true);");
				expect (spaEnabled).to.equal (true, "SPA mode should be enabled via the spa-target attribute");
			});

		it ("should have the correct spaTarget selector", async () =>
			{
				let target: string = await common.driver.executeScript (
					"return HotStaqWeb.HotStaq.spaTarget;");
				expect (target).to.equal ("#spa-target");
			});

		it ("should have routes registered in the router manager", async () =>
			{
				let hasPage1: boolean = await common.driver.executeScript (
					"return (HotStaqWeb.HotStaq.routerManager['/tests/browser/SPAPage1'] != null);");
				let hasPage2: boolean = await common.driver.executeScript (
					"return (HotStaqWeb.HotStaq.routerManager['/tests/browser/SPAPage2'] != null);");

				expect (hasPage1).to.equal (true, "Route for SPAPage1 should be registered");
				expect (hasPage2).to.equal (true, "Route for SPAPage2 should be registered");
			});

		it ("should navigate to page 2 via navigateTo()", async () =>
			{
				// Call navigateTo directly.
				await common.driver.executeAsyncScript (`
					var done = arguments[arguments.length - 1];
					HotStaqWeb.HotStaq.navigateTo ('/tests/browser/SPAPage2').then (function () { done (); });
				`);

				await HotStaq.wait (1000);

				let elm = await common.driver.wait (until.elementLocated (By.id ("page2Title")), 5000);
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 2");
			});

		it ("should have replaced only the target content, not the shell", async () =>
			{
				// The nav and shell elements should still exist.
				let nav = await common.driver.findElement (By.id ("spa-nav"));
				expect (nav).to.not.equal (null, "Navigation shell should still be present after SPA nav");

				let shell = await common.driver.findElement (By.id ("spa-shell"));
				expect (shell).to.not.equal (null, "Outer shell should still be present after SPA nav");
			});

		it ("should have updated the browser URL", async () =>
			{
				let url: string = await common.driver.getCurrentUrl ();
				expect (url).to.include ("/tests/browser/SPAPage2", "URL should reflect SPA navigation");
			});

		it ("should navigate via link click interception", async () =>
			{
				// Click the nav link to Page 1.
				let link = await common.driver.findElement (By.id ("navPage1"));
				await link.click ();

				await HotStaq.wait (1000);

				let elm = await common.driver.wait (until.elementLocated (By.id ("page1Title")), 5000);
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 1");

				let url: string = await common.driver.getCurrentUrl ();
				expect (url).to.include ("/tests/browser/SPAPage1", "URL should update after link click SPA nav");
			});

		it ("should execute scripts in SPA-loaded content", async () =>
			{
				// Navigate to Page 2 and check that its inline script executed.
				await common.driver.executeAsyncScript (`
					var done = arguments[arguments.length - 1];
					HotStaqWeb.HotStaq.navigateTo ('/tests/browser/SPAPage2').then (function () { done (); });
				`);

				await HotStaq.wait (1000);

				let scriptElm = await common.driver.findElement (By.id ("page2Script"));
				let value: string = await scriptElm.getAttribute ("innerHTML");
				expect (value).to.equal ("page2-loaded", "Inline scripts should execute after SPA navigation");
			});

		it ("should handle browser back button via popstate", async () =>
			{
				// We're on Page 2. Go back to Page 1.
				await common.driver.navigate ().back ();

				await HotStaq.wait (1500);

				let elm = await common.driver.wait (until.elementLocated (By.id ("page1Title")), 5000);
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 1");
			});

		it ("should handle browser forward button via popstate", async () =>
			{
				// We should be on Page 1. Go forward to Page 2.
				await common.driver.navigate ().forward ();

				await HotStaq.wait (1500);

				let elm = await common.driver.wait (until.elementLocated (By.id ("page2Title")), 5000);
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 2");
			});

		it ("should fire onBeforeNavigate and onAfterNavigate hooks", async () =>
			{
				// Set up hooks.
				await common.driver.executeScript (`
					HotStaqWeb.HotStaq.onBeforeNavigate = function (path) {
						document.getElementById ('beforeNavFired').innerHTML = 'before:' + path;
						return true;
					};
					HotStaqWeb.HotStaq.onAfterNavigate = function (path) {
						document.getElementById ('afterNavFired').innerHTML = 'after:' + path;
					};
				`);

				// Navigate to Page 1.
				await common.driver.executeAsyncScript (`
					var done = arguments[arguments.length - 1];
					HotStaqWeb.HotStaq.navigateTo ('/tests/browser/SPAPage1').then (function () { done (); });
				`);

				await HotStaq.wait (1000);

				let beforeElm = await common.driver.findElement (By.id ("beforeNavFired"));
				let beforeVal: string = await beforeElm.getAttribute ("innerHTML");
				expect (beforeVal).to.equal ("before:/tests/browser/SPAPage1", "onBeforeNavigate should fire with correct path");

				let afterElm = await common.driver.findElement (By.id ("afterNavFired"));
				let afterVal: string = await afterElm.getAttribute ("innerHTML");
				expect (afterVal).to.equal ("after:/tests/browser/SPAPage1", "onAfterNavigate should fire with correct path");
			});

		it ("should allow onBeforeNavigate to cancel navigation", async () =>
			{
				// Set onBeforeNavigate to return false.
				await common.driver.executeScript (`
					HotStaqWeb.HotStaq.onBeforeNavigate = function (path) {
						return false;
					};
					HotStaqWeb.HotStaq.onAfterNavigate = null;
				`);

				// Try to navigate to Page 2 — should be blocked.
				await common.driver.executeAsyncScript (`
					var done = arguments[arguments.length - 1];
					HotStaqWeb.HotStaq.navigateTo ('/tests/browser/SPAPage2').then (function () { done (); });
				`);

				await HotStaq.wait (500);

				// Page 1 content should still be showing.
				let elm = await common.driver.findElement (By.id ("page1Title"));
				let value: string = await elm.getAttribute ("innerHTML");
				expect (value).to.equal ("SPA Page 1", "Navigation should have been cancelled by onBeforeNavigate returning false");

				// Clean up: remove the blocking hook.
				await common.driver.executeScript (`
					HotStaqWeb.HotStaq.onBeforeNavigate = null;
				`);
			});
	});
