import "mocha";
import { expect } from "chai";

import { validateHotSiteForStatic } from "../../src/hott/validate-hotsite";
import { HotSite } from "../../src/HotSite";

function base (): HotSite
{
	return ({
		name: "TestApp",
		web: {
			TestApp: {
				mainUrl: "/",
				routes: [
					{ path: "/", file: "./public/index.hott" },
					{ path: "/login", file: "./public/login.hott", preload: "eager" }
				]
			}
		}
	});
}

describe ("v0.9.0 — validateHotSiteForStatic", () =>
{
	it ("accepts a minimal valid HotSite with no warnings", () =>
	{
		const r = validateHotSiteForStatic (base ());
		expect (r.errors).to.be.empty;
		expect (r.warnings).to.be.empty;
	});

	it ("errors when web is missing entirely", () =>
	{
		const site: HotSite = { name: "NoWeb" };
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/no-web-apps");
	});

	it ("errors when an app has no routes", () =>
	{
		const site: HotSite = {
			name: "T",
			web: { T: { mainUrl: "/", routes: [] } }
		};
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/no-routes");
	});

	it ("errors on duplicate route paths", () =>
	{
		const site = base ();
		site.web!.TestApp.routes!.push ({ path: "/", file: "./other.hott" });
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/route-duplicate-path");
	});

	it ("errors on an invalid preload value", () =>
	{
		const site = base ();
		site.web!.TestApp.routes![0].preload = "sometime" as any;
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/route-bad-preload");
	});

	it ("errors when staticRender combines with lazy preload", () =>
	{
		const site = base ();
		site.web!.TestApp.routes!.push ({
			path: "/terms",
			file: "./terms.hott",
			preload: "lazy",
			staticRender: true,
			fixtures: "./fixtures/terms.json"
		});
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/static-render-with-lazy-preload");
	});

	it ("errors when staticRender is set without a fixture source", () =>
	{
		const site = base ();
		site.web!.TestApp.routes!.push ({
			path: "/terms",
			file: "./terms.hott",
			staticRender: true
		});
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/static-render-no-fixture");
	});

	it ("accepts staticRender: true when any fixture source is set", () =>
	{
		const site = base ();
		site.web!.TestApp.routes!.push ({
			path: "/terms",
			file: "./terms.hott",
			preload: "eager",
			staticRender: true,
			fixturesScript: "./fixtures/terms.ts"
		});
		const r = validateHotSiteForStatic (site);
		expect (r.errors).to.be.empty;
	});

	it ("errors on duplicate partial ids", () =>
	{
		const site = base ();
		site.web!.TestApp.partials = [
			{ id: "header", src: "./a.hott" },
			{ id: "header", src: "./b.hott" }
		];
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/partial-duplicate-id");
	});

	it ("errors when a route is missing a path or file", () =>
	{
		const site: HotSite = {
			name: "T",
			web: {
				T: {
					mainUrl: "/",
					routes: [{ path: "/ok", file: "./ok.hott" }, { path: "/bad" } as any]
				}
			}
		};
		const r = validateHotSiteForStatic (site);
		expect (r.errors.map (e => e.code)).to.include ("hotsite/route-missing-file");
	});

	it ("reports each violation with a path for editor navigation", () =>
	{
		const site = base ();
		site.web!.TestApp.routes!.push ({
			path: "/bad",
			file: "./bad.hott",
			preload: "lazy",
			staticRender: true,
			fixtures: "./fx.json"
		});
		const r = validateHotSiteForStatic (site);
		const issue = r.errors.find (e => e.code === "hotsite/static-render-with-lazy-preload");
		expect (issue).to.exist;
		expect (issue!.path).to.equal ("web.TestApp.routes[2]");
	});
});
