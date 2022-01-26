[hotstaq](../README.md) / [Modules](../modules.md) / HotFile

# Class: HotFile

A file to process.

## Implements

- `IHotFile`

## Table of contents

### Constructors

- [constructor](HotFile.md#constructor)

### Properties

- [content](HotFile.md#content)
- [localFile](HotFile.md#localfile)
- [name](HotFile.md#name)
- [page](HotFile.md#page)
- [throwAllErrors](HotFile.md#throwallerrors)
- [url](HotFile.md#url)

### Methods

- [getContent](HotFile.md#getcontent)
- [load](HotFile.md#load)
- [loadLocalFile](HotFile.md#loadlocalfile)
- [loadUrl](HotFile.md#loadurl)
- [process](HotFile.md#process)
- [setContent](HotFile.md#setcontent)
- [httpGet](HotFile.md#httpget)
- [processContent](HotFile.md#processcontent)
- [processNestedContent](HotFile.md#processnestedcontent)

## Constructors

### constructor

• **new HotFile**(`copy?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `copy` | `IHotFile` |

#### Defined in

[HotFile.ts:70](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L70)

## Properties

### content

• **content**: `string`

The content of the file to process.

#### Implementation of

IHotFile.content

#### Defined in

[HotFile.ts:64](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L64)

___

### localFile

• **localFile**: `string`

The path to the local file to get.

#### Implementation of

IHotFile.localFile

#### Defined in

[HotFile.ts:60](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L60)

___

### name

• **name**: `string`

The name of the file.

#### Implementation of

IHotFile.name

#### Defined in

[HotFile.ts:52](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L52)

___

### page

• **page**: [`HotPage`](HotPage.md)

The parent page.

#### Implementation of

IHotFile.page

#### Defined in

[HotFile.ts:48](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L48)

___

### throwAllErrors

• **throwAllErrors**: `boolean`

Force all errors to be thrown.

#### Implementation of

IHotFile.throwAllErrors

#### Defined in

[HotFile.ts:68](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L68)

___

### url

• **url**: `string`

The url to the file to get.

#### Implementation of

IHotFile.url

#### Defined in

[HotFile.ts:56](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L56)

## Methods

### getContent

▸ **getContent**(): `string`

Get the content of this file.

#### Returns

`string`

#### Defined in

[HotFile.ts:91](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L91)

___

### load

▸ **load**(): `Promise`<`string`\>

Load the contents of the file.

#### Returns

`Promise`<`string`\>

#### Defined in

[HotFile.ts:154](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L154)

___

### loadLocalFile

▸ **loadLocalFile**(): `Promise`<`string`\>

Load content from a local file.

#### Returns

`Promise`<`string`\>

#### Defined in

[HotFile.ts:131](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L131)

___

### loadUrl

▸ **loadUrl**(): `Promise`<`string`\>

Load content from a url.

#### Returns

`Promise`<`string`\>

#### Defined in

[HotFile.ts:121](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L121)

___

### process

▸ **process**(`args?`): `Promise`<`string`\>

Process the content in this file. This treats each file as one large JavaScript
file. Any text outside of the <* *> areas will be treated as:

		Hot.echo ("text");

**`fixme`** The regex's in the offContent functions need to be fixed. There's several
test cases where they will fail.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `args` | `any` | `null` |

#### Returns

`Promise`<`string`\>

#### Defined in

[HotFile.ts:330](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L330)

___

### setContent

▸ **setContent**(`content`): `void`

Set the content of this file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

`void`

#### Defined in

[HotFile.ts:83](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L83)

___

### httpGet

▸ `Static` **httpGet**(`url`): `Promise`<`string`\>

Make a HTTP get request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[HotFile.ts:99](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L99)

___

### processContent

▸ `Static` **processContent**(`content`, `contentRegex`, `contentProcessor`, `offContentProcessor`, `numRemoveFromBeginning?`, `numRemoveFromEnd?`): `string`

Process string content. This will take in a regular expression and
parse the content based on the regex. When the regex content is found
contentProcessor will be executed with the regex content found. When
the regex content is not found, offContentProcessor will be called with
the content outside of the regex.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `content` | `string` | `undefined` | The content to parse. |
| `contentRegex` | `RegExp` | `undefined` | The regex to use to parse the content. |
| `contentProcessor` | (`regexFound`: `string`) => `string` | `undefined` | The content found inside the regex. |
| `offContentProcessor` | (`offContent`: `string`) => `string` | `undefined` | The content found outside of the regex. |
| `numRemoveFromBeginning` | `number` | `2` | The number of characters to remove from the beginning of the found content. |
| `numRemoveFromEnd` | `number` | `2` | The number of characters to remove from the end of the found content. |

#### Returns

`string`

#### Defined in

[HotFile.ts:183](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L183)

___

### processNestedContent

▸ `Static` **processNestedContent**(`content`, `startChars`, `endChars`, `triggerChar`, `contentProcessor`, `offContentProcessor`, `numRemoveFromBeginning?`, `numRemoveFromEnd?`): `string`

Process any content that could have nested values. This will
take in a regular expression and
parse the content based on the regex. When the regex content is found
contentProcessor will be executed with the regex content found. When
the regex content is not found, offContentProcessor will be called with
the content outside of the regex.

**`fixme`** Needs to be able to ignore any characters found inside comments
or a string. For example, if the following is used ```${"Test }"}``` It
will error out.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `content` | `string` | `undefined` | The content to parse. |
| `startChars` | `string` | `undefined` | - |
| `endChars` | `string` | `undefined` | - |
| `triggerChar` | `string` | `undefined` | - |
| `contentProcessor` | (`regexFound`: `string`) => `string` | `undefined` | The content found inside the regex. |
| `offContentProcessor` | (`offContent`: `string`) => `string` | `undefined` | The content found outside of the regex. |
| `numRemoveFromBeginning` | `number` | `2` | The number of characters to remove from the beginning of the found content. |
| `numRemoveFromEnd` | `number` | `1` | The number of characters to remove from the end of the found content. |

#### Returns

`string`

#### Defined in

[HotFile.ts:241](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotFile.ts#L241)
