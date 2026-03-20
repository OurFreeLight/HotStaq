import express from "express";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { ListToolsRequestSchema, CallToolRequestSchema, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { HotAPI } from "./HotAPI";
import { HotRoute } from "./HotRoute";
import { HotRouteMethod, HotEventMethod, HotRouteMethodParameter } from "./HotRouteMethod";
import { HotLog, HotLogLevel } from "./HotLog";

/**
 * A JSON Schema property definition.
 */
interface JSONSchemaProperty
{
	/**
	 * The JSON Schema type.
	 */
	type: string;
	/**
	 * The description of the property.
	 */
	description?: string;
	/**
	 * Items schema for array types.
	 */
	items?: JSONSchemaProperty;
	/**
	 * Nested properties for object types.
	 */
	properties?: { [name: string]: JSONSchemaProperty };
}

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
		properties: { [name: string]: JSONSchemaProperty };
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
	 * The base URL for making internal API calls.
	 */
	baseUrl: string;
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
		this.baseUrl = api.baseUrl || "";
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
	 * Convert a HotRouteMethodParameter type to a JSON Schema type.
	 */
	protected convertParamType (paramType: string): string
	{
		if (paramType == null || paramType === "")
			return ("string");

		return (paramType);
	}

	/**
	 * Convert a HotRouteMethodParameter to a JSON Schema property.
	 */
	protected convertParameter (param: HotRouteMethodParameter): JSONSchemaProperty
	{
		let prop: JSONSchemaProperty = {
				type: this.convertParamType (param.type)
			};

		if (param.description != null)
			prop.description = param.description;

		if (param.type === "array" && param.items != null)
		{
			if (typeof (param.items) !== "function")
				prop.items = this.convertParameter (param.items);
		}

		if (param.type === "object" && param.parameters != null)
		{
			prop.properties = {};

			for (let subName in param.parameters)
			{
				let subParam = param.parameters[subName];

				if (typeof (subParam) === "string")
				{
					prop.properties[subName] = { type: "string", description: subParam };
				}
				else if (typeof (subParam) !== "function")
				{
					prop.properties[subName] = this.convertParameter (subParam);
				}
			}
		}

		return (prop);
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
				let properties: { [name: string]: JSONSchemaProperty } = {};
				let required: string[] = [];

				if (method.parameters != null)
				{
					for (let paramName in method.parameters)
					{
						let param = method.parameters[paramName];

						if (typeof (param) === "function")
							continue;

						properties[paramName] = this.convertParameter (param);

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
						urlPath: urlPath
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
					let result = await this.executeToolCall (tool, args);

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
	 * Execute a tool call by making an internal HTTP fetch to the API endpoint.
	 */
	protected async executeToolCall (tool: MCPToolDefinition, args: any): Promise<CallToolResult>
	{
		let url: string = `${this.baseUrl}${tool.urlPath}`;
		let fetchOptions: any = {
				method: tool.httpMethod,
				headers: {
					"Content-Type": "application/json"
				}
			};

		if (tool.httpMethod === "GET")
		{
			let queryParams = new URLSearchParams ();

			for (let key in args)
			{
				if (args[key] != null)
					queryParams.append (key, String (args[key]));
			}

			let queryString: string = queryParams.toString ();

			if (queryString !== "")
				url += `?${queryString}`;
		}
		else
		{
			fetchOptions.body = JSON.stringify (args);
		}

		let response = await fetch (url, fetchOptions);
		let responseText: string = await response.text ();

		let result: CallToolResult = {
				content: [{ type: "text", text: responseText }],
				isError: !response.ok
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
