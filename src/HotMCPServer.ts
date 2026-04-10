import express from "express";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { ListToolsRequestSchema, CallToolRequestSchema, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, ServerRequest, ServerAuthorizationFunction } from "./HotRouteMethod";
import { HotLog, HotLogLevel } from "./HotLog";
import { HotHTTPServer } from "./HotHTTPServer";
import { HotStaq } from "./HotStaq";
import { processRequest } from "./HotHTTPServerProcessRequest";

/**
 * A tool definition for the MCP server.
 */
interface MCPToolDefinition
{
	/**
	 * The tool name.
	 */
	name: string;
	/**
	 * The tool description.
	 */
	description: string;
	/**
	 * The JSON Schema for the tool's input parameters.
	 */
	inputSchema: {
		type: "object";
		properties: { [name: string]: any };
		required?: string[];
	};
	/**
	 * The HTTP method type for making the internal call.
	 */
	httpMethod: string;
	/**
	 * The internal URL path to call.
	 */
	urlPath: string;
	/**
	 * The route name (key in api.routes).
	 */
	routeName: string;
	/**
	 * The method name on the route.
	 */
	methodName: string;
}

/**
 * Exposes a HotAPI as an MCP (Model Context Protocol) server using SSE transport.
 *
 * This class walks all routes and methods on a HotAPI instance and registers
 * them as MCP tools. When a tool is called via MCP, it makes an internal HTTP
 * fetch to the actual API endpoint and returns the result.
 */
export class HotMCPServer
{
	/**
	 * The API instance to expose as MCP tools.
	 */
	api: HotAPI;
	/**
	 * The route prefix for the MCP endpoints.
	 * @default "/mcp"
	 */
	route: string;
	/**
	 * The associated logger.
	 */
	logger: HotLog;
	/**
	 * The MCP Server instances keyed by session ID.
	 * A new Server instance is created per SSE connection because the MCP SDK
	 * Server class only supports one active transport at a time.
	 */
	servers: { [sessionId: string]: Server };
	/**
	 * The registered tool definitions.
	 */
	tools: MCPToolDefinition[];
	/**
	 * Active SSE transports keyed by session ID.
	 */
	transports: { [sessionId: string]: SSEServerTransport };
	/**
	 * Authorized values from connection-level authorization, keyed by session ID.
	 * Set when onServerAuthorize is used and a connection is successfully authorized.
	 */
	authorizedValues: { [sessionId: string]: any };
	/**
	 * Executes when authorizing an incoming MCP SSE connection. The value
	 * returned from here will be stored as the connection's authorizedValue
	 * and passed into tool call ServerRequests via bearerToken. Returning
	 * undefined means authorization failed and the connection will be closed.
	 * If any exceptions are thrown, the connection will be closed with an error.
	 *
	 * The bearer token from the MCP connection request (query param or header)
	 * will be passed in via request.bearerToken.
	 *
	 * Set to null to skip connection-level authorization (default).
	 */
	onServerAuthorize: ServerAuthorizationFunction;
	/**
	 * Executes after a successful MCP SSE connection is established.
	 */
	onSuccessfulConnection: ((sessionId: string, authorizedValue: any) => Promise<void>);
	/**
	 * Executes right when a client connects before onServerAuthorize is called.
	 * If this returns false, the connection will be closed immediately.
	 * Use onServerAuthorize for authorization logic, not here.
	 */
	onConnection: ((req: express.Request) => Promise<boolean>);
	/**
	 * Executes after a connection fails authorization.
	 */
	onConnectionError: ((req: express.Request, errorMessage: string) => Promise<void>);

	constructor (api: HotAPI, route: string = "/mcp")
	{
		this.api = api;
		this.route = route;
		this.logger = new HotLog (HotLogLevel.All);
		this.tools = [];
		this.transports = {};
		this.servers = {};
		this.authorizedValues = {};
		this.onServerAuthorize = null;
		this.onSuccessfulConnection = null;
		this.onConnection = null;
		this.onConnectionError = null;

		this.buildToolDefinitions ();
	}


