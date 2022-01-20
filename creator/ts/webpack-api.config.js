const webpack = require ("webpack");
const CopyPlugin = require ("copy-webpack-plugin");

const fs = require ("fs");
const ppath = require ("path");

const packageStr = fs.readFileSync (process.cwd () + "/package.json").toString ();
const packageJSON = JSON.parse (packageStr);
let packageVersion = packageJSON.version.toString ();

module.exports = {
		entry: "./src/WebExport.ts",
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
					exclude: /node_modules/
				}]
		},
		plugins: [
			new webpack.DefinePlugin ({
					__VERSION__: `\"${packageVersion}\"`
				}),
			new CopyPlugin ({
					patterns: [
							{ from: `${process.cwd ()}/build-web/${APPNAME}.js`, 
							to: `${process.cwd ()}/public/js/${APPNAME}.js` }
						]
				})
		],
		resolve: {
			extensions: [".tsx", ".ts", ".js"]
		},
		node: {
			fs: "empty",
			crypto: "empty",
			stream: "empty",
			Utils: "empty"
		},
		externals: {
			hotstaq: "HotStaqWeb"
		},
		output: {
			filename: "${APPNAME}.js",
			path: ppath.resolve (process.cwd (), "build-web"),
			library: "${APPNAME}Web",
			libraryTarget: "umd"
		}
	};