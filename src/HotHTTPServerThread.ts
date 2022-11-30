import { parentPort, workerData } from "node:worker_threads";
import { processRequest } from "./HotHTTPServerProcessRequest";

(async () => 
{
	let result = await processRequest (null, workerData.logger, workerData.route, workerData.method, workerData.methodName, workerData.req, workerData.res);
	parentPort.postMessage (result);
})();