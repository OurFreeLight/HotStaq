import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import { HotWebSocketServer } from "./HotWebSocketServer";

/**
 * The server-side websocket connection to the client.
 */
export class HotWebSocketServerClient
{
	/**
	 * The connected socket.
	 */
	webSocketServer: HotWebSocketServer;
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

	constructor (webSocketServer: HotWebSocketServer, socket: Socket)
	{
		this.webSocketServer = webSocketServer;
		this.socket = socket;
		this.persistentData = {};
		this.authorizedValue = null;
	}

	/**
	 * This client's id.
	 */
	getId (): string
	{
		return (this.socket.id);
	}

	/**
	 * Get the client's ip.
	 */
	getIP (): string
	{
		const incomingIP: string = HotWebSocketServer.getIPFromSocket (this.socket);

		return (incomingIP);
	}

	/**
	 * Tag a client. This is useful when trying to send messages to groups of clients.
	 */
	tag (tag: string): void
	{
		this.webSocketServer.tagClient (this, tag);
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
	 * Send an event to the client. You can optionally receive a response from the client.
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
		if (removeFromServer === true)
			this.webSocketServer.disconnect (this.getId (), false);

		if (this.socket.connected === true)
		{
			this.socket.disconnect (true);
			this.webSocketServer.logger.verbose (() => `Websocket Disconnected ${this.getId ()}`);
		}
	}
}