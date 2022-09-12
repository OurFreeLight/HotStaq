import { HotRoute, HTTPMethod, HotDBMySQL, MySQLSchema, MySQLResults, 
	MySQLSchemaTable, MySQLSchemaField, ConnectionStatus, HotStaq, 
	HotServer, HotRouteMethod, ServerAuthorizationFunction, HotTestDriver, HotServerType } from "hotstaq";
import { AppAPI } from "./AppAPI";

/**
 * Data route.
 */
export class DataRoute extends HotRoute
{
	/**
	 * The database connection.
	 */
	db: HotDBMySQL;

	constructor (api: AppAPI)
	{
		super (api.connection, "data");

		this.onRegister = async () =>
			{
				if (api.connection.type !== HotServerType.Generate)
				{
					this.db = (<HotDBMySQL>this.connection.api.db);

					if (this.db.connectionStatus !== ConnectionStatus.Connected)
						return (true);

					// Create and sync any tables here. The following is simply an example:
					await this.db.query (
						`create table if not exists users (
								id             BINARY(36)     NOT NULL DEFAULT UUID(),
								name           VARCHAR(256)   DEFAULT '',
								email          VARCHAR(256)   DEFAULT '',
								password       VARCHAR(256)   DEFAULT '',
								verified       INT(1)         DEFAULT '0',
								registered     DATETIME       DEFAULT NOW(),
								enabled        INT(1)         DEFAULT '1',
								PRIMARY KEY (id)
							)`);
				}

				return (true);
			};

		this.addMethod ({
			"name": "add",
			"onServerExecute": this.add,
			"parameters": {
				"schema": {
					"type": "string",
					"required": true,
					"description": "The schema to add data to."
				},
				"fields": {
					"type": "object",
					"required": true,
					"description": "The fields and their values to add to the database."
				}
			},
			"description": "Add results to the database.",
			"returns": "Returns true if successful.",
			"testCases": [
				"HiTest",
				async (driver: HotTestDriver): Promise<any> =>
				{
					// @ts-ignore
					let resp = await api.data.add ();

					driver.assert (resp === "hello", "The message \"hello\" was not returned!");
				}
			]
		});
		this.addMethod ({
			"name": "list",
			"onServerExecute": this.list,
			"parameters": {
				"schema": {
					"type": "string",
					"required": true,
					"description": "The schema to access."
				},
				"fields": {
					"type": "array",
					"required": true,
					"description": "The list of fields in the schema to access."
				},
				"offset": {
					"type": "int",
					"required": false,
					"description": "The offset."
				},
				"limit": {
					"type": "int",
					"required": false,
					"description": "The max number of results to return. Default is 20."
				}
			},
			"description": "List results from a schema.",
			"returns": "Returns the results from the schema.",
			"testCases": [
				"HiTest",
				async (driver: HotTestDriver): Promise<any> =>
				{
					// @ts-ignore
					let resp = await api.data.list ();

					driver.assert (resp === "hello", "The message \"hello\" was not returned!");
				}
			]
		});
	}

	/**
	 * Add some data.
	 */
	protected async add (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let schema: string = HotStaq.getParam ("schema", jsonObj);
		let fields: any = HotStaq.getParam ("fields", jsonObj);
		let insertQuery: string = "";
		let insertArray = [schema];

		for (let key in fields)
		{
			let field: string = key;
			let value: any = fields[key];

			insertQuery += `${field} = ?, `;
			insertArray.push (value);
		}

		if (insertArray.length > 1)
			insertQuery = insertQuery.substring (0, (insertQuery.length - 2));

		let result = await this.db.query (`insert into ?? set ${insertQuery};`, insertArray);

		if (result.error != null)
			throw new Error (result.error);

        return (true);
	}

	/**
	 * List some data.
	 */
	protected async list (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
	{
		let schema: string = HotStaq.getParam ("schema", jsonObj);
		let fields: any = HotStaq.getParamDefault ("fields", jsonObj, {});
		let offset: number = HotStaq.getParamDefault ("offset", jsonObj, 0);
		let limit: number = HotStaq.getParamDefault ("limit", jsonObj, 20);

		let queryStr: string = "select * from ??";
		let values: any = [schema];

		for (let key in fields)
		{
			let fieldElement = fields[key];
			let value = fieldElement.value;

			if (values.length === 1)
				queryStr += " where ";

			queryStr += `?? = ? AND `;

			values.push (key);
			values.push (value);
		}

		if (values.length > 1)
			queryStr = queryStr.substring (0, (queryStr.length - 5));

		values.push (offset);
		values.push (limit);

		let strtemp = this.db.db.format (queryStr, values);
		this.logger.verbose (strtemp);
		let result = await this.db.query (queryStr, values);

		if (result.error != null)
			throw result.error;

		this.logger.verbose (JSON.stringify (result));
		let results = result.results;

        return (results);
	}
}