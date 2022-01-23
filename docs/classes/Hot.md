[hotstaq](../README.md) / [Modules](../modules.md) / Hot

# Class: Hot

The api used during processing.

## Table of contents

### Constructors

- [constructor](Hot.md#constructor)

### Properties

- [API](Hot.md#api)
- [Arguments](Hot.md#arguments)
- [CSS](Hot.md#css)
- [Cookies](Hot.md#cookies)
- [CurrentPage](Hot.md#currentpage)
- [Data](Hot.md#data)
- [DeveloperMode](Hot.md#developermode)
- [HotTestElement](Hot.md#hottestelement)
- [JSFiles](Hot.md#jsfiles)
- [JSScripts](Hot.md#jsscripts)
- [Mode](Hot.md#mode)
- [Output](Hot.md#output)
- [PublicSecrets](Hot.md#publicsecrets)
- [TesterAPI](Hot.md#testerapi)
- [cssStr](Hot.md#cssstr)
- [jsFileStr](Hot.md#jsfilestr)
- [jsScriptsStr](Hot.md#jsscriptsstr)

### Methods

- [apiCall](Hot.md#apicall)
- [displayCSS](Hot.md#displaycss)
- [displayJSFiles](Hot.md#displayjsfiles)
- [displayJSScripts](Hot.md#displayjsscripts)
- [echo](Hot.md#echo)
- [getFile](Hot.md#getfile)
- [httpRequest](Hot.md#httprequest)
- [include](Hot.md#include)
- [jsonRequest](Hot.md#jsonrequest)
- [runFile](Hot.md#runfile)

## Constructors

### constructor

• **new Hot**()

## Properties

### API

▪ `Static` **API**: [`HotAPI`](HotAPI.md) = `null`

The current API used on this page. This is cleared between every file processed.

#### Defined in

[Hot.ts:73](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L73)

___

### Arguments

▪ `Static` **Arguments**: `any` = `null`

The arguments passed.

#### Defined in

[Hot.ts:54](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L54)

___

### CSS

▪ `Static` **CSS**: `string`[] = `[]`

The CSS files to use in the current page being generated.

**`todo`** Make this a "string | CSSObject" data type so it can also include
the integrity hashes as well.

#### Defined in

[Hot.ts:104](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L104)

___

### Cookies

▪ `Static` **Cookies**: `CookiesStatic`<`object`\> = `Cookies`

The cookies to use between pages.

#### Defined in

[Hot.ts:89](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L89)

___

### CurrentPage

▪ `Static` **CurrentPage**: [`HotPage`](HotPage.md) = `null`

The currently generated page being displayed. This is cleared between every file processed.

#### Defined in

[Hot.ts:50](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L50)

___

### Data

▪ `Static` **Data**: `any` = `{}`

The data to share across all the different files and pages. This data will be public.

#### Defined in

[Hot.ts:85](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L85)

___

### DeveloperMode

▪ `Static` **DeveloperMode**: typeof [`DeveloperMode`](../enums/DeveloperMode.md) = `DeveloperMode`

The mode in which this application is running. If it's set to development mode, all testing
related data will be collected, parsed, and executed if necessary.

#### Defined in

[Hot.ts:59](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L59)

___

### HotTestElement

▪ `Static` **HotTestElement**: typeof [`HotTestElement`](HotTestElement.md) = `HotTestElement`

The mode in which this application is running. If it's set to development mode, all testing
related data will be collected, parsed, and executed if necessary.

#### Defined in

[Hot.ts:64](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L64)

___

### JSFiles

▪ `Static` **JSFiles**: `any`[] = `[]`

The JavaScript files to use in the current page being generated.

**`todo`** Make this a "string | JSFileObject" data type so it can also include
the integrity hashes as well.

#### Defined in

[Hot.ts:111](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L111)

___

### JSScripts

▪ `Static` **JSScripts**: `any`[] = `[]`

The JavaScript inline code to use in the current page being generated.

#### Defined in

[Hot.ts:115](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L115)

___

### Mode

▪ `Static` **Mode**: [`DeveloperMode`](../enums/DeveloperMode.md) = `DeveloperMode.Production`

The mode in which this application is running. If it's set to development mode, all testing
related data will be collected, parsed, and executed if necessary.

#### Defined in

[Hot.ts:69](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L69)

___

### Output

▪ `Static` **Output**: `string` = `""`

Contains the buffer to output. This is cleared between every file processed.

#### Defined in

[Hot.ts:81](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L81)

___

### PublicSecrets

▪ `Static` **PublicSecrets**: `any` = `{}`

Any secrets that can be shown publicly. These can be passed from HotSite.json.

#### Defined in

[Hot.ts:93](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L93)

___

### TesterAPI

▪ `Static` **TesterAPI**: [`HotAPI`](HotAPI.md) = `null`

The API being used by the tester.

#### Defined in

[Hot.ts:77](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L77)

___

### cssStr

▪ `Static` **cssStr**: `string`

The CSS string to use when echoing out the CSS files.

#### Defined in

[Hot.ts:97](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L97)

___

### jsFileStr

▪ `Static` **jsFileStr**: `string`

The JavaScript string to use when echoing out the Scripts files.

#### Defined in

[Hot.ts:119](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L119)

___

### jsScriptsStr

▪ `Static` **jsScriptsStr**: `string`

The JavaScript string to use when echoing out the Scripts files.

#### Defined in

[Hot.ts:123](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L123)

## Methods

### apiCall

▸ `Static` **apiCall**(`route`, `data?`, `httpMethod?`): `Promise`<`any`\>

Make an api call.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | `string` | `undefined` |
| `data` | `any` | `null` |
| `httpMethod` | `string` | `"POST"` |

#### Returns

`Promise`<`any`\>

#### Defined in

[Hot.ts:195](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L195)

___

### displayCSS

▸ `Static` **displayCSS**(): `void`

Echo out the CSS for the current page being generated.

#### Returns

`void`

#### Defined in

[Hot.ts:275](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L275)

___

### displayJSFiles

▸ `Static` **displayJSFiles**(): `void`

Echo out the JS files for the current page being generated.

#### Returns

`void`

#### Defined in

[Hot.ts:291](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L291)

___

### displayJSScripts

▸ `Static` **displayJSScripts**(): `void`

Echo out the JS scripts for the current page being generated.

#### Returns

`void`

#### Defined in

[Hot.ts:307](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L307)

___

### echo

▸ `Static` **echo**(`message`): `void`

Echo out some output.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[Hot.ts:267](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L267)

___

### getFile

▸ `Static` **getFile**(`path`, `args?`): `Promise`<`string`\>

Get the content of a file.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `string` \| [`HotFile`](HotFile.md) | `undefined` |
| `args` | `any`[] | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Hot.ts:168](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L168)

___

### httpRequest

▸ `Static` **httpRequest**(`url`, `requestInit?`): `Promise`<`Response`\>

Make a HTTP request. This is basically just a wrapper for fetch.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `undefined` | The full url to make the HTTP call. |
| `requestInit` | `RequestInit` | `undefined` | The request parameters to send. |

#### Returns

`Promise`<`Response`\>

The HTTP response.

#### Defined in

[Hot.ts:257](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L257)

___

### include

▸ `Static` **include**(`file`, `args?`): `Promise`<`void`\>

Retrieve a file and echo out it's contents.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `file` | `string` \| [`HotFile`](HotFile.md) | `undefined` |
| `args` | `any`[] | `null` |

#### Returns

`Promise`<`void`\>

#### Defined in

[Hot.ts:128](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L128)

___

### jsonRequest

▸ `Static` **jsonRequest**(`url`, `data?`, `httpMethod?`): `Promise`<`any`\>

Make a HTTP JSON request.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `undefined` | The full url to make the HTTP call. |
| `data` | `any` | `null` | The data to JSON.stringify and send. |
| `httpMethod` | `string` | `"POST"` | The HTTP method to use to send the data. |

#### Returns

`Promise`<`any`\>

The parsed JSON object.

#### Defined in

[Hot.ts:223](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L223)

___

### runFile

▸ `Static` **runFile**(`fileName`, `args?`): `Promise`<`void`\>

Run an already loaded file and echo out it's contents.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileName` | `string` | `undefined` |
| `args` | `any`[] | `null` |

#### Returns

`Promise`<`void`\>

#### Defined in

[Hot.ts:152](https://github.com/OurFreeLight/HotStaq/blob/b031357/src/Hot.ts#L152)
