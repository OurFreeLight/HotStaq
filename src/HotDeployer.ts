import * as ppath from "path";
import * as fs from "fs";

import archiver from "archiver";

import { HotIO } from "./HotIO";
import { HotLog } from "./HotLog";
import { Hot } from "./Hot";
import { HotEventMethod } from "./HotRouteMethod";

/**
 * Deploys applications.
 */
export class HotDeployer
{
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The input directory to deploy.
	 */
	inputDir: string;
	/**
	 * The input directory to deploy.
	 */
	deployerUrl: string;
	/**
	 * The user's JWT token.
	 */
	usersJWTToken: string;

	constructor (logger: HotLog)
	{
		this.logger = logger;
		this.inputDir = ppath.normalize (process.cwd ());
		this.deployerUrl = "https://hotstaq.highersoftware.com/";
		this.usersJWTToken = "";
	}

	/**
	 * Deploy the HotStaq app at the given path.
	 */
	async deploy (): Promise<void>
	{
		if (this.usersJWTToken === "")
			throw new Error ("Unable to deploy. User is not signed in.");

		this.logger.info ("Deploying HotStaq app at " + this.inputDir);

		const deploymentPath: string = ppath.normalize (`${this.inputDir}/deployment.tar.gz`);

		await this.compressFolder (this.inputDir, deploymentPath);

		await Hot.httpRequest (this.deployerUrl, {
				jwtToken: this.usersJWTToken,
			}, HotEventMethod.FILE_UPLOAD, {
					"file": HotIO.readFileStream (deploymentPath)
				});

		this.logger.info ("Complete!");
	}

	/**
	 * Compress a folder to .tar.gz.
	 */
	async compressFolder (sourceFolder: string, outputFile: string): Promise<void>
	{
		return new Promise<void> (async (resolve, reject) =>
			{
				if (await HotIO.exists (sourceFolder) === false)
				{
					reject(new Error(`Source folder "${sourceFolder}" does not exist.`));

					return;
				}

				const outputStream = fs.createWriteStream (outputFile);
				const archive = archiver ("tar", { gzip: true });

				archive.on ("error", (error: NodeJS.ErrnoException) => {
						reject(error);
					});

				outputStream.on ("close", () => {
						resolve();
					});

				archive.pipe (outputStream);
				archive.directory (sourceFolder, false);
				archive.finalize ();
			});
	}
}