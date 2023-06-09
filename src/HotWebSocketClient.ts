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
	async connect (auth: any = null, query: any = null): Promise<void>
	{
		let socketObj: Partial<ManagerOptions & SocketOptions> | undefined = undefined;

		if (auth != null)
			socketObj = { auth: auth };

		if (query != null)
		{
			if (socketObj == null)
				socketObj = {};

			socketObj.query = query;
		}

		this.socket = io (this.url, socketObj);

		await new Promise<void> ((resolve, reject) =>
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

						throw new Error (err);
					});
				this.socket.on ("error", (err: any) =>
					{
						if (this.onError != null)
						{
							this.onError (err);

							return;
						}

						throw new Error (err);
					});
				this.socket.on ("disconnect", () =>
					{
						if (this.onDisconnect != null)
							this.onDisconnect ();
					});
			});
	}

	/**
	 * Listen for a client event.
	 */
	on (event: string, callback: (...args: any[]) => void): void
	{
		this.socket.on (event, callback);
	}

	/**
	 * Stop listening for a client event.
	 */
	off (event: string): void
	{
		this.socket.off (event, null);
	}

	/**
	 * Listen for a client event once.
	 */
	once (event: string, callback: (...args: any[]) => void): void
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
	send (event: string, data: any): string
	{
		if (this.socket == null)
			throw new Error (`Client socket is null. Unable to send event ${event}`);

		if (this.socket.connected === false)
			throw new Error (`Client socket is not connected. Unable to send event ${event}`);

		const uuid: string = uuidv4 ();
		this.socket.emit (event, { uuid: uuid, data: data });

		return (uuid);
	}

	/**
	 * Send an event to the client, and wait for a response. Every time 
	 * data is received from this event, the callback will be called.
	 * 
	 * @param event The event to send. SHOULD NOT include pub/ or sub/ prefixes as those are added automatically.
	 */
	async sendOn (event: string, data: any, callback: (data: any) => void): Promise<any>
	{
		let result = await new Promise<any> ((resolve, reject) =>
			{
				let uuid: string = "";

				this.on (`sub/${event}`, (data: any) =>
					{
						if (data.uuid === uuid)
						{
							callback (data.data);
							resolve (data.data);
						}
					});
				uuid = this.send (`pub/${event}`, data);
			});

		return (result);
	}

	/**
	 * Send an event to the client, and wait for a response once.
	 * 
	 * @param event The event to send. SHOULD NOT include pub/ or sub/ prefixes as those are added automatically.
	 */
	async sendOnce (event: string, data: any): Promise<any>
	{
		let result = await new Promise<any> ((resolve, reject) =>
			{
				let uuid: string = "";

				this.once (`sub/${event}`, (data: any) =>
					{
						if (data.uuid === uuid)
							resolve (data.data);
					});
				uuid = this.send (`pub/${event}`, data);
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