/**
 * Validate a HotSite definition for v0.9.0 static-build constraints. Runs
 * only under `hotstaq build --static`; SSR mode ignores every rule here.
 *
 * See design/HS090-hotsite-schema.md "Validation Rules Enforced by Compiler".
 */

import { HotSite, HotSiteWebRoute, HotSiteWebPartial } from "../HotSite";

export interface HotSiteValidationIssue
{
	code: string;
	/** Fatal for --static regardless of --strict. */
	severity: "error" | "warning";
	message: string;
	/** Dotted path into the HotSite object, e.g. `web.App.routes[2]`. */
	path?: string;
}

export interface HotSiteValidationResult
{
	issues: HotSiteValidationIssue[];
	errors: HotSiteValidationIssue[];
	warnings: HotSiteValidationIssue[];
}

/**
 * Validate a HotSite for static-build readiness.
 *
 * The function never throws — callers decide whether to abort the build
 * based on `result.errors.length > 0` (and, optionally for warnings, on
 * `--strict`).
 */
export function validateHotSiteForStatic (site: HotSite): HotSiteValidationResult
{
	const issues: HotSiteValidationIssue[] = [];

	if (!site || typeof site !== "object")
	{
		issues.push ({
			code: "hotsite/not-an-object",
			severity: "error",
			message: "HotSite must be an object."
		});
		return (finalize (issues));
	}

	if (!site.web || typeof site.web !== "object")
	{
		issues.push ({
			code: "hotsite/no-web-apps",
			severity: "error",
			message: "HotSite.web is required for --static builds (no apps to compile)."
		});
		return (finalize (issues));
	}

	for (const appName of Object.keys (site.web))
	{
		const app = site.web[appName];
		const pathBase: string = `web.${appName}`;

		validateRoutes (appName, app.routes, pathBase, issues);
		validatePartials (appName, app.partials, pathBase, issues);
	}

	return (finalize (issues));
}

function validateRoutes (
	appName: string,
	routes: HotSiteWebRoute[] | undefined,
	pathBase: string,
	issues: HotSiteValidationIssue[]
): void
{
	if (!routes || routes.length === 0)
	{
		issues.push ({
			code: "hotsite/no-routes",
			severity: "error",
			message: `web.${appName} has no routes; --static has nothing to build.`,
			path: `${pathBase}.routes`
		});
		return;
	}

	const seenPaths: Map<string, number> = new Map ();

	for (let i = 0; i < routes.length; i++)
	{
		const r: HotSiteWebRoute = routes[i];
		const rpath: string = `${pathBase}.routes[${i}]`;

		if (!r.path || typeof r.path !== "string")
		{
			issues.push ({
				code: "hotsite/route-missing-path",
				severity: "error",
				message: `Route at ${rpath} is missing a path.`,
				path: rpath
			});
			continue;
		}
		if (!r.file || typeof r.file !== "string")
		{
			issues.push ({
				code: "hotsite/route-missing-file",
				severity: "error",
				message: `Route ${r.path} is missing a file.`,
				path: rpath
			});
		}

		if (seenPaths.has (r.path))
		{
			issues.push ({
				code: "hotsite/route-duplicate-path",
				severity: "error",
				message: `Duplicate route path ${r.path} (first seen at ${pathBase}.routes[${seenPaths.get (r.path)}]).`,
				path: rpath
			});
		}
		else
		{
			seenPaths.set (r.path, i);
		}

		const preload = r.preload || "eager";
		if (preload !== "eager" && preload !== "lazy" && preload !== "never")
		{
			issues.push ({
				code: "hotsite/route-bad-preload",
				severity: "error",
				message: `Route ${r.path}: preload must be "eager" | "lazy" | "never" (got ${JSON.stringify (r.preload)}).`,
				path: rpath
			});
		}

		if (r.staticRender === true)
		{
			if (preload === "lazy" || preload === "never")
			{
				issues.push ({
					code: "hotsite/static-render-with-lazy-preload",
					severity: "error",
					message: `Route ${r.path}: staticRender: true is incompatible with preload: ${preload}. ` +
						"staticRender implies the prerendered HTML must be in the shell for crawlers, " +
						"which lazy-loaded chunks don't satisfy.",
					path: rpath
				});
			}

			const hasFixture = !!(r.fixtures || r.fixturesApi || r.fixturesScript);
			if (!hasFixture)
			{
				issues.push ({
					code: "hotsite/static-render-no-fixture",
					severity: "error",
					message: `Route ${r.path}: staticRender: true requires one of fixtures, fixturesApi, or fixturesScript.`,
					path: rpath
				});
			}
		}
	}
}

function validatePartials (
	appName: string,
	partials: HotSiteWebPartial[] | undefined,
	pathBase: string,
	issues: HotSiteValidationIssue[]
): void
{
	if (!partials || partials.length === 0)
		return;

	const seenIds: Map<string, number> = new Map ();

	for (let i = 0; i < partials.length; i++)
	{
		const p: HotSiteWebPartial = partials[i];
		const ppath: string = `${pathBase}.partials[${i}]`;

		if (!p.id || typeof p.id !== "string")
		{
			issues.push ({
				code: "hotsite/partial-missing-id",
				severity: "error",
				message: `Partial at ${ppath} is missing an id.`,
				path: ppath
			});
			continue;
		}
		if (!p.src || typeof p.src !== "string")
		{
			issues.push ({
				code: "hotsite/partial-missing-src",
				severity: "error",
				message: `Partial ${p.id} is missing src.`,
				path: ppath
			});
		}

		if (seenIds.has (p.id))
		{
			issues.push ({
				code: "hotsite/partial-duplicate-id",
				severity: "error",
				message: `Duplicate partial id ${p.id} (first seen at ${pathBase}.partials[${seenIds.get (p.id)}]).`,
				path: ppath
			});
		}
		else
		{
			seenIds.set (p.id, i);
		}
	}
}

function finalize (issues: HotSiteValidationIssue[]): HotSiteValidationResult
{
	const errors: HotSiteValidationIssue[] = [];
	const warnings: HotSiteValidationIssue[] = [];

	for (const issue of issues)
	{
		if (issue.severity === "error")
			errors.push (issue);
		else
			warnings.push (issue);
	}

	return ({ issues, errors, warnings });
}
