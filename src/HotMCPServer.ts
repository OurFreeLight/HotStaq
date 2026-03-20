import express from "express";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { ListToolsRequestSchema, CallToolRequestSchema, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod } from "./HotRouteMethod";
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
	 * The MCP Server instance.
	 */
	server: Server;
	/**
	 * The registered tool definitions.
	 */
	tools: MCPToolDefinition[];
	/**
	 * Active SSE transports keyed by session ID.
	 */
	transports: { [sessionId: string]: SSEServerTransport };

	constructor (api: HotAPI, route: string = "/mcp")
	{
		this.api = api;
		this.route = route;
		this.logger = new HotLog (HotLogLevel.All);
		this.tools = [];
		this.transports = {};

		this.server = new Server (
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

		this.buildToolDefinitions ();
		this.registerHandlers ();
	}

	/**
	 * Get the HTTP method string from a HotEventMethod enum value.
	 */
	protected getHTTPMethod (type: HotEventMethod): string
	{
		switch (type)
		{
			case HotEventMethod.GET:
				return ("GET");
			case HotEventMethod.POST:
				return ("POST");
			case HotEventMethod.POST_AND_WEBSOCKET_CLIENT_PUB_EVENT:
				return ("POST");
			default:
				return ("POST");
		}
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

				let httpMethod: string = this.getHTTPMethod (method.type);
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
	 * Register the MCP request handlers for tools/list and tools/call.
	 */
	protected registerHandlers (): void
	{
		this.server.setRequestHandler (ListToolsRequestSchema, async () =>
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

		this.server.setRequestHandler (CallToolRequestSchema, async (request: any) =>
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
					let result = await this.executeToolCall (tool, args, request);

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
	protected async executeToolCall (tool: MCPToolDefinition, args: any, request?: any): Promise<CallToolResult>
	{
		let server: HotHTTPServer = this.api.connection as HotHTTPServer;
		let route: HotRoute = this.api.routes[tool.routeName];

		if (route == null)
			throw new Error (`Route "${tool.routeName}" not found`);

		let method: HotRouteMethod | undefined = route.methods.find ((m) => m.name === tool.methodName);

		if (method == null)
			throw new Error (`Method "${tool.methodName}" not found on route "${tool.routeName}"`);

		let methodName: string = method.getRouteUrl ();

		// Build authorization header from MCP request metadata if available
		let headers: any = {};

		if (request != null && request.params != null &&
			request.params._meta != null && request.params._meta.authorization != null)
		{
			headers.authorization = request.params._meta.authorization;
		}

		// Build synthetic Express req object
		let req: any = {
				method: tool.httpMethod,
				body: (tool.httpMethod === "GET") ? {} : args,
				query: (tool.httpMethod === "GET") ? args : {},
				headers: headers,
				on: () => {}
			};

		// Build synthetic Express res object that captures the response
		let capturedStatus: number = 200;
		let capturedBody: any = undefined;

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
				on: () => {},
				set: () => {},
				flushHeaders: () => {}
			};

		let response: any = await processRequest (server, server.logger, route, method, methodName, req as any, res as any);

		// processRequest may return a value directly or the res.json path may have been used
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
	 * Attach the MCP SSE endpoints to an Express application.
	 */
	async attach (app: express.Express): Promise<void>
	{
		let sseRoute: string = `${this.route}/sse`;
		let messageRoute: string = `${this.route}/message`;

		// SSE endpoint
		app.get (sseRoute, async (req: express.Request, res: express.Response) =>
			{
				this.logger.verbose (() => `New MCP SSE connection`);

				let transport = new SSEServerTransport (messageRoute, res as any);

				this.transports[transport.sessionId] = transport;

				transport.onclose = () =>
					{
						delete this.transports[transport.sessionId];
					};

				await this.server.connect (transport);
			});

		// Also handle GET on the base route as SSE
		app.get (this.route, async (req: express.Request, res: express.Response) =>
			{
				this.logger.verbose (() => `New MCP SSE connection (base route)`);

				let transport = new SSEServerTransport (messageRoute, res as any);

				this.transports[transport.sessionId] = transport;

				transport.onclose = () =>
					{
						delete this.transports[transport.sessionId];
					};

				await this.server.connect (transport);
			});

		// Message endpoint
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

				await transport.handlePostMessage (req as any, res as any);
			});
	}
}
