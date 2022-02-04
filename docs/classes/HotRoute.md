[hotstaq](../README.md) / [Modules](../modules.md) / HotRoute

# Class: HotRoute

The route to use.

## Table of contents

### Constructors

- [constructor](HotRoute.md#constructor)

### Properties

- [authCredentials](HotRoute.md#authcredentials)
- [connection](HotRoute.md#connection)
- [description](HotRoute.md#description)
- [errors](HotRoute.md#errors)
- [logger](HotRoute.md#logger)
- [methods](HotRoute.md#methods)
- [onAuthorizeUser](HotRoute.md#onauthorizeuser)
- [onPostRegister](HotRoute.md#onpostregister)
- [onPreRegister](HotRoute.md#onpreregister)
- [onRegister](HotRoute.md#onregister)
- [prefix](HotRoute.md#prefix)
- [route](HotRoute.md#route)
- [version](HotRoute.md#version)

### Methods

- [addMethod](HotRoute.md#addmethod)
- [getMethod](HotRoute.md#getmethod)
- [createError](HotRoute.md#createerror)

## Constructors

### constructor

• **new HotRoute**(`connection`, `route`, `methods?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `connection` | [`HotServer`](HotServer.md) \| [`HotClient`](HotClient.md) | `undefined` |
| `route` | `string` | `undefined` |
| `methods` | [`HotRouteMethod`](HotRouteMethod.md)[] | `[]` |

#### Defined in

[HotRoute.ts:51](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L51)

## Properties

### authCredentials

• **authCredentials**: `any`

The authorization credentials to be used by the client
when connecting to the server.

#### Defined in

[HotRoute.ts:39](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L39)

___

### connection

• **connection**: [`HotServer`](HotServer.md) \| [`HotClient`](HotClient.md)

The server that maintains the connections.

#### Defined in

[HotRoute.ts:14](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L14)

___

### description

• **description**: `string`

The description of the route.

#### Defined in

[HotRoute.ts:26](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L26)

___

### errors

• **errors**: `Object`

The errors and their JSON that can be thrown. Can be:
* not_authorized
* no_server_execute_function

#### Index signature

▪ [error: `string`]: `any`

#### Defined in

[HotRoute.ts:49](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L49)

___

### logger

• **logger**: [`HotLog`](HotLog.md)

The associated logger.

#### Defined in

[HotRoute.ts:18](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L18)

___

### methods

• **methods**: [`HotRouteMethod`](HotRouteMethod.md)[]

The calls that can be made.

#### Defined in

[HotRoute.ts:43](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L43)

___

### onAuthorizeUser

• **onAuthorizeUser**: (`req`: `any`, `res`: `any`) => `Promise`<`any`\> = `null`

#### Type declaration

▸ (`req`, `res`): `Promise`<`any`\>

Executes when authorizing a called method.
The value returned from here will be passed to onExecute in the
called HotRouteMethod. Undefined returning from here will mean
the authorization failed.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[HotRoute.ts:152](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L152)

___

### onPostRegister

• **onPostRegister**: () => `Promise`<`void`\> = `null`

#### Type declaration

▸ (): `Promise`<`void`\>

Executes after all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotRoute.ts:144](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L144)

___

### onPreRegister

• **onPreRegister**: () => `Promise`<`void`\> = `null`

#### Type declaration

▸ (): `Promise`<`void`\>

Executes before all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotRoute.ts:135](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L135)

___

### onRegister

• **onRegister**: () => `Promise`<`boolean`\> = `null`

#### Type declaration

▸ (): `Promise`<`boolean`\>

Executes when first registering this route with Express. If
this returns false, the route will not be registered.

##### Returns

`Promise`<`boolean`\>

#### Defined in

[HotRoute.ts:140](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L140)

___

### prefix

• **prefix**: `string`

The prefix to add to the beginning of each route method.

#### Defined in

[HotRoute.ts:34](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L34)

___

### route

• **route**: `string`

The route.

#### Defined in

[HotRoute.ts:22](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L22)

___

### version

• **version**: `string`

The version.

#### Defined in

[HotRoute.ts:30](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L30)

## Methods

### addMethod

▸ **addMethod**(`method`, `executeFunction?`, `type?`, `testCases?`): `void`

Add an API method to this route.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `method` | `string` \| [`HotRouteMethod`](HotRouteMethod.md) \| `IHotRouteMethod` | `undefined` | The name of the method to add. If a HotRouteMethod is supplied, the rest of the arguments supplied will be ignored. |
| `executeFunction` | [`ServerExecutionFunction`](../modules.md#serverexecutionfunction) | `null` | - |
| `type` | [`HTTPMethod`](../enums/HTTPMethod.md) | `HTTPMethod.POST` | - |
| `testCases` | (`string` \| `TestCaseFunction`)[] \| `TestCaseFunction`[] \| `TestCaseObject`[] | `null` | - |

#### Returns

`void`

#### Defined in

[HotRoute.ts:88](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L88)

___

### getMethod

▸ **getMethod**(`name`): [`HotRouteMethod`](HotRouteMethod.md)

Get a method by it's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`HotRouteMethod`](HotRouteMethod.md)

#### Defined in

[HotRoute.ts:113](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L113)

___

### createError

▸ `Static` **createError**(`message`): `any`

Create an error JSON object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`any`

#### Defined in

[HotRoute.ts:77](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotRoute.ts#L77)
