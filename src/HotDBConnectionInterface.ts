import { HotDBType } from "./HotDB";

/**
 * The database connection info.
 */
export interface HotDBConnectionInterface
{
    /**
     * The type of database to connect to.
     */
    type?: HotDBType;
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
     * 
     * This may be removed in the future.
     */
    multipleStatements?: boolean;
    /**
     * The connection object to pass to the pool options to customize any pool options.
     * 
     * For example, when using HotDBMySQL, if you place the object for mysql.PoolOptions 
     * that object will be used instead. If using HotDBInflux, you place the object for 
     * ClientOptions here, that will be used instead.
     * 
     * For HotDBPostgres, you can place the object for pg.PoolConfig here.
     */
    connectionObjectOverride?: any;
    /**
     * SSL settings.
     */
    ssl?: {
        /**
         * If set to false, any ssl cert will be accepted.
         * @default true
         */
        rejectUnauthorized?: boolean;
        /**
         * The file path to the SSL certificate.
         */
        cert?: string;
        /**
         * The file path to the SSL key.
         */
        key?: string;
        /**
         * The file path to the SSL CA.
         */
        ca?: string;
    };
}