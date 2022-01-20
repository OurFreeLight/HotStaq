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

[HotTestSeleniumDriver.ts:54](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L54)

## Properties

### browser

• **browser**: `string`

The browser to use.

#### Defined in

[HotTestSeleniumDriver.ts:27](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L27)

___

### driver

• **driver**: `WebDriver`

The selenium webdriver.

#### Defined in

[HotTestSeleniumDriver.ts:23](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L23)

___

### headless

• **headless**: `boolean`

Run the tests headless.

#### Defined in

[HotTestSeleniumDriver.ts:31](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L31)

___

### openDevTools

• **openDevTools**: `boolean`

Automatically open the developer tools on start.

#### Defined in

[HotTestSeleniumDriver.ts:35](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L35)

___

### page

• **page**: [`HotTestPage`](../interfaces/HotTestPage.md)

The current page.

#### Inherited from

[HotTestDriver](HotTestDriver.md).[page](HotTestDriver.md#page)

#### Defined in

[HotTestDriver.ts:13](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L13)

___

### remoteServer

• **remoteServer**: `string`

Set the remote server to use for testing.

#### Defined in

[HotTestSeleniumDriver.ts:39](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L39)

___

### session

• **session**: `Session`

The current selenium session running.

#### Defined in

[HotTestSeleniumDriver.ts:19](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L19)

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

[HotTestSeleniumDriver.ts:43](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L43)

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

[HotTestDriver.ts:107](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L107)

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

[HotTestSeleniumDriver.ts:323](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L323)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Disconnect this server or destroy anything associated with this HotTestDriver.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotTestDriver](HotTestDriver.md).[destroy](HotTestDriver.md#destroy)

#### Defined in

[HotTestSeleniumDriver.ts:70](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L70)

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

[HotTestSeleniumDriver.ts:226](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L226)

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

[HotTestSeleniumDriver.ts:171](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L171)

___

### loadSeleniumDriver

▸ **loadSeleniumDriver**(): `Promise`<`void`\>

Load the selenium driver.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTestSeleniumDriver.ts:84](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L84)

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

[HotTestSeleniumDriver.ts:181](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L181)

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

[HotTestDriver.ts:25](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L25)

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

[HotTestDriver.ts:65](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L65)

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

[HotTestDriver.ts:73](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L73)

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

[HotTestDriver.ts:116](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L116)

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

[HotTestSeleniumDriver.ts:268](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L268)

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

[HotTestDriver.ts:51](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L51)

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

[HotTestSeleniumDriver.ts:189](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestSeleniumDriver.ts#L189)
