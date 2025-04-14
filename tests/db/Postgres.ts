import "mocha";
import { expect, should } from "chai";

import { Common } from "./Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "../server/HelloWorldAPI";
import { HotDBPostgres } from "../../src/schemas/HotDBPostgres";

/**
 * This needs more test cases!!
 * 
 * It needs to test adding, removing, moving, renaming, and more.
 */
describe ("Database - Postgres Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let api: HelloWorldAPI = null;
		let url: string = "";

		before (async () =>
			{
				common = new Common ();

				processor = common.processor;
				server = common.server;

				await common.startServer ();
				url = common.getUrl ();

				api = new HelloWorldAPI (common.getUrl (), server);
				api.db = new HotDBPostgres ();
				await server.setAPI (api);
			});
		after (async () =>
			{
				await common.shutdown ();
			});

		it ("should connect to the database", async () =>
			{
				await api.db.connect ({
						"server": process.env["DATABASE_SERVER"],
						"username": process.env["DATABASE_USERNAME"],
						"password": process.env["DATABASE_PASSWORD"],
						"port": parseInt (process.env["POSTGRES_DB_PORT"]) || 5432,
						"database": process.env["DATABASE_SCHEMA"]
					});
			});
		it ("should create a new table", async () =>
			{
				let results = await api.db.query (`
					create table if not exists test_table (
							id       SERIAL        NOT NULL UNIQUE,
							name     VARCHAR(255)  NOT NULL DEFAULT '',
							primary key(id));
					`, []);

				expect (results.results, "Did not create a table!");

				let tableExists: boolean = await api.db.tableCheck ("test_table");

				expect (tableExists).to.equal (true, "Did not create a table!");
			});
		it ("should insert data into the table", async () =>
			{
				let results = await api.db.query ("insert into test_table (name) VALUES ($1) returning id;", ["test1"]);
				let dbresults = results.results;

				expect (dbresults[0].id, "Did not insert data into the table!");
			});
		it ("should select data from the table", async () =>
			{
				let results = await api.db.queryOne ("select * from test_table where name = $1", ["test1"]);
				let dbresults = results.results;

				should ().equal (dbresults.name, "test1", "Did not select data from the table!");
			});
		it ("should select data from an incorrect table", async () =>
			{
				let results = await api.db.queryOne ("select * from test_table_bad where name = $1", ["test1"]);

				expect (results.error, "Did not incorrectly select data from the table!");
			});
		it ("should drop the table", async () =>
			{
				let results = await api.db.query ("DROP TABLE test_table;", []);

				should ().equal (results.error, null, "Did not drop the table!");
			});
	});