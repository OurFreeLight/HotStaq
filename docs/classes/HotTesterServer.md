[hotstaq](../README.md) / [Modules](../modules.md) / HotTesterServer

# Class: HotTesterServer

An API server for use during testing.

## Hierarchy

- [`HotServer`](HotServer.md)

  ↳ **`HotTesterServer`**

## Table of contents

### Constructors

- [constructor](HotTesterServer.md#constructor)

### Properties

- [api](HotTesterServer.md#api)
- [expressApp](HotTesterServer.md#expressapp)
- [httpListener](HotTesterServer.md#httplistener)
- [httpsListener](HotTesterServer.md#httpslistener)
- [listenAddress](HotTesterServer.md#listenaddress)
- [logger](HotTesterServer.md#logger)
- [ports](HotTesterServer.md#ports)
- [processor](HotTesterServer.md#processor)
- [redirectHTTPtoHTTPS](HotTesterServer.md#redirecthttptohttps)
- [routes](HotTesterServer.md#routes)
- [secrets](HotTesterServer.md#secrets)
- [serverType](HotTesterServer.md#servertype)
- [ssl](HotTesterServer.md#ssl)
- [type](HotTesterServer.md#type)

### Methods

- [addRoute](HotTesterServer.md#addroute)
- [addTester](HotTesterServer.md#addtester)
- [clearErrorHandlingRoutes](HotTesterServer.md#clearerrorhandlingroutes)
- [executeAllAPITests](HotTesterServer.md#executeallapitests)
- [executeAllWebTests](HotTesterServer.md#executeallwebtests)
- [executeTests](HotTesterServer.md#executetests)
- [listen](HotTesterServer.md#listen)
- [preregisterRoute](HotTesterServer.md#preregisterroute)
- [registerRoute](HotTesterServer.md#registerroute)
- [setAPI](HotTesterServer.md#setapi)
- [setErrorHandlingRoutes](HotTesterServer.md#seterrorhandlingroutes)
- [setupTesterAPI](HotTesterServer.md#setuptesterapi)
- [shutdown](HotTesterServer.md#shutdown)
- [checkIfFileExists](HotTesterServer.md#checkiffileexists)
- [startServer](HotTesterServer.md#startserver)

## Constructors

### constructor

• **new HotTesterServer**(`processor`, `httpPort?`, `httpsPort?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) | `undefined` |
| `httpPort` | `number` | `null` |
| `httpsPort` | `number` | `null` |

#### Overrides

[HotServer](HotServer.md).[constructor](HotServer.md#constructor)

#### Defined in

[HotTesterServer.ts:55](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L55)

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

[HotTesterServer.ts:26](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L26)

___

### httpListener

• **httpListener**: `Server`

The HTTP listener to use.

#### Defined in

[HotTesterServer.ts:30](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L30)

___

### httpsListener

• **httpsListener**: `Server`

The HTTPS listener to use.

#### Defined in

[HotTesterServer.ts:34](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L34)

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

[HotTesterServer.ts:40](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L40)

___

### secrets

• **secrets**: `any`

Any secrets associated with this server.

#### Inherited from

[HotServer](HotServer.md).[secrets](HotServer.md#secrets)

#### Defined in

[HotServer.ts:138](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L138)

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

[HotTesterServer.ts:177](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L177)

___

### addTester

▸ **addTester**(`tester`): `void`

Add a tester for use later.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tester` | [`HotTester`](HotTester.md) |

#### Returns

`void`

#### Defined in

[HotTesterServer.ts:143](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L143)

___

### clearErrorHandlingRoutes

▸ **clearErrorHandlingRoutes**(): `void`

Clear the last two express routes, which are reserved for the
error handlers.

#### Returns

`void`

#### Defined in

[HotTesterServer.ts:397](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L397)

___

### executeAllAPITests

▸ **executeAllAPITests**(`testerName`): `Promise`<`void`\>

Execute all api tests for all maps in the HotSite testing api object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testerName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterServer.ts:169](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L169)

___

### executeAllWebTests

▸ **executeAllWebTests**(`testerName`): `Promise`<`void`\>

Execute all web tests for all maps in the HotSite testing web object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testerName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterServer.ts:161](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L161)

___

### executeTests

▸ **executeTests**(`testerName`, `mapName`): `Promise`<`void`\>

Execute tests.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testerName` | `string` |
| `mapName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterServer.ts:152](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L152)

___

### listen

▸ **listen**(): `Promise`<`void`\>

Start listening for requests.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotServer](HotServer.md).[listen](HotServer.md#listen)

#### Defined in

[HotTesterServer.ts:425](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L425)

___

### preregisterRoute

▸ **preregisterRoute**(): `void`

The routes to add before registering a route.

#### Returns

`void`

#### Defined in

[HotTesterServer.ts:334](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L334)

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

[HotTesterServer.ts:193](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L193)

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

[HotTesterServer.ts:357](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L357)

___

### setupTesterAPI

▸ **setupTesterAPI**(`baseUrl`): `Promise`<`void`\>

Setup the tester api.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseUrl` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterServer.ts:505](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L505)

___

### shutdown

▸ **shutdown**(): `Promise`<`void`\>

Shutdown the server.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotServer](HotServer.md).[shutdown](HotServer.md#shutdown)

#### Defined in

[HotTesterServer.ts:546](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L546)

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

[HotTesterServer.ts:317](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L317)

___

### startServer

▸ `Static` **startServer**(`baseUrl?`, `httpPort?`, `httpsPort?`, `processor?`, `logLevel?`): `Promise`<{ `processor`: [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) ; `server`: [`HotTesterServer`](HotTesterServer.md)  }\>

Start the server.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `baseUrl` | `string` | `undefined` | - |
| `httpPort` | `number` | `8182` | The HTTP port to listen on. |
| `httpsPort` | `number` | `4142` | The HTTPS port to listen on. |
| `processor` | [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) | `null` | The HotStaq or parent server being used for communication. |
| `logLevel` | [`HotLogLevel`](../enums/HotLogLevel.md) | `HotLogLevel.Info` | - |

#### Returns

`Promise`<{ `processor`: [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) ; `server`: [`HotTesterServer`](HotTesterServer.md)  }\>

#### Defined in

[HotTesterServer.ts:520](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTesterServer.ts#L520)