	/**
	 * Build MCP tool definitions from the API's routes and methods.
	 */
	protected buildToolDefinitions (): void
	{
		if (this.api.routes == null)
			return;

		for (let routeName in this.api.routes)
		{
			let route: HotRoute = this.api.routes[routeName];

			if (route.methods == null)
				continue;

			for (let method of route.methods)
			{
				let toolName: string = `${route.route}_${method.name}`;
				let properties: { [name: string]: any } = {};
				let required: string[] = [];

				if (method.parameters != null)
				{
					for (let paramName in method.parameters)
					{
						let param = method.parameters[paramName];

						if (typeof (param) === "function")
							continue;

						properties[paramName] = HotStaq.convertParamToJSONSchemaProperty (param);

						if (param.required === true)
							required.push (paramName);
					}
				}

				let httpMethod: string = HotStaq.getHTTPMethodFromEvent (method.type);
				let version: string = route.version || "v1";
				let prefix: string = route.prefix || "";
				let urlPath: string = `/${version}/${prefix}${route.route}/${method.name}`;

				// Clean up double slashes
				urlPath = urlPath.replace (/\/+/g, "/");

				let toolDef: MCPToolDefinition = {
						name: toolName,
						description: method.description || `Call ${route.route}/${method.name}`,
						inputSchema: {
							type: "object",
							properties: properties
						},
						httpMethod: httpMethod,
						urlPath: urlPath,
						routeName: routeName,
						methodName: method.name
					};

				if (required.length > 0)
					toolDef.inputSchema.required = required;

				this.tools.push (toolDef);
			}
		}
	}

	/**
	 * Create a fresh MCP Server instance with handlers registered.
	 * A new instance is required per SSE connection because the MCP SDK
	 * Server class only supports one active transport at a time.
	 */
	protected createServerInstance (sessionId: string): Server
	{
		let instance: Server = new Server (
				{
					name: "HotStaq MCP Server",
					version: "1.0.0"
				},
				{
					capabilities: {
						tools: {}
					}
				}
			);

		this.registerHandlers (instance, sessionId);

		return (instance);
	}

	/**
	 * Register the MCP request handlers for tools/list and tools/call on
	 * the given Server instance. The sessionId is used to look up the
	 * connection-level authorizedValue for authenticated tool calls.
	 */
	protected registerHandlers (instance: Server, sessionId: string): void
	{
		instance.setRequestHandler (ListToolsRequestSchema, async () =>
			{
				return ({
					tools: this.tools.map ((tool) =>
						{
							return ({
								name: tool.name,
								description: tool.description,
								inputSchema: tool.inputSchema
							});
						})
				});
			});

		instance.setRequestHandler (CallToolRequestSchema, async (request: any) =>
			{
				let toolName: string = request.params.name;
				let args: any = request.params.arguments || {};

				let tool: MCPToolDefinition | undefined = this.tools.find ((t) => t.name === toolName);

				if (tool == null)
				{
					let result: CallToolResult = {
							content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
							isError: true
						};

					return (result);
				}

				try
				{
					let result = await this.executeToolCall (tool, args, request, sessionId);

					return (result);
				}
				catch (ex)
				{
					let errorMessage: string = "Unknown error";

					if (ex instanceof Error)
						errorMessage = ex.message;
					else if (typeof (ex) === "string")
						errorMessage = ex;

					let result: CallToolResult = {
							content: [{ type: "text", text: `Error calling ${toolName}: ${errorMessage}` }],
							isError: true
						};

					return (result);
				}
			});
	}

