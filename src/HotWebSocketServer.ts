import { Server, Socket } from "socket.io";

import { HotHTTPServer } from "./HotHTTPServer";
import { HotWebSocketClient } from "./HotWebSocketClient";
import { HotLog } from "./HotLog";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest, ServerAuthorizationFunction } from "./HotRouteMethod";

/**
 * A web socket server.
 */
export class HotWebSocketServer
{
	/**
	 * The parent HTTP server.
	 */
	protected connection: HotHTTPServer;
	/**
	 * The logger.
	 */
	logger: HotLog;
	/**
	 * The Websocket server.
	 */
	protected io: Server;
	/**
	 * The routes to attach to incoming connections.
	 */
	protected routes: { [name: string]: HotRoute };
	/**
	 * The connected clients.
	 */
	clients: { [socketId: string]: HotWebSocketClient };
	/**
	 * The tags and their associated clients.
	 */
	tags: { [tag: string]: {
			[socketId: string]: HotWebSocketClient;
		}
	};
	/**
	 * Executes when authorizing a called method. The value returned from 
	 * here will be passed to onServerExecute. Undefined returning from here 
	 * will mean the authorization failed. If any exceptions are thrown from 
	 * this function, they will be sent to the client as an { error: string; } 
	 * object with the exception message as the error.
	 * 
	 * The socket.handshake.auth will be passed into the jsonObj in the 
	 * ServerRequest parameter.
	 */
	onServerAuthorize?: ServerAuthorizationFunction;
	/**
	 * Executes after a successful connection.
	 */
	onSuccessfulConnection?: (client: HotWebSocketClient) => Promise<void>;
	/**
	 * Executes after a connection is unable to authenticate.
	 */
	onConnectionError?: (socket: Socket, errorMessage: string) => Promise<void>;

	constructor (server: HotHTTPServer)
	{
		this.connection = server;
		this.logger = this.connection.logger;
		this.io = null;
		this.routes = {};
		this.clients = {};
		this.tags = {};
		this.onServerAuthorize = null;
		this.onSuccessfulConnection = null;
	}

	/**
	 * Setup the WebSocket server AFTER the http server is running.
	 */
	setup (): void
	{
		if (this.connection.httpsListener != null)
		{
			this.io = new Server (this.connection.httpsListener);
			this.logger.info (`Secure WebSocket server listening...`);
		}
		else
		{
			this.io = new Server (this.connection.httpListener);
			this.logger.info (`WebSocket server listening...`);
		}

		this.io.use (async (socket, next) =>
			{
				let incomingIP: string = HotWebSocketServer.getIPFromSocket (socket);
				let authorizationValue: any = null;
				let hasAuthorization: boolean = true;
				let executedFailedFunc: boolean = false;

				if (this.onServerAuthorize != null)
				{
					try
					{
						let request = new ServerRequest ({
							req: null,
							res: null,
							authorizedValue: null,
							jsonObj: socket.handshake.auth,
							queryObj: null,
							files: null
						});

						authorizationValue = await this.onServerAuthorize.call (this, request);
					}
					catch (ex)
					{
						this.logger.verbose (`Authorization error from ip ${incomingIP}: ${ex.message}`);
						hasAuthorization = false;

						if (this.onConnectionError != null)
							await this.onConnectionError (socket, ex.message);

						next (new Error (ex.message));

						executedFailedFunc = true;
					}

					if (authorizationValue === undefined)
						hasAuthorization = false;
				}

				if (hasAuthorization === false)
				{
					if (executedFailedFunc === false)
					{
						if (this.onConnectionError != null)
							await this.onConnectionError (socket, "Unauthorized");
					}

					next (new Error ("Unauthorized"));
				}

				this.logger.verbose (`Incoming WebSocket connection from ${incomingIP}, Authorized: true, Authorization Value: ${authorizationValue}`);

				socket.data.authorizationValue = authorizationValue;
				next ();
			});
		this.io.on ("connection", async (socket: Socket) =>
			{
				let authorizationValue: any = socket.data.authorizationValue;

				for (let routeName in this.routes)
				{
					let route: HotRoute = this.routes[routeName];

					if (route.methods.length < 1)
						throw new Error (`HotRoute ${routeName} does not have any methods! Methods are required to be attached prior to adding a route to a websocket.`);

					for (let iIdx = 0; iIdx < route.methods.length; iIdx++)
					{
						let method: HotRouteMethod = route.methods[iIdx];

						if (method.type !== HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT)
							continue;

						let eventName: string = `pub/${routeName}/${method.name}`;

						// Only 1 argument will be passed to the jsonObj in the new ServerRequest.
						// Devs can always pass an array or whatever object(s) they need.
						socket.on (eventName, async (...args: any[]) => 
							{
								try
								{
									let request: ServerRequest = new ServerRequest ({
											"authorizedValue": authorizationValue,
											"jsonObj": args[0]
										});
					
									let result: any = await method.onServerExecute.call (this, request);
					
									this.logger.verbose (`WebSocket Event ${eventName}, Response: ${result}`);
					
									if (result !== undefined)
										socket.emit (`sub/${routeName}/${method.name}`, result);
								}
								catch (ex)
								{
									this.logger.verbose (`Execution error: ${ex.message}`);
									socket.emit (`sub/${routeName}/${method.name}`, { error: ex.message });
								}
							});
						this.logger.verbose (`Adding WebSocket Event: ${eventName}`);
					}
				}

				let socketId: string = socket.id;

				socket.on ("disconnect", () =>
					{
						this.disconnect (socketId);
					});

				this.clients[socketId] = new HotWebSocketClient (this, socket);
				this.logger.verbose (`Client connected ${socketId}`);

				if (this.onSuccessfulConnection != null)
					await this.onSuccessfulConnection (this.clients[socketId]);
			});
	}

