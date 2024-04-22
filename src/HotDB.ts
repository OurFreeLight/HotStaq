import { HotDBSchema } from "./schemas/HotDBSchema";
import { HotDBConnectionInterface } from "./HotDBConnectionInterface";

/**
 * The database connection status.
 */
export enum ConnectionStatus
{
	Disconnected,
	Connecting,
	Connected
}

/**
 * The server-side database connection.
 */
export abstract class HotDB<DBType = any, DBResultType = any, DBSchema = HotDBSchema>
{
	/**
	 * The database type.
	 */
	type: string;
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

	constructor (db: DBType = null, type: string = "", schema: DBSchema = null)
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
     * Make multiple queries.
     */
	abstract multiQuery? (queryStrings: string[] | { query: string; values: any[]; }[]): Promise<DBResultType[]>;
	/**
     * Disconnect from the server.
     */
    abstract disconnect (): Promise<void>;
}