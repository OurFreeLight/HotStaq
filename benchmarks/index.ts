import { HotLog } from "../src/HotLog.js";
import { HotPage } from "../src/HotPage.js";
import { HotStaq } from "../src/HotStaq.js";

import { start as HotFileStart } from "./HotFile.js";

async function runTest (testName: string, func: Function, logger: HotLog)
{
	let processor = new HotStaq ();
	processor.logger = logger;
	let page = new HotPage (processor);

    const t0 = performance.now();

	logger.info (`Running benchmarks for "${testName}"...`);

	await func (processor, page);

    const delta = (performance.now() - t0);

	logger.info (`Finished running benchmarks for "${testName}". Time taken: ${delta.toFixed(2)} ms`);
}

async function main()
{
	let logger = new HotLog ();

	logger.info ("Starting benchmarks...");

	await runTest ("HotFile", HotFileStart, logger);

	logger.info ("Finished benchmarks!");
}

main ();