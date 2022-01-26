[hotstaq](../README.md) / [Modules](../modules.md) / HotHTTPServer

# Class: HotHTTPServer

A HTTP server.

## Hierarchy

- [`HotServer`](HotServer.md)

  ↳ **`HotHTTPServer`**

## Table of contents

### Constructors

- [constructor](HotHTTPServer.md#constructor)

### Properties

- [api](HotHTTPServer.md#api)
- [expressApp](HotHTTPServer.md#expressapp)
- [hottFilesAssociatedInfo](HotHTTPServer.md#hottfilesassociatedinfo)
- [httpListener](HotHTTPServer.md#httplistener)
- [httpsListener](HotHTTPServer.md#httpslistener)
- [ignoreHottFiles](HotHTTPServer.md#ignorehottfiles)
- [listenAddress](HotHTTPServer.md#listenaddress)
- [logger](HotHTTPServer.md#logger)
- [ports](HotHTTPServer.md#ports)
- [processor](HotHTTPServer.md#processor)
- [redirectHTTPtoHTTPS](HotHTTPServer.md#redirecthttptohttps)
- [routes](HotHTTPServer.md#routes)
- [secrets](HotHTTPServer.md#secrets)
- [serveHottFiles](HotHTTPServer.md#servehottfiles)
- [serverType](HotHTTPServer.md#servertype)
- [ssl](HotHTTPServer.md#ssl)
- [staticRoutes](HotHTTPServer.md#staticroutes)
- [type](HotHTTPServer.md#type)

### Methods

- [addRoute](HotHTTPServer.md#addroute)
- [addStaticRoute](HotHTTPServer.md#addstaticroute)
- [clearErrorHandlingRoutes](HotHTTPServer.md#clearerrorhandlingroutes)
- [getStaticRoute](HotHTTPServer.md#getstaticroute)
- [listen](HotHTTPServer.md#listen)
- [preregisterRoute](HotHTTPServer.md#preregisterroute)
- [registerRoute](HotHTTPServer.md#registerroute)
- [registerStaticRoute](HotHTTPServer.md#registerstaticroute)
- [serveDirectory](HotHTTPServer.md#servedirectory)
- [setAPI](HotHTTPServer.md#setapi)
- [setErrorHandlingRoutes](HotHTTPServer.md#seterrorhandlingroutes)
- [shutdown](HotHTTPServer.md#shutdown)
- [checkIfFileExists](HotHTTPServer.md#checkiffileexists)
- [getFileUploads](HotHTTPServer.md#getfileuploads)
- [startServer](HotHTTPServer.md#startserver)

## Constructors

### constructor

• **new HotHTTPServer**(`processor`, `httpPort?`, `httpsPort?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) | `undefined` |
| `httpPort` | `number` | `null` |
| `httpsPort` | `number` | `null` |

#### Overrides

[HotServer](HotServer.md).[constructor](HotServer.md#constructor)

#### Defined in

[HotHTTPServer.ts:100](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L100)

## Properties

### api

• **api**: [`HotAPI`](HotAPI.md)

The API to use.

#### Inherited from

[HotServer](HotServer.md).[api](HotServer.md#api)

#### Defined in

[HotServer.ts:94](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L94)

___

### expressApp

• **expressApp**: `Express`

The express app to use.

#### Defined in

[HotHTTPServer.ts:40](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L40)

___

### hottFilesAssociatedInfo

• **hottFilesAssociatedInfo**: `Object`

The associated info with any hott files served. All values here will be
overwritten by whatever values are set in the server object in HotSite.json.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsSrcPath` | `string` | The JavaScript source path. |
| `name` | `string` | The default name for a served Hott file. |
| `url` | `string` | The base url for a hott file. |

#### Defined in

[HotHTTPServer.ts:85](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L85)

___

### httpListener

• **httpListener**: `Server`

The HTTP listener to use.

#### Defined in

[HotHTTPServer.ts:44](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L44)

___

### httpsListener

• **httpsListener**: `Server`

The HTTPS listener to use.

#### Defined in

[HotHTTPServer.ts:48](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L48)

___

### ignoreHottFiles

• **ignoreHottFiles**: `Object`

Do not serve these hott files.

#### Index signature

▪ [name: `string`]: `boolean`

#### Defined in

[HotHTTPServer.ts:80](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L80)

___

### listenAddress

• **listenAddress**: `string`

The network address to listen on.

#### Inherited from

[HotServer](HotServer.md).[listenAddress](HotServer.md#listenaddress)

#### Defined in

[HotServer.ts:98](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L98)

___

### logger

• **logger**: [`HotLog`](HotLog.md)

The logger.

#### Inherited from

[HotServer](HotServer.md).[logger](HotServer.md#logger)

#### Defined in

[HotServer.ts:134](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L134)

___

### ports

• **ports**: `Object`

The ports to use.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `http` | `number` |
| `https` | `number` |

#### Inherited from

[HotServer](HotServer.md).[ports](HotServer.md#ports)

#### Defined in

[HotServer.ts:102](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L102)

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The processor to use.

#### Inherited from

[HotServer](HotServer.md).[processor](HotServer.md#processor)

#### Defined in

[HotServer.ts:86](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L86)

___

### redirectHTTPtoHTTPS

• **redirectHTTPtoHTTPS**: `boolean`

Redirect HTTP traffic to HTTPS.

#### Inherited from

[HotServer](HotServer.md).[redirectHTTPtoHTTPS](HotServer.md#redirecthttptohttps)

#### Defined in

[HotServer.ts:126](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L126)

___

### routes

• **routes**: { `route`: `string` ; `type`: [`HTTPMethod`](../enums/HTTPMethod.md) ; `method`: (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>) => `Promise`<`void`\>  }[]

Any non-static routes that need to be added. These
will be added during the preregistration phase, before
all API routes are added.

#### Defined in

[HotHTTPServer.ts:58](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L58)

___

### secrets

• **secrets**: `any`

Any secrets associated with this server.

#### Inherited from

[HotServer](HotServer.md).[secrets](HotServer.md#secrets)

#### Defined in

[HotServer.ts:138](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L138)

___

### serveHottFiles

• **serveHottFiles**: `boolean`

Serve hott files when requested. This value will be overwritten by whatever
value is set to server.serveHottFiles in HotSite.json.

#### Defined in

[HotHTTPServer.ts:76](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L76)

___

### serverType

• **serverType**: `string`

The server type.

#### Inherited from

[HotServer](HotServer.md).[serverType](HotServer.md#servertype)

#### Defined in

[HotServer.ts:90](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L90)

___

### ssl

• **ssl**: `Object`

SSL settings.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `ca` | `string` | The SSL certificate CA to use. |
| `cert` | `string` | The SSL certificate to use. |
| `key` | `string` | The SSL certificate key to use. |

#### Inherited from

[HotServer](HotServer.md).[ssl](HotServer.md#ssl)

#### Defined in

[HotServer.ts:109](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L109)

___

### staticRoutes

• **staticRoutes**: `StaticRoute`[]

The static files and folders to serve.

#### Defined in

[HotHTTPServer.ts:52](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L52)

___

### type

• **type**: `HotServerType`

The type of server.

#### Inherited from

[HotServer](HotServer.md).[type](HotServer.md#type)

#### Defined in

[HotServer.ts:130](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L130)

## Methods

### addRoute

▸ **addRoute**(`route`, `method`, `type?`): `void`

Add a route. This will be registered before any APIs are registered.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | `string` | `undefined` |
| `method` | (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>) => `Promise`<`void`\> | `undefined` |
| `type` | [`HTTPMethod`](../enums/HTTPMethod.md) | `HTTPMethod.GET` |

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:215](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L215)

___

### addStaticRoute

▸ **addStaticRoute**(`route`, `localPath?`): `void`

Add a static route.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | `string` \| `StaticRoute` | `undefined` |
| `localPath` | `string` | `"."` |

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:194](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L194)

___

### clearErrorHandlingRoutes

▸ **clearErrorHandlingRoutes**(): `void`

Clear the last two express routes, which are reserved for the
error handlers.

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:683](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L683)

___

### getStaticRoute

▸ **getStaticRoute**(`route`): `StaticRoute`

Get a static route.

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `string` |

#### Returns

`StaticRoute`

#### Defined in

[HotHTTPServer.ts:252](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L252)

___

### listen

▸ **listen**(): `Promise`<`void`\>

Start listening for requests.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotServer](HotServer.md).[listen](HotServer.md#listen)

#### Defined in

[HotHTTPServer.ts:711](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L711)

___

### preregisterRoute

▸ **preregisterRoute**(): `void`

The routes to add before registering a route.

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:440](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L440)

___

### registerRoute

▸ **registerRoute**(`route`): `Promise`<`void`\>

Register a route.

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | [`HotRoute`](HotRoute.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotServer](HotServer.md).[registerRoute](HotServer.md#registerroute)

#### Defined in

[HotHTTPServer.ts:274](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L274)

___

### registerStaticRoute

▸ **registerStaticRoute**(`route`): `void`

Register a static route with Express.

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | `StaticRoute` |

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:238](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L238)

___

### serveDirectory

▸ **serveDirectory**(`route`, `localPath?`): `void`

Serve a directory. This is an alias for addStaticRoute.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | `string` \| `StaticRoute` | `undefined` |
| `localPath` | `string` | `"."` |

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:230](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L230)

___

### setAPI

▸ **setAPI**(`api`): `Promise`<`void`\>

Set an API to this server. This will also set the associated
processor to this API as well.

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | [`HotAPI`](HotAPI.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotServer](HotServer.md).[setAPI](HotServer.md#setapi)

#### Defined in

[HotServer.ts:188](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L188)

___

### setErrorHandlingRoutes

▸ **setErrorHandlingRoutes**(`handle404?`, `handleOther?`): `void`

Set the error handlers. This will create two express routes at the bottom of the
route stack. The first will be to capture any 404 errors, the second would be to
catch any remaining errors.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `handle404` | (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>, `next`: `any`) => `void` | `null` |
| `handleOther` | (`err`: `any`, `req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>, `res`: `Response`<`any`, `Record`<`string`, `any`\>\>, `next`: `any`) => `void` | `null` |

#### Returns

`void`

#### Defined in

[HotHTTPServer.ts:643](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L643)

___

### shutdown

▸ **shutdown**(): `Promise`<`void`\>

Shutdown the server.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotServer](HotServer.md).[shutdown](HotServer.md#shutdown)

#### Defined in

[HotHTTPServer.ts:937](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L937)

___

### checkIfFileExists

▸ `Static` **checkIfFileExists**(`filepath`): `Promise`<`boolean`\>

Check if a file exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `filepath` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[HotHTTPServer.ts:423](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L423)

___

### getFileUploads

▸ `Static` **getFileUploads**(`req`, `options?`): `Promise`<`Files`\>

Get all files uploaded.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |
| `options` | `any` |

#### Returns

`Promise`<`Files`\>

#### Defined in

[HotHTTPServer.ts:622](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L622)

___

### startServer

▸ `Static` **startServer**(`localStaticPath?`, `httpPort?`, `httpsPort?`, `processor?`): `Promise`<{ `processor`: [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) ; `server`: [`HotHTTPServer`](HotHTTPServer.md)  }\>

Start the server.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `localStaticPath` | `string` \| `StaticRoute`[] | `null` | The public path that contains the HTML, Hott files, images, and all public content. This can also be an array of StaticRoutes. |
| `httpPort` | `number` | `80` | The HTTP port to listen on . |
| `httpsPort` | `number` | `443` | The HTTPS port to listen on. |
| `processor` | [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) | `null` | The HotStaq or parent server being used for communication. |

#### Returns

`Promise`<{ `processor`: [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) ; `server`: [`HotHTTPServer`](HotHTTPServer.md)  }\>

#### Defined in

[HotHTTPServer.ts:904](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotHTTPServer.ts#L904)
