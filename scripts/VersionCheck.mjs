import * as ppath from "path";
import * as fs from "fs";

import { HotStaq } from "../build/src/HotStaq.js";

/**
 * Start the CLI app.
 */
 async function start ()
 {
	 try
	 {
		let packagePath = ppath.normalize (`./package.json`);
		let packageJSON = JSON.parse (fs.readFileSync (packagePath).toString ());
		const VERSION = packageJSON.version;

		if (HotStaq.version !== VERSION)
			throw new Error (`package.json version does not match version in HotStaq!`);
	 }
	 catch (ex)
	 {
		console.error (ex.toString ());

		process.exit (1);
	 }
}

start ();