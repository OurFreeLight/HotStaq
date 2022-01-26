[hotstaq](../README.md) / [Modules](../modules.md) / HotTester

# Class: HotTester

Executes tests.

## Hierarchy

- **`HotTester`**

  ↳ [`HotTesterMocha`](HotTesterMocha.md)

  ↳ [`HotTesterMochaSelenium`](HotTesterMochaSelenium.md)

## Table of contents

### Constructors

- [constructor](HotTester.md#constructor)

### Properties

- [baseUrl](HotTester.md#baseurl)
- [driver](HotTester.md#driver)
- [finishedLoading](HotTester.md#finishedloading)
- [hasBeenDestroyed](HotTester.md#hasbeendestroyed)
- [hasBeenSetup](HotTester.md#hasbeensetup)
- [name](HotTester.md#name)
- [processor](HotTester.md#processor)
- [testMaps](HotTester.md#testmaps)

### Methods

- [destroy](HotTester.md#destroy)
- [execute](HotTester.md#execute)
- [executeCommand](HotTester.md#executecommand)
- [executeTestAPIPath](HotTester.md#executetestapipath)
- [executeTestAPIPaths](HotTester.md#executetestapipaths)
- [executeTestPagePath](HotTester.md#executetestpagepath)
- [executeTestPagePaths](HotTester.md#executetestpagepaths)
- [getTestPage](HotTester.md#gettestpage)
- [getTestPath](HotTester.md#gettestpath)
- [onCommand](HotTester.md#oncommand)
- [onExecute](HotTester.md#onexecute)
- [onFinishedLoading](HotTester.md#onfinishedloading)
- [onTestAPIPathEnd](HotTester.md#ontestapipathend)
- [onTestAPIPathStart](HotTester.md#ontestapipathstart)
- [onTestEnd](HotTester.md#ontestend)
- [onTestPagePathEnd](HotTester.md#ontestpagepathend)
- [onTestPagePathStart](HotTester.md#ontestpagepathstart)
- [onTestStart](HotTester.md#onteststart)
- [setup](HotTester.md#setup)
- [waitForData](HotTester.md#waitfordata)
- [interpretDestination](HotTester.md#interpretdestination)

## Constructors

### constructor

• **new HotTester**(`processor`, `name`, `baseUrl`, `driver`, `testMaps?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) |
| `name` | `string` |
| `baseUrl` | `string` |
| `driver` | [`HotTestDriver`](HotTestDriver.md) |
| `testMaps` | `Object` |

#### Defined in

[HotTester.ts:100](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L100)

## Properties

### baseUrl

• **baseUrl**: `string`

The base url that will construct future urls.

#### Defined in

[HotTester.ts:74](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L74)

___

### driver

• **driver**: [`HotTestDriver`](HotTestDriver.md)

The driver to use when running tests.

#### Defined in

[HotTester.ts:86](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L86)

___

### finishedLoading

• **finishedLoading**: `boolean`

Has this tester finished loading?

#### Defined in

[HotTester.ts:90](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L90)

___

### hasBeenDestroyed

• **hasBeenDestroyed**: `boolean`

Has this tester finished setting up?

#### Defined in

[HotTester.ts:98](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L98)

___

### hasBeenSetup

• **hasBeenSetup**: `boolean`

Has this tester finished setting up?

#### Defined in

[HotTester.ts:94](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L94)

___

### name

• **name**: `string`

The tester name.

#### Defined in

[HotTester.ts:70](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L70)

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The associated processor.

#### Defined in

[HotTester.ts:78](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L78)

___

### testMaps

• **testMaps**: `Object`

The test maps to test.

#### Index signature

▪ [name: `string`]: [`HotTestMap`](HotTestMap.md)

#### Defined in

[HotTester.ts:82](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L82)

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Executed when destroying up the tester.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTester.ts:120](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L120)

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

#### Defined in

[HotTester.ts:191](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L191)

___

### onCommand

▸ `Optional` **onCommand**(`destination`, `page`, `stop`, `cmd`, `args`, `cmdFunc`): `Promise`<`void`\>

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

#### Defined in

[HotTester.ts:153](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L153)

___

### onExecute

▸ `Optional` **onExecute**(): `Promise`<`void`\>

Executed when this tester has been executed from the API.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTester.ts:163](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L163)

___

### onFinishedLoading

▸ `Optional` **onFinishedLoading**(): `Promise`<`void`\>

Executed when this tester has finished loading all data from the API.

#### Returns

`Promise`<`void`\>

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

#### Defined in

[HotTester.ts:132](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L132)

___

### onTestEnd

▸ `Optional` **onTestEnd**(`destination`): `Promise`<`void`\>

Executed when tests are finished.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTester.ts:158](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L158)

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

#### Defined in

[HotTester.ts:148](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L148)

___

### onTestPagePathStart

▸ `Optional` **onTestPagePathStart**(`destination`, `page`, `stop`, `continueWhenTestIsComplete?`): `Promise`<`boolean`\>

Executed when page tests are started. If this returns false, the testPath will not be
immediately executed afterwards.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) |
| `stop` | [`HotTestStop`](../interfaces/HotTestStop.md) |
| `continueWhenTestIsComplete?` | `boolean` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[HotTester.ts:143](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L143)

___

### onTestStart

▸ `Optional` **onTestStart**(`destination`, `url`, `destinationKey?`): `Promise`<`boolean`\>

Executed when tests are started. If this returns true, it will
continue and execute all test paths. If this returns it will
skip all test paths and execute onTestEnd instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) |
| `url` | `string` |
| `destinationKey?` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[HotTester.ts:127](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L127)

___

### setup

▸ `Abstract` **setup**(`isWebRoute`, `url`, `destinationKey?`): `Promise`<`void`\>

Executed when setting up the tester.

#### Parameters

| Name | Type |
| :------ | :------ |
| `isWebRoute` | `boolean` |
| `url` | `string` |
| `destinationKey?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTester.ts:116](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L116)

___

### waitForData

▸ **waitForData**(): `Promise`<`void`\>

Waits for the API to finish loading all data.

#### Returns

`Promise`<`void`\>

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

#### Defined in

[HotTester.ts:201](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTester.ts#L201)
