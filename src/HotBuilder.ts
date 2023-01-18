import * as ppath from "path";
import { HotIO } from "./HotIO";

import { HotStaq } from "./HotStaq";
import { HotSite } from "./HotSite";
import { HotLog } from "./HotLog";

/**
 * Builds stuff for the CLI like docker images and Kubernetes Helm charts.
 */
export class HotBuilder
{
	/**
	 * The HotSites to build from.
	 */
	hotsites: HotSite[];
	/**
	 * Will build the web api.
	 * @default true
	 */
	api: boolean;
	/**
	 * The version of HotStaq to use.
	 */
	hotstaqVersion: string;
	/**
	 * The namespace to use when building the dockerfiles.
	 */
	dockerNamespace: string;
	/**
	 * Will build the Dockerfiles.
	 */
	dockerFiles: boolean;
	/**
	 * Will harden the Dockerfiles security when possible.
	 */
	dockerHardenSecurity: boolean;
	/**
	 * Will append the docker documentation to the existing README.md.
	 */
	appendReadMe: boolean;
	/**
	 * Will build a Kubernetes Helm Chart.
	 */
	helmChart: boolean;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The output directory.
	 */
	outputDir: string;

	constructor (logger: HotLog)
	{
		this.api = true;
		this.hotstaqVersion = "";
		this.dockerNamespace = "ourfreelight";
		this.dockerFiles = true;
		this.dockerHardenSecurity = true;
		this.appendReadMe = true;
		this.helmChart = false;
		this.hotsites = [];
		this.logger = logger;
		this.outputDir = ppath.normalize (`${process.cwd ()}/`);
	}

