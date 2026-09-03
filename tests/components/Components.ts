import { HotStaq } from "../../src/HotStaq";

// This module is bundled into the browser component tests, where HotStaq must
// run in web mode. Guard the assignment behind an actual browser context so
// that merely loading this file under Node (mocha imports every ./build/tests
// file) does NOT flip the process-wide HotStaq.isWeb flag. Without this guard
// the flag leaks into subsequent node-side suites, which then take the browser
// code path in loadHotSite()/convertInterfaceToRouteParameters() and fail with
// "Only absolute URLs are supported" / "not supported in the browser".
if (typeof window !== "undefined")
	HotStaq.isWeb = true;

import { HelloWorld } from "./HelloWorldComponent";
import { HelloWorldAPI } from "../server/HelloWorldAPI";

import { TableComponent } from "./TableComponent";
import { TableHeader } from "./TableHeader";
import { MainComponent } from "./MainComponent";

export {
		HelloWorld,
		HelloWorldAPI,
		TableComponent,
		TableHeader,
		MainComponent
	};