/**
 * The database connection info.
 */
export interface HotDBConnectionInterface
{
    /**
     * The type of database. Can be:
     * * none
     * * mysql
     * * influx
     */
    type?: string;
    /**
     * The server's address.
     */
    server?: string;
    /**
     * The server's port.
     */
    port?: number;
    /**
     * The username to use to connect.
     */
    username?: string;
    /**
     * The password to use.
     */
    password?: string;
    /**
     * The token to use.
     */
    token?: string;
    /**
     * The org to use.
     */
     org?: string;
    /**
     * The database to use.
     */
    database?: string;
    /**
     * If set to true, multiple statements will be enabled. WARNING: This can cause 
     * security issues. Additionally this currently only support HotDBMySQL which uses 
     * mysql2.
     */
    multipleStatements?: boolean;
    /**
     * The connection object to pass to the .
     * 
     * For example, when using HotDBMySQL, if you place the object for mysql.PoolOptions 
     * that object will be used instead. If using HotDBInflux, you place the object for 
     * ClientOptions here, that will be used instead.
     */
    connectionObjectOverride?: any;
}