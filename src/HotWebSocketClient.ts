import { Socket } from "socket.io";

import { HotWebSocketServer } from "./HotWebSocketServer";

/**
 * The connected websocket client.
 */
export class HotWebSocketClient
{
	/**
	 * The connected socket.
	 */
	webSocketServer: HotWebSocketServer;
	/**
	 * The connected socket.
	 */
	socket: Socket;

	constructor (webSocketServer: HotWebSocketServer, socket: Socket)
	{
		this.webSocketServer = webSocketServer;
		this.socket = socket;
	}

	/**
	 * This client's id.
	 */
	getId (): string
	{
		return (this.socket.id);
	}

	/**
	 * Tag a client. This is useful when trying to send messages to groups of clients.
	 */
	tag (tag: string): void
	{
		this.webSocketServer.tagClient (this, tag);
	}

	/**
	 * Send an event to the client.
	 */
	send (event: string, data: any): void
	{
		if (this.socket == null)
			throw new Error (`Client socket is null. Unable to send event ${event}`);

		if (this.socket.connected === false)
			throw new Error (`Client socket is not connected. Unable to send event ${event}`);

		this.socket.emit (event, data);
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
			this.webSocketServer.logger.verbose (`Websocket Disconnected ${this.getId ()}`);
		}
	}
}