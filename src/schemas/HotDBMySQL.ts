import * as mysql from "mysql2";

import { ConnectionStatus, HotDB, HotDBType } from "../HotDB";
import { HotDBConnectionInterface } from "../HotDBConnectionInterface";
import { MySQLSchema } from "./mysql/MySQLSchema";

/**
 * The database results.
 */
export interface MySQLResults
{
	error: any;
	results: any;
	fields: mysql.FieldPacket[];
}

/**
 * The MySQL database connection.
 */
export class HotDBMySQL extends HotDB<mysql.Pool, MySQLResults, MySQLSchema>
{
	constructor (db: mysql.Pool = null, type: HotDBType = HotDBType.MySQL, schema: MySQLSchema = null)
	{
		super (db, type, schema);
	}

	/**
	 * Connect to the database.
	 */
	async connect (connectionInfo: HotDBConnectionInterface): Promise<any[]>
	{
		return (new Promise<any[]> ((resolve, reject) =>
			{
				if (process.env["DATABASE_CONNECTIONS_LIMIT"] != null)
					this.connectionLimit = parseInt (process.env["DATABASE_CONNECTIONS_LIMIT"]);

				let multipleStatements: boolean = false;

				if (connectionInfo.multipleStatements != null)
					multipleStatements = connectionInfo.multipleStatements;

				let connectionObj: mysql.PoolOptions = {
						host: connectionInfo.server,
						user: connectionInfo.username,
						password: connectionInfo.password,
						port: connectionInfo.port,
						database: connectionInfo.database,
						waitForConnections: true,
						connectionLimit: this.connectionLimit,
						multipleStatements: multipleStatements
					};

				if (connectionInfo.connectionObjectOverride != null)
					connectionObj = connectionInfo.connectionObjectOverride;

				this.connectionStatus = ConnectionStatus.Connecting;
				this.db = mysql.createPool (connectionObj);
				this.connectionStatus = ConnectionStatus.Connected;
				resolve ([true]);
			}));
	}

	/**
	 * Checks to see if this has a database connection.
	 */
	protected dbCheck (): void
	{
		if (this.db == null)
			throw new Error ("Not connected to a database!");
	}

	/**
     * Synchronize all tables.
     */
	/*async syncAllTables (migrationsDirectory: string, throwErrors: boolean = true): Promise<boolean>
	{
		this.dbCheck ();

		const migrationsPath: string = ppath.normalize (migrationsDirectory);

		if (await HotIO.exists (migrationsPath) === false)
			throw new Error (`Migrations directory ${migrationsDirectory} does not exist.`);

		let files: string[] = await HotIO.listFiles (migrationsPath);
		let versions: {
				version: number;
				fileContent: string;
			}[] = [];

		for (let iIdx = 0; iIdx < files.length; iIdx++)
		{
			let file: string = ppath.normalize (files[iIdx]);
			let fileContent: string = await HotIO.readTextFile (file);

			let context = { HotDBMigration: HotDBMigration, db: this, migrationPath: file };
			vm.createContext (context);
			let migrationVersion: any = vm.runInContext (
`${fileContent}
let migration = new Migration ();
return (migration.version);
`, context);

			versions.push ({ version: migrationVersion, fileContent: fileContent });
		}

		versions.sort ();

		await this.syncMigrationsTableTracker ();

		let madeModifications: boolean = false;

		for (let tableName in this.schema.tables)
		{
			let tempResult: boolean = await this.syncTable (tableName, throwErrors);

			if (tempResult === true)
				madeModifications = true;
		}

		return (madeModifications);
	}*/

    /**
     * Synchronize a table. This will create/modify the table based on whether it 
	 * exists, and if there's been any changes to any fields.
     */
	/*async syncTable (tableName: string, throwErrors: boolean = true): Promise<boolean>
	{
		this.dbCheck ();

		let tableExists: boolean =  await this.tableCheck (tableName);
		let madeModifications: boolean = false;

		if (tableExists === false)
		{
			let structure: string[] = await this.schema.generateTableStructure (tableName);
			// This should always be structure[0]. There should only be 1 string to process 
			// for a newly created table.
			let tempResults = await this.query (structure[0], []);

			if (tempResults.error == null)
				madeModifications = true;
			else
			{
				if (throwErrors === true)
					throw new Error (`Error while creating table ${tableName}: ${tempResults.error.message}`);
			}
		}
		else
		{*/
			/*let structure: string[] = await this.schema.generateTableStructure (
										tableName, HotDBGenerationType.Modify, this);
			let tempResults = await this.multiQuery (structure);

			for (let iIdx = 0; iIdx < tempResults.length; iIdx++)
			{
				let results = tempResults[iIdx];

				if (results.error != null)
				{
					madeModifications = false;

					if (throwErrors === true)
						throw new Error (`Error while creating table ${tableName}: ${results.error.message}`);
				}
				else
					madeModifications = true;
			}*/
		/*}

		return (madeModifications);
	}*/