	/**
	 * Get the IP address from a socket.
	 */
	static getIPFromSocket (socket: Socket): string
	{
		return (socket.handshake.address);
	}

	/**
	 * Tag a client. This is useful when trying to send messages to groups of clients.
	 */
	tagClient (client: HotWebSocketClient, tag: string): void
	{
		if (client == null)
			throw new Error (`No client given when tagging with "${tag}"`);

		if (this.tags[tag] == null)
			this.tags[tag] = {};

		this.tags[tag][client.getId ()] = client;
	}

	/**
	 * Get a list of clients with the same tag.
	 */
	getTaggedClients (tag: string): { [tag: string]: HotWebSocketClient; }
	{
		return (this.tags[tag]);
	}

	/**
	 * Clears the list of clients with the same tag.
	 */
	clearTag (tag: string): void
	{
		if (this.tags[tag] == null)
			throw new Error (`Unable to remove tagged clients. Tag ${tag} does not exist.`);

		this.tags[tag] = {};
	}

	/**
	 * Clears the list of tagged clients.
	 */
	clearAllTags (): void
	{
		this.tags = {};
	}

	/**
	 * Send an event to all clients with the same tag.
	 */
	sendToTaggedClients (tag: string, event: string, data: any): void
	{
		if (this.tags[tag] == null)
			throw new Error (`Unable to send to tagged clients. Tag ${tag} does not exist.`);

		for (let key in this.tags[tag])
		{
			let client: HotWebSocketClient = this.tags[tag][key];

			client.send (event, data);
		}
	}

	/**
	 * Send an event to all clients.
	 */
	sendToAll (event: string, data: any): void
	{
		for (let key in this.clients)
		{
			let client: HotWebSocketClient = this.clients[key];

			client.send (event, data);
		}
	}

	/**
	 * Send an event to a client.
	 */
	send (clientId: string, event: string, data: any): void
	{
		let client: HotWebSocketClient = this.clients[clientId];

		if (client == null)
			throw new Error (`Unable to find client with id ${clientId}`);

		client.send (event, data);
	}

	/**
	 * Disconnect all clients with the same tag.
	 */
	disconnectTaggedClients (tag: string, closeConnection: boolean = true): void
	{
		if (this.tags[tag] == null)
			throw new Error (`Unable to send to tagged clients. Tag ${tag} does not exist.`);

		this.tags[tag] = {};

		for (let key in this.tags[tag])
		{
			let client: HotWebSocketClient = this.tags[tag][key];

			if (closeConnection === true)
				client.disconnect (false);
		}
	}

	/**
	 * Disconnect all clients.
	 */
	disconnectAll (closeConnection: boolean = true): void
	{
		this.clients = {};
		this.clearAllTags ();

		for (let key in this.clients)
		{
			let client: HotWebSocketClient = this.clients[key];

			if (closeConnection === true)
				client.disconnect (false);
		}
	}

	/**
	 * Send a client.
	 */
	disconnect (clientId: string, closeConnection: boolean = true): void
	{
		let client: HotWebSocketClient = this.clients[clientId];

		if (client == null)
			throw new Error (`Unable to find client with id ${clientId}`);

		delete this.clients[clientId];

		for (let tag in this.tags)
		{
			for (let clientId2 in this.tags[tag])
			{
				let client2: HotWebSocketClient = this.tags[tag][clientId2];

				if (client2 != null)
					delete this.tags[tag][clientId2];
			}
		}

		if (closeConnection === true)
			client.disconnect (false);
	}

	/**
	 * Add a route for socket.io. These will only be added to new 
	 * connections. Existing connections will not receive these.
	 */
	addRoute (
			route: HotRoute | string,
			routeMethod: HotRouteMethod | string = null,
			executeFunction: (jsonObj: any) => Promise<any> = null
		): void
	{
		let routeName: string = "";

		if (route instanceof HotRoute)
		{
			routeName = route.route;
			this.routes[route.route] = route;
		}
		else
		{
			routeName = route;

			if (this.routes[routeName] == null)
				this.routes[routeName] = new HotRoute (this.connection, routeName);

			if (routeMethod instanceof HotRouteMethod)
				this.routes[routeName].addMethod (routeMethod);
			else
			{
				this.routes[routeName].addMethod (new HotRouteMethod (
					this.routes[routeName], routeMethod, executeFunction));
			}
		}
	}

	/**
	 * Stop the socket.io server.
	 */
	async stop (): Promise<void>
	{
		this.disconnectAll ();

		await new Promise<void> ((resolve, reject) =>
			{
				this.io.close ((err: Error) =>
					{
						if (err != null)
							throw err;

						this.logger.verbose (`WebSocket Server has stopped listening.`);
						resolve ();
					});
			});

		this.logger.info (`WebSocket Server has completely shut down.`);
	}
}