import * as ppath from "path";
import { HotIO } from "./HotIO";

import { HotStaq, HotSite } from "./HotStaq";
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
	 * Will build the Docker compose file.
	 */
	dockerCompose: boolean;
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
		this.dockerFiles = true;
		this.dockerHardenSecurity = true;
		this.appendReadMe = true;
		this.dockerCompose = false;
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
			const dockerFileContent: string = await HotIO.readTextFile (
						ppath.normalize (`${dockerDir}/Dockerfile.linux.gen`));
			const startFileContent: string = await HotIO.readTextFile (
						ppath.normalize (`${dockerDir}/app/start.sh`));

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				this.logger.info (`Building Dockerfile "${hotsite.name}"...`);

				if (hotsite.name == null)
					throw new Error (`HotSite ${hotsite.hotsitePath} is missing a name!`);

				HotStaq.checkHotSiteName (hotsite.name, true);

				const hotsiteName: string = hotsite.name;
				let outputDir: string = ppath.normalize (`${this.outputDir}/`);
				let newDockerfileContent: string = dockerFileContent;
				let newStartFileContent: string = startFileContent;
				let dockerfilePortsStr: string = "";
				let dockercomposeAppPortsStr: string = "";
				let dockercomposeAppAPIPortsStr: string = "";
				let httpPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "http"]);
				let httpsPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "https"]);
				let hotsitePath: string = `/app/${hotsiteName}/HotSite.json`;
				let hardenSecurity: string = 
`
RUN npm -g uninstall npm && \
apk --purge del apk-tools
`;
				/**
				 * Replace any keywords in a string.
				 */
				let replaceKeywords = (str: string): string =>
					{
						str = str.replace (/\$\{HOTSITE_NAME\}/g, hotsiteName);
						str = str.replace (/\$\{DOCKERFILE_PORTS\}/g, dockerfilePortsStr);
						str = str.replace (/\$\{DOCKER_COMPOSE_APP_PORTS\}/g, dockercomposeAppPortsStr);
						str = str.replace (/\$\{DOCKER_COMPOSE_APP_API_PORTS\}/g, dockercomposeAppAPIPortsStr);
						str = str.replace (/\$\{HARDEN\_SECURITY\}/g, hardenSecurity);
						str = str.replace (/\$\{HOTSITE_PATH\}/g, hotsitePath);

						return (str);
					};
				/**
				 * Replace any keywords in a file.
				 */
				let replaceKeywordsInFile = async (filepath: string): Promise<string> =>
					{
						let fileContent: string = await HotIO.readTextFile (ppath.normalize (filepath));
						fileContent = replaceKeywords (fileContent);

						return (fileContent);
					};

				if (this.dockerHardenSecurity === false)
					hardenSecurity = "";

				await HotIO.mkdir (`${outputDir}/docker/${hotsiteName}/app/`);

				if (httpPort != null)
				{
					dockerfilePortsStr += `ARG HTTP_PORT=${httpPort}
ENV HTTP_PORT \${HTTP_PORT}
EXPOSE \${HTTP_PORT}`;
					dockercomposeAppPortsStr += `
    ports:
      - "${httpPort}:${httpPort}"`;
				}

				if (httpsPort != null)
				{
					dockerfilePortsStr += `ARG HTTPS_PORT=${httpsPort}
ENV HTTPS_PORT \${HTTPS_PORT}
EXPOSE \${HTTPS_PORT}`;
					dockercomposeAppPortsStr += `
					- "${httpsPort}:${httpsPort}"`;
				}

				if (dockerfilePortsStr === "")
				{
					dockerfilePortsStr += `ARG HTTP_PORT=80
ENV HTTP_PORT \${HTTP_PORT}
EXPOSE \${HTTP_PORT}`;
					dockercomposeAppPortsStr += `
ports:
- "80:80"`;
				}

				newDockerfileContent = replaceKeywords (newDockerfileContent);
				newStartFileContent = replaceKeywords (newStartFileContent);

				await HotIO.writeTextFile (`${outputDir}/docker/${hotsiteName}/Dockerfile`, newDockerfileContent);
				await HotIO.copyFiles (`${dockerDir}/scripts/`, `${outputDir}/`);
				await HotIO.writeTextFile (`${outputDir}/docker/${hotsiteName}/app/start.sh`, newStartFileContent);
				await HotIO.writeTextFile (`${outputDir}/start-app.sh`, 
					await HotIO.readTextFile (ppath.normalize (`${outputDir}/start-app.sh`)));
				await HotIO.copyFile (`${dockerDir}/dockerignore`, `${outputDir}/.dockerignore`);

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

		if (this.dockerCompose === true)
		{
			this.logger.info ("Building Docker Compose files...");

			const dockerDir: string = ppath.normalize (`${__dirname}/../../builder/docker-compose`);
			const dockerFileContent: string = await HotIO.readTextFile (
						ppath.normalize (`${dockerDir}/docker-compose.gen.yaml`));
			const startFileContent: string = await HotIO.readTextFile (
						ppath.normalize (`${dockerDir}/app/start.sh`));

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				this.logger.info ("Building Docker Compose files...");
				this.logger.info (`Finished building Docker Compose  "${hotsite.name}"...`);
			}

			this.logger.info ("Finished building Docker Compose files...");
		}
	}
}