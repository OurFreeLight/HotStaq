import { InfluxDB, ClientOptions, WriteApi, QueryApi, FluxTableMetaData, flux, Point } from "@influxdata/influxdb-client";

import { ConnectionStatus, HotDB } from "../HotDB";
import { HotDBConnectionInterface } from "../HotDBConnectionInterface";
import { InfluxSchema } from "./influx/InfluxSchema";

/**
 * The Influx database connection.
 */
export class HotDBInflux extends HotDB<InfluxDB, void, InfluxSchema>
{
	/**
	 * The Influx write api.
	 */
	writeApi: WriteApi;
	/**
	 * The Influx query api.
	 */
	queryApi: QueryApi;

	constructor (db: InfluxDB = null, type: string = "influx", schema: InfluxSchema = null)
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
				let influxConnection: ClientOptions = {
						"url": connectionInfo.server
					};

				if (connectionInfo.org == null)
					throw new Error (`An org must be specified when connecting to Influx.`);

				if (connectionInfo.database == null)
					throw new Error (`A database (aka bucket) must be specified when connecting to Influx.`);

				if (connectionInfo.token != null)
					influxConnection.token = connectionInfo.token;
				else
				{
					// This is mostly for Influx 1.8
					influxConnection.token = `${connectionInfo.username}:${connectionInfo.password}`;
				}

				try
				{
					if (connectionInfo.connectionObjectOverride != null)
						influxConnection = connectionInfo.connectionObjectOverride;

					this.connectionStatus = ConnectionStatus.Connecting;
					this.db = new InfluxDB (influxConnection);

					this.writeApi = this.db.getWriteApi (connectionInfo.org, connectionInfo.database);
					this.queryApi = this.db.getQueryApi (connectionInfo.org);

					this.connectionStatus = ConnectionStatus.Connected;
					resolve ([true]);
				}
				catch (ex)
				{
					throw new Error (ex.message);
				}
			}));
	}

	multiQuery: undefined;
	queryOne: undefined;
	//syncAllTables: undefined;
	syncTable: undefined;
	tableCheck: undefined;

	/**
	 * Checks to see if this has a database connection.
	 */
	protected dbCheck (): void
	{
		if (this.db == null)
			throw new Error ("Not connected to a database!");
	}

	/**
	 * Write to the database. This will only store the point. It will not send to the database 
	 * unless sendPoints is called.
	 */
	addPoint (point: Point): void
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		this.writeApi.writePoint (point);
	}

	/**
	 * Write to the database. This will only store the points. It will not send to the database 
	 * unless sendPoints is called.
	 */
	addPoints (points: Point[]): void
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		this.writeApi.writePoints (points);
	}

	/**
	 * Writes all stored points to the database.
	 */
	async sendPoints (): Promise<void>
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		return (new Promise<void> ((resolve, reject) =>
			{
				this.writeApi.close ().then (() =>
					{
						resolve ();
					})
					.catch ((ex) =>
					{
						throw new Error (ex.message);
					});
			}));
	}

	/**
	 * Write to the database. This will call close and send the point immediately to the database.
	 * Do not use this to send lots of data. If you're sending batches of data, be sure to use 
	 * writePoints.
	 */
	async write (point: Point): Promise<void>
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		this.addPoint (point);

		return (this.sendPoints ());
	}

	/**
	 * Write points to the database. This will call close and send the point immediately to the database.
	 */
	async writePoints (points: Point[]): Promise<void>
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		this.addPoints (points);

		return (this.sendPoints ());
	}

	/**
	 * The query to make.
	 */
	async query (queryString: string, values: any[] = [], 
		nextFunc: (row: string[], tableMeta: FluxTableMetaData) => void = null, 
		errorFunc: (error: Error) => void = null): Promise<void>
	{
		if (this.queryApi == null)
			throw new Error ("The Influx query API is not instantiated! Is Influx connected?");

		return (new Promise<void> (async (resolve, reject) =>
			{
				let ary = [{ raw: [queryString] }];

				for (let iIdx = 0; iIdx < values.length; iIdx++)
				{
					let value: any = values[iIdx];

					ary.push (value);
				}

				/// @fixme Is this correct? wtf? Hardly any documentation on TemplateStringsArray or flux usage.
				let inputQuery: TemplateStringsArray = String.raw.apply (String, ary);

				this.queryApi.queryRows (inputQuery, {
						"next": (row: string[], tableMeta: FluxTableMetaData) => 
						{
							if (nextFunc != null)
								nextFunc (row, tableMeta);
						},
						"error": (errorObj: Error) => 
						{
							if (errorFunc != null)
								errorFunc (errorObj);
						},
						"complete": () => 
						{
							resolve ();
						}
					});
			}));
	}

	/**
	 * Disconnect from the server.
	 */
	async disconnect (): Promise<void>
	{
		this.dbCheck ();

		this.queryApi = null;
		await this.writeApi.close ();
		this.db = null;
	}
}