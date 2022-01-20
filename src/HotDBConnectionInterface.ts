/**
 * The database connection info.
 */
export interface HotDBConnectionInterface
{
    /**
     * The type of database. Can be:
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
}