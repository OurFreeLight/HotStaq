import { HotStaq, HotStartOptions, IHotStaq } from "./HotStaq";
import { HotSite, HotSiteRoute, HotSiteMapPath } from "./HotSite";
import { Hot, DeveloperMode } from "./Hot";
import { HotAsset } from "./HotAsset";
import { HotModule } from "./HotModule";
import { HotComponent, HotComponentOutput, IHotComponent } from "./HotComponent";
import { HotFile } from "./HotFile";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotPage } from "./HotPage";

// Server stuff
import { HotAPI, EventExecutionType, APItoLoad } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest, PassType, HotRouteMethodParameter } from "./HotRouteMethod";
import { HotServer, HotServerType } from "./HotServer";
import { HotClient } from "./HotClient";

import { HotWebSocketClient } from "./HotWebSocketClient";

// Testing stuff
import { HotTestDriver } from "./HotTestDriver";
import { IHotTestElement, HotTestElement, HotTestElementOptions, IHotTestElementOptions } from "./HotTestElement";
import { HotTester } from "./HotTester";
import { HotTestStop } from "./HotTestStop";
import { HotDestination } from "./HotDestination";
//import { HotTesterMocha } from "./HotTesterMocha";
//import { HotTesterMochaSelenium } from "./HotTesterMochaSelenium";
import { HotTesterAPI } from "./HotTesterAPI";
import { HotTestMap, HotTestPath } from "./HotTestMap";
import { HotTestDestination } from "./HotTestDestination";
import { HotTestPage } from "./HotTestPage";

HotStaq.isWeb = true;

// Can't export interfaces from here :(

export {
    HotStaq,
    Hot,
    HotModule,
    HotAsset,
    HotTestStop, HotDestination, HotTestPage,
    DeveloperMode, HotStartOptions, IHotStaq,
    HotSite, HotSiteRoute, HotSiteMapPath,
    HotComponent, HotComponentOutput, IHotComponent,
    HotAPI,
    EventExecutionType, APItoLoad,
    HotFile,
    HotLog,
    HotLogLevel,
    HotPage,
    HotRoute,
    HotRouteMethod,
    HotEventMethod,
    ServerRequest,
    PassType,
    HotRouteMethodParameter,
    HotServer,
    HotServerType,
    HotClient,
    HotWebSocketClient,
    HotTester,
    HotTesterAPI,
    HotTestMap,
    HotTestDestination,
    IHotTestElement, HotTestElement,
    HotTestElementOptions, IHotTestElementOptions,
    HotTestDriver
};