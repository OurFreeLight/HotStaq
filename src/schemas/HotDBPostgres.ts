import * as pg from "pg";

import { ConnectionStatus, HotDB, HotDBType } from "../HotDB";
import { HotDBConnectionInterface } from "../HotDBConnectionInterface";
import { PostgresSchema } from "./postgres/PostgresSchema";

/**
 * The database results.
 */
export interface PostgresResults
{
	error: any;
	results: any;
	fields: pg.FieldDef[];
}

/**
 * The Postgres database connection.
 */
export class HotDBPostgres extends HotDB<pg.Pool, PostgresResults, PostgresSchema>
{
	constructor (db: pg.Pool = null, type: HotDBType = HotDBType.Postgres, schema: PostgresSchema = null)
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
				try
				{
					if (process.env['DATABASE_CONNECTIONS_LIMIT'] != null)
						this.connectionLimit = parseInt (process.env['DATABASE_CONNECTIONS_LIMIT']);

					let poolConfig: pg.PoolConfig = {
						host: connectionInfo.server,
						user: connectionInfo.username,
						password: connectionInfo.password,
						port: connectionInfo.port,
						database: connectionInfo.database,
						maxUses: this.connectionLimit
					};

					if (connectionInfo.connectionObjectOverride != null)
					{
						poolConfig = {
							...poolConfig,
							...connectionInfo.connectionObjectOverride
						};
					}

					this.connectionStatus = ConnectionStatus.Connecting;
					this.db = new pg.Pool (poolConfig);
					this.connectionStatus = ConnectionStatus.Connected;
					resolve ([true]);
				}
				catch (err)
				{
					this.connectionStatus = ConnectionStatus.Error;
					reject(err);
				}
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

		try
		{
			const query = `
			SELECT table_name 
			FROM information_schema.tables
			WHERE table_name = $1;
			`;

			const result = await this.db.query (query, [tableName]);

			return (result.rows.length > 0);
		}
		catch (err)
		{
			throw err;
		}
	}

	/**
	 * The query to make.
	 */
	async query (queryString: string, values: any[] = []): Promise<PostgresResults>
	{
		this.dbCheck();

		try
		{
			const result = await this.db.query (queryString, values);

			return ({
				error: null,
				results: result,
				fields: result.fields
			});
		}
		catch (err)
		{
			return ({
				error: err,
				results: null,
				fields: []
			});
		}
	}

	/**
	 * Make a single query. If there are no results, null will be in MySQLResults.results
	 */
	async queryOne (queryString: string, values: any[] = []): Promise<PostgresResults>
	{
		this.dbCheck();

		try
		{
			const result = await this.db.query (queryString, values);
			let tempResults = null;

			if (result != null)
			{
				if (result.rows != null)
				{
					if (result.rows.length > 0)
						tempResults = result.rows[0];
				}
			}

			return ({
				error: null,
				results: tempResults,
				fields: result.fields
			});
		}
		catch (err)
		{
			return ({
				error: err,
				results: null,
				fields: []
			});
		}
	}

	/**
	 * Make multiple queries.
	 * 
	 * This is not implemented, and will not be.
	 * 
	 * @deprecated
	 */
	async multiQuery (queryStrings: string[] | { query: string; values: any[]; }[]): Promise<PostgresResults[]>
	{
		throw new Error ("Not implemented");
	}

	/**
	 * Disconnect from the server.
	 */
	async disconnect (): Promise<void>
	{
		this.dbCheck ();

		return (this.db.end ());
	}
}