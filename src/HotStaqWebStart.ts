import { Hot } from "./Hot";
import { HotClient } from "./HotClient";
import { HotLog } from "./HotLog";
import { HotStaq, HotStartOptions } from "./HotStaq";

/**
 * If running in a browser, this will start HotStaq.
 */
export function hotStaqWebStart ()
{
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
                let name: string = getAttr (hotstaqElm, ["name"]) || "default";
                let args: string = getAttr (hotstaqElm, ["args"]) || null;
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

                    if (apiUrl === "")
                        throw new Error (`api-url was not set!`);

                    let parentLib: any = window;

                    if (apiLibrary != null)
                    {
                        // @ts-ignore
                        parentLib = window[apiLibrary];
                    }

                    let newAPI = new parentLib[apiName] (apiUrl, client);
                    newAPI.connection.api = newAPI;
                    processor.api = newAPI;
                }

                if (hasHtmlSource === false)
                {
                    if (loadPage === "")
                        throw new Error (`The hotstaq tag must have a src, HTML contents inside it, or a router set.`);

                    HotStaq.displayUrl (options);
                }
                else
                {
                    HotStaq.displayContent (options);
                }
            }, 50);
    }
}