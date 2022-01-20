[hotstaq](../README.md) / [Modules](../modules.md) / HotTestDriver

# Class: HotTestDriver

This actually executes the tests.

## Hierarchy

- **`HotTestDriver`**

  ↳ [`HotTestSeleniumDriver`](HotTestSeleniumDriver.md)

## Table of contents

### Constructors

- [constructor](HotTestDriver.md#constructor)

### Properties

- [page](HotTestDriver.md#page)

### Methods

- [assert](HotTestDriver.md#assert)
- [assertElementValue](HotTestDriver.md#assertelementvalue)
- [destroy](HotTestDriver.md#destroy)
- [findTestElement](HotTestDriver.md#findtestelement)
- [navigateToUrl](HotTestDriver.md#navigatetourl)
- [parseTestObject](HotTestDriver.md#parsetestobject)
- [print](HotTestDriver.md#print)
- [println](HotTestDriver.md#println)
- [run](HotTestDriver.md#run)
- [runCommand](HotTestDriver.md#runcommand)
- [wait](HotTestDriver.md#wait)
- [waitForTestElement](HotTestDriver.md#waitfortestelement)

## Constructors

### constructor

• **new HotTestDriver**(`page?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `page` | [`HotTestPage`](../interfaces/HotTestPage.md) | `null` |

#### Defined in

[HotTestDriver.ts:15](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L15)

## Properties

### page

• **page**: [`HotTestPage`](../interfaces/HotTestPage.md)

The current page.

#### Defined in

[HotTestDriver.ts:13](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L13)

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

#### Defined in

[HotTestDriver.ts:107](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L107)

___

### assertElementValue

▸ `Abstract` **assertElementValue**(`name`, `value`, `errorMessage?`, `options?`): `Promise`<`any`\>

An expression to test.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `value` | `any` |
| `errorMessage?` | `string` |
| `options?` | [`HotTestElementOptions`](HotTestElementOptions.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[HotTestDriver.ts:102](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L102)

___

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Disconnect this server or destroy anything associated with this HotTestDriver.

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTestDriver.ts:81](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L81)

___

### findTestElement

▸ `Abstract` **findTestElement**(`name`, `options?`): `Promise`<`any`\>

Find a HotTestElement to utilize.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `options?` | [`HotTestElementOptions`](HotTestElementOptions.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[HotTestDriver.ts:94](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L94)

___

### navigateToUrl

▸ `Abstract` **navigateToUrl**(`url`): `Promise`<`void`\>

Navigate to a url.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[HotTestDriver.ts:86](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L86)

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

#### Defined in

[HotTestDriver.ts:116](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L116)

___

### runCommand

▸ `Abstract` **runCommand**(`testElm`, `funcName?`, `valueStr?`): `Promise`<`any`\>

Run a HotTestElement command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testElm` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `funcName?` | `string` |
| `valueStr?` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[HotTestDriver.ts:98](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L98)

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

#### Defined in

[HotTestDriver.ts:51](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L51)

___

### waitForTestElement

▸ `Abstract` **waitForTestElement**(`name`, `options?`): `Promise`<`any`\>

Wait for a HotTestElement to load.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| [`HotTestElement`](HotTestElement.md) |
| `options?` | [`HotTestElementOptions`](HotTestElementOptions.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[HotTestDriver.ts:90](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestDriver.ts#L90)
