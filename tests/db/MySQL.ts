import "mocha";
import { expect, should } from "chai";

import { Common } from "../Common";

import { HotStaq } from "../../src/HotStaq";
import { HotHTTPServer } from "../../src/HotHTTPServer";
import { HelloWorldAPI } from "../server/HelloWorldAPI";
import { HotDBMySQL } from "../../src/schemas/HotDBMySQL";

/**
 * This needs more test cases!!
 * 
 * It needs to test adding, removing, moving, renaming, and more.
 */
describe ("Database - MySQL Tests", () =>
	{
		let common: Common = null;
		let processor: HotStaq = null;
		let server: HotHTTPServer = null;
		let api: HelloWorldAPI = null;
		let url: string = "";
		let db: HotDBMySQL = null;

		before (async () =>
			{
				common = new Common ();

				processor = common.processor;
				server = common.server;

				db = new HotDBMySQL ();
			});

		it ("should connect to the database", async () =>
			{
				await db.connect ({
						"server": process.env["DATABASE_SERVER"],
						"username": process.env["DATABASE_USERNAME"],
						"password": process.env["DATABASE_PASSWORD"],
						"port": parseInt (process.env["DATABASE_PORT"]) || 3306,
						"database": process.env["DATABASE_SCHEMA"]
					});
			});
		it ("should create a new table", async () =>
			{
				let results = await db.query (`
					create table if not exists testTable (
							id       INT(5)        NOT NULL UNIQUE AUTO_INCREMENT,
							name     VARCHAR(255)  NOT NULL DEFAULT '',
							primary key(id));
					`, []);

				expect (results.results, "Did not create a table!");

				let tableExists: boolean = await db.tableCheck ("testTable");

				expect (tableExists).to.equal (true, "Did not create a table!");
			});
		it ("should insert data into the table", async () =>
			{
				let results = await db.query ("insert into testTable set name = ?", ["test1"]);
				let dbresults = results.results;

				expect (dbresults.insertId, "Did not insert data into the table!");
			});
		it ("should select data from the table", async () =>
			{
				let results = await db.queryOne ("select * from testTable where name = ?", ["test1"]);
				let dbresults = results.results;

				should ().equal (dbresults.name, "test1", "Did not select data from the table!");
			});
		it ("should select data from an incorrect table", async () =>
			{
				let results = await db.queryOne ("select * from testTableBad where name = ?", ["test1"]);

				expect (results.error, "Did not incorrectly select data from the table!");
			});
		it ("should drop the table", async () =>
			{
				let results = await db.query ("DROP TABLE testTable;", []);

				should ().equal (results.error, null, "Did not drop the table!");
			});
		/// @todo Remove these tests and functionality. HotStaq should not maintain databases, etc.
		/*it ("should recreate the testTable", async () =>
			{
				let schema: MySQLSchema = new MySQLSchema ("test");
				schema.addTable (new MySQLSchemaTable ("freeUsers", [
					new MySQLSchemaField ({ name: "id", dataType: "INT(5)", primaryKey: true, uniqueIndex: true, 
											unsignedDataType: true, autoIncrement: true }),
					new MySQLSchemaField ({ name: "emailHash", dataType: "VARCHAR(128)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "passwordHash", dataType: "VARCHAR(512)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "verifiedHash", dataType: "VARCHAR(64)", defaultValue: "0" }),
					new MySQLSchemaField ({ name: "userData", dataType: "MEDIUMTEXT", defaultValue: "" }),
					new MySQLSchemaField ({ name: "deleteOnDate", dataType: "DATETIME", notNull: false, defaultValue: null })
				]));
				schema.addTable (new MySQLSchemaTable ("authHashes", [
					new MySQLSchemaField ({ name: "id", dataType: "INT(5)", primaryKey: true, uniqueIndex: true, 
											unsignedDataType: true, autoIncrement: true }),
					new MySQLSchemaField ({ name: "loginDate", dataType: "DATETIME", 
						defaultValue: "CURRENT_TIMESTAMP", strAroundDefaultValue: "" }),
					new MySQLSchemaField ({ name: "authHash", dataType: "VARCHAR(64)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "location", dataType: "VARCHAR(64)", defaultValue: "" })
				]));
				db.schema = schema;

				//await db.syncAllTables ();

				let tableExists: boolean =  await db.tableCheck ("freeUsers");
				expect (tableExists, "Did not create a table!");

				tableExists =  await db.tableCheck ("authHashes");
				expect (tableExists, "Did not create a table!");
			});
		it ("should NOT alter or recreate the testTable", async () =>
			{
				let schema: MySQLSchema = new MySQLSchema ("test");
				schema.addTable (new MySQLSchemaTable ("freeUsers", [
					new MySQLSchemaField ({ name: "id", dataType: "INT(5)", primaryKey: true, uniqueIndex: true, 
											unsignedDataType: true, autoIncrement: true }),
					new MySQLSchemaField ({ name: "emailHash", dataType: "VARCHAR(128)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "passwordHash", dataType: "VARCHAR(512)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "verifiedHash", dataType: "VARCHAR(64)", defaultValue: "0" }),
					new MySQLSchemaField ({ name: "userData", dataType: "MEDIUMTEXT", defaultValue: "" }),
					new MySQLSchemaField ({ name: "deleteOnDate", dataType: "DATETIME", notNull: false, defaultValue: null })
				]));
				schema.addTable (new MySQLSchemaTable ("authHashes", [
					new MySQLSchemaField ({ name: "id", dataType: "INT(5)", primaryKey: true, uniqueIndex: true, 
											unsignedDataType: true, autoIncrement: true }),
					new MySQLSchemaField ({ name: "loginDate", dataType: "DATETIME", 
						defaultValue: "CURRENT_TIMESTAMP", strAroundDefaultValue: "" }),
					new MySQLSchemaField ({ name: "authHash", dataType: "VARCHAR(64)", defaultValue: "" }),
					new MySQLSchemaField ({ name: "location", dataType: "VARCHAR(64)", defaultValue: "" })
				]));
				db.schema = schema;

				//await db.syncAllTables ();

				/// @fixme Needs additional verification that the fields have not moved. 
				/// This is mostly here to just catch exceptions.

				let tableExists: boolean =  await db.tableCheck ("freeUsers");
				expect (tableExists, "Did not create a table!");

				tableExists =  await db.tableCheck ("authHashes");
				expect (tableExists, "Did not create a table!");
			});*/
	});