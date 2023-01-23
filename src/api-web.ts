import { HotStaq, HotStartOptions, IHotStaq } from "./HotStaq";
import { HotSite, HotSiteRoute, HotSiteMapPath } from "./HotSite";
import { Hot, DeveloperMode } from "./Hot";
import { HotComponent, IHotComponent } from "./HotComponent";
import { HotFile } from "./HotFile";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotPage } from "./HotPage";

// Server stuff
import { HotAPI, EventExecutionType, APItoLoad } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest } from "./HotRouteMethod";
import { HotServer, HotServerType } from "./HotServer";
import { HotClient } from "./HotClient";

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

module.exports["HotStaq"] = HotStaq;
module.exports["Hot"] = Hot;
module.exports["DeveloperMode"] = DeveloperMode;
module.exports["HotComponent"] = HotComponent;
module.exports["HotAPI"] = HotAPI;
module.exports["EventExecutionType"] = EventExecutionType;
module.exports["HotFile"] = HotFile;
module.exports["HotLog"] = HotLog;
module.exports["HotLogLevel"] = HotLogLevel;
module.exports["HotPage"] = HotPage;
module.exports["HotRoute"] = HotRoute;
module.exports["HotRouteMethod"] = HotRouteMethod;
module.exports["HotEventMethod"] = HotEventMethod;
module.exports["ServerRequest"] = ServerRequest;
module.exports["HotServer"] = HotServer;
module.exports["HotServerType"] = HotServerType;
module.exports["HotClient"] = HotClient;
module.exports["HotTester"] = HotTester;
module.exports["HotTesterAPI"] = HotTesterAPI;
//module.exports["HotTesterMocha"] = HotTesterMocha;
//module.exports["HotTesterMochaSelenium"] = HotTesterMochaSelenium;
module.exports["HotTestMap"] = HotTestMap;
module.exports["HotTestDestination"] = HotTestDestination;
module.exports["HotTestElement"] = HotTestElement;
module.exports["HotTestElementOptions"] = HotTestElementOptions;
module.exports["HotTestDriver"] = HotTestDriver;