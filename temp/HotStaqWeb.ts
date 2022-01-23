import { HotStaq, IHotStaq, HotStartOptions, 
		HotSite, HotSiteRoute, HotSiteMapPath } from "./HotStaq";
import { Hot, DeveloperMode } from "./Hot";
import { HotComponent, IHotComponent } from "./HotComponent";
import { HotFile } from "./HotFile";
import { HotLog } from "./HotLog";

// Server stuff
import { HotPage } from "./HotPage";
import { HotRoute } from "./HotRoute";
import { HotAPI, EventExecutionType } from "./HotAPI";
import { HotRouteMethod, HTTPMethod, ServerAuthorizationFunction, ServerExecutionFunction } from "./HotRouteMethod";
import { HotServer } from "./HotServer";
import { HotClient } from "./HotClient";

// Testing stuff
import { HotTester } from "./HotTester";
import { HotTesterAPI } from "./HotTesterAPI";
import { HotTestMap, HotTestDestination, HotTestPath, HotTestPage } from "./HotTestMap";
import { IHotTestElement, HotTestElement, HotTestElementOptions, IHotTestElementOptions } from "./HotTestElement";
import { HotTestDriver } from "./HotTestDriver";

HotStaq.isWeb = true;

export {
		HotStaq, 
		HotStartOptions, 
		IHotStaq,
		HotSite,
		HotSiteRoute,
		HotSiteMapPath,
		Hot,
		DeveloperMode,
		HotComponent,
		IHotComponent,
		HotAPI,
		EventExecutionType,
		HotFile,
		HotLog,
		HotPage,
		HotRoute,
		HotRouteMethod,
		HTTPMethod,
		ServerAuthorizationFunction,
		ServerExecutionFunction,
		HotServer,
		HotClient,
		HotTester,
		HotTesterAPI,
		HotTestMap,
		HotTestDestination,
		HotTestPath,
		HotTestPage,
		HotTestElement,
		IHotTestElement,
		HotTestElementOptions,
		IHotTestElementOptions,
		HotTestDriver
	};