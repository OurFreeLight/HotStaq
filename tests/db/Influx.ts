import "mocha";
import { expect, should } from "chai";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "../server/HelloWorldAPI";
import { HotDBInflux } from "../../src/schemas/HotDBInflux";
import { FluxTableColumn, FluxTableMetaData, Point } from "@influxdata/influxdb-client";

/**
 * This needs more test cases!!
 * 
 * It needs to test adding, removing, moving, renaming, and more.
 */
describe ("Database - Influx Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let api: HelloWorldAPI = null;
		let db: HotDBInflux = null;
		let url: string = "";

		before (async () =>
			{
				common = new Common ();

				processor = common.processor;
				server = common.server;

				await common.startServer ();
				url = common.getUrl ();

				api = new HelloWorldAPI (common.getUrl (), server);
				api.db = new HotDBInflux ();
				db = (<HotDBInflux>api.db);
				await server.setAPI (api);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should connect to the database", async () =>
			{
				await db.connect ({
						"server": process.env["INFLUX_DATABASE_SERVER"],
						"username": process.env["INFLUX_DATABASE_USERNAME"],
						"password": process.env["INFLUX_DATABASE_PASSWORD"],
						"org": process.env["INFLUX_DATABASE_ORG"],
						"token": process.env["INFLUX_DATABASE_TOKEN"],
						"database": process.env["INFLUX_DATABASE_SCHEMA"]
					});
			});
		it ("should write a point into the database", async () =>
			{
				let point: Point = new Point ("temp")
					.tag ("example", "influx-test")
					.floatField ("value", 2);
				await db.write (point);
			});
		it ("should get a point from the database", async () =>
			{
				let tag: string = "";
				let value: number = 0;

				/// @fixme FOUR SECONDS?! DO I REALLY HAVE TO WAIT THIS LONG FOR INFLUX TO WRITE THE DATA?! 
				/// No way this can be correct.
				await HotStaq.wait (4000);

				await db.query (
					`from(bucket:"hotstaq") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "temp")`, [], 
						(row: string[], tableMeta: FluxTableMetaData) =>
						{
							let obj = tableMeta.toObject (row);

							tag = obj.example;
							value = obj._value;
						}, 
						(error: Error) =>
						{
							throw new Error (error.message);
						});

				should ().equal (tag, "influx-test", "Did not select data from the table!");
				should ().equal (value, 2, "Did not select data from the table!");
			});
	});