[hotstaq](../README.md) / [Modules](../modules.md) / HotStaq

# Class: HotStaq

The main class that handles all HTML preprocessing, then outputs the
results.

## Implements

- [`IHotStaq`](../interfaces/IHotStaq.md)

## Table of contents

### Constructors

- [constructor](HotStaq.md#constructor)

### Properties

- [api](HotStaq.md#api)
- [apiContent](HotStaq.md#apicontent)
- [components](HotStaq.md#components)
- [files](HotStaq.md#files)
- [hotSite](HotStaq.md#hotsite)
- [logger](HotStaq.md#logger)
- [mode](HotStaq.md#mode)
- [pageContent](HotStaq.md#pagecontent)
- [pages](HotStaq.md#pages)
- [publicSecrets](HotStaq.md#publicsecrets)
- [testerAPI](HotStaq.md#testerapi)
- [testerApiContent](HotStaq.md#testerapicontent)
- [testers](HotStaq.md#testers)
- [isReadyForTesting](HotStaq.md#isreadyfortesting)
- [isWeb](HotStaq.md#isweb)
- [onReadyForTesting](HotStaq.md#onreadyfortesting)

### Methods

- [addComponent](HotStaq.md#addcomponent)
- [addFile](HotStaq.md#addfile)
- [addPage](HotStaq.md#addpage)
- [addTester](HotStaq.md#addtester)
- [createExpressRoutes](HotStaq.md#createexpressroutes)
- [executeAllAPITests](HotStaq.md#executeallapitests)
- [executeAllWebTests](HotStaq.md#executeallwebtests)
- [executeTests](HotStaq.md#executetests)
- [generateContent](HotStaq.md#generatecontent)
- [getAPITestingMaps](HotStaq.md#getapitestingmaps)
- [getComponent](HotStaq.md#getcomponent)
- [getFile](HotStaq.md#getfile)
- [getPage](HotStaq.md#getpage)
- [getRouteFromName](HotStaq.md#getroutefromname)
- [getRouteKeyFromName](HotStaq.md#getroutekeyfromname)
- [getWebTestingMaps](HotStaq.md#getwebtestingmaps)
- [loadHotFiles](HotStaq.md#loadhotfiles)
- [loadHotSite](HotStaq.md#loadhotsite)
- [process](HotStaq.md#process)
- [registerComponent](HotStaq.md#registercomponent)
- [addHtml](HotStaq.md#addhtml)
- [checkHotSiteName](HotStaq.md#checkhotsitename)
- [displayContent](HotStaq.md#displaycontent)
- [displayUrl](HotStaq.md#displayurl)
- [getParam](HotStaq.md#getparam)
- [getParamDefault](HotStaq.md#getparamdefault)
- [getValueFromHotSiteObj](HotStaq.md#getvaluefromhotsiteobj)
- [onReady](HotStaq.md#onready)
- [parseBoolean](HotStaq.md#parseboolean)
- [processContent](HotStaq.md#processcontent)
- [processLocalFile](HotStaq.md#processlocalfile)
- [processUrl](HotStaq.md#processurl)
- [replaceKey](HotStaq.md#replacekey)
- [useOutput](HotStaq.md#useoutput)
- [wait](HotStaq.md#wait)
- [waitForTesters](HotStaq.md#waitfortesters)

## Constructors

### constructor

• **new HotStaq**(`copy?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `copy` | [`IHotStaq`](../interfaces/IHotStaq.md) |

#### Defined in

HotStaq.ts:440

## Properties

### api

• **api**: [`HotAPI`](HotAPI.md)

The api that's used to communicate with.

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[api](../interfaces/IHotStaq.md#api)

#### Defined in

HotStaq.ts:394

___

### apiContent

• **apiContent**: `string`

The api content to use when about to load HotStaq.

#### Defined in

HotStaq.ts:418

___

### components

• **components**: `Object`

The components that can be constructed.

#### Index signature

▪ [name: `string`]: [`HotComponent`](HotComponent.md)

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[components](../interfaces/IHotStaq.md#components)

#### Defined in

HotStaq.ts:406

___

### files

• **files**: `Object`

The files that can be stored for later use.

#### Index signature

▪ [name: `string`]: [`HotFile`](HotFile.md)

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[files](../interfaces/IHotStaq.md#files)

#### Defined in

HotStaq.ts:410

___

### hotSite

• **hotSite**: [`HotSite`](../interfaces/HotSite.md)

The loaded hotsite.

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[hotSite](../interfaces/IHotStaq.md#hotsite)

#### Defined in

HotStaq.ts:414

___

### logger

• **logger**: [`HotLog`](HotLog.md)

The logger.

#### Defined in

HotStaq.ts:430

___

### mode

• **mode**: [`DeveloperMode`](../enums/DeveloperMode.md)

Indicates what type of execution this is.

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[mode](../interfaces/IHotStaq.md#mode)

#### Defined in

HotStaq.ts:390

___

### pageContent

• **pageContent**: `string`

The page content to use when about to load HotStaq.

#### Defined in

HotStaq.ts:426

___

### pages

• **pages**: `Object`

The pages that can be constructed.

#### Index signature

▪ [name: `string`]: [`HotPage`](HotPage.md)

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[pages](../interfaces/IHotStaq.md#pages)

#### Defined in

HotStaq.ts:402

___

### publicSecrets

• **publicSecrets**: `any`

The secrets that can be exposed publicly.

#### Defined in

HotStaq.ts:434

___

### testerAPI

• **testerAPI**: [`HotAPI`](HotAPI.md)

The tester api that's used to communicate with.

#### Implementation of

[IHotStaq](../interfaces/IHotStaq.md).[testerAPI](../interfaces/IHotStaq.md#testerapi)

#### Defined in

HotStaq.ts:398

___

### testerApiContent

• **testerApiContent**: `string`

The tester api content to use when about to load HotStaq.

#### Defined in

HotStaq.ts:422

___

### testers

• **testers**: `Object`

The secrets that can be exposed publicly.

#### Index signature

▪ [name: `string`]: [`HotTester`](HotTester.md)

#### Defined in

HotStaq.ts:438

___

### isReadyForTesting

▪ `Static` **isReadyForTesting**: `boolean` = `false`

Indicates if this is ready for testing.

#### Defined in

HotStaq.ts:382

___

### isWeb

▪ `Static` **isWeb**: `boolean` = `false`

Indicates if this is a web build.

#### Defined in

HotStaq.ts:378

___

### onReadyForTesting

▪ `Static` **onReadyForTesting**: () => `Promise`<`void`\> = `null`

#### Type declaration

▸ (): `Promise`<`void`\>

Executes this event when this page is ready for testing.

##### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:386

## Methods

### addComponent

▸ **addComponent**(`component`): `void`

Add and register a component.

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | [`HotComponent`](HotComponent.md) |

#### Returns

`void`

#### Defined in

HotStaq.ts:674

___

### addFile

▸ **addFile**(`file`): `void`

Add a file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`HotFile`](HotFile.md) |

#### Returns

`void`

#### Defined in

HotStaq.ts:647

___

### addPage

▸ **addPage**(`page`): `void`

Add a page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | [`HotPage`](HotPage.md) |

#### Returns

`void`

#### Defined in

HotStaq.ts:631

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

HotStaq.ts:1447

___

### createExpressRoutes

▸ **createExpressRoutes**(`expressApp`, `jsSrcPath?`): `void`

Create the Express routes from the given pages. Be sure to load the
pages first before doing this. This method is meant to be used for
customized Express applications. If you wish to use the loaded routes
from this HotStaq object with HotHTTPServer, be sure to use
the loadHotSite method in HotHTTPServer.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `expressApp` | `any` | `undefined` |
| `jsSrcPath` | `string` | `"./js/HotStaq.js"` |

#### Returns

`void`

#### Defined in

HotStaq.ts:1430

___

### executeAllAPITests

▸ **executeAllAPITests**(`testerName`): `Promise`<`void`\>

Execute all api tests from the HotSite testing api object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `testerName` | `string` | The tester to use to execute tests. |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:1576

___

### executeAllWebTests

▸ **executeAllWebTests**(`testerName`): `Promise`<`void`\>

Execute all web tests from the HotSite testing web object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `testerName` | `string` | The tester to use to execute tests. |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:1555

___

### executeTests

▸ **executeTests**(`testerName`, `mapName`): `Promise`<`void`\>

Execute tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `testerName` | `string` | The tester to use to execute tests. |
| `mapName` | `string` | The map or maps to use to navigate through tests. |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:1540

___

### generateContent

▸ **generateContent**(`routeKey`, `name?`, `url?`, `jsSrcPath?`, `passArgs?`, `args?`): `string`

Generate the content to send to a client.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `routeKey` | `string` | `undefined` |
| `name` | `string` | `""` |
| `url` | `string` | `"./"` |
| `jsSrcPath` | `string` | `"./js/HotStaq.js"` |
| `passArgs` | `boolean` | `true` |
| `args` | `any` | `null` |

#### Returns

`string`

#### Defined in

HotStaq.ts:1145

___

### getAPITestingMaps

▸ **getAPITestingMaps**(): `string`[]

Get the list of maps for testing from the HotSite.

#### Returns

`string`[]

#### Defined in

HotStaq.ts:1475

___

### getComponent

▸ **getComponent**(`name`): [`HotComponent`](HotComponent.md)

Get a component to process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`HotComponent`](HotComponent.md)

#### Defined in

HotStaq.ts:744

___

### getFile

▸ **getFile**(`name`): [`HotFile`](HotFile.md)

Get a file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`HotFile`](HotFile.md)

#### Defined in

HotStaq.ts:663

___

### getPage

▸ **getPage**(`pageName`): [`HotPage`](HotPage.md)

Get a page to process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageName` | `string` |

#### Returns

[`HotPage`](HotPage.md)

#### Defined in

HotStaq.ts:639

___

### getRouteFromName

▸ **getRouteFromName**(`name`): [`HotSiteRoute`](../interfaces/HotSiteRoute.md)

Get a route from a route's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`HotSiteRoute`](../interfaces/HotSiteRoute.md)

#### Defined in

HotStaq.ts:1523

___

### getRouteKeyFromName

▸ **getRouteKeyFromName**(`name`): `string`

Get a route's key from a route's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Defined in

HotStaq.ts:1495

___

### getWebTestingMaps

▸ **getWebTestingMaps**(): `string`[]

Get the list of maps for testing from the HotSite.

#### Returns

`string`[]

#### Defined in

HotStaq.ts:1455

___

### loadHotFiles

▸ **loadHotFiles**(`files`, `forceContentLoading?`): `Promise`<`void`\>

Load an array of files. If a file already has content, it will not be reloaded
unless forceContentLoading is set to true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `files` | `Object` | `undefined` |
| `forceContentLoading` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:1094

___

### loadHotSite

▸ **loadHotSite**(`path`): `Promise`<`void`\>

Load from a HotSite.json file. Be sure to load and attach any testers before
loading a HotSite.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:858

___

### process

▸ **process**(`pageName`, `args?`): `Promise`<`string`\>

Process a page and get the result.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pageName` | `string` | `undefined` |
| `args` | `any` | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

HotStaq.ts:1595

___

### registerComponent

▸ **registerComponent**(`component`): `void`

Register a component for use as a HTML tag.

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | [`HotComponent`](HotComponent.md) |

#### Returns

`void`

#### Defined in

HotStaq.ts:683

___

### addHtml

▸ `Static` **addHtml**(`parent`, `html`): `HTMLElement` \| `HTMLElement`[]

Add a new HTML element(s) to the current document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | `string` \| `HTMLElement` |
| `html` | `string` \| `HTMLElement` |

#### Returns

`HTMLElement` \| `HTMLElement`[]

#### Defined in

HotStaq.ts:752

___

### checkHotSiteName

▸ `Static` **checkHotSiteName**(`hotsiteName`, `throwException?`): `boolean`

Check if a HotSite's name is valid.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `hotsiteName` | `string` | `undefined` |
| `throwException` | `boolean` | `false` |

#### Returns

`boolean`

#### Defined in

HotStaq.ts:789

___

### displayContent

▸ `Static` **displayContent**(`content`, `name`, `processor?`): `Promise`<[`HotStaq`](HotStaq.md)\>

Process and replace the current HTML page with the hott script.
This is meant for web browser use only.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `content` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `processor` | [`HotStaq`](HotStaq.md) | `null` |

#### Returns

`Promise`<[`HotStaq`](HotStaq.md)\>

#### Defined in

HotStaq.ts:1860

___

### displayUrl

▸ `Static` **displayUrl**(`url`, `name?`, `processor?`, `args?`): `Promise`<[`HotStaq`](HotStaq.md)\>

Process and replace the current HTML page with the hott script from the given url.
This is meant for web browser use only.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` \| [`HotStartOptions`](../interfaces/HotStartOptions.md) | `undefined` |
| `name` | `string` | `null` |
| `processor` | [`HotStaq`](HotStaq.md) | `null` |
| `args` | `any` | `null` |

#### Returns

`Promise`<[`HotStaq`](HotStaq.md)\>

#### Defined in

HotStaq.ts:1710

___

### getParam

▸ `Static` **getParam**(`name`, `objWithParam`, `required?`, `throwException?`): `any`

Check if a required parameter exists inside an object. If it exists, return the value.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `objWithParam` | `any` | `undefined` |
| `required` | `boolean` | `true` |
| `throwException` | `boolean` | `true` |

#### Returns

`any`

#### Defined in

HotStaq.ts:566

___

### getParamDefault

▸ `Static` **getParamDefault**(`name`, `objWithParam`, `defaultValue`): `any`

Check if a required parameter exists inside an object. If it exists, return the value.
If it does not exist, return a default value instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `objWithParam` | `any` |
| `defaultValue` | `any` |

#### Returns

`any`

#### Defined in

HotStaq.ts:598

___

### getValueFromHotSiteObj

▸ `Static` **getValueFromHotSiteObj**(`hotsite`, `params`): `any`

Get a value from a HotSite object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hotsite` | [`HotSite`](../interfaces/HotSite.md) |
| `params` | `string`[] |

#### Returns

`any`

Returns the value from the hotsite object. Returns null if it doesn't exist.

#### Defined in

HotStaq.ts:823

___

### onReady

▸ `Static` **onReady**(`readyFunc`): `void`

When the window has finished loading, execute the function.
This is meant for web browser use only.

#### Parameters

| Name | Type |
| :------ | :------ |
| `readyFunc` | () => `void` |

#### Returns

`void`

#### Defined in

HotStaq.ts:1672

___

### parseBoolean

▸ `Static` **parseBoolean**(`value`): `boolean`

Parse a boolean value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

#### Defined in

HotStaq.ts:529

___

### processContent

▸ `Static` **processContent**(`processor`, `content`, `name`, `args?`): `Promise`<`string`\>

Process content and get the result.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `processor` | [`HotStaq`](HotStaq.md) | `undefined` |
| `content` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `args` | `any` | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

HotStaq.ts:1650

___

### processLocalFile

▸ `Static` **processLocalFile**(`localFilepath`, `name?`, `args?`): `Promise`<`string`\>

Process a local file and get the result.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `localFilepath` | `string` | `undefined` |
| `name` | `string` | `localFilepath` |
| `args` | `any` | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

HotStaq.ts:1606

___

### processUrl

▸ `Static` **processUrl**(`options`): `Promise`<`string`\>

Process a url and get the result.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`HotStartOptions`](../interfaces/HotStartOptions.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

HotStaq.ts:1627

___

### replaceKey

▸ `Static` **replaceKey**(`str`, `key`, `value`): `string`

Replace a key in a ${KEY} with a value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `key` | `string` |
| `value` | `string` |

#### Returns

`string`

#### Defined in

HotStaq.ts:811

___

### useOutput

▸ `Static` **useOutput**(`output`): `void`

Replace the current HTML page with the output.
This is meant for web browser use only.

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | `string` |

#### Returns

`void`

#### Defined in

HotStaq.ts:1684

___

### wait

▸ `Static` **wait**(`numMilliseconds`): `Promise`<`void`\>

Wait for a number of milliseconds.

#### Parameters

| Name | Type |
| :------ | :------ |
| `numMilliseconds` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:617

___

### waitForTesters

▸ `Static` **waitForTesters**(): `Promise`<`void`\>

Wait for testers to load.

**`fixme`** This does not wait for ALL testers to finish loading. Only
the first one.

#### Returns

`Promise`<`void`\>

#### Defined in

HotStaq.ts:1697
