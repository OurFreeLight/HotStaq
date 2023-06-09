import { HotCLI } from "./HotCLI";

import { HotStaq, HotStartOptions, IHotStaq } from "./HotStaq";
import { HotSite, HotSiteRoute, HotSiteMapPath } from "./HotSite";
import { Hot, DeveloperMode } from "./Hot";
import { HotComponent, HotComponentOutput, IHotComponent } from "./HotComponent";
import { HotFile } from "./HotFile";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotPage } from "./HotPage";
import { HotIO } from "./HotIO";

// Server stuff
import { HotAPI, EventExecutionType, APItoLoad } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerAuthorizationFunction, ServerExecutionFunction, ServerRequest, IServerRequest } from "./HotRouteMethod";
import { HotServer, HotServerType } from "./HotServer";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotClient } from "./HotClient";

// Server Websocket stuff
import { HotWebSocketServerClient } from "./HotWebSocketServerClient";
import { HotWebSocketClient } from "./HotWebSocketClient";
import { HotWebSocketServer } from "./HotWebSocketServer";

// Testing stuff
import { HotTestDriver } from "./HotTestDriver";
import { IHotTestElement, HotTestElement, HotTestElementOptions, IHotTestElementOptions } from "./HotTestElement";
import { HotTester } from "./HotTester";
import { HotTestStop } from "./HotTestStop";
import { HotDestination } from "./HotDestination";
import { HotTesterAPI } from "./HotTesterAPI";
import { HotTesterMocha } from "./HotTesterMocha";
import { HotTesterMochaSelenium } from "./HotTesterMochaSelenium";
import { HotTesterServer } from "./HotTesterServer";
import { HotTestMap, HotTestPath } from "./HotTestMap";
import { HotTestDestination } from "./HotTestDestination";
import { HotTestPage } from "./HotTestPage";
import { HotTestSeleniumDriver } from "./HotTestSeleniumDriver";

// Database stuff
import { HotDB, ConnectionStatus } from "./HotDB";
import { HotDBConnectionInterface } from "./HotDBConnectionInterface";
import { HotDBGenerationType, HotDBSchema } from "./schemas/HotDBSchema";

// MySQL specific database stuff
import { HotDBMySQL, MySQLResults } from "./schemas/HotDBMySQL";
import { HotDBMigration } from "./schemas/HotDBMigration";
import { MySQLSchema } from "./schemas/mysql/MySQLSchema";
import { MySQLSchemaFieldResult, MySQLSchemaField } from "./schemas/mysql/MySQLSchemaField";
import { MySQLSchemaTable } from "./schemas/mysql/MySQLSchemaTable";

// Influx specific stuff
import { HotDBInflux } from "./schemas/HotDBInflux";
import { InfluxSchema } from "./schemas/influx/InfluxSchema";

HotStaq.isWeb = false;

export {
		HotCLI,
		HotStaq, 
		HotStartOptions, 
		IHotStaq,
		HotSite,
		HotSiteRoute,
		HotSiteMapPath,
		Hot,
		DeveloperMode,
		HotComponent,
		HotComponentOutput,
		IHotComponent,
		HotAPI,
		EventExecutionType,
		APItoLoad,
		HotFile,
		HotLog,
		HotLogLevel,
		HotPage,
		HotIO,
		HotDB,
		ConnectionStatus,
		HotRoute,
		HotRouteMethod,
		HotEventMethod,
		ServerAuthorizationFunction,
		ServerExecutionFunction,
		IServerRequest,
		ServerRequest,
		HotServer,
		HotServerType,
		HotHTTPServer,
		HotWebSocketServerClient,
		HotWebSocketClient,
		HotWebSocketServer,
		HotClient,
		HotTesterServer,
		HotTester,
		HotTestStop,
		HotDestination,
		HotTesterAPI,
		HotTesterMocha,
		HotTesterMochaSelenium,
		HotTestMap,
		HotTestDestination,
		HotTestPath,
		HotTestPage,
		HotTestSeleniumDriver,
		HotTestElement,
		IHotTestElement,
		HotTestElementOptions,
		IHotTestElementOptions,
		HotTestDriver,
		HotDBGenerationType,
		HotDBConnectionInterface,
		HotDBSchema,
		HotDBMySQL,
		HotDBMigration,
		MySQLResults,
		MySQLSchema,
		MySQLSchemaFieldResult,
		MySQLSchemaField,
		MySQLSchemaTable,
		HotDBInflux,
		InfluxSchema
	};
