[hotstaq](../README.md) / [Modules](../modules.md) / HotPage

# Class: HotPage

A page to preprocess.

## Implements

- `IHotPage`

## Table of contents

### Constructors

- [constructor](HotPage.md#constructor)

### Properties

- [files](HotPage.md#files)
- [name](HotPage.md#name)
- [processor](HotPage.md#processor)
- [route](HotPage.md#route)
- [testElements](HotPage.md#testelements)
- [testPaths](HotPage.md#testpaths)
- [testerMap](HotPage.md#testermap)
- [testerName](HotPage.md#testername)

### Methods

- [addFile](HotPage.md#addfile)
- [addTestElement](HotPage.md#addtestelement)
- [createTestPath](HotPage.md#createtestpath)
- [getAPI](HotPage.md#getapi)
- [getTestElement](HotPage.md#gettestelement)
- [getTesterAPI](HotPage.md#gettesterapi)
- [load](HotPage.md#load)
- [process](HotPage.md#process)

## Constructors

### constructor

• **new HotPage**(`copy`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `copy` | [`HotStaq`](HotStaq.md) \| `IHotPage` |

#### Defined in

HotPage.ts:87

## Properties

### files

• **files**: [`HotFile`](HotFile.md)[]

The name of the page. File ordering matters here.
Every file is processed incrementally.

#### Implementation of

IHotPage.files

#### Defined in

HotPage.ts:69

___

### name

• **name**: `string`

The name of the page.

#### Implementation of

IHotPage.name

#### Defined in

HotPage.ts:60

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The processor to use.

#### Implementation of

IHotPage.processor

#### Defined in

HotPage.ts:56

___

### route

• **route**: `string`

The route used to get to this page.

#### Implementation of

IHotPage.route

#### Defined in

HotPage.ts:64

___

### testElements

• **testElements**: `Object`

The elements to test on this page.

#### Index signature

▪ [name: `string`]: [`HotTestElement`](HotTestElement.md)

#### Implementation of

IHotPage.testElements

#### Defined in

HotPage.ts:81

___

### testPaths

• **testPaths**: `Object`

The test paths to test on this page.

#### Index signature

▪ [name: `string`]: [`HotTestPath`](../modules.md#hottestpath)

#### Implementation of

IHotPage.testPaths

#### Defined in

HotPage.ts:85

___

### testerMap

• **testerMap**: `string`

The associated tester map.

#### Implementation of

IHotPage.testerMap

#### Defined in

HotPage.ts:77

___

### testerName

• **testerName**: `string`

The associated tester name.

#### Implementation of

IHotPage.testerName

#### Defined in

HotPage.ts:73

## Methods

### addFile

▸ **addFile**(`file`): `Promise`<`void`\>

Add a file to process. It's recommend to load the file prior to
adding it to a page if it's about to be used.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`HotFile`](HotFile.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

HotPage.ts:117

___

### addTestElement

▸ **addTestElement**(`elm`): `void`

Add a test element.

#### Parameters

| Name | Type |
| :------ | :------ |
| `elm` | [`HotTestElement`](HotTestElement.md) |

#### Returns

`void`

#### Defined in

HotPage.ts:177

___

### createTestPath

▸ **createTestPath**(`pathName`, `driverFunc`): `void`

Create a test path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathName` | `string` |
| `driverFunc` | [`HotTestPath`](../modules.md#hottestpath) |

#### Returns

`void`

#### Defined in

HotPage.ts:199

___

### getAPI

▸ **getAPI**(): [`HotAPI`](HotAPI.md)

Get the API associated with this page.

#### Returns

[`HotAPI`](HotAPI.md)

#### Defined in

HotPage.ts:127

___

### getTestElement

▸ **getTestElement**(`name`): [`HotTestElement`](HotTestElement.md)

Get a test element.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`HotTestElement`](HotTestElement.md)

#### Defined in

HotPage.ts:188

___

### getTesterAPI

▸ **getTesterAPI**(): [`HotAPI`](HotAPI.md)

Get the tester API associated with this page.

#### Returns

[`HotAPI`](HotAPI.md)

#### Defined in

HotPage.ts:135

___

### load

▸ **load**(`file`): `Promise`<`void`\>

Add all files in the page. Could decrease page loading performance.
It's recommend to load the file prior to adding it to a page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | [`HotFile`](HotFile.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

HotPage.ts:144

___

### process

▸ **process**(`args?`): `Promise`<`string`\>

Process a page and get the result.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `args` | `any` | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

HotPage.ts:157
