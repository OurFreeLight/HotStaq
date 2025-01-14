import { Server, ServerOptions, Socket } from "socket.io";

import { HotHTTPServer } from "./HotHTTPServer";
import { HotWebSocketServerClient } from "./HotWebSocketServerClient";
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
	clients: { [socketId: string]: HotWebSocketServerClient };
	/**
	 * The tags and their associated clients.
	 */
	tags: { [tag: string]: {
			[socketId: string]: HotWebSocketServerClient;
		}
	};
	/**
	 * The socket.io server options. Default options are:
	 * ```json
	 * {
	 * 	"cors": {
	 * 		"origin": this.connection.cors.origin,
	 * 		"allowedHeaders": this.connection.cors.allowedHeaders
	 * 	}
	 * }
	 * ```
	 * Where this.connection.cors represents the CORS settings set for the 
	 * HotStaq processor.
	 */
	serverOptions: Partial<ServerOptions>;
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
	onServerAuthorize: ServerAuthorizationFunction;
	/**
	 * Executes after a successful connection.
	 */
	onSuccessfulConnection: (client: HotWebSocketServerClient) => Promise<void>;
	/**
	 * Executes right when a user connects before onServerAuthorize is called.
	 * If this function returns false, the connection will be closed. Be sure 
	 * to use onServerAuthorize to handle authorization, NOT here.
	 */
	onConnection: (socket: Socket) => Promise<boolean>;
	/**
	 * Executes after a connection is unable to authenticate.
	 */
	onConnectionError: (socket: Socket, errorMessage: string) => Promise<void>;
	/**
	 * Executes right after a user disconnects.
	 */
	onDisconnect: (socket: HotWebSocketServerClient) => void;

	constructor (server: HotHTTPServer)
	{
		this.connection = server;
		this.logger = this.connection.logger;
		this.io = null;
		this.routes = {};
		this.clients = {};
		this.tags = {};
		this.serverOptions = {
				"cors": {
					"origin": this.connection.cors.origin,
					"allowedHeaders": this.connection.cors.allowedHeaders
				},
				maxHttpBufferSize: 1e8
			};

		this.onServerAuthorize = null;
		this.onSuccessfulConnection = null;
		this.onConnection = null;
		this.onDisconnect = null;
	}

	/**
	 * Setup the WebSocket server AFTER the http server is running.
	 */
	setup (): void
	{
		if (this.connection.httpsListener != null)
		{
			this.io = new Server (this.connection.httpsListener, this.serverOptions);
			this.logger.info (`Secure WebSocket server listening...`);
		}
		else
		{
			this.io = new Server (this.connection.httpListener, this.serverOptions);
			this.logger.info (`WebSocket server listening...`);
		}

		this.io.use (async (socket, next) =>
			{
				try
				{
					let incomingIP: string = HotWebSocketServer.getIPFromSocket (socket);
					let authorizationValue: any = null;
					let hasAuthorization: boolean = true;
					let executedFailedFunc: boolean = false;

					const socketId: string = socket.id;
					const newSocket: HotWebSocketServerClient = new HotWebSocketServerClient (this, socket);

					if (this.onConnection != null)
					{
						const canConnect: boolean = await this.onConnection (socket);

						if (canConnect === false)
						{
							next (new Error ("Unauthorized"));

							return;
						}
					}

					if (this.onServerAuthorize != null)
					{
						try
						{
							let request = new ServerRequest ({
								req: null,
								res: null,
								bearerToken: "",
								authorizedValue: null,
								jsonObj: socket.handshake.auth,
								queryObj: socket.handshake.query,
								files: null,
								wsSocket: newSocket
							});

							authorizationValue = await this.onServerAuthorize.call (this, request);
						}
						catch (ex)
						{
							// This is verbose since it SHOULDN'T be an error, it's just a failed authorization.
							this.logger.verbose (`Authorization error from ip ${incomingIP}: ${ex.message}`);
							hasAuthorization = false;

							if (this.onConnectionError != null)
								await this.onConnectionError (socket, ex.message);

							executedFailedFunc = true;
						}

						if (authorizationValue === undefined)
							hasAuthorization = false;
					}

					if (hasAuthorization === false)
					{
						// Ensures we execute the onConnectionError function only once.
						if (executedFailedFunc === false)
						{
							if (this.onConnectionError != null)
								await this.onConnectionError (socket, "Unauthorized");
						}

						this.logger.verbose (`Unauthorized connection from ${incomingIP}`);
						next (new Error ("Unauthorized"));

						return;
					}

					this.logger.verbose (`Incoming WebSocket connection from ${incomingIP}, Authorized: true, Authorization Value: ${authorizationValue}`);

					socket.data.authorizationValue = authorizationValue;

					newSocket.authorizedValue = authorizationValue;
					this.clients[socketId] = newSocket;

					next ();
				}
				catch (ex)
				{
					this.logger.error (`Error while authorizing a websocket connection: ${ex}`);
					next (new Error ("Internal Server Error"));
				}
			});
		this.io.on ("connection", async (socket: Socket) =>
			{
				try
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

							if (! ((method.type === HotEventMethod.WEBSOCKET_CLIENT_PUB_EVENT) || 
								(method.type === HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT)))
							{
								continue;
							}

							let eventName: string = `${routeName}/${method.name}`;

							// Only 1 argument will be passed to the jsonObj in the new ServerRequest.
							// Devs can always pass an array or whatever object(s) they need.
							socket.on (eventName, async (...args: any[]) => 
								{
									try
									{
										let jsonObj: any = null;

										if (args != null)
										{
											if (args.length > 0)
												jsonObj = args[0];
										}

										let uuid: string = null;
										let data: any = jsonObj;

										if (jsonObj.uuid != null)
										{
											uuid = jsonObj.uuid;
											data = jsonObj.data;
										}

										const socketId: string = socket.id;
										let wsSocket: HotWebSocketServerClient = this.clients[socketId];

										let request: ServerRequest = new ServerRequest ({
												"bearerToken": "",
												"authorizedValue": authorizationValue,
												"jsonObj": data,
												"wsSocket": wsSocket
											});

										socket.data.wsSocket = wsSocket;
						
										let result: any = await method.onServerExecute.call (route, request);
						
										if (this.logger.showWebSocketEvents === true)
										{
											this.logger.verbose ((result2: any) => {
												let resultStr: string = "";
						
												if (this.logger.showResponses === true)
													resultStr = `, Response: ${JSON.stringify (result2)}`;

												return (`WebSocket Event ${eventName}${resultStr}`);
											}, result);
										}

										if (result !== undefined)
										{
											let resultObj: any = result;

											if (uuid != null)
												resultObj = { uuid: uuid, data: result };

											socket.emit (`${routeName}/${method.name}`, resultObj);
										}
									}
									catch (ex)
									{
										this.logger.error (`Execution error: ${ex}`);
										socket.emit (`${routeName}/${method.name}`, { error: ex.message });
									}
								});
							this.logger.verbose (`Adding WebSocket Event: ${eventName}`);
						}
					}

					const socketId: string = socket.id;

					socket.on ("disconnect", () =>
						{
							try
							{
								this.disconnect (socketId);
							}
							catch (ex)
							{
								this.logger.error (`Error while disconnecting a websocket client: ${ex}`);
							}
						});

					this.logger.verbose (`Client successfully connected ${socketId}`);

					if (this.onSuccessfulConnection != null)
						await this.onSuccessfulConnection (this.clients[socketId]);
				}
				catch (ex)
				{
					this.logger.error (`Error while connecting a websocket client: ${ex}`);
					socket.emit ("error", "Internal Server Error");
					socket.disconnect ();
				}
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
	tagClient (client: HotWebSocketServerClient, tag: string): void
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
	getTaggedClients (tag: string): { [tag: string]: HotWebSocketServerClient; }
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
			let client: HotWebSocketServerClient = this.tags[tag][key];

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
			let client: HotWebSocketServerClient = this.clients[key];

			client.send (event, data);
		}
	}

	/**
	 * Send an event to a client.
	 */
	send (clientId: string, event: string, data: any): void
	{
		let client: HotWebSocketServerClient = this.clients[clientId];

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
			let client: HotWebSocketServerClient = this.tags[tag][key];

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
			let client: HotWebSocketServerClient = this.clients[key];

			if (closeConnection === true)
				client.disconnect (false);
		}
	}

	/**
	 * Send a client.
	 */
	disconnect (clientId: string, closeConnection: boolean = true): void
	{
		let client: HotWebSocketServerClient = this.clients[clientId];

		if (client == null)
			throw new Error (`Unable to find client with id ${clientId}`);

		delete this.clients[clientId];

		for (let tag in this.tags)
		{
			let client2: HotWebSocketServerClient = this.tags[tag][clientId];

			if (client2 != null)
				delete this.tags[tag][clientId];
		}

		if (this.onDisconnect != null)
			this.onDisconnect (client);

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

		if (typeof (route) === "string")
		{
			routeName = route;

			if (this.routes[routeName] == null)
				this.routes[routeName] = new HotRoute (this.connection, routeName);

			if (typeof (routeMethod) === "string")
			{
				this.routes[routeName].addMethod (HotRouteMethod.create (
					this.routes[routeName], routeMethod, executeFunction));
				this.logger.verbose (`Added WebSocket route ${routeName} with method ${routeMethod}`);
			}
			else
			{
				this.routes[routeName].addMethod (routeMethod);
				this.logger.verbose (`Added WebSocket route ${routeName}`);
			}
		}
		else
		{
			routeName = route.route;
			this.routes[route.route] = route;

			this.logger.verbose (`Added WebSocket route ${routeName}`);
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
				this.io.close ((err: NodeJS.ErrnoException) =>
					{
						if (err != null)
						{
							if (err.code != null)
							{
								if (err.code !== "ERR_SERVER_NOT_RUNNING")
									throw err;
							}
						}

						this.logger.verbose (`WebSocket Server has stopped listening.`);
						resolve ();
					});
			});

		this.logger.info (`WebSocket Server has completely shut down.`);
	}
}