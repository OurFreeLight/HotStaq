import * as ppath from "path";

import { glob } from "glob";

import { HotIO } from "./HotIO";

import { HotStaq } from "./HotStaq";
import { HotSite } from "./HotSite";
import { HotLog } from "./HotLog";

type FilesImported = {
		js: string[];
		css: string[];
		html: string[];
		components: string[];
	};

/**
 * The options for building a NPM module that utilizes HotStaq.
 */
export interface ModuleBuildOptions
{
	/**
	 * The type of install to do. Can be:
	 * * install
	 * * link
	 * 
	 * Default value is "install".
	 */
	installType?: string;
	/**
	 * The type of build to do. Can be:
	 * * build
	 * 
	 * Default value is "build".
	 */
	buildType?: string;
	/**
	 * The name of the NPM module to install.
	 */
	name: string;
	/**
	 * The associated processor.
	 */
	processor: HotStaq;
	/**
	 * The associated HotSite to parse.
	 */
	hotsite: HotSite;
	/**
	 * The path to the HotSite to parse.
	 */
	hotsitePath: string;
	/**
	 * The path to the module to install/build.
	 */
	modulePath: string;
	/**
	 * The path to the module's HotSite to install/build from.
	 */
	moduleHotsite: string;
	/**
	 * The output directory to place all built files.
	 * 
	 * Default value is ${cwd}/public/hotstaq_modules/${name}/
	 */
	outDir?: string;
	/**
	 * The base url used to access the files on the web.
	 * 
	 * Default value is ./hotstaq_modules/${name}/
	 */
	baseUrl?: string;
	/**
	 * The current working directory to work out of.
	 * 
	 * Default value is the current working directory.
	 */
	cwd?: string;
}

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
	 * Will generate JSON from TypeScript interfaces.
	 * @default false
	 */
	interfaces: boolean;
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
	 * The configuration for interface generation.
	 */
	interfaceConfig: {
		/**
		 * The list of interfaces to generate. This is used to generate IHotParameter JSON 
		 * files that can be consumed by TypeScript.
		 * @default []
		 */
		filesToGenerate: string[];
		/**
		 * The location of the tsconfig to use for the TypeScript conversion.
		 * @default ""
		 */
		tsconfigPath: string;
		/**
		 * The directory to output all generated route parameters to.
		 * @default "./json/"
		 */
		outputDir: string;
	};
	/**
	 * The output directory.
	 */
	outputDir: string;

	constructor (logger: HotLog)
	{
		this.interfaces = false;
		this.api = false;
		this.hotstaqVersion = "";
		this.dockerNamespace = "ourfreelight";
		this.dockerFiles = false;
		this.appendReadMe = true;
		this.helmChart = false;
		this.hotsites = [];
		this.logger = logger;
		this.interfaceConfig = {
				filesToGenerate: [],
				tsconfigPath: "",
				outputDir: "./json/"
			};
		this.outputDir = ppath.normalize (`${process.cwd ()}/`);
	}

	/**
	 * Install a NPM module that utilizes HotStaq.
	 */
	static async installModule (options: ModuleBuildOptions): Promise<void>
	{
		let name: string = options.name;
		let installType: string = options.installType;
		let processor: HotStaq = options.processor;
		let cwd: string = options.cwd;
		let hotsite: HotSite = options.hotsite;
		let hotsitePath: string = options.hotsitePath;
		let outDir: string = options.outDir;
		let baseUrl: string = options.baseUrl;

		if (installType == null)
			installType = "install";

		if (cwd == null)
			cwd = process.cwd ();

		let atCount: number = (name.match (/@/g) || []).length;
		let version: string = "latest";

		if (atCount > 1)
		{
			let lastAtIndex: number = name.lastIndexOf ("@");
			version = name.slice (lastAtIndex + 1);
			name = name.substring (0, lastAtIndex);
		}

		if (outDir === "")
			outDir = `${cwd}/public/hotstaq_modules/${name}/`;

		if (baseUrl === "")
			baseUrl = `./hotstaq_modules/${name}/`;

		if (await HotIO.exists (outDir) === false)
			await HotIO.mkdir (outDir);

		let appendVersionStr: string = "";

		if (installType === "install")
			appendVersionStr = `@${version}`;

		processor.logger.info (`Installing Node Module ${name}${appendVersionStr}`);

		await HotIO.exec (`cd ${cwd} && npm ${installType} "${name}${appendVersionStr}"`);

		const pkgObjStr: string = await HotIO.exec (`cd ${cwd} && npm ls --json --depth=0 ${name}`);
		const pkgObj: any = JSON.parse (pkgObjStr);
		version = `^${pkgObj.dependencies[name].version}`; /// @todo Check on this. Is this ok to do?

		hotsite.dependencies["web"][name] = version;

		await processor.saveHotSite (hotsitePath);

		let moduleHotsite: string = options.moduleHotsite;

		if (moduleHotsite.toLowerCase ().indexOf (".json") < 0)
			moduleHotsite += ".json";

		moduleHotsite = ppath.normalize (moduleHotsite);

		if (await HotIO.exists (moduleHotsite) === false)
		{
			moduleHotsite = options.moduleHotsite;

			if (moduleHotsite.toLowerCase ().indexOf (".yaml") < 0)
				moduleHotsite += ".yaml";

			moduleHotsite = ppath.normalize (moduleHotsite);
		}

		let tempProcessor: HotStaq = new HotStaq ();
		await tempProcessor.loadHotSite (moduleHotsite);
		await tempProcessor.processHotSite ();

		let moduleHotsiteJSON: HotSite = tempProcessor.hotSite;
		let deps = moduleHotsiteJSON.dependencies;

		if (deps != null)
		{
			if (deps.web != null)
			{
				let installs: string = "";

				for (let depName in deps.web)
				{
					let depVersion: string = deps.web[depName];

					installs += `"${depName}@${depVersion}" `;
				}

				processor.logger.verbose (`NPM installing ${installs}`);
				await HotIO.exec (`cd ${cwd} && npm install ${installs}`);

				// Relink anything that needs to be linked.
				if (installType === "link")
					await HotIO.exec (`cd ${cwd} && npm ${installType} "${name}${appendVersionStr}"`);

				processor.logger.verbose (`NPM Finished installed`);
			}
		}

		processor.logger.info (`Finished installing Node Module ${name}${appendVersionStr}`);
	}

	/**
	 * Build a NPM module that utilizes HotStaq.
	 */
	static async buildModule (options: ModuleBuildOptions): Promise<void>
	{
		let name: string = options.name;
		let buildType: string = options.buildType;
		let processor: HotStaq = options.processor;
		let cwd: string = options.cwd;
		let outDir: string = options.outDir;
		let baseUrl: string = options.baseUrl;

		let atCount: number = (name.match (/@/g) || []).length;
		let version: string = "latest";

		if (atCount > 1)
		{
			let lastAtIndex: number = name.lastIndexOf ("@");
			version = name.slice (lastAtIndex + 1);
			name = name.substring (0, lastAtIndex);
		}

		let modulePath: string = options.modulePath;
		let moduleHotsite: string = options.moduleHotsite;

		if (moduleHotsite.toLowerCase ().indexOf (".json") < 0)
			moduleHotsite += ".json";

		moduleHotsite = ppath.normalize (moduleHotsite);

		if (await HotIO.exists (moduleHotsite) === false)
		{
			moduleHotsite = options.moduleHotsite;

			if (moduleHotsite.toLowerCase ().indexOf (".yaml") < 0)
				moduleHotsite += ".yaml";

			moduleHotsite = ppath.normalize (moduleHotsite);
		}

		let tempProcessor: HotStaq = new HotStaq ();
		await tempProcessor.loadHotSite (moduleHotsite);
		await tempProcessor.processHotSite ();

		let moduleHotsiteJSON: HotSite = tempProcessor.hotSite;
		let deps = moduleHotsiteJSON.dependencies;

		if (outDir === "")
			outDir = `${cwd}/public/hotstaq_modules/${name}/`;

		if (baseUrl === "")
			baseUrl = `./hotstaq_modules/${name}/`;

		if (await HotIO.exists (outDir) === false)
			await HotIO.mkdir (outDir);

		processor.logger.info (`Building HotStaq Module ${name}`);

		let componentLibrary: string = "";
		let files: FilesImported = {
				js: [],
				css: [],
				html: [],
				components: []
			};

		if (deps != null)
		{
			if (deps.webExport != null)
			{
				let webExportAbsPath: string = ppath.normalize (`${modulePath}/${deps.webExport}`);
				processor.logger.verbose (`Accessing webExport module at ${webExportAbsPath}`);
				let webExportPath: string = require.resolve (webExportAbsPath);
				let webExport = require (webExportPath);

				if (webExport.buildAssets == null)
					throw new Error (`The webExport module ${webExportPath} does not have an exported buildAssets function.`);

				type AssetType = (string | { path: string; });
				type ImportInfo = (string | { name: string; files: string[]; });
				let assetsToCopyObj: {
						import: ImportInfo[];
						html: AssetType[];
						css: AssetType[];
						js: AssetType[];
						componentLibrary: string;
						components: AssetType[];
				 	} = await webExport.buildAssets ();

				processor.logger.verbose (() => `Executed buildAssets. Importing assets ${JSON.stringify (assetsToCopyObj)}`);

				if (assetsToCopyObj != null)
				{
					if (assetsToCopyObj.import != null)
					{
						processor.logger.verbose (`Importing assets`);

						// Copy all files being imported from other NPM modules to the outDir.
						for (let iIdx = 0; iIdx < assetsToCopyObj.import.length; iIdx++)
						{
							let importInfo: ImportInfo = assetsToCopyObj.import[iIdx];
							let importName: string = "";
							let importFiles: string[] = [];

							if (typeof (importInfo) === "string")
								importName = importInfo;
							else
							{
								importName = importInfo.name;
								importFiles = importInfo.files;
							}

							let modulePath: string = `${cwd}/node_modules/${importName}/`;
							let fileExts: string[] = importFiles;

							if (importFiles.length === 0)
								fileExts = [".min.js", ".umd.js", ".js"]

							// The order to search for the file extensions and their location is 
							// crtical. The search will be done in sequential order. This will 
							// copy Javascript files first, prefering the minified versions.
							await HotBuilder.copyFilesFromImport (processor, "js",
								modulePath, 
								`${outDir}/public/js/`, 
								fileExts,
								[`${modulePath}/dist/`,
								`${modulePath}/dist/js/`,
								`${modulePath}/dist/umd/`,
								`${modulePath}/build/`,
								`${modulePath}/build/js/`,
								`${modulePath}/build/umd/`,
								`${modulePath}/js/`], 
								files.js,
								`${baseUrl}/public/js/`,
								false);

							if (importFiles.length === 0)
								fileExts = [".min.css", ".css"];

							// Copy the CSS files next, prefering the minified versions.
							await HotBuilder.copyFilesFromImport (processor, "css",
								modulePath, 
								`${outDir}/public/css/`, 
								fileExts,
								[`${modulePath}/dist/`,
								`${modulePath}/dist/css/`,
								`${modulePath}/build/`,
								`${modulePath}/build/css/`,
								`${modulePath}/css/`],
								files.css,
								`${baseUrl}/public/css/`,
								false);
						}

						processor.logger.verbose (`Finished importing assets`);
					}

					let copyFilesFromAssets = async (assets: AssetType[], finalOutDir: string, finalBaseUrl: string, outFiles: string[]) =>
					{
						if (await HotIO.exists (finalOutDir) === false)
							await HotIO.mkdir (finalOutDir);

						for (let iIdx = 0; iIdx < assets.length; iIdx++)
						{
							let assetObj: AssetType = assets[iIdx];

							if (assetObj == null)
								continue;

							let assetPath: string = "";

							if (typeof (assetObj) !== "string")
								assetPath = assetObj.path;
							else
								assetPath = assetObj;

							if (modulePath.endsWith ("/") === false)
								modulePath += "/";

							assetPath = ppath.normalize (`${modulePath}${assetPath}`);

							processor.logger.verbose (`Copying files at ${assetPath}`);

							const files = await glob (assetPath);

							for (let iJdx = 0; iJdx < files.length; iJdx++)
							{
								let file: string = files[iJdx];
								let filename: string = ppath.basename (files[iJdx]);
								let src: string = file;
								let dest: string = ppath.normalize (`${finalOutDir}/${filename}`);
			
								processor.logger.verbose (`Copying file ${src} ${dest}`);
								await HotIO.copyFile (src, dest);

								let webDest: string = ppath.normalize (`${finalBaseUrl}/${filename}`);
								outFiles.push (webDest);
							}
						}
					};

					if (assetsToCopyObj.html != null)
						await copyFilesFromAssets (assetsToCopyObj.html, `${outDir}/public/html/`, `${baseUrl}/public/html/`, files.html);

					if (assetsToCopyObj.css != null)
						await copyFilesFromAssets (assetsToCopyObj.css, `${outDir}/public/css/`, `${baseUrl}/public/css/`, files.css);

					if (assetsToCopyObj.js != null)
						await copyFilesFromAssets (assetsToCopyObj.js, `${outDir}/public/js/`, `${baseUrl}/public/js/`, files.js);

					if (assetsToCopyObj.componentLibrary != null)
						componentLibrary = assetsToCopyObj.componentLibrary;

					if (assetsToCopyObj.components != null)
					{
						for (let iIdx = 0; iIdx < assetsToCopyObj.components.length; iIdx++)
						{
							// @ts-ignore
							files.components.push (assetsToCopyObj.components[iIdx]);
						}
					}
				}
			}
		}

		let getFileStr = (outFiles: string[], isAsset: boolean = false) =>
			{
				let outputFilesStr: string = "";

				for (let iIdx = 0; iIdx < outFiles.length; iIdx++)
				{
					let file: string = outFiles[iIdx];
					let baseFilename: string = ppath.basename (file);
		
					if (isAsset === true)
					{
						// Make sure that names are autogenerated as lowercase.
						const lowerFullname: string = `${name}/${baseFilename}`.toLowerCase ();
						outputFilesStr += `{ name: "${lowerFullname}", path: "${file}" }, \n`;
					}
					else
						outputFilesStr += `"${file}", \n`;
				}

				if (outputFilesStr !== "")
					outputFilesStr = outputFilesStr.substr (0, outputFilesStr.length - 3);

				return (outputFilesStr);
			};
		let jsFilesStr: string = getFileStr (files.js);
		let cssFilesStr: string = getFileStr (files.css);
		let htmlFilesStr: string = getFileStr (files.html, true);
		let componentsFilesStr: string = "";

		for (let iIdx = 0; iIdx < files.components.length; iIdx++)
		{
			let component: string = files.components[iIdx];
			componentsFilesStr += `"${component}", \n`;
		}

		if (componentsFilesStr !== "")
			componentsFilesStr = componentsFilesStr.substr (0, componentsFilesStr.length - 3);

		const indexJSPath: string = ppath.normalize (`${outDir}/index.js`);

		processor.logger.verbose (`Creating index.js file at ${indexJSPath}`);
		await HotIO.writeTextFile (indexJSPath, 
`// Auto-generated by HotStaq ${HotStaq.version} on ${new Date ().toString ()}
let newModule = new HotStaqWeb.HotModule ("${name}");

newModule.js = [${jsFilesStr}];
newModule.css = [${cssFilesStr}];
newModule.html = [${htmlFilesStr}];
newModule.componentLibrary = "${componentLibrary}";
newModule.components = [${componentsFilesStr}];

return (newModule);
`);

		processor.logger.verbose (`Created index.js file`);
		processor.logger.info (`Finished building HotStaq Module ${name}`);
	}

	/**
	 * Get the correct NPM name from the given name. This will remove the version.
	 */
	static getNameFromNPMName (name: string): string
	{
		let atCount: number = (name.match (/@/g) || []).length;
		let version: string = "latest";

		if (atCount > 1)
		{
			let lastAtIndex: number = name.lastIndexOf ("@");
			version = name.slice (lastAtIndex + 1);
			name = name.substring (0, lastAtIndex);
		}

		return (name);
	}

	/**
	 * Prepare a HotSite for building. This will return the replace keys to use for 
	 * every file that will be generated. Additionally, this will ensure the HotSite 
	 * is named properly, and check if the target output directory already exists.
	 * Also, this will normalize the output directory.
	 * 
	 * @param generatorType The type of generator to use. Can be:
	 * * docker
	 * * helm
	 */
	protected async prepareHotsiteBuild (hotsite: HotSite, generatorType: "docker" | "helm"): Promise<any>
	{
		if (hotsite.name == null)
			throw new Error (`HotSite ${hotsite.hotsitePath} is missing a name!`);

		HotStaq.checkHotSiteName (hotsite.name, true);

		this.outputDir = ppath.normalize (`${this.outputDir}/`);
		let dockerfilePortsStr: string = "";
		let httpPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "http"]);
		let httpsPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "https"]);
		let httpApiPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "apiHttp"]);
		let httpsApiPort: number = HotStaq.getValueFromHotSiteObj (hotsite, ["server", "ports", "apiHttps"]);
		let hotsitePath: string = `/app/HotSite.json`;

		if (await HotIO.exists (`${this.outputDir}/${generatorType}/${hotsite.name}/app/`) === true)
		{
			this.logger.info (`Unable to create ${generatorType} files because the directory "${this.outputDir}/${generatorType}/${hotsite.name}/app/" already exists!`);

			return;
		}

		await HotIO.mkdir (`${this.outputDir}/${generatorType}/${hotsite.name}/app/`);

		if (httpPort != null)
		{
			dockerfilePortsStr += `ARG HTTP_PORT=${httpPort}
	ENV HTTP_PORT=\${HTTP_PORT}
	EXPOSE \${HTTP_PORT}`;
		}

		if (httpsPort != null)
		{
			dockerfilePortsStr += `ARG HTTPS_PORT=${httpsPort}
	ENV HTTPS_PORT=\${HTTPS_PORT}
	EXPOSE \${HTTPS_PORT}`;
		}

		if (dockerfilePortsStr === "")
		{
			httpPort = 5000;
			dockerfilePortsStr += `ARG HTTP_PORT=5000
	ENV HTTP_PORT=\${HTTP_PORT}
	EXPOSE \${HTTP_PORT}`;
		}

		if (httpApiPort == null)
			httpApiPort = 5001;

		let replaceKeys = {
				NAMESPACE: this.dockerNamespace,
				HOTSITE_NAME: hotsite.name,
				REAL_HOTSTAQ_VERSION: this.hotstaqVersion,
				DOCKERFILE_PORTS: dockerfilePortsStr,
				REAL_HTTP_PORT: httpPort.toString (),
				REAL_API_HTTP_PORT: httpApiPort.toString (),
				HOTSITE_PATH: hotsitePath
			};

		return (replaceKeys);
	}

	/**
	 * During install, copy files to their correct locations. All copying will 
	 * stop if stopAfterFirstIsFound is set to true, and the first file is found.
	 * 
	 * @param type The type of file to copy (e.g. "js", "css")
	 */
	protected static async copyFilesFromImport (processor: HotStaq, type: string, modulePath: string, 
		outDir: string, fileExts: string[], searchDirs: string[], outFiles: string[], 
		baseUrl: string, stopAfterFirstIsFound: boolean = true): Promise<void>
	{
		let copyFile = async (src: string, dest: string, webdest: string) =>
			{
				processor.logger.verbose (`Copying file ${src} ${dest}`);
				await HotIO.copyFile (src, dest);

				let webDest: string = webdest;
				outFiles.push (webDest);
			};
		let findAndCopyFile = async (path: string) =>
			{
				if (await HotIO.exists (path) === false)
					return (false);

				for (let iJdx = 0; iJdx < fileExts.length; iJdx++)
				{
					let fileExt: string = fileExts[iJdx];
					let foundPreferredExt: boolean = false;

					const files = await glob (`${path}/*${fileExt}`);

					for (let iIdx = 0; iIdx < files.length; iIdx++)
					{
						let file: string = files[iIdx].toLowerCase ();
						let filename: string = ppath.basename (files[iIdx]);
						let findFileExt: string = ppath.extname (file);

						if (findFileExt === "")
							continue;

						let src: string = ppath.normalize (`${path}/${filename}`);
						let dest: string = ppath.normalize (`${outDir}/${filename}`);
						let webdest: string = ppath.normalize (`${baseUrl}/${filename}`);

						await copyFile (src, dest, webdest);
					}

					foundPreferredExt = true;

					/// @ts-ignore
					if (foundPreferredExt === true)
					{
						if (stopAfterFirstIsFound === true)
							return (true);
						
						break;
					}
				}

				return (false);
			};

		if (await HotIO.exists (outDir) === false)
			await HotIO.mkdir (outDir);

		if (await HotIO.exists (`${modulePath}/package.json`) === true)
		{
			let packageJSONStr: string = await HotIO.readTextFile (`${modulePath}/package.json`);
			let packageJSONObj = JSON.parse (packageJSONStr);
			let checkProperties: string[] = [];

			if (type === "js")
				checkProperties = ["jsdelivr", "unpkg"];

			if (type === "css")
				checkProperties = ["style"];

			for (let iIdx = 0; iIdx < checkProperties.length; iIdx++)
			{
				let prop: string = checkProperties[iIdx];

				if (packageJSONObj[prop] != null)
				{
					let filePath: string = packageJSONObj[prop];
					let fullFilePath: string = ppath.normalize (`${modulePath}/${filePath}`);
					let filename: string = ppath.basename (fullFilePath);
					let ext: string = ppath.extname (filename);
					let dest: string = ppath.normalize (`${outDir}/${filename}`);
					let webdest: string = ppath.normalize (`${baseUrl}/${filename}`);

					// Check if the .min version exists
					if (ext.indexOf (".min.") < 0)
					{
						let base: string = ppath.basename (filename, ext);
						let tempFilename = `${base}.min${ext}`;
						let tempDirPath: string = ppath.dirname (fullFilePath);
						let tempFullFilePath: string = ppath.normalize (`${tempDirPath}/${tempFilename}`);

						if (await HotIO.exists (tempFullFilePath) === true)
						{
							fullFilePath = tempFullFilePath;
							dest = ppath.normalize (`${outDir}/${tempFilename}`);
							webdest = ppath.normalize (`${baseUrl}/${tempFilename}`);
						}
					}

					await copyFile (fullFilePath, dest, webdest);

					return;
				}
			}
		}

		for (let iIdx = 0; iIdx < searchDirs.length; iIdx++)
		{
			let searchDir: string = ppath.normalize (searchDirs[iIdx]);
			const copiedFile: boolean = await findAndCopyFile (searchDir);

			if (copiedFile === true)
				return;
		}
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

		if (this.interfaces === true)
		{
			if (this.interfaceConfig.tsconfigPath === "")
				this.interfaceConfig.tsconfigPath = ppath.normalize (`${process.cwd ()}/tsconfig.json`);

			if (this.interfaceConfig.outputDir === "")
				throw new Error (`The output directory for the interface generation is not set!`);

			this.logger.info (`Generating IHotParameter objects to: ${this.interfaceConfig.outputDir}`);
			this.logger.info (`Using tsconfig: ${this.interfaceConfig.tsconfigPath}`);

			if (await HotIO.exists (this.interfaceConfig.outputDir) === false)
				await HotIO.mkdir (this.interfaceConfig.outputDir);

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				if (hotsite.server != null)
				{
					if (hotsite.server.interfaces != null)
					{
						if (hotsite.server.interfaces.generate != null)
						{
							this.logger.info (`Collecting list of interfaces from HotSite ${hotsite.name}...`);

							for (let iJdx = 0; iJdx < hotsite.server.interfaces.generate.length; iJdx++)
							{
								const interfaceGenObj = hotsite.server.interfaces.generate[iJdx];
								let interfaceGen = {
										name: interfaceGenObj
									};

								if (typeof (interfaceGenObj) !== "string")
									interfaceGen = interfaceGenObj;

								// @ts-ignore
								this.interfaceConfig.filesToGenerate.push (interfaceGen);
							}
						}
					}
				}
			}

			if (this.interfaceConfig.filesToGenerate.length === 0)
			{
				this.logger.info (`No files to generate!`);
				return;
			}

			for (let iIdx = 0; iIdx < this.interfaceConfig.filesToGenerate.length; iIdx++)
			{
				const interfaceGen: string | { name: string; } = this.interfaceConfig.filesToGenerate[iIdx];
				// @ts-ignore
				const ifaceName = (typeof (interfaceGen) === "string") ? interfaceGen : interfaceGen.name;

				this.logger.info (`Generating IHotParameter objects for ${ifaceName}...`);

				const params = await HotStaq.convertInterfaceToRouteParameters (ifaceName, false, { "tsconfigPath": this.interfaceConfig.tsconfigPath });
				const finalPath = ppath.normalize (`${this.interfaceConfig.outputDir}/${ifaceName}.json`);

				await HotIO.writeTextFile (finalPath, JSON.stringify (params, null, 2));
				this.logger.info (`Wrote to: ${finalPath}`);
			}

			this.logger.info (`Finished generating objects!`);
		}

		if (this.api === true)
			throw new Error ("This is not implemented yet...");

		if (this.dockerFiles === true)
		{
			this.logger.info ("Building docker files...");

			const dockerDir: string = ppath.normalize (`${__dirname}/../../builder/docker`);

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				this.logger.info (`Preparing Dockerfile "${hotsite.name}"...`);

				let replaceKeys = await this.prepareHotsiteBuild (hotsite, "docker");

				this.logger.info (`Building Dockerfile "${hotsite.name}"...`);
				this.logger.info (`Output Directory: ${dockerDir}`);

				await HotIO.copyFile (ppath.normalize (`${dockerDir}/Dockerfile.hardened.linux.gen`), `${this.outputDir}/docker/${hotsite.name}/prod.dockerfile`);
				await HotIO.copyFile (ppath.normalize (`${dockerDir}/Dockerfile.linux.gen`), `${this.outputDir}/docker/${hotsite.name}/dev.dockerfile`);
				await this.replaceKeysInFile (`${this.outputDir}/docker/${hotsite.name}/prod.dockerfile`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/docker/${hotsite.name}/dev.dockerfile`, replaceKeys);
				await HotIO.copyFiles (`${dockerDir}/scripts/`, `${this.outputDir}/`);
				await HotIO.copyFiles (`${dockerDir}/app/`, `${this.outputDir}/docker/${hotsite.name}/app/`);
				await HotIO.copyFile (`${dockerDir}/dockerignore`, `${this.outputDir}/.dockerignore`);
				await HotIO.copyFile (`${dockerDir}/docker-compose.gen.yaml`, `${this.outputDir}/docker-compose.yaml`);
				await HotIO.copyFile (`${dockerDir}/env-skeleton`, `${this.outputDir}/env-skeleton`);

				await this.replaceKeysInFile (`${this.outputDir}/docker/${hotsite.name}/app/start.sh`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/docker/${hotsite.name}/app/start-pkg.sh`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/env-skeleton`, replaceKeys);

				await this.replaceKeysInFile (`${this.outputDir}/docker-compose.yaml`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/build.bat`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/build.sh`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/start.bat`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/start.sh`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/stop.bat`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/stop.sh`, replaceKeys);

				if (await HotIO.exists (`${this.outputDir}/README.md`) === true)
				{
					const prevREADME: string = await HotIO.readTextFile (`${this.outputDir}/README.md`);
					const dockerREADME: string = await HotIO.readTextFile (`${dockerDir}/README.md`);

					// Only append the docker readme if it's not already there...
					if (prevREADME.indexOf ("Docker Getting Started") < 0)
						await HotIO.writeTextFile (`${this.outputDir}/README.md`, `${prevREADME}\n${dockerREADME}`);
				}

				this.logger.info (`Finished building Dockerfile "${hotsite.name}"...`);
			}

			this.logger.info ("Finished building docker files...");
		}

		if (this.helmChart === true)
		{
			this.logger.info ("Building helm chart files (THIS IS EXPERIMENTAL AND UNTESTED)...");

			const helmDir: string = ppath.normalize (`${__dirname}/../../builder/helm-chart`);
			this.logger.info (`Output Directory: ${helmDir}`);

			for (let iIdx = 0; iIdx < this.hotsites.length; iIdx++)
			{
				const hotsite: HotSite = this.hotsites[iIdx];

				this.logger.info (`Preparing Helm Chart "${hotsite.name}"...`);

				let replaceKeys = await this.prepareHotsiteBuild (hotsite, "helm");

				this.logger.info (`Building Helm Chart "${hotsite.name}"...`);

				await HotIO.copyFiles (`${helmDir}/`, `${this.outputDir}/helm/`);
				this.logger.info (`Helm Chart ${hotsite.name} Output Directory: ${this.outputDir}/helm/`);

				await this.replaceKeysInFile (`${this.outputDir}/helm/values.yaml`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/helm/Chart.yaml`, replaceKeys);
				await this.replaceKeysInFile (`${this.outputDir}/helm/README.md`, replaceKeys);

				this.logger.info ("Finished building Helm Chart...");
			}

			this.logger.info ("Finished building helm chart files (THIS IS EXPERIMENTAL AND UNTESTED)...");
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