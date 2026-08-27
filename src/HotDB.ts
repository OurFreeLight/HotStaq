import { HotDBSchema } from "./schemas/HotDBSchema";
import { HotDBConnectionInterface } from "./HotDBConnectionInterface";

/**
 * The database connection status.
 */
export enum ConnectionStatus
{
	Disconnected,
	Connecting,
	Connected,
	Error
}

/**
 * The database type.
 */
export enum HotDBType
{
	None = "none",
	MySQL = "mysql",
	MariaDB = "mariadb",
	Influx = "influx",
	Postgres = "postgres"
}

/**
 * The minimal surface for running queries and grouping them into a transaction.
 *
 * Both the pooled connections (HotDBPostgres, HotDBMySQL) and the per-transaction
 * executors (HotDBTransaction, HotDBMySQLTransaction) satisfy this, so a live
 * transaction can be handed to any code that only needs to run queries and open
 * (or join) a transaction — e.g. a library given a transaction-scoped `db`.
 */
export interface IHotDBExecutor<DBResultType = any>
{
	/**
	 * The database type, so callers can pick the correct SQL dialect.
	 */
	type: HotDBType;
	/**
	 * Run a query.
	 */
	query (queryString: string, values?: any[]): Promise<DBResultType>;
	/**
	 * Run a query and return the first row.
	 */
	queryOne (queryString: string, values?: any[]): Promise<DBResultType>;
	/**
	 * Run a callback inside a transaction. On a pooled connection this opens a
	 * new transaction; on a live transaction it JOINs the current one.
	 */
	transaction<T> (callback: (tx: IHotDBExecutor<DBResultType>) => Promise<T>): Promise<T>;
}

/**
 * The server-side database connection. This may be deprecated and removed in a future version soon.
 */
export abstract class HotDB<DBType = any, DBResultType = any, DBSchema = HotDBSchema>
{
	/**
	 * The database type.
	 */
	type: HotDBType;
	/**
	 * The connection to the database (or the driver).
	 */
	db: DBType;
	/**
	 * The connection status.
	 */
	connectionStatus: ConnectionStatus;
	/**
	 * The max number of database connections to maintain.
	 * @default 10
	 */
	connectionLimit: number;
	/**
	 * The db schema. This will generate a database structure 
	 * and keep it maintained as needed.
	 */
	schema: DBSchema;

	constructor (db: DBType = null, type: HotDBType = HotDBType.None, schema: DBSchema = null)
	{
		this.type = type;
		this.db = db;
		this.connectionStatus = ConnectionStatus.Disconnected;
		this.connectionLimit = 10;
		this.schema = schema;
	}

    /**
     * Connect to the database. This will only start connecting 
     * if db is null.
     */
	abstract connect (connectionInfo: HotDBConnectionInterface): Promise<any[]>;
    /**
     * Synchronize all tables.
     */
	//abstract syncAllTables? (migrationsDirectory: string, throwErrors?: boolean): Promise<boolean>;
    /**
     * Synchronize a table. This will create/modify the table based on whether it 
	 * exists, and if there's been any changes to any fields.
     */
	//abstract syncTable? (tableName: string, throwErrors?: boolean): Promise<boolean>;
    /**
     * Checks if the table exists.
     */
	abstract tableCheck? (tableName: string): Promise<boolean>;
    /**
     * The query to make.
     */
	abstract query? (queryString: string, values?: any[]): Promise<DBResultType>;
    /**
     * Make a single query.
     */
	abstract queryOne? (queryString: string, values?: any[]): Promise<DBResultType>;
    /**
     * Make multiple queries. This is not implemented in all databases, and most likely will be removed.
     */
	abstract multiQuery? (queryStrings: string[] | { query: string; values: any[]; }[]): Promise<DBResultType[]>;
	/**
     * Disconnect from the server.
     */
    abstract disconnect (): Promise<void>;
	/**
	 * Run a unit of work inside a single database transaction. The callback is
	 * given a transaction executor bound to ONE checked-out connection; use its
	 * `query`/`queryOne` for every write so the whole unit commits or rolls back
	 * atomically (the executor throws on error to trigger a rollback).
	 *
	 * The base implementation throws — each database type that supports
	 * transactions overrides this (see HotDBPostgres and HotDBMySQL).
	 */
	async transaction<T> (callback: (tx: IHotDBExecutor<DBResultType>) => Promise<T>): Promise<T>
	{
		throw new Error (`Transactions are not supported for this database type: ${this.type}`);
	}
}