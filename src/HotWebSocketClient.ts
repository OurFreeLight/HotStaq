import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

/**
 * The client-side websocket client that can be used to connect to the server.
 */
export class HotWebSocketClient
{
	/**
	 * The url to the websocket server.
	 */
	url: string;
	/**
	 * The connected socket.
	 */
	socket: Socket;
	/**
	 * Any data that this client socket should contain.
	 */
	persistentData: any;
	/**
	 * The response received from authorizing a client. Can be a JWT token, api key, etc.
	 * DO NOT STORE SENSITIVE INFORMATION HERE SUCH AS PASSWORDS.
	 */
	authorizedValue: any;
	/**
	 * The callback to call when the client connected.
	 */
	onConnect: () => void;
	/**
	 * The callback to call when the client has an error while connecting. This will 
	 * prevent an exception from being thrown.
	 */
	onConnectError: (err: any) => void;
	/**
	 * The callback to call when the client has an error. This will 
	 * prevent an exception from being thrown.
	 */
	onError: (err: any) => void;
	/**
	 * The callback to call when the client disconnects.
	 */
	onDisconnect: () => void;

	constructor (url: string, socket: Socket = null)
	{
		this.url = url;
		this.socket = socket;
		this.persistentData = {};
		this.authorizedValue = null;
		this.onConnectError = null;
		this.onError = null;
		this.onDisconnect = null;
	}

	/**
	 * Use an already connected socket.
	 */
	useSocket (socket: Socket): void
	{
		this.socket = socket;
	}

	/**
	 * Connect to the websocket server.
	 */
	async connect (auth: any = null, query: any = null, options: Partial<ManagerOptions & SocketOptions> | undefined = undefined): Promise<void>
	{
		let socketObj: Partial<ManagerOptions & SocketOptions> | undefined = options;

		if (auth != null)
		{
			if (socketObj == null)
				socketObj = {};

			socketObj = { ...socketObj, auth: auth };
		}

		if (query != null)
		{
			if (socketObj == null)
				socketObj = {};

			socketObj = { ...socketObj, query: query };
		}

		this.socket = io (this.url, socketObj);

		return (new Promise<void> ((resolve, reject) =>
			{
				this.socket.on ("connect", () =>
					{
						if (this.onConnect != null)
							this.onConnect ();

						resolve ();
					});
				this.socket.on ("connect_error", (err: any) =>
					{
						if (this.onConnectError != null)
						{
							this.onConnectError (err);

							return;
						}

						reject (err);
					});
				this.socket.on ("error", (err: any) =>
					{
						if (this.onError != null)
						{
							this.onError (err);

							return;
						}

						reject (err);
					});
				this.socket.on ("disconnect", () =>
					{
						if (this.onDisconnect != null)
							this.onDisconnect ();
					});
			}));
	}

	/**
	 * Listen for a client event. The event should not include the "sub/" prefix.
	 */
	on (event: string, callback: (data: any, uuid?: string) => void, uuid: string = null): void
	{
		this.socket.on (`sub/${event}`, function (uuid2: string, data: any)
		{
			if (data.uuid != null)
			{
				if (uuid2 != null)
				{
					if (data.uuid === uuid2)
						callback (data.data, data.uuid);
				}
				else
					callback (data.data, data.uuid);
			}
			else
				callback (data, uuid2);
		}.bind (this, uuid));
	}

	/**
	 * Listen for a client event without any intervention. The event will not have any 
	 * sub/ prepended, and will not include an event uuid.
	 */
	onRaw (event: string, callback: (data: any) => void): void
	{
		this.socket.on (event, callback);
	}

	/**
	 * Stop listening for a client event. The event should not include the "sub/" prefix.
	 */
	off (event: string): void
	{
		this.socket.off (`sub/${event}`, null);
	}

	/**
	 * Listen for a client event once. The event should not include the "sub/" prefix.
	 */
	once (event: string, callback: (data: any, uuid?: string) => void, uuid: string = null): void
	{
		this.socket.once (`sub/${event}`, function (uuid2: string, data: any)
		{
			if (data.uuid != null)
			{
				if (uuid2 != null)
				{
					if (data.uuid === uuid2)
						callback (data.data, data.uuid);
				}
				else
					callback (data.data, data.uuid);
			}
			else
				callback (data, uuid2);
		}.bind (this, uuid));
	}

	/**
	 * Listen for a client event once without any intervention. The event will not have any 
	 * sub/ prepended, and will not include an event uuid.
	 */
	onceRaw (event: string, callback: (data: any) => void): void
	{
		this.socket.once (event, callback);
	}

	/**
	 * Get the socket's id.
	 */
	getId (): string
	{
		return (this.socket.id);
	}

	/**
	 * Is the socket connected?
	 */
	isConnected (): boolean
	{
		if (this.socket == null)
			return (false);

		if (this.socket.connected === false)
			return (false);

		return (true);
	}

	/**
	 * Send an event to the client. You can optionally receive a response from the client.
	 * 
	 * @returns The uuid of the event sent.
	 */
	send (event: string, data: any, uuid: string = null): string
	{
		if (this.socket == null)
			throw new Error (`Client socket is null. Unable to send event ${event}`);

		if (this.socket.connected === false)
			throw new Error (`Client socket is not connected. Unable to send event ${event}`);

		if (uuid == null)
			uuid = uuidv4 ();

		this.socket.emit (`pub/${event}`, { uuid: uuid, data: data });

		return (uuid);
	}

	/**
	 * Send an event to the client, and wait for a response. Every time 
	 * data is received from this event, the callback will be called.
	 * 
	 * @param event The event to send. SHOULD NOT include pub/ or sub/ prefixes as those are added automatically.
	 */
	async sendOn (event: string, data: any, callback: (data: any, uuid?: string) => void, uuid: string = null): Promise<any>
	{
		let result = await new Promise<any> ((resolve, reject) =>
			{
				if (uuid == null)
					uuid = uuidv4 ();

				this.on (event, function (uuid2: string, data: any)
					{
						callback (data, uuid2);
						resolve (data);
					}.bind (this, uuid), uuid);
				this.send (event, data, uuid);
			});

		return (result);
	}

	/**
	 * Send an event to the client, and wait for a response once.
	 * 
	 * @param event The event to send. SHOULD NOT include pub/ or sub/ prefixes as those are added automatically.
	 */
	async sendOnce (event: string, data: any, uuid: string = null): Promise<any>
	{
		let result = await new Promise<any> ((resolve, reject) =>
			{
				if (uuid == null)
					uuid = uuidv4 ();

				this.once (event, function (uuid2: string, data: any)
					{
						resolve (data);
					}.bind (this, uuid), uuid);
				this.send (event, data, uuid);
			});

		return (result);
	}

	/**
	 * Disconnect the client.
	 */
	disconnect (removeFromServer: boolean = true): void
	{
		if (this.socket == null)
			return;

		if (this.socket.connected === false)
			return;

		this.socket.disconnect ();
	}
}