	/**
	 * Sync the migrations table tracker. This keeps track of all database table migrations. 
	 * If the "migrations" table is missing, it will be created.
	 */
	/*async syncMigrationsTableTracker (): Promise<void>
	{
		if (await this.tableCheck ("migrations") === false)
		{
			await new Promise<void> ((resolve, reject) =>
				{
					this.db.getConnection (async (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) =>
						{
							if (err)
							{
								reject (err);

								return;
							}
	
							/// @todo Verify that this actually created.
							await this.db.query (`create table if not exists migrations (
									version datetime not null
								);`).on ("end", () =>
									{
										connection.release ();
									});

							resolve ();
						});
				});
		}
	}*/

	/**
	 * Checks if the table exists.
	 */
	async tableCheck (tableName: string): Promise<boolean>
	{
		this.dbCheck ();

		let tableExists: boolean = await new Promise<boolean> ((resolve, reject) =>
			{
				this.db.getConnection (async (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) =>
					{
						if (err)
						{
							reject (err);

							return;
						}

						this.db.query ("SELECT table_name FROM information_schema.tables where table_name = ?;", [tableName], 
							(err: mysql.QueryError, results: any, fields: mysql.FieldPacket[]) =>
							{
								let result: boolean = false;

								if (results != null)
								{
									if (results.length > 0)
										result = true;
								}

								resolve (result);
							}).on ("end", () =>
								{
									connection.release ();
								});
					});
			});

		return (tableExists);
	}

	/**
	 * The query to make.
	 */
	async query (queryString: string, values: any[] = []): Promise<MySQLResults>
	{
		this.dbCheck ();

		let dbresults: MySQLResults = await new Promise<MySQLResults> ((resolve, reject) =>
			{
				this.db.getConnection ((err: NodeJS.ErrnoException, connection: mysql.PoolConnection) =>
					{
						if (err)
						{
							reject (err);

							return;
						}

						this.db.query (queryString, values, 
							(err: mysql.QueryError, results: any, fields: mysql.FieldPacket[]) =>
							{
								resolve ({ error: err, results: results, fields: fields });
							}).on ("end", () =>
								{
									connection.release ();
								});
					});
			});

		return (dbresults);
	}

	/**
	 * Make a single query. If there are no results, null will be in MySQLResults.results
	 */
	async queryOne (queryString: string, values: any[] = []): Promise<MySQLResults>
	{
		this.dbCheck ();

		let dbresults: MySQLResults = await new Promise<MySQLResults> ((resolve, reject) =>
			{
				this.db.getConnection ((err: NodeJS.ErrnoException, connection: mysql.PoolConnection) =>
					{
						if (err)
						{
							reject (err);

							return;
						}

						this.db.query (queryString, values, 
							(err: mysql.QueryError, results: any, fields: mysql.FieldPacket[]) =>
							{
								let tempResults = null;

								if (results != null)
								{
									if (results.length > 0)
										tempResults = results[0];
								}

								resolve ({ error: err, results: tempResults, fields: fields });
							}).on ("end", () =>
								{
									connection.release ();
								});
					});
			});

		return (dbresults);
	}

	/**
	 * Make multiple queries. **Warning! This can be a security vulnerability 
	 * if misused! Ideally this should only be used when making changes to tables!
	 * Additionally, this could overwhelm the server and each command sent is not 
	 * guaranteed to be done in order.**
	 * 
	 * @deprecated
	 */
	async multiQuery (queryStrings: string[] | { query: string; values: any[]; }[]): Promise<MySQLResults[]>
	{
		this.dbCheck ();

		let alldbresults: MySQLResults[] = [];

		await new Promise<void> ((resolve, reject) =>
		{
			this.db.getConnection (async (err: NodeJS.ErrnoException, connection: mysql.PoolConnection) =>
				{
					let promises = [];

					if (err)
					{
						reject (err);

						return;
					}

					for (let iIdx = 0; iIdx < queryStrings.length; iIdx++)
					{
						/// @fixme This could overwhelm the server, and each query most likely will 
						/// not be done in a deterministic order. Consider adding a 5-10ms delay between
						/// each query.
						promises.push (new Promise<MySQLResults> ((resolve2, reject2) =>
							{
								let queryString: string | { query: string; values: any[]; } = queryStrings[iIdx];
								let queryValues: any[] = [];

								if (typeof (queryString) !== "string")
								{
									queryValues = queryString.values;
									queryString = queryString.query;
								}

								this.db.query (queryString, queryValues, 
									(err: mysql.QueryError, results: any, fields: mysql.FieldPacket[]) =>
									{
										resolve2 ({ error: err, results: results, fields: fields });
									}).on ("end", () =>
										{
										});
							}));
					}

					alldbresults = await Promise.all (promises);

					connection.release ();

					resolve ();
				});
		});

		return (alldbresults);
	}

	/**
	 * Disconnect from the server.
	 */
	async disconnect (): Promise<void>
	{
		return (new Promise<void> ((resolve, reject) =>
		{
			this.dbCheck ();

			this.db.end ((err: mysql.QueryError) =>
				{
					if (err)
					{
						reject (err);

						return;
					}

					this.connectionStatus = ConnectionStatus.Disconnected;
					resolve ();
				});
		}));
	}
}