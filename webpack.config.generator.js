const webpack = require ("webpack");

const fs = require ("fs");
const ppath = require ("path");

let packageVersion = "${WEBPACK_VERSION}";

module.exports = {
		entry: "${WEBPACK_ENTRY}",
		devtool: "inline-source-map",
		target: "web",
		module: {
			rules: [{
					test: new RegExp ("\.tsx?$"),
					use: [{
							loader: "ts-loader",
							options: {
									transpileOnly: true,
									configFile: "${WEBPACK_TSCONFIG}"
								}
						}],
					exclude: new RegExp ("node_modules")
				}]
		},
		plugins: [
			new webpack.DefinePlugin ({
					__VERSION__: `\"${packageVersion}\"`
				})
		],
		resolve: {
			extensions: [".tsx", ".ts", ".js"]
		},
		node: {
		},
		output: {
			filename: "${WEBPACK_OUTPUT_FILE}",
			path: "${WEBPACK_OUTPUT_PATH}",
			library: "${WEBPACK_LIBRARY_NAME}",
			libraryTarget: "umd"
		}
	};