[hotstaq](../README.md) / [Modules](../modules.md) / HotServer

# Class: HotServer

The server.

## Hierarchy

- **`HotServer`**

  ↳ [`HotHTTPServer`](HotHTTPServer.md)

  ↳ [`HotTesterServer`](HotTesterServer.md)

## Implements

- `IHotServer`

## Table of contents

### Constructors

- [constructor](HotServer.md#constructor)

### Properties

- [api](HotServer.md#api)
- [listenAddress](HotServer.md#listenaddress)
- [logger](HotServer.md#logger)
- [ports](HotServer.md#ports)
- [processor](HotServer.md#processor)
- [redirectHTTPtoHTTPS](HotServer.md#redirecthttptohttps)
- [secrets](HotServer.md#secrets)
- [serverType](HotServer.md#servertype)
- [ssl](HotServer.md#ssl)
- [type](HotServer.md#type)

### Methods

- [listen](HotServer.md#listen)
- [registerRoute](HotServer.md#registerroute)
- [setAPI](HotServer.md#setapi)
- [shutdown](HotServer.md#shutdown)

## Constructors

### constructor

• **new HotServer**(`processor`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) \| [`HotServer`](HotServer.md) |

#### Defined in

[HotServer.ts:140](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L140)

## Properties

### api

• **api**: [`HotAPI`](HotAPI.md)

The API to use.

#### Implementation of

IHotServer.api

#### Defined in

[HotServer.ts:94](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L94)

___

### listenAddress

• **listenAddress**: `string`

The network address to listen on.

#### Implementation of

IHotServer.listenAddress

#### Defined in

[HotServer.ts:98](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L98)

___

### logger

• **logger**: [`HotLog`](HotLog.md)

The logger.

#### Implementation of

IHotServer.logger

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

#### Implementation of

IHotServer.ports

#### Defined in

[HotServer.ts:102](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L102)

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The processor to use.

#### Implementation of

IHotServer.processor

#### Defined in

[HotServer.ts:86](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L86)

___

### redirectHTTPtoHTTPS

• **redirectHTTPtoHTTPS**: `boolean`

Redirect HTTP traffic to HTTPS.

#### Implementation of

IHotServer.redirectHTTPtoHTTPS

#### Defined in

[HotServer.ts:126](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L126)

___

### secrets

• **secrets**: `any`

Any secrets associated with this server.

#### Implementation of

IHotServer.secrets

#### Defined in

[HotServer.ts:138](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L138)

___

### serverType

• **serverType**: `string`

The server type.

#### Implementation of

IHotServer.serverType

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

#### Implementation of

IHotServer.ssl

#### Defined in

[HotServer.ts:109](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L109)

___

### type

• **type**: `HotServerType`

The type of server.

#### Implementation of

IHotServer.type

#### Defined in

[HotServer.ts:130](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L130)

## Methods

### listen

▸ `Optional` **listen**(): `Promise`<`void`\>

Start listening for requests.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotServer.ts:205](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L205)

___

### registerRoute

▸ `Optional` **registerRoute**(`route`): `Promise`<`void`\>

Register a route with the server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | [`HotRoute`](HotRoute.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotServer.ts:200](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L200)

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

#### Defined in

[HotServer.ts:188](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L188)

___

### shutdown

▸ `Optional` **shutdown**(): `Promise`<`void`\>

Shutdown the server.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotServer.ts:210](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotServer.ts#L210)
