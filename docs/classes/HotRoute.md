[hotstaq](../README.md) / [Modules](../modules.md) / HotRoute

# Class: HotRoute

The route to use.

## Table of contents

### Constructors

- [constructor](HotRoute.md#constructor)

### Properties

- [authCredentials](HotRoute.md#authcredentials)
- [connection](HotRoute.md#connection)
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

[HotRoute.ts:46](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L46)

## Properties

### authCredentials

• **authCredentials**: `any`

The authorization credentials to be used by the client
when connecting to the server.

#### Defined in

[HotRoute.ts:35](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L35)

___

### connection

• **connection**: [`HotServer`](HotServer.md) \| [`HotClient`](HotClient.md)

The server that maintains the connections.

#### Defined in

[HotRoute.ts:14](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L14)

___

### errors

• **errors**: `Object`

The errors and their JSON that can be thrown. Can be:
* not_authorized

#### Index signature

▪ [error: `string`]: `any`

#### Defined in

[HotRoute.ts:44](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L44)

___

### logger

• **logger**: [`HotLog`](HotLog.md)

The associated logger.

#### Defined in

[HotRoute.ts:18](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L18)

___

### methods

• **methods**: [`HotRouteMethod`](HotRouteMethod.md)[]

The calls that can be made.

#### Defined in

[HotRoute.ts:39](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L39)

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

[HotRoute.ts:136](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L136)

___

### onPostRegister

• **onPostRegister**: () => `Promise`<`void`\> = `null`

#### Type declaration

▸ (): `Promise`<`void`\>

Executes after all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotRoute.ts:128](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L128)

___

### onPreRegister

• **onPreRegister**: () => `Promise`<`void`\> = `null`

#### Type declaration

▸ (): `Promise`<`void`\>

Executes before all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotRoute.ts:119](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L119)

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

[HotRoute.ts:124](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L124)

___

### prefix

• **prefix**: `string`

The prefix to add to the beginning of each route method.

#### Defined in

[HotRoute.ts:30](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L30)

___

### route

• **route**: `string`

The route.

#### Defined in

[HotRoute.ts:22](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L22)

___

### version

• **version**: `string`

The version.

#### Defined in

[HotRoute.ts:26](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L26)

## Methods

### addMethod

▸ **addMethod**(`method`, `executeFunction?`, `type?`, `testCases?`): `void`

Add an API method to this route.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `method` | `string` \| [`HotRouteMethod`](HotRouteMethod.md) | `undefined` | The name of the method to add. If a HotRouteMethod is supplied, the rest of the arguments supplied will be ignored. |
| `executeFunction` | [`ServerExecutionFunction`](../modules.md#serverexecutionfunction) | `null` | - |
| `type` | [`HTTPMethod`](../enums/HTTPMethod.md) | `HTTPMethod.POST` | - |
| `testCases` | (`string` \| `TestCaseFunction`)[] \| `TestCaseFunction`[] \| `TestCaseObject`[] | `null` | - |

#### Returns

`void`

#### Defined in

[HotRoute.ts:81](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L81)

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

[HotRoute.ts:97](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L97)

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

[HotRoute.ts:70](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotRoute.ts#L70)
