[hotstaq](../README.md) / [Modules](../modules.md) / HotRouteMethod

# Class: HotRouteMethod

An API method to make.

## Table of contents

### Constructors

- [constructor](HotRouteMethod.md#constructor)

### Properties

- [authCredentials](HotRouteMethod.md#authcredentials)
- [executeSetup](HotRouteMethod.md#executesetup)
- [isRegistered](HotRouteMethod.md#isregistered)
- [name](HotRouteMethod.md#name)
- [onClientExecute](HotRouteMethod.md#onclientexecute)
- [onPostRegister](HotRouteMethod.md#onpostregister)
- [onPreRegister](HotRouteMethod.md#onpreregister)
- [onRegister](HotRouteMethod.md#onregister)
- [onServerAuthorize](HotRouteMethod.md#onserverauthorize)
- [onServerExecute](HotRouteMethod.md#onserverexecute)
- [parentRoute](HotRouteMethod.md#parentroute)
- [testCases](HotRouteMethod.md#testcases)
- [type](HotRouteMethod.md#type)

### Methods

- [addTestCase](HotRouteMethod.md#addtestcase)

## Constructors

### constructor

• **new HotRouteMethod**(`route`, `name`, `onExecute?`, `type?`, `onServerAuthorize?`, `onRegister?`, `authCredentials?`, `testCases?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | [`HotRoute`](HotRoute.md) | `undefined` |
| `name` | `string` | `undefined` |
| `onExecute` | [`ServerExecutionFunction`](../modules.md#serverexecutionfunction) \| `ClientExecutionFunction` | `null` |
| `type` | [`HTTPMethod`](../enums/HTTPMethod.md) | `HTTPMethod.POST` |
| `onServerAuthorize` | [`ServerAuthorizationFunction`](../modules.md#serverauthorizationfunction) | `null` |
| `onRegister` | `ServerRegistrationFunction` | `null` |
| `authCredentials` | `any` | `null` |
| `testCases` | (`string` \| `TestCaseFunction`)[] \| `TestCaseFunction`[] \| `TestCaseObject`[] | `null` |

#### Defined in

HotRouteMethod.ts:95

## Properties

### authCredentials

• **authCredentials**: `any`

The authorization credentials to be used by the client
when connecting to the server.

#### Defined in

HotRouteMethod.ts:87

___

### executeSetup

• **executeSetup**: `boolean`

Has this method been registered with the server? This
prevents the method from being reregistered.

#### Defined in

HotRouteMethod.ts:82

___

### isRegistered

• **isRegistered**: `boolean`

Has this method been registered with the server? This
prevents the method from being reregistered.

#### Defined in

HotRouteMethod.ts:77

___

### name

• **name**: `string`

The api call name.

#### Defined in

HotRouteMethod.ts:68

___

### onClientExecute

• `Optional` **onClientExecute**: `ClientExecutionFunction`

Executes when executing a called method from the client side.

**`fixme`** Is this necessary?

#### Defined in

HotRouteMethod.ts:178

___

### onPostRegister

• `Optional` **onPostRegister**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Executes after all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

HotRouteMethod.ts:151

___

### onPreRegister

• `Optional` **onPreRegister**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Executes before all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Defined in

HotRouteMethod.ts:142

___

### onRegister

• `Optional` **onRegister**: `ServerRegistrationFunction`

Executes when first registering this method with Express. If
this returns false, the method will not be registered.

#### Defined in

HotRouteMethod.ts:147

___

### onServerAuthorize

• `Optional` **onServerAuthorize**: [`ServerAuthorizationFunction`](../modules.md#serverauthorizationfunction)

Executes when authorizing a called method. If this method
is set, this will not call onAuthorize for the parent HotRoute.
The value returned from here will be passed to onExecute.
Undefined returning from here will mean the authorization failed.
If any exceptions are thrown from this function, they will be sent
to the server as an { error: string; } object with the exception
message as the error.

#### Defined in

HotRouteMethod.ts:162

___

### onServerExecute

• `Optional` **onServerExecute**: [`ServerExecutionFunction`](../modules.md#serverexecutionfunction)

Executes when executing a called method from the server side.
This will stringify any JSON object and send it as a JSON response.
If undefined is returned no response will be sent to the server.
So the developer would have to send a response using "res".
If any exceptions are thrown from this function, they will be sent
to the server as an { error: string; } object with the exception
message as the error.

#### Defined in

HotRouteMethod.ts:173

___

### parentRoute

• **parentRoute**: [`HotRoute`](HotRoute.md)

The parent route.

#### Defined in

HotRouteMethod.ts:64

___

### testCases

• **testCases**: `Object`

The test case objects to execute during tests.

#### Index signature

▪ [name: `string`]: `TestCaseObject`

#### Defined in

HotRouteMethod.ts:91

___

### type

• **type**: [`HTTPMethod`](../enums/HTTPMethod.md)

The api call name.

#### Defined in

HotRouteMethod.ts:72

## Methods

### addTestCase

▸ **addTestCase**(`newTestCase`, `testCaseFunction?`): `void`

Add a new test case.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `newTestCase` | `string` \| `TestCaseFunction` \| `TestCaseObject` | `undefined` |
| `testCaseFunction` | `TestCaseFunction` | `null` |

#### Returns

`void`

#### Defined in

HotRouteMethod.ts:183