	/**
	 * Execute a tool call by calling processRequest directly, going through
	 * the full HotStaq sanitization pipeline (validation, authorization,
	 * pre/post execute hooks, etc).
	 */
	protected async executeToolCall (tool: MCPToolDefinition, args: any, mcpRequest?: any, sessionId?: string): Promise<CallToolResult>
	{
		let server: HotHTTPServer = this.api.connection as HotHTTPServer;
		let route: HotRoute = this.api.routes[tool.routeName];

		if (route == null)
			throw new Error (`Route "${tool.routeName}" not found`);

		let method: HotRouteMethod | undefined = route.methods.find ((m) => m.name === tool.methodName);

		if (method == null)
			throw new Error (`Method "${tool.methodName}" not found on route "${tool.routeName}"`);

		let methodName: string = method.getRouteUrl ();

		// Extract bearer token from MCP request metadata if provided.
		// MCP clients pass auth via request.params._meta.authorization.
		let bearerToken: string = "";

		if (mcpRequest != null && mcpRequest.params != null &&
			mcpRequest.params._meta != null && mcpRequest.params._meta.authorization != null)
		{
			bearerToken = mcpRequest.params._meta.authorization;

			// Strip "Bearer " prefix if present, matching how processRequest handles it.
			if (bearerToken.startsWith ("Bearer ") || bearerToken.startsWith ("bearer "))
				bearerToken = bearerToken.substring (7);
		}

		// If no per-call token was provided, check for a connection-level
		// authorized value. When onServerAuthorize is set and the SSE
		// connection was authenticated, the returned value (e.g. a JWT or
		// user object) is stored in authorizedValues keyed by session ID.
		// We pass it through as bearerToken so processRequest's
		// onAuthorizeUser sees it the same way it would for an HTTP request.
		let connectionAuthorizedValue: any = null;

		if (sessionId != null && this.authorizedValues[sessionId] != null)
			connectionAuthorizedValue = this.authorizedValues[sessionId];

		if (bearerToken === "" && connectionAuthorizedValue != null &&
			typeof (connectionAuthorizedValue) === "string")
		{
			bearerToken = connectionAuthorizedValue;
		}

		// Build the authorization header so processRequest can read it the same way
		// it does for normal HTTP requests.
		let authHeader: string = bearerToken !== "" ? `Bearer ${bearerToken}` : "";

		// Build a synthetic Express req object that mirrors a real Express request
		// closely enough for route handlers, middleware, and processRequest to work.
		// In addition to body/query/headers, handlers commonly access req.ip,
		// req.connection.remoteAddress, req.get(), req.originalUrl, req.protocol, etc.
		let reqHeaders: any = authHeader !== "" ? { authorization: authHeader } : {};

		let req: any = {
				method: tool.httpMethod,
				body: (tool.httpMethod === "GET") ? {} : args,
				query: (tool.httpMethod === "GET") ? args : {},
				headers: reqHeaders,
				ip: "127.0.0.1",
				ips: [],
				protocol: "mcp",
				secure: false,
				hostname: "localhost",
				originalUrl: tool.urlPath,
				path: tool.urlPath,
				baseUrl: "",
				params: {},
				httpVersion: "1.1",
				connection: { remoteAddress: "127.0.0.1", encrypted: false },
				socket: { remoteAddress: "127.0.0.1", encrypted: false },
				cookies: {},
				get: (name: string): string | undefined =>
					{
						return (reqHeaders[name.toLowerCase ()]);
					},
				header: (name: string): string | undefined =>
					{
						return (reqHeaders[name.toLowerCase ()]);
					},
				on: (_event: string, _handler: any) => {}
			};

		// Build a synthetic Express res that captures the response instead of
		// writing to a real HTTP connection — same pattern as HotWebSocketServer
		// which creates a ServerRequest without req/res when there's no HTTP context.
		let capturedStatus: number = 200;
		let capturedBody: any = undefined;

		let resHeaders: any = {};

		let res: any = {
				status: (code: number) =>
					{
						capturedStatus = code;

						return (res);
					},
				json: (value: any) =>
					{
						capturedBody = value;
					},
				send: (value: any) =>
					{
						capturedBody = value;
					},
				end: () => {},
				on: (_event: string, _handler: any) => {},
				set: (headers: any) =>
					{
						if (typeof (headers) === "object")
							Object.assign (resHeaders, headers);

						return (res);
					},
				setHeader: (name: string, value: string) =>
					{
						resHeaders[name] = value;

						return (res);
					},
				getHeader: (name: string): string | undefined =>
					{
						return (resHeaders[name]);
					},
				getHeaders: (): any =>
					{
						return (resHeaders);
					},
				flushHeaders: () => {},
				headersSent: false
			};

		// Delegate to processRequest — this runs the full HotStaq pipeline:
		// onServerAuthorize / onAuthorizeUser, input validation (validateQueryInput,
		// validateJSONInput, processInput), onServerPreExecute, onServerExecute,
		// onServerPostExecute. The ServerRequest built inside processRequest will
		// have bearerToken set from req.headers.authorization, matching normal HTTP flow.
		let response: any = await processRequest (server, server.logger, route, method, methodName, req as any, res as any);

		// processRequest returns the result directly or routes through res.json().
		let resultBody: any = (response !== undefined) ? response : capturedBody;
		let isError: boolean = false;

		if (resultBody != null && resultBody.error != null)
			isError = true;

		let resultText: string;

		if (typeof (resultBody) === "string")
			resultText = resultBody;
		else
			resultText = JSON.stringify (resultBody);

		let result: CallToolResult = {
				content: [{ type: "text", text: resultText }],
				isError: isError
			};

		return (result);
	}

