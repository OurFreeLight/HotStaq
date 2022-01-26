[hotstaq](../README.md) / [Modules](../modules.md) / HotTestSeleniumDriver

# Class: HotTestSeleniumDriver

Runs and executes tests using Selenium.

## Hierarchy

- [`HotTestDriver`](HotTestDriver.md)

  ↳ **`HotTestSeleniumDriver`**

## Table of contents

### Constructors

- [constructor](HotTestSeleniumDriver.md#constructor)

### Properties

- [browser](HotTestSeleniumDriver.md#browser)
- [disableGPUAndSandbox](HotTestSeleniumDriver.md#disablegpuandsandbox)
- [driver](HotTestSeleniumDriver.md#driver)
- [headless](HotTestSeleniumDriver.md#headless)
- [openDevTools](HotTestSeleniumDriver.md#opendevtools)
- [page](HotTestSeleniumDriver.md#page)
- [remoteServer](HotTestSeleniumDriver.md#remoteserver)
- [session](HotTestSeleniumDriver.md#session)
- [windowSize](HotTestSeleniumDriver.md#windowsize)

### Methods

- [assert](HotTestSeleniumDriver.md#assert)
- [assertElementValue](HotTestSeleniumDriver.md#assertelementvalue)
- [destroy](HotTestSeleniumDriver.md#destroy)
- [findTestElement](HotTestSeleniumDriver.md#findtestelement)
- [getTestObjectByName](HotTestSeleniumDriver.md#gettestobjectbyname)
- [loadSeleniumDriver](HotTestSeleniumDriver.md#loadseleniumdriver)
- [navigateToUrl](HotTestSeleniumDriver.md#navigatetourl)
- [parseTestObject](HotTestSeleniumDriver.md#parsetestobject)
- [print](HotTestSeleniumDriver.md#print)
- [println](HotTestSeleniumDriver.md#println)
- [run](HotTestSeleniumDriver.md#run)
- [runCommand](HotTestSeleniumDriver.md#runcommand)
- [wait](HotTestSeleniumDriver.md#wait)
- [waitForTestElement](HotTestSeleniumDriver.md#waitfortestelement)

## Constructors

### constructor

• **new HotTestSeleniumDriver**(`page?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) | `null` |

#### Overrides

[HotTestDriver](HotTestDriver.md).[constructor](HotTestDriver.md#constructor)

#### Defined in

[HotTestSeleniumDriver.ts:58](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L58)

## Properties

### browser

• **browser**: `string`

The browser to use.

#### Defined in

[HotTestSeleniumDriver.ts:27](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L27)

___

### disableGPUAndSandbox

• **disableGPUAndSandbox**: `boolean`

Disable GPU usage and the Chrome Sandbox. Mostly for usage within Docker.

#### Defined in

[HotTestSeleniumDriver.ts:35](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L35)

___

### driver

• **driver**: `WebDriver`

The selenium webdriver.

#### Defined in

[HotTestSeleniumDriver.ts:23](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L23)

___

### headless

• **headless**: `boolean`

Run the tests headless.

#### Defined in

[HotTestSeleniumDriver.ts:31](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L31)

___

### openDevTools

• **openDevTools**: `boolean`

Automatically open the developer tools on start.

#### Defined in

[HotTestSeleniumDriver.ts:39](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L39)

___

### page

• **page**: [`HotTestPage`](../interfaces/HotTestPage.md)

The current page.

#### Inherited from

[HotTestDriver](HotTestDriver.md).[page](HotTestDriver.md#page)

#### Defined in

[HotTestDriver.ts:12](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L12)

___

### remoteServer

• **remoteServer**: `string`

Set the remote server to use for testing.

#### Defined in

[HotTestSeleniumDriver.ts:43](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L43)

___

### session

• **session**: `Session`

The current selenium session running.

#### Defined in

[HotTestSeleniumDriver.ts:19](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L19)

___

### windowSize

• **windowSize**: `Object`

Set the window size on start.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `height` | `number` | The height of the window. |
| `width` | `number` | The width of the window. |

#### Defined in

[HotTestSeleniumDriver.ts:47](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L47)

## Methods

### assert

▸ **assert**(`value`, `errorMessage?`): `Promise`<`any`\>

An expression to test.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `any` | `undefined` |
| `errorMessage` | `string` | `""` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[HotTestDriver](HotTestDriver.md).[assert](HotTestDriver.md#assert)

#### Defined in

[HotTestDriver.ts:106](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L106)

___

### assertElementValue

▸ **assertElementValue**(`name`, `value`, `errorMessage?`, `options?`): `Promise`<`any`\>

An expression to test.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) | `undefined` |
| `value` | `any` | `undefined` |
| `errorMessage` | `string` | `""` |
| `options` | [`HotTestElementOptions`](HotTestElementOptions.md) | `undefined` |

#### Returns

`Promise`<`any`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[assertElementValue](HotTestDriver.md#assertelementvalue)

#### Defined in

[HotTestSeleniumDriver.ts:330](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L330)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Disconnect this server or destroy anything associated with this HotTestDriver.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[destroy](HotTestDriver.md#destroy)

#### Defined in

[HotTestSeleniumDriver.ts:75](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L75)

___

### findTestElement

▸ **findTestElement**(`name`, `options?`): `Promise`<`WebElement`\>

Get a test element using selenium webdriver.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `options` | [`HotTestElementOptions`](HotTestElementOptions.md) |

#### Returns

`Promise`<`WebElement`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[findTestElement](HotTestDriver.md#findtestelement)

#### Defined in

[HotTestSeleniumDriver.ts:233](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L233)

___

### getTestObjectByName

▸ **getTestObjectByName**(`name`): `By`

Get a test object by it's name. If a * is used, it will be used as a
wildcard for the object's name. If a > is used, then the name will
be treated as a CSS selector.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`By`

#### Defined in

[HotTestSeleniumDriver.ts:178](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L178)

___

### loadSeleniumDriver

▸ **loadSeleniumDriver**(): `Promise`<`void`\>

Load the selenium driver.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTestSeleniumDriver.ts:89](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L89)

___

### navigateToUrl

▸ **navigateToUrl**(`url`): `Promise`<`void`\>

Navigate to a url.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[navigateToUrl](HotTestDriver.md#navigatetourl)

#### Defined in

[HotTestSeleniumDriver.ts:188](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L188)

___

### parseTestObject

▸ **parseTestObject**(`name`): `string`

Get a test object by it's name. If a * is used, it will be used as a
wildcard for the object's name. If a > is used, then the name will
be treated as a CSS selector.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Inherited from

[HotTestDriver](HotTestDriver.md).[parseTestObject](HotTestDriver.md#parsetestobject)

#### Defined in

[HotTestDriver.ts:24](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L24)

___

### print

▸ **print**(`message`): `Promise`<`void`\>

Print a message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTestDriver](HotTestDriver.md).[print](HotTestDriver.md#print)

#### Defined in

[HotTestDriver.ts:64](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L64)

___

### println

▸ **println**(`message`): `Promise`<`void`\>

Print a message line.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTestDriver](HotTestDriver.md).[println](HotTestDriver.md#println)

#### Defined in

[HotTestDriver.ts:72](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L72)

___

### run

▸ **run**(`executions`): `Promise`<`any`[]\>

Run a series of test elements.

#### Parameters

| Name | Type |
| :------ | :------ |
| `executions` | `string`[] \| `string`[][] |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[HotTestDriver](HotTestDriver.md).[run](HotTestDriver.md#run)

#### Defined in

[HotTestDriver.ts:115](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L115)

___

### runCommand

▸ **runCommand**(`testElm`, `funcName?`, `valueStr?`, `options?`): `Promise`<`any`\>

Run a command using Selenium Webdriver.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `testElm` | `string` \| [`HotTestElement`](HotTestElement.md) | `undefined` |
| `funcName` | `string` | `""` |
| `valueStr` | `string` | `""` |
| `options` | [`HotTestElementOptions`](HotTestElementOptions.md) | `undefined` |

#### Returns

`Promise`<`any`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[runCommand](HotTestDriver.md#runcommand)

#### Defined in

[HotTestSeleniumDriver.ts:275](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L275)

___

### wait

▸ **wait**(`numMilliseconds`): `Promise`<`void`\>

Wait for a number of milliseconds.

#### Parameters

| Name | Type |
| :------ | :------ |
| `numMilliseconds` | `number` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotTestDriver](HotTestDriver.md).[wait](HotTestDriver.md#wait)

#### Defined in

[HotTestDriver.ts:50](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestDriver.ts#L50)

___

### waitForTestElement

▸ **waitForTestElement**(`name`, `options?`): `Promise`<`WebElement`\>

Wait for a test element using Selenium Webdriver.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `options` | [`HotTestElementOptions`](HotTestElementOptions.md) |

#### Returns

`Promise`<`WebElement`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[waitForTestElement](HotTestDriver.md#waitfortestelement)

#### Defined in

[HotTestSeleniumDriver.ts:196](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestSeleniumDriver.ts#L196)
