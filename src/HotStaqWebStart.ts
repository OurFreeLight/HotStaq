import { Hot } from "./Hot";
import { HotClient } from "./HotClient";
import { HotFile } from "./HotFile";
import { HotLog } from "./HotLog";
import { HotEventMethod } from "./HotRouteMethod";
import { HotStaq, HotStartOptions } from "./HotStaq";

/**
 * If running in a browser, this will start HotStaq.
 */
export function hotStaqWebStart ()
{
	// @ts-ignore
	if (typeof (window.hotstaqStartingApp) !== "undefined")
	{
		// @ts-ignore
		if (window.hotstaqStartingApp === true)
			return;
	}

	// Prevent re-entry from synthetic load events dispatched by useOutput.
	// @ts-ignore
	window.hotstaqStartingApp = true;

	let hotstaqElms = document.getElementsByTagName ("hotstaq");

	// Set this to true, just in case...
	HotStaq.isWeb = true;

	// @ts-ignore
	if (typeof (HotStaqWeb) !== "undefined")
	{
		// @ts-ignore
		for (let key in HotStaqWeb)
		{
			// @ts-ignore
			window[key] = HotStaqWeb[key];
		}
	}

	if (hotstaqElms.length > 0)
	{
		let hotstaqElm: HTMLElement = (<HTMLElement>hotstaqElms[0]);

		setTimeout (async function ()
			{
				let getAttr = (elm: HTMLElement, attrNames: string[]) =>
					{
						for (let iIdx = 0; iIdx < attrNames.length; iIdx++)
						{
							let attrName: string = attrNames[iIdx];

							if (elm.getAttribute (attrName) != null)
								return (elm.getAttribute (attrName));

							if (elm.getAttribute (`data-${attrName}`) != null)
								return (elm.getAttribute (`data-${attrName}`));
						}

						return (undefined);
					};

				let loadPage: string = getAttr (hotstaqElm, ["load-page", "loadPage", "src"]) || "";
				let loggingLevel: string = getAttr (hotstaqElm, ["logging-level", "loggingLevel"]) || null;
				let startDelay: string = getAttr (hotstaqElm, ["start-delay", "startDelay"]) || null;
				let router: string = getAttr (hotstaqElm, ["router"]) || "";
				let spaTarget: string = getAttr (hotstaqElm, ["spa-target", "spaTarget"]) || null;
				let outlet: string = getAttr (hotstaqElm, ["outlet", "spa-outlet", "spaOutlet"]) || null;
				// In layout mode the `src` is the shell page (rendered once); the
				// route is resolved separately from the URL. Capture it before the
				// router match below overwrites `loadPage` with the route's src.
				let shellSrc: string = getAttr (hotstaqElm, ["src"]) || "";
				let name: string = getAttr (hotstaqElm, ["name"]) || "default";
				let args: string = getAttr (hotstaqElm, ["args"]) || null;
				let apiJSUrl: string = getAttr (hotstaqElm, ["api-js-url", "apiJSUrl"]) || null;
				let apiLibrary: string = getAttr (hotstaqElm, ["api-library", "apiLibrary"]) || null;
				let apiName: string = getAttr (hotstaqElm, ["api-name", "apiName"]) || null;
				let apiUrl: string = getAttr (hotstaqElm, ["api-url", "apiUrl"]) || null;
				let testerName: string = getAttr (hotstaqElm, ["tester-name", "testerName"]) || "HotTesterMochaSelenium";
				let testerMap: string = getAttr (hotstaqElm, ["tester-map", "testerMap"]) || null;
				let testerApiBaseUrl: string = getAttr (hotstaqElm, ["tester-api-base-url", "testerApiBaseUrl"]) || null;
				let testerLaunchpadUrl: string = getAttr (hotstaqElm, ["tester-launchpad-url", "testerLaunchpadUrl"]) || null;
				let dontReuseProcessor: boolean = false;
				let passRawUrl: boolean = false;
				let htmlSource: string = hotstaqElm.innerHTML || "";
				let routerManager: { [path: string]: { redirect: string; baseRedirect: string; base: string; src: string; } } = {};
				let routerWildcards: string[] = [];
				let search: URLSearchParams = new URLSearchParams (window.location.search);

				if (startDelay != null)
					await HotStaq.wait (parseInt (startDelay));

				if (getAttr (hotstaqElm, ["src"]) != null)
					loadPage = getAttr (hotstaqElm, ["src"]);

				if (getAttr (hotstaqElm, ["passRawUrl"]) != null)
					passRawUrl = true;

				if (getAttr (hotstaqElm, ["dont-reuse-processor", "dontReuseProcessor"]) != null)
					dontReuseProcessor = true;

				let hstqbaseredirect: string = search.get ("hstqbaseredirect");

				if (hstqbaseredirect != null)
				{
					hstqbaseredirect = decodeURI (hstqbaseredirect);
					window.history.replaceState ("", "", hstqbaseredirect);
					loadPage = hstqbaseredirect;
				}

				let hotstaqErrors = document.getElementsByTagName ("hotstaq-error");

				for (let iIdx = 0; iIdx < hotstaqErrors.length; iIdx++)
				{
					// @ts-ignore
					let hotstaqErrorElm: HTMLElement = hotstaqErrors[iIdx];
					let errorStatus: string = getAttr (hotstaqErrorElm, ["status"]);
					let unsupportedBrowser: string = getAttr (hotstaqErrorElm, ["unsupported-browser-redirect"]);

					if (unsupportedBrowser != null)
						HotStaq.errors["unsupportedBrowser"] = { redirectToUrl: unsupportedBrowser };
					else
						HotStaq.errors[`${errorStatus}`] = { redirectToUrl: unsupportedBrowser };
				}

				// Check if async/await is available.
				try
				{
					eval ("async () => {}");
				}
				catch (ex)
				{
					HotStaq.executeError ("unsupportedBrowser");
				}

				if (router !== "")
				{
					let hotstaqRouterElms = document.getElementsByTagName ("hotstaq-router");

					for (let iIdx = 0; iIdx < hotstaqRouterElms.length; iIdx++)
					{
						// @ts-ignore
						let hotstaqRouterElm: HTMLElement = hotstaqRouterElms[iIdx];
						let routerName: string = getAttr (hotstaqRouterElm, ["name"]);
						let serveLocally: string = getAttr (hotstaqRouterElm, ["serve-local", "serveLocally"]);

						// @ts-ignore
						if (routerName === router)
						{
							// Load all routes from the router.
							for (let iJdx = 0; iJdx < hotstaqRouterElm.childNodes.length; iJdx++)
							{
								// @ts-ignore
								let routerElm: HTMLElement = hotstaqRouterElm.childNodes[iJdx];

								if (routerElm instanceof HTMLElement)
								{
									if (routerElm.tagName.toUpperCase () === "ROUTE")
									{
										let routerPath: string = getAttr (routerElm, ["path"]);
										let redirect: string = getAttr (routerElm, ["redirect"]);
										let baseRedirect: string = getAttr (routerElm, ["base-redirect", "baseRedirect"]);
										let base: string = getAttr (routerElm, ["base"]);
										let routerSrc: string = getAttr (routerElm, ["src"]);

										if (routerPath.indexOf ("*") > -1)
											routerWildcards.push (routerPath);

										routerManager[routerPath] = {
												redirect: redirect || undefined,
												baseRedirect: baseRedirect || undefined,
												base: base || undefined,
												src: routerSrc || undefined
											};
									}
								}
							}

							let checkPath: string = window.location.pathname;
							let gotoPath: string = window.location.pathname;

							if (serveLocally != null)
							{
								const lowerServeLocally: string = serveLocally.toLowerCase ();

								if ((lowerServeLocally === "true") ||
									(lowerServeLocally === "yes") ||
									(lowerServeLocally === "1"))
								{
									const lastSlashPos: number = checkPath.lastIndexOf ("/");

									if (lastSlashPos > -1)
									{
										checkPath = checkPath.substring (lastSlashPos);
										gotoPath = gotoPath.substring (lastSlashPos);
									}
								}
							}

							if (routerWildcards.length > 0)
							{
								// Serve locally doesn't really work with wildcards
								/// @fixme This isn't actually working like a wildcard should. This needs to be improved.
								for (let iJdx = 0; iJdx < routerWildcards.length; iJdx++)
								{
									let routeWildcard: string = routerWildcards[iJdx];
									let tempRouteWildcard: string = routeWildcard.replace ("*", "");

									if (checkPath.indexOf (tempRouteWildcard) > -1)
									{
										// This simply returns the key in the routerManager to access.
										checkPath = routeWildcard;

										break;
									}
								}
							}

							// Find the correct route and load it.
							if (routerManager[checkPath] != null)
							{
								if (routerManager[checkPath].redirect != null)
								{
									window.location.href = routerManager[checkPath].redirect;

									return;
								}

								if (routerManager[checkPath].baseRedirect != null)
								{
									const searchParams = window.location.search;
									let modifiedSearchParams = "";

									if ((searchParams !== "") && (searchParams !== "?"))
										modifiedSearchParams = `&${searchParams.substring (1)}`;

									window.location.href = `${routerManager[checkPath].baseRedirect}?hstqbaseredirect=${encodeURI (gotoPath + searchParams)}${modifiedSearchParams}`;

									return;
								}

								if (routerManager[checkPath].src != null)
									loadPage = routerManager[checkPath].src;
							}

							break;
						}
					}
				}

				// Store router data on HotStaq for SPA navigation.
				HotStaq.routerManager = routerManager;
				HotStaq.routerWildcards = routerWildcards;

				// Also save on window as a backup — these survive any class
				// re-initialization that may occur during useOutput's DOM replacement.
				// @ts-ignore
				window.__hotstaqRouterManager = routerManager;
				// @ts-ignore
				window.__hotstaqRouterWildcards = routerWildcards;

				if (args != null)
					args = JSON.parse (args);
				else
					args = Hot.Arguments;

				let hasHtmlSource: boolean = false;

				if (htmlSource !== "")
				{
					const htmlSourceCheck: string = htmlSource.replace (/\s/g,'');

					if (htmlSourceCheck !== "")
						hasHtmlSource = true;
				}

				let tempMode = 0;

				// @ts-ignore
				if (window["Hot"] != null)
					tempMode = Hot.Mode;

				let processor: HotStaq = null;

				if (dontReuseProcessor === false)
				{
					if (typeof (Hot) !== "undefined")
					{
						if (Hot.CurrentPage != null)
						{
							if (Hot.CurrentPage.processor != null)
								processor = Hot.CurrentPage.processor;
						}
					}
				}

				if (processor == null)
					processor = new HotStaq ();

				if (loggingLevel != null)
					processor.logger.logLevel = HotLog.parse (loggingLevel);

				processor.mode = tempMode;

				let options: HotStartOptions = {
						name: name,
						processor: processor,
						args: args
					};

				if (loadPage !== "")
				{
					if (passRawUrl === false)
					{
						if (loadPage.indexOf ("hstqserve") < 0)
							loadPage += "?hstqserve=nahfam";
					}

					options.url = loadPage;
				}

				if (testerMap != null)
				{
					options.testerMap = testerMap;
					options.testerName = testerName;
				}

				if (testerName != null)
					options.testerName = testerName;

				if (testerApiBaseUrl != null)
					options.testerAPIBaseUrl = testerApiBaseUrl;

				if (testerLaunchpadUrl != null)
					options.testerLaunchpadUrl = testerLaunchpadUrl;

				if (apiName != null)
				{
					let client = new HotClient (processor);

					if ((apiUrl == null) || (apiUrl === ""))
						throw new Error (`api-url was not set!`);

					if ((apiJSUrl == null) || (apiJSUrl === ""))
						throw new Error (`api-js-url was not set!`);

					const apiJSUrlContent: string = await HotFile.httpGet (apiJSUrl);

					if (apiJSUrlContent === "")
						throw new Error (`api-js-url content was empty!`);

					let parentObject = null;

					/// @todo Require a hash to be passed that matches the content of apiJSUrlContent.
					if (HotStaq.isWeb === true)
					{
						if (parentObject == null)
							parentObject = window;
					}
					else
					{
						if (parentObject == null)
							parentObject = global;
					}

					eval.apply (parentObject, [apiJSUrlContent]);

					let parentLib: any = window;

					if (apiLibrary != null)
					{
						// @ts-ignore
						parentLib = window[apiLibrary];

						if (parentLib == null)
							throw new Error (`Unable to find the API library ${apiLibrary}!`);
					}

					let newAPI = new parentLib[apiName] (apiUrl, client);

					if (newAPI.onPreRegister != null)
						await newAPI.onPreRegister ();

					newAPI.connection.api = newAPI;
					processor.api = newAPI;
				}

				// Store the processor for SPA navigation.
				HotStaq.spaProcessor = processor;

				// @ts-ignore
				window.__hotstaqSpaProcessor = processor;

				// Layout (app-shell) mode: when an `outlet` is declared, this
				// page IS the shell — it renders once and each route is
				// content-only, injected into the outlet by navigateTo. Set the
				// statics + window backups (the latter survive useOutput's
				// <html>.innerHTML swap so the first navigateTo still takes the
				// layout path).
				if (outlet != null)
				{
					HotStaq.spaOutlet = outlet;
					HotStaq.layoutEnabled = true;

					// @ts-ignore
					window.__hotstaqSpaOutlet = outlet;
					// @ts-ignore
					window.__hotstaqLayoutEnabled = true;
				}

				// Enable SPA mode if a spa-target or an outlet was provided. In
				// layout mode the outlet doubles as the link-interception target
				// (navigateTo branches on layoutEnabled, not spaTarget, so this
				// is harmless).
				if (spaTarget != null || outlet != null)
					HotStaq.enableSPA (spaTarget || outlet, processor);

				// Layout (app-shell) mode. The shell (chrome + <hot-outlet>) comes
				// from one of three sources, then the current route's content is
				// injected into the outlet via navigateTo (pushState=false so the
				// initial paint doesn't add a duplicate history entry):
				//   1. a rendered shell .hott (the `src` attribute) — rendered once
				//      via useOutput, for apps whose chrome is dynamic;
				//   2. inline <hotstaq> content — same, rendered via displayContent;
				//   3. a static host-HTML shell (no src) — the outlet is already in
				//      the DOM, so just inject the route.
				// If the current URL matches no route (e.g. opening the shell host
				// directly in a test), nothing is injected yet — navigation will
				// populate the outlet.
				if (outlet != null)
				{
					let initialPath: string = window.location.pathname + window.location.search;
					let initialCheck: string = initialPath.split ("?")[0];
					let initialMatched: boolean = (routerManager[initialCheck] != null);

					if (initialMatched === false)
					{
						for (let wIdx = 0; wIdx < routerWildcards.length; wIdx++)
						{
							if (initialCheck.indexOf (routerWildcards[wIdx].replace ("*", "")) > -1)
							{
								initialMatched = true;

								break;
							}
						}
					}

					let injectInitialRoute = function (): void
					{
						if (initialMatched === true)
							HotStaq.navigateTo (initialPath, false);
					};

					if (shellSrc !== "")
					{
						// Rendered shell: render the shell page once, then inject
						// the route into its outlet once that render resolves.
						let shellUrl: string = shellSrc;

						if (shellUrl.indexOf ("hstqserve") < 0)
							shellUrl += "?hstqserve=nahfam";

						options.url = shellUrl;

						let shellRender: any = HotStaq.displayUrl (options);

						if ((shellRender != null) && (typeof (shellRender.then) === "function"))
							shellRender.then (injectInitialRoute);
						else
							injectInitialRoute ();
					}
					else if (hasHtmlSource === true)
					{
						// Shell provided as inline <hotstaq> content.
						let shellRender: any = HotStaq.displayContent (options);

						if ((shellRender != null) && (typeof (shellRender.then) === "function"))
							shellRender.then (injectInitialRoute);
						else
							injectInitialRoute ();
					}
					else
					{
						// Static host-HTML shell: the outlet is already present.
						injectInitialRoute ();
					}
				}
				else if (hasHtmlSource === false)
				{
					if (loadPage === "")
					{
						// No route matched the current URL. Try, in order:
						//   1. An explicit `path="404"` route.
						//   2. An explicit `path="*"` catch-all route. (The
						//      wildcard scanner above already tries to match
						//      `*`-containing paths via indexOf — this is a
						//      belt-and-suspenders direct lookup.)
						//   3. A user-supplied `HotStaq.onRouteNotFound` hook.
						//   4. The framework's default "page not found" body
						//      (no throw, no blank screen).
						const notFoundPath: string = window.location.pathname;

						let fallbackSrc: string = "";

						if ((routerManager["404"] != null) && (routerManager["404"].src != null))
							fallbackSrc = routerManager["404"].src;
						else if ((routerManager["*"] != null) && (routerManager["*"].src != null))
							fallbackSrc = routerManager["*"].src;

						if (fallbackSrc !== "")
						{
							loadPage = fallbackSrc;
						}
						else if (typeof HotStaq.onRouteNotFound === "function")
						{
							HotStaq.onRouteNotFound (notFoundPath);
							return;
						}
						else
						{
							HotStaq.displayDefault404 (notFoundPath);
							return;
						}
					}

					if (loadPage.indexOf ("hstqserve") < 0)
						loadPage += "?hstqserve=nahfam";

					options.url = loadPage;

					HotStaq.displayUrl (options);
				}
				else
				{
					HotStaq.displayContent (options);
				}
			}, 50);
	}
}
