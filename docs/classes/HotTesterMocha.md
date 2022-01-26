[hotstaq](../README.md) / [Modules](../modules.md) / HotTesterMocha

# Class: HotTesterMocha

The tester that uses Mocha to executes all tests.

## Hierarchy

- [`HotTester`](HotTester.md)

  ↳ **`HotTesterMocha`**

## Table of contents

### Constructors

- [constructor](HotTesterMocha.md#constructor)

### Properties

- [afterAll](HotTesterMocha.md#afterall)
- [baseUrl](HotTesterMocha.md#baseurl)
- [beforeAll](HotTesterMocha.md#beforeall)
- [driver](HotTesterMocha.md#driver)
- [finishedLoading](HotTesterMocha.md#finishedloading)
- [hasBeenDestroyed](HotTesterMocha.md#hasbeendestroyed)
- [hasBeenSetup](HotTesterMocha.md#hasbeensetup)
- [mocha](HotTesterMocha.md#mocha)
- [name](HotTesterMocha.md#name)
- [processor](HotTesterMocha.md#processor)
- [suite](HotTesterMocha.md#suite)
- [testMaps](HotTesterMocha.md#testmaps)
- [timeout](HotTesterMocha.md#timeout)

### Methods

- [destroy](HotTesterMocha.md#destroy)
- [execute](HotTesterMocha.md#execute)
- [executeCommand](HotTesterMocha.md#executecommand)
- [executeTestAPIPath](HotTesterMocha.md#executetestapipath)
- [executeTestAPIPaths](HotTesterMocha.md#executetestapipaths)
- [executeTestPagePath](HotTesterMocha.md#executetestpagepath)
- [executeTestPagePaths](HotTesterMocha.md#executetestpagepaths)
- [getTestPage](HotTesterMocha.md#gettestpage)
- [getTestPath](HotTesterMocha.md#gettestpath)
- [onCommand](HotTesterMocha.md#oncommand)
- [onExecute](HotTesterMocha.md#onexecute)
- [onFinishedLoading](HotTesterMocha.md#onfinishedloading)
- [onTestAPIPathEnd](HotTesterMocha.md#ontestapipathend)
- [onTestAPIPathStart](HotTesterMocha.md#ontestapipathstart)
- [onTestEnd](HotTesterMocha.md#ontestend)
- [onTestPagePathEnd](HotTesterMocha.md#ontestpagepathend)
- [onTestPagePathStart](HotTesterMocha.md#ontestpagepathstart)
- [onTestStart](HotTesterMocha.md#onteststart)
- [setup](HotTesterMocha.md#setup)
- [waitForData](HotTesterMocha.md#waitfordata)
- [interpretDestination](HotTesterMocha.md#interpretdestination)

## Constructors

### constructor

• **new HotTesterMocha**(`processor`, `name`, `baseUrl`, `driver`, `testMaps?`, `beforeAll?`, `afterAll?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) | `undefined` |
| `name` | `string` | `undefined` |
| `baseUrl` | `string` | `undefined` |
| `driver` | [`HotTestDriver`](HotTestDriver.md) | `undefined` |
| `testMaps` | `Object` | `{}` |
| `beforeAll` | () => `Promise`<`void`\> | `null` |
| `afterAll` | () => `Promise`<`void`\> | `null` |

#### Overrides

[HotTester](HotTester.md).[constructor](HotTester.md#constructor)

#### Defined in

[HotTesterMocha.ts:35](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L35)

## Properties

### afterAll

• **afterAll**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

The Mocha afterAll event to call before any tests are executed.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterMocha.ts:33](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L33)

___

### baseUrl

• **baseUrl**: `string`

The base url that will construct future urls.

#### Inherited from

[HotTester](HotTester.md).[baseUrl](HotTester.md#baseurl)

#### Defined in

[HotTester.ts:74](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L74)

___

### beforeAll

• **beforeAll**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

The Mocha beforeAll event to call before any tests are executed.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterMocha.ts:29](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L29)

___

### driver

• **driver**: [`HotTestDriver`](HotTestDriver.md)

The driver to use when running tests.

#### Inherited from

[HotTester](HotTester.md).[driver](HotTester.md#driver)

#### Defined in

[HotTester.ts:86](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L86)

___

### finishedLoading

• **finishedLoading**: `boolean`

Has this tester finished loading?

#### Inherited from

[HotTester](HotTester.md).[finishedLoading](HotTester.md#finishedloading)

#### Defined in

[HotTester.ts:90](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L90)

___

### hasBeenDestroyed

• **hasBeenDestroyed**: `boolean`

Has this tester finished setting up?

#### Inherited from

[HotTester](HotTester.md).[hasBeenDestroyed](HotTester.md#hasbeendestroyed)

#### Defined in

[HotTester.ts:98](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L98)

___

### hasBeenSetup

• **hasBeenSetup**: `boolean`

Has this tester finished setting up?

#### Inherited from

[HotTester](HotTester.md).[hasBeenSetup](HotTester.md#hasbeensetup)

#### Defined in

[HotTester.ts:94](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L94)

___

### mocha

• **mocha**: `Mocha`

The mocha instance to run.

#### Defined in

[HotTesterMocha.ts:17](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L17)

___

### name

• **name**: `string`

The tester name.

#### Inherited from

[HotTester](HotTester.md).[name](HotTester.md#name)

#### Defined in

[HotTester.ts:70](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L70)

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The associated processor.

#### Inherited from

[HotTester](HotTester.md).[processor](HotTester.md#processor)

#### Defined in

[HotTester.ts:78](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L78)

___

### suite

• **suite**: `Suite`

The suite to execute.

#### Defined in

[HotTesterMocha.ts:25](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L25)

___

### testMaps

• **testMaps**: `Object`

The test maps to test.

#### Index signature

▪ [name: `string`]: [`HotTestMap`](HotTestMap.md)

#### Inherited from

[HotTester](HotTester.md).[testMaps](HotTester.md#testmaps)

#### Defined in

[HotTester.ts:82](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L82)

___

### timeout

• **timeout**: `number`

The timeout for each test.

#### Defined in

[HotTesterMocha.ts:21](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L21)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Executed when destroying up the tester.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[destroy](HotTester.md#destroy)

#### Defined in

[HotTesterMocha.ts:58](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L58)

___

### execute

▸ **execute**(`mapName`): `Promise`<`void`\>

Execute the tests.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapName` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[execute](HotTester.md#execute)

#### Defined in

[HotTester.ts:561](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L561)

___

### executeCommand

▸ **executeCommand**(`destination`, `page`, `stop`, `cmd`): `Promise`<`void`\>

Execute a command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) |
| `stop` | [`HotTestStop`](../interfaces/HotTestStop.md) |
| `cmd` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[executeCommand](HotTester.md#executecommand)

#### Defined in

[HotTester.ts:380](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L380)

___

### executeTestAPIPath

▸ **executeTestAPIPath**(`destination`, `method`, `testName`, `skipEventCalls?`, `continueWhenTestIsComplete?`): `Promise`<`any`\>

Execute an API's test path.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `method` | [`HotRouteMethod`](HotRouteMethod.md) | `undefined` |
| `testName` | `string` | `undefined` |
| `skipEventCalls` | `boolean` | `false` |
| `continueWhenTestIsComplete` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[HotTester](HotTester.md).[executeTestAPIPath](HotTester.md#executetestapipath)

#### Defined in

[HotTester.ts:256](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L256)

___

### executeTestAPIPaths

▸ **executeTestAPIPaths**(`destination`): `Promise`<`any`[]\>

Execute all test paths in an API route.

**`fixme`** This needs a better implementation...

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[HotTester](HotTester.md).[executeTestAPIPaths](HotTester.md#executetestapipaths)

#### Defined in

[HotTester.ts:294](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L294)

___

### executeTestPagePath

▸ **executeTestPagePath**(`destination`, `stop`, `skipEventCalls?`, `continueWhenTestIsComplete?`): `Promise`<`any`\>

Execute a test page path.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `stop` | [`HotTestStop`](../interfaces/HotTestStop.md) | `undefined` |
| `skipEventCalls` | `boolean` | `false` |
| `continueWhenTestIsComplete` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[HotTester](HotTester.md).[executeTestPagePath](HotTester.md#executetestpagepath)

#### Defined in

[HotTester.ts:329](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L329)

___

### executeTestPagePaths

▸ **executeTestPagePaths**(`destination`, `continueWhenTestIsComplete?`): `Promise`<`any`[]\>

Execute all test paths in a page.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `continueWhenTestIsComplete` | `boolean` | `false` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[HotTester](HotTester.md).[executeTestPagePaths](HotTester.md#executetestpagepaths)

#### Defined in

[HotTester.ts:515](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L515)

___

### getTestPage

▸ **getTestPage**(`destination`): [`HotTestPage`](../interfaces/HotTestPage.md)

Get a test page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |

#### Returns

[`HotTestPage`](../interfaces/HotTestPage.md)

#### Inherited from

[HotTester](HotTester.md).[getTestPage](HotTester.md#gettestpage)

#### Defined in

[HotTester.ts:181](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L181)

___

### getTestPath

▸ **getTestPath**(`destination`, `pathName`): [`HotTestPath`](../modules.md#hottestpath)

Get a test path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `pathName` | `string` |

#### Returns

[`HotTestPath`](../modules.md#hottestpath)

#### Inherited from

[HotTester](HotTester.md).[getTestPath](HotTester.md#gettestpath)

#### Defined in

[HotTester.ts:191](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L191)

___

### onCommand

▸ **onCommand**(`destination`, `page`, `stop`, `cmd`, `args`, `cmdFunc`): `Promise`<`void`\>

Executed when a command is executed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) |
| `stop` | [`HotTestStop`](../interfaces/HotTestStop.md) |
| `cmd` | `string` |
| `args` | `string`[] |
| `cmdFunc` | (`cmdArgs`: `string`[]) => `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[onCommand](HotTester.md#oncommand)

#### Defined in

[HotTesterMocha.ts:111](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L111)

___

### onExecute

▸ `Optional` **onExecute**(): `Promise`<`void`\>

Executed when this tester has been executed from the API.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onExecute](HotTester.md#onexecute)

#### Defined in

[HotTester.ts:163](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L163)

___

### onFinishedLoading

▸ `Optional` **onFinishedLoading**(): `Promise`<`void`\>

Executed when this tester has finished loading all data from the API.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onFinishedLoading](HotTester.md#onfinishedloading)

#### Defined in

[HotTester.ts:167](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L167)

___

### onTestAPIPathEnd

▸ `Optional` **onTestAPIPathEnd**(`destination`, `method`, `testName`, `result`, `continueWhenTestIsComplete?`): `Promise`<`void`\>

Executed when an API test path has ended.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `method` | [`HotRouteMethod`](HotRouteMethod.md) |
| `testName` | `string` |
| `result` | `any` |
| `continueWhenTestIsComplete?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onTestAPIPathEnd](HotTester.md#ontestapipathend)

#### Defined in

[HotTester.ts:137](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L137)

___

### onTestAPIPathStart

▸ `Optional` **onTestAPIPathStart**(`destination`, `method`, `testName`, `continueWhenTestIsComplete?`): `Promise`<`boolean`\>

Executed when an API test path has started. If this returns false,
the testPath will not be immediately executed afterwards.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `method` | [`HotRouteMethod`](HotRouteMethod.md) |
| `testName` | `string` |
| `continueWhenTestIsComplete?` | `boolean` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[HotTester](HotTester.md).[onTestAPIPathStart](HotTester.md#ontestapipathstart)

#### Defined in

[HotTester.ts:132](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L132)

___

### onTestEnd

▸ **onTestEnd**(`destination`): `Promise`<`void`\>

Executed when tests are finished.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[onTestEnd](HotTester.md#ontestend)

#### Defined in

[HotTesterMocha.ts:120](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L120)

___

### onTestPagePathEnd

▸ `Optional` **onTestPagePathEnd**(`destination`, `testPath`, `result`, `continueWhenTestIsComplete?`): `Promise`<`void`\>

Executed when a page test has ended.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `testPath` | [`HotTestPath`](../modules.md#hottestpath) |
| `result` | `any` |
| `continueWhenTestIsComplete?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onTestPagePathEnd](HotTester.md#ontestpagepathend)

#### Defined in

[HotTester.ts:148](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L148)

___

### onTestPagePathStart

▸ **onTestPagePathStart**(`destination`, `page`, `stop`, `continueWhenTestIsComplete?`): `Promise`<`boolean`\>

Executed when page tests are started. If this returns false, the testPath will not be
immediately executed afterwards.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) | `undefined` |
| `stop` | [`HotTestStop`](../interfaces/HotTestStop.md) | `undefined` |
| `continueWhenTestIsComplete` | `boolean` | `false` |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[HotTester](HotTester.md).[onTestPagePathStart](HotTester.md#ontestpagepathstart)

#### Defined in

[HotTesterMocha.ts:82](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L82)

___

### onTestStart

▸ **onTestStart**(`destination`, `destinationKey?`): `Promise`<`boolean`\>

Executed when tests are started.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `destinationKey` | `string` | `""` |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[HotTester](HotTester.md).[onTestStart](HotTester.md#onteststart)

#### Defined in

[HotTesterMocha.ts:65](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L65)

___

### setup

▸ **setup**(): `Promise`<`void`\>

Executed when setting up the tester.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[setup](HotTester.md#setup)

#### Defined in

[HotTesterMocha.ts:51](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTesterMocha.ts#L51)

___

### waitForData

▸ **waitForData**(): `Promise`<`void`\>

Waits for the API to finish loading all data.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[waitForData](HotTester.md#waitfordata)

#### Defined in

[HotTester.ts:172](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L172)

___

### interpretDestination

▸ `Static` **interpretDestination**(`mapName`, `testDest`): [`HotDestination`](../interfaces/HotDestination.md)

Get a destination JSON object to use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapName` | `string` |
| `testDest` | [`HotTestDestination`](HotTestDestination.md) |

#### Returns

[`HotDestination`](../interfaces/HotDestination.md)

#### Inherited from

[HotTester](HotTester.md).[interpretDestination](HotTester.md#interpretdestination)

#### Defined in

[HotTester.ts:201](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L201)
