[hotstaq](../README.md) / [Modules](../modules.md) / HotRouteMethod

# Class: HotRouteMethod

An API method to make.

## Implements

- `IHotRouteMethod`

## Table of contents

### Constructors

- [constructor](HotRouteMethod.md#constructor)

### Properties

- [authCredentials](HotRouteMethod.md#authcredentials)
- [description](HotRouteMethod.md#description)
- [executeSetup](HotRouteMethod.md#executesetup)
- [isRegistered](HotRouteMethod.md#isregistered)
- [name](HotRouteMethod.md#name)
- [onClientExecute](HotRouteMethod.md#onclientexecute)
- [onPostRegister](HotRouteMethod.md#onpostregister)
- [onPreRegister](HotRouteMethod.md#onpreregister)
- [onRegister](HotRouteMethod.md#onregister)
- [onServerAuthorize](HotRouteMethod.md#onserverauthorize)
- [onServerExecute](HotRouteMethod.md#onserverexecute)
- [parameters](HotRouteMethod.md#parameters)
- [returns](HotRouteMethod.md#returns)
- [route](HotRouteMethod.md#route)
- [testCases](HotRouteMethod.md#testcases)
- [type](HotRouteMethod.md#type)

### Methods

- [addTestCase](HotRouteMethod.md#addtestcase)

## Constructors

### constructor

• **new HotRouteMethod**(`route`, `name?`, `onExecute?`, `type?`, `onServerAuthorize?`, `onRegister?`, `authCredentials?`, `testCases?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | [`HotRoute`](HotRoute.md) \| `IHotRouteMethod` | `undefined` |
| `name` | `string` | `""` |
| `onExecute` | [`ServerExecutionFunction`](../modules.md#serverexecutionfunction) \| `ClientExecutionFunction` | `null` |
| `type` | [`HTTPMethod`](../enums/HTTPMethod.md) | `HTTPMethod.POST` |
| `onServerAuthorize` | [`ServerAuthorizationFunction`](../modules.md#serverauthorizationfunction) | `null` |
| `onRegister` | `ServerRegistrationFunction` | `null` |
| `authCredentials` | `any` | `null` |
| `testCases` | (`string` \| `TestCaseFunction`)[] \| `TestCaseFunction`[] \| `TestCaseObject`[] \| { [name: string]: `TestCaseObject`;  } | `null` |

#### Defined in

[HotRouteMethod.ts:248](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L248)

## Properties

### authCredentials

• **authCredentials**: `any`

The authorization credentials to be used by the client
when connecting to the server.

#### Implementation of

IHotRouteMethod.authCredentials

#### Defined in

[HotRouteMethod.ts:200](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L200)

___

### description

• **description**: `string`

The description of the api method.

#### Implementation of

IHotRouteMethod.description

#### Defined in

[HotRouteMethod.ts:173](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L173)

___

### executeSetup

• **executeSetup**: `boolean`

Has this method been registered with the server? This
prevents the method from being reregistered.

#### Defined in

[HotRouteMethod.ts:195](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L195)

___

### isRegistered

• **isRegistered**: `boolean`

Has this method been registered with the server? This
prevents the method from being reregistered.

#### Defined in

[HotRouteMethod.ts:190](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L190)

___

### name

• **name**: `string`

The api call name.

#### Implementation of

IHotRouteMethod.name

#### Defined in

[HotRouteMethod.ts:169](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L169)

___

### onClientExecute

• `Optional` **onClientExecute**: `ClientExecutionFunction`

Executes when executing a called method from the client side.

**`fixme`** Is this necessary?

#### Implementation of

IHotRouteMethod.onClientExecute

#### Defined in

[HotRouteMethod.ts:246](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L246)

___

### onPostRegister

• `Optional` **onPostRegister**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Executes after all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Implementation of

IHotRouteMethod.onPostRegister

#### Defined in

[HotRouteMethod.ts:219](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L219)

___

### onPreRegister

• `Optional` **onPreRegister**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Executes before all routes have been registered.

##### Returns

`Promise`<`void`\>

#### Implementation of

IHotRouteMethod.onPreRegister

#### Defined in

[HotRouteMethod.ts:210](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L210)

___

### onRegister

• `Optional` **onRegister**: `ServerRegistrationFunction`

Executes when first registering this method with Express. If
this returns false, the method will not be registered.

#### Implementation of

IHotRouteMethod.onRegister

#### Defined in

[HotRouteMethod.ts:215](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L215)

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

#### Implementation of

IHotRouteMethod.onServerAuthorize

#### Defined in

[HotRouteMethod.ts:230](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L230)

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

#### Implementation of

IHotRouteMethod.onServerExecute

#### Defined in

[HotRouteMethod.ts:241](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L241)

___

### parameters

• **parameters**: `Object`

The parameters in the api method.

#### Index signature

▪ [name: `string`]: `HotRouteMethodParameter`

#### Implementation of

IHotRouteMethod.parameters

#### Defined in

[HotRouteMethod.ts:181](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L181)

___

### returns

• **returns**: `string`

The description of what returns from the api method.

#### Implementation of

IHotRouteMethod.returns

#### Defined in

[HotRouteMethod.ts:177](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L177)

___

### route

• **route**: [`HotRoute`](HotRoute.md)

The parent route.

#### Implementation of

IHotRouteMethod.route

#### Defined in

[HotRouteMethod.ts:165](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L165)

___

### testCases

• **testCases**: `Object`

The test case objects to execute during tests.

#### Index signature

▪ [name: `string`]: `TestCaseObject`

#### Implementation of

IHotRouteMethod.testCases

#### Defined in

[HotRouteMethod.ts:204](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L204)

___

### type

• **type**: [`HTTPMethod`](../enums/HTTPMethod.md)

The api call name.

#### Implementation of

IHotRouteMethod.type

#### Defined in

[HotRouteMethod.ts:185](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L185)

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

[HotRouteMethod.ts:373](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L373)
