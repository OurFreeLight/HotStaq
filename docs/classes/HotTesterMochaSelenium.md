[hotstaq](../README.md) / [Modules](../modules.md) / HotTesterMochaSelenium

# Class: HotTesterMochaSelenium

The tester that uses Mocha to executes all tests.

## Hierarchy

- [`HotTester`](HotTester.md)

  ↳ **`HotTesterMochaSelenium`**

## Table of contents

### Constructors

- [constructor](HotTesterMochaSelenium.md#constructor)

### Properties

- [afterAll](HotTesterMochaSelenium.md#afterall)
- [baseUrl](HotTesterMochaSelenium.md#baseurl)
- [beforeAll](HotTesterMochaSelenium.md#beforeall)
- [driver](HotTesterMochaSelenium.md#driver)
- [finishedLoading](HotTesterMochaSelenium.md#finishedloading)
- [hasBeenDestroyed](HotTesterMochaSelenium.md#hasbeendestroyed)
- [hasBeenSetup](HotTesterMochaSelenium.md#hasbeensetup)
- [mocha](HotTesterMochaSelenium.md#mocha)
- [name](HotTesterMochaSelenium.md#name)
- [onSetup](HotTesterMochaSelenium.md#onsetup)
- [processor](HotTesterMochaSelenium.md#processor)
- [suite](HotTesterMochaSelenium.md#suite)
- [testMaps](HotTesterMochaSelenium.md#testmaps)
- [timeout](HotTesterMochaSelenium.md#timeout)
- [waitForTesterData](HotTesterMochaSelenium.md#waitfortesterdata)

### Methods

- [destroy](HotTesterMochaSelenium.md#destroy)
- [execute](HotTesterMochaSelenium.md#execute)
- [executeCommand](HotTesterMochaSelenium.md#executecommand)
- [executeTestAPIPath](HotTesterMochaSelenium.md#executetestapipath)
- [executeTestAPIPaths](HotTesterMochaSelenium.md#executetestapipaths)
- [executeTestPagePath](HotTesterMochaSelenium.md#executetestpagepath)
- [executeTestPagePaths](HotTesterMochaSelenium.md#executetestpagepaths)
- [getTestPage](HotTesterMochaSelenium.md#gettestpage)
- [getTestPath](HotTesterMochaSelenium.md#gettestpath)
- [onCommand](HotTesterMochaSelenium.md#oncommand)
- [onExecute](HotTesterMochaSelenium.md#onexecute)
- [onFinishedLoading](HotTesterMochaSelenium.md#onfinishedloading)
- [onTestAPIPathEnd](HotTesterMochaSelenium.md#ontestapipathend)
- [onTestAPIPathStart](HotTesterMochaSelenium.md#ontestapipathstart)
- [onTestEnd](HotTesterMochaSelenium.md#ontestend)
- [onTestPagePathEnd](HotTesterMochaSelenium.md#ontestpagepathend)
- [onTestPagePathStart](HotTesterMochaSelenium.md#ontestpagepathstart)
- [onTestStart](HotTesterMochaSelenium.md#onteststart)
- [setup](HotTesterMochaSelenium.md#setup)
- [waitForData](HotTesterMochaSelenium.md#waitfordata)
- [interpretDestination](HotTesterMochaSelenium.md#interpretdestination)

## Constructors

### constructor

• **new HotTesterMochaSelenium**(`processor`, `name`, `baseUrl`, `testMaps?`, `onSetup?`, `beforeAll?`, `afterAll?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) | `undefined` |
| `name` | `string` | `undefined` |
| `baseUrl` | `string` | `undefined` |
| `testMaps` | `Object` | `{}` |
| `onSetup` | (`driver`: `WebDriver`) => `Promise`<`boolean`\> | `null` |
| `beforeAll` | () => `Promise`<`void`\> | `null` |
| `afterAll` | () => `Promise`<`void`\> | `null` |

#### Overrides

[HotTester](HotTester.md).[constructor](HotTester.md#constructor)

#### Defined in

[HotTesterMochaSelenium.ts:52](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L52)

## Properties

### afterAll

• **afterAll**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

The Mocha afterAll event to call before any tests are executed.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterMochaSelenium.ts:39](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L39)

___

### baseUrl

• **baseUrl**: `string`

The base url that will construct future urls.

#### Inherited from

[HotTester](HotTester.md).[baseUrl](HotTester.md#baseurl)

#### Defined in

[HotTester.ts:74](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L74)

___

### beforeAll

• **beforeAll**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

The Mocha beforeAll event to call before any tests are executed.

##### Returns

`Promise`<`void`\>

#### Defined in

[HotTesterMochaSelenium.ts:35](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L35)

___

### driver

• **driver**: [`HotTestSeleniumDriver`](HotTestSeleniumDriver.md)

The driver to use when running tests.

#### Overrides

[HotTester](HotTester.md).[driver](HotTester.md#driver)

#### Defined in

[HotTesterMochaSelenium.ts:19](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L19)

___

### finishedLoading

• **finishedLoading**: `boolean`

Has this tester finished loading?

#### Inherited from

[HotTester](HotTester.md).[finishedLoading](HotTester.md#finishedloading)

#### Defined in

[HotTester.ts:90](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L90)

___

### hasBeenDestroyed

• **hasBeenDestroyed**: `boolean`

Has this tester finished setting up?

#### Inherited from

[HotTester](HotTester.md).[hasBeenDestroyed](HotTester.md#hasbeendestroyed)

#### Defined in

[HotTester.ts:98](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L98)

___

### hasBeenSetup

• **hasBeenSetup**: `boolean`

Has this tester finished setting up?

#### Inherited from

[HotTester](HotTester.md).[hasBeenSetup](HotTester.md#hasbeensetup)

#### Defined in

[HotTester.ts:94](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L94)

___

### mocha

• **mocha**: `Mocha`

The mocha instance to run.

#### Defined in

[HotTesterMochaSelenium.ts:23](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L23)

___

### name

• **name**: `string`

The tester name.

#### Inherited from

[HotTester](HotTester.md).[name](HotTester.md#name)

#### Defined in

[HotTester.ts:70](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L70)

___

### onSetup

• **onSetup**: (`driver`: `WebDriver`, `url`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`driver`, `url`): `Promise`<`boolean`\>

This event is executed after the Selenium driver and url have
been loaded. If this returns true, Selenium will load the url.

##### Parameters

| Name | Type |
| :------ | :------ |
| `driver` | `WebDriver` |
| `url` | `string` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[HotTesterMochaSelenium.ts:44](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L44)

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The associated processor.

#### Inherited from

[HotTester](HotTester.md).[processor](HotTester.md#processor)

#### Defined in

[HotTester.ts:78](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L78)

___

### suite

• **suite**: `Suite`

The suite to execute.

#### Defined in

[HotTesterMochaSelenium.ts:31](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L31)

___

### testMaps

• **testMaps**: `Object`

The test maps to test.

#### Index signature

▪ [name: `string`]: [`HotTestMap`](HotTestMap.md)

#### Inherited from

[HotTester](HotTester.md).[testMaps](HotTester.md#testmaps)

#### Defined in

[HotTester.ts:82](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L82)

___

### timeout

• **timeout**: `number`

The timeout for each test.

#### Defined in

[HotTesterMochaSelenium.ts:27](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L27)

___

### waitForTesterData

• **waitForTesterData**: `boolean`

If set to true, this will wait for the tester API data. If
onSetup is used, it will have to return true in order to
wait for the tester data.

#### Defined in

[HotTesterMochaSelenium.ts:50](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L50)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Executed when destroying this tester.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[destroy](HotTester.md#destroy)

#### Defined in

[HotTesterMochaSelenium.ts:112](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L112)

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

[HotTester.ts:561](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L561)

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

[HotTester.ts:380](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L380)

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

[HotTester.ts:256](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L256)

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

[HotTester.ts:294](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L294)

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

[HotTester.ts:329](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L329)

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

[HotTester.ts:515](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L515)

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

[HotTester.ts:181](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L181)

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

[HotTester.ts:191](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L191)

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

[HotTesterMochaSelenium.ts:167](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L167)

___

### onExecute

▸ `Optional` **onExecute**(): `Promise`<`void`\>

Executed when this tester has been executed from the API.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onExecute](HotTester.md#onexecute)

#### Defined in

[HotTester.ts:163](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L163)

___

### onFinishedLoading

▸ `Optional` **onFinishedLoading**(): `Promise`<`void`\>

Executed when this tester has finished loading all data from the API.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[onFinishedLoading](HotTester.md#onfinishedloading)

#### Defined in

[HotTester.ts:167](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L167)

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

[HotTester.ts:137](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L137)

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

[HotTester.ts:132](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L132)

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

[HotTesterMochaSelenium.ts:176](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L176)

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

[HotTester.ts:148](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L148)

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

[HotTesterMochaSelenium.ts:138](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L138)

___

### onTestStart

▸ **onTestStart**(`destination`, `url`, `destinationKey?`): `Promise`<`boolean`\>

Executed when tests are started.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | [`HotDestination`](../interfaces/HotDestination.md) | `undefined` |
| `url` | `string` | `undefined` |
| `destinationKey` | `string` | `""` |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[HotTester](HotTester.md).[onTestStart](HotTester.md#onteststart)

#### Defined in

[HotTesterMochaSelenium.ts:121](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L121)

___

### setup

▸ **setup**(`isWebRoute`, `url?`, `destinationKey?`): `Promise`<`void`\>

Setup the Mocha/Selenium frameworks.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `isWebRoute` | `boolean` | `undefined` | - |
| `url` | `string` | `""` | If this is set, this url will be used instead of the url associated with this tester. |
| `destinationKey` | `string` | `""` | - |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTester](HotTester.md).[setup](HotTester.md#setup)

#### Defined in

[HotTesterMochaSelenium.ts:77](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTesterMochaSelenium.ts#L77)

___

### waitForData

▸ **waitForData**(): `Promise`<`void`\>

Waits for the API to finish loading all data.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTester](HotTester.md).[waitForData](HotTester.md#waitfordata)

#### Defined in

[HotTester.ts:172](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L172)

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

[HotTester.ts:201](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotTester.ts#L201)