	/**
	 * Handle an incoming SSE connection request, running the connection lifecycle:
	 * onConnection (early gate), onServerAuthorize (auth), then establishing
	 * the MCP SSE transport. Mirrors HotWebSocketServer's connection handling.
	 */
	protected async handleSSEConnection (req: express.Request, res: express.Response, messageRoute: string): Promise<void>
	{
		this.logger.verbose (() => `New MCP SSE connection from ${req.ip}`);

		// Early connection gate — developer can reject before auth runs.
		if (this.onConnection != null)
		{
			let allowed: boolean = false;

			try
			{
				allowed = await this.onConnection (req);
			}
			catch (ex)
			{
				this.logger.error (`MCP onConnection error: ${ex.message}`);
				res.status (500).json ({ error: "Internal Server Error" });

				return;
			}

			if (allowed === false)
			{
				this.logger.verbose (`MCP connection rejected by onConnection from ${req.ip}`);
				res.status (403).json ({ error: "Forbidden" });

				return;
			}
		}

		// Connection-level authorization — optional, mirrors HotWebSocketServer.onServerAuthorize.
		let authorizedValue: any = null;

		if (this.onServerAuthorize != null)
		{
			// Extract bearer token from Authorization header or query param.
			let bearerToken: string = "";

			if (req.headers.authorization != null)
			{
				bearerToken = req.headers.authorization;

				if (bearerToken.startsWith ("Bearer ") || bearerToken.startsWith ("bearer "))
					bearerToken = bearerToken.substring (7);
			}
			else if ((req.query.token != null) && (typeof (req.query.token) === "string"))
			{
				bearerToken = req.query.token as string;
			}

			let request: ServerRequest = new ServerRequest ({
					req: req,
					res: null,
					bearerToken: bearerToken,
					authorizedValue: null,
					jsonObj: req.body || {},
					queryObj: req.query,
					files: null
				});

			try
			{
				authorizedValue = await this.onServerAuthorize (request);
			}
			catch (ex)
			{
				this.logger.verbose (`MCP authorization error from ${req.ip}: ${ex.message}`);

				if (this.onConnectionError != null)
					await this.onConnectionError (req, ex.message);

				res.status (401).json ({ error: ex.message });

				return;
			}

			if (authorizedValue === undefined)
			{
				this.logger.verbose (`MCP unauthorized connection from ${req.ip}`);

				if (this.onConnectionError != null)
					await this.onConnectionError (req, "Unauthorized");

				res.status (401).json ({ error: "Unauthorized" });

				return;
			}
		}

		this.logger.verbose (() => `MCP SSE connection authorized from ${req.ip}`);

		let transport = new SSEServerTransport (messageRoute, res as any);

		// Create a fresh Server instance per connection — the MCP SDK Server
		// only supports one active transport at a time. Pass the session ID
		// so tool call handlers can look up connection-level auth.
		let sessionServer: Server = this.createServerInstance (transport.sessionId);

		this.transports[transport.sessionId] = transport;
		this.servers[transport.sessionId] = sessionServer;

		if (authorizedValue != null)
			this.authorizedValues[transport.sessionId] = authorizedValue;

		transport.onclose = () =>
			{
				delete this.transports[transport.sessionId];
				delete this.servers[transport.sessionId];
				delete this.authorizedValues[transport.sessionId];
			};

		await sessionServer.connect (transport);

		if (this.onSuccessfulConnection != null)
			await this.onSuccessfulConnection (transport.sessionId, authorizedValue);
	}

	/**
	 * Attach the MCP SSE endpoints to an Express application.
	 */
	async attach (app: express.Express): Promise<void>
	{
		let sseRoute: string = `${this.route}/sse`;
		let messageRoute: string = `${this.route}/message`;

		// SSE endpoint (/mcp/sse)
		app.get (sseRoute, async (req: express.Request, res: express.Response) =>
			{
				await this.handleSSEConnection (req, res, messageRoute);
			});

		// Also handle GET on the base route as SSE (/mcp)
		app.get (this.route, async (req: express.Request, res: express.Response) =>
			{
				await this.handleSSEConnection (req, res, messageRoute);
			});

		// Message endpoint — routes MCP JSON-RPC messages to the correct session transport.
		app.post (messageRoute, async (req: express.Request, res: express.Response) =>
			{
				let sessionId: string = req.query.sessionId as string;

				if (sessionId == null)
				{
					res.status (400).json ({ error: "Missing sessionId query parameter" });

					return;
				}

				let transport: SSEServerTransport = this.transports[sessionId];

				if (transport == null)
				{
					res.status (404).json ({ error: "Session not found" });

					return;
				}

				// Pass req.body as the pre-parsed body — Express's JSON middleware
			// consumes the stream before this handler runs, so we must provide
			// the already-parsed body explicitly.
			await transport.handlePostMessage (req as any, res as any, req.body);
			});
	}
}