	/**
	 * Build everything and output to outputDir.
	 * 
	 * @fixme Needs tests!
	 */
	async build (): Promise<void>
	{
		let hotPackageJSONStr: string = await HotIO.readTextFile (ppath.normalize (`${__dirname}/../../package.json`));
		let hotPackageJSONObj = JSON.parse (hotPackageJSONStr);

		if (this.hotstaqVersion === "")
			this.hotstaqVersion = hotPackageJSONObj.version;

		this.logger.info (`Generating using HotStaq version: ${this.hotstaqVersion}`);

		if (this.api === true)
		{
			this.logger.info ("Building web API...");

			/// @todo Finish this...

			this.logger.info ("Finished building web API...");
		}

		if (this.dockerFiles === true)
		{
			this.logger.info ("Building docker files...");

			const dockerDir: string = ppath.normalize (`${__dirname}/../../builder/docker`);
			let dockerFilePath: string = "";

			if (this.dockerHardenSecurity === true)
			{
				this.logger.info (`Hardening Dockerfile...`);
				dockerFilePath = ppath.normalize (`${dockerDir}/Dockerfile.hardened.linux.gen`);
			}
			else
			{
				this.logger.info (`NOT hardening Dockerfile...`);
				dockerFilePath = ppath.normalize (`${dockerDir}/Dockerfile.linux.gen`);
			}

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				this.logger.info (`Building Dockerfile "${hotsite.name}"...`);

				if (hotsite.name == null)
					throw new Error (`HotSite ${hotsite.hotsitePath} is missing a name!`);

				HotStaq.checkHotSiteName (hotsite.name, true);

				const hotsiteName: string = hotsite.name;
				let outputDir: string = ppath.normalize (`${this.outputDir}/`);
				let dockerfilePortsStr: string = "";
				let httpPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "http"]);
				let httpsPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "https"]);
				let httpApiPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "apiHttp"]);
				let httpsApiPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "apiHttps"]);
				let hotsitePath: string = `/app/HotSite.json`;

				if (await HotIO.exists (`${outputDir}/docker/${hotsiteName}/app/`) === true)
				{
					this.logger.info (`Unable to create Docker files because the directory "${outputDir}/docker/${hotsiteName}/app/" already exists!`);

					return;
				}

				await HotIO.mkdir (`${outputDir}/docker/${hotsiteName}/app/`);

				if (httpPort != null)
				{
					dockerfilePortsStr += `ARG HTTP_PORT=${httpPort}
ENV HTTP_PORT \${HTTP_PORT}
EXPOSE \${HTTP_PORT}`;
				}

				if (httpsPort != null)
				{
					dockerfilePortsStr += `ARG HTTPS_PORT=${httpsPort}
ENV HTTPS_PORT \${HTTPS_PORT}
EXPOSE \${HTTPS_PORT}`;
				}

				if (dockerfilePortsStr === "")
				{
					httpPort = 5000;
					dockerfilePortsStr += `ARG HTTP_PORT=5000
ENV HTTP_PORT \${HTTP_PORT}
EXPOSE \${HTTP_PORT}`;
				}

				if (httpApiPort == null)
					httpApiPort = 5001;

				let appCmds: string = `"/app/hotapp",`;

				if (this.dockerHardenSecurity === false)
					appCmds = `"node", "./build/cli.js",`;

				let replaceKeys = {
						APP_CMDS: appCmds,
						NAMESPACE: this.dockerNamespace,
						HOTSITE_NAME: hotsiteName,
						REAL_HOTSTAQ_VERSION: this.hotstaqVersion,
						DOCKERFILE_PORTS: dockerfilePortsStr,
						HTTP_PORT: httpPort.toString (),
						API_HTTP_PORT: httpApiPort.toString (),
						HOTSITE_PATH: hotsitePath
					};

				await HotIO.copyFile (dockerFilePath, `${outputDir}/docker/${hotsiteName}/Dockerfile`);
				await this.replaceKeysInFile (`${outputDir}/docker/${hotsiteName}/Dockerfile`, replaceKeys);
				await HotIO.copyFiles (`${dockerDir}/scripts/`, `${outputDir}/`);
				await HotIO.copyFiles (`${dockerDir}/app/`, `${outputDir}/docker/${hotsiteName}/app/`);
				await HotIO.copyFile (`${dockerDir}/dockerignore`, `${outputDir}/.dockerignore`);
				await HotIO.copyFile (`${dockerDir}/docker-compose.gen.yaml`, `${outputDir}/docker-compose.yaml`);
				await HotIO.copyFile (`${dockerDir}/env-skeleton`, `${outputDir}/env-skeleton`);

				await this.replaceKeysInFile (`${outputDir}/docker/${hotsiteName}/app/start.sh`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/docker/${hotsiteName}/app/start-pkg.sh`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/env-skeleton`, replaceKeys);

				await this.replaceKeysInFile (`${outputDir}/docker-compose.yaml`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/build.bat`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/build.sh`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/start.bat`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/start.sh`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/stop.bat`, replaceKeys);
				await this.replaceKeysInFile (`${outputDir}/stop.sh`, replaceKeys);

				if (await HotIO.exists (`${outputDir}/README.md`) === true)
				{
					const prevREADME: string = await HotIO.readTextFile (`${outputDir}/README.md`);
					const dockerREADME: string = await HotIO.readTextFile (`${dockerDir}/README.md`);

					// Only append the docker readme if it's not already there...
					if (prevREADME.indexOf ("Docker Getting Started") < 0)
						await HotIO.writeTextFile (`${outputDir}/README.md`, `${prevREADME}\n${dockerREADME}`);
				}

				this.logger.info (`Finished building Dockerfile "${hotsite.name}"...`);
			}

			this.logger.info ("Finished building docker files...");
		}
	}

	/**
	 * Replace keys in a file.
	 */
	protected async replaceKeysInFile (filepath: string, keys: { [name: string]: string; }): Promise<void>
	{
		let contents: string = await HotIO.readTextFile (filepath);

		for (let key in keys)
		{
			let value: string = keys[key];

			contents = HotStaq.replaceKey (contents, key, value);
		}

		await HotIO.writeTextFile (filepath, contents);
	}
}