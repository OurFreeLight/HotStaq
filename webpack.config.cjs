const webpack = require ("webpack");

const fs = require ("fs");
const ppath = require ("path");

const packageStr = fs.readFileSync (process.cwd () + "/package.json").toString ();
const packageJSON = JSON.parse (packageStr);
let packageVersion = packageJSON.version.toString ();

module.exports = {
		entry: "./src/api-web.ts",
		devtool: "inline-source-map",
		target: "web",
		module: {
			rules: [{
					test: new RegExp ("\.tsx?$"),
					use: [{
							loader: "ts-loader",
							options: {
									transpileOnly: true,
									configFile: "tsconfig-web.json"
								}
						}],
					exclude: new RegExp ("node_modules")
				}]
		},
		plugins: [
			new webpack.DefinePlugin ({
					__VERSION__: `\"${packageVersion}\"`
				}),
			new webpack.ProvidePlugin ({
					Cookies: "js-cookie"
				}),
			new webpack.IgnorePlugin ({
					resourceRegExp: 
					/HotCLI|HotGenerator|HotDB|HotDBInflux|InfluxSchema|HotDBMySQL|HotDBSchema|HotHTTPServer|HotAgentRoute|HotTesterServer|HotTesterMochaSelenium|HotTestSeleniumDriver|HotIO|HotCreator|HotBuilder|HotTesterMocha|express|mysql|rimraf|graceful-fs|fs-extra/
				})
		],
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
			fallback: {
				fs: false,
				path: false,
				net: false,
				tls: false,
				crypto: false,
				buffer: false,
				https: false,
				http: false,
				net: false,
				process: false,
				child_process: false,
				stream: false,
				worker_threads: false,
				url: false,
				util: false,
				zlib: false
			}
		},
		externals: {
			"validate-npm-package-name": "{}",
			"fs-extra": "{}",
			"HotIO": "{}",
			"graceful-fs": "{}",
			"node:path": "{}",
			"node:buffer": "{}",
			"node:fs": "{}",
			"node:crypto": "{}",
			"node:https": "{}",
			"node:http": "{}",
			"node:net": "{}",
			"node:process": "{}",
			"node:child_process": "{}",
			"node:stream/web": "{}",
			"node:stream": "{}",
			"node:url": "{}",
			"node:util": "{}",
			"node:zlib": "{}"
		},
		output: {
			filename: "HotStaq.js",
			path: ppath.resolve (process.cwd (), "build-web"),
			library: "HotStaqWeb",
			libraryTarget: "var"
		}
	};