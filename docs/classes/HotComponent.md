[hotstaq](../README.md) / [Modules](../modules.md) / HotComponent

# Class: HotComponent

A component to preprocess.

## Implements

- [`IHotComponent`](../interfaces/IHotComponent.md)

## Table of contents

### Constructors

- [constructor](HotComponent.md#constructor)

### Properties

- [api](HotComponent.md#api)
- [elementOptions](HotComponent.md#elementoptions)
- [events](HotComponent.md#events)
- [htmlElement](HotComponent.md#htmlelement)
- [name](HotComponent.md#name)
- [processor](HotComponent.md#processor)
- [tag](HotComponent.md#tag)
- [type](HotComponent.md#type)
- [value](HotComponent.md#value)

### Methods

- [click](HotComponent.md#click)
- [handleAttributes](HotComponent.md#handleattributes)
- [onCreated](HotComponent.md#oncreated)
- [output](HotComponent.md#output)

## Constructors

### constructor

• **new HotComponent**(`copy`, `api?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `copy` | [`HotStaq`](HotStaq.md) \| [`IHotComponent`](../interfaces/IHotComponent.md) | `undefined` |
| `api` | [`HotAPI`](HotAPI.md) | `null` |

#### Defined in

HotComponent.ts:101

## Properties

### api

• **api**: [`HotAPI`](HotAPI.md)

The connected API.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[api](../interfaces/IHotComponent.md#api)

#### Defined in

HotComponent.ts:77

___

### elementOptions

• **elementOptions**: `ElementDefinitionOptions`

The options to include with registering this component.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[elementOptions](../interfaces/IHotComponent.md#elementoptions)

#### Defined in

HotComponent.ts:81

___

### events

• **events**: `Object`

The events to trigger.

#### Index signature

▪ [name: `string`]: { `func`: `Function` ; `options`: `any` ; `type`: `string`  }

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[events](../interfaces/IHotComponent.md#events)

#### Defined in

HotComponent.ts:93

___

### htmlElement

• **htmlElement**: `HTMLElement`

The associated HTMLElement.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[htmlElement](../interfaces/IHotComponent.md#htmlelement)

#### Defined in

HotComponent.ts:65

___

### name

• **name**: `string`

The name of the component.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[name](../interfaces/IHotComponent.md#name)

#### Defined in

HotComponent.ts:69

___

### processor

• **processor**: [`HotStaq`](HotStaq.md)

The processor to use.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[processor](../interfaces/IHotComponent.md#processor)

#### Defined in

HotComponent.ts:61

___

### tag

• **tag**: `string`

The name of the tag.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[tag](../interfaces/IHotComponent.md#tag)

#### Defined in

HotComponent.ts:73

___

### type

• **type**: `string`

The type of component.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[type](../interfaces/IHotComponent.md#type)

#### Defined in

HotComponent.ts:85

___

### value

• **value**: `any`

The value of the component.

#### Implementation of

[IHotComponent](../interfaces/IHotComponent.md).[value](../interfaces/IHotComponent.md#value)

#### Defined in

HotComponent.ts:89

## Methods

### click

▸ `Abstract` **click**(): `Promise`<`void`\>

Handle a click event.

#### Returns

`Promise`<`void`\>

#### Defined in

HotComponent.ts:152

___

### handleAttributes

▸ `Optional` **handleAttributes**(`attributes`): `Promise`<`void`\>

Handle the attributes manually.

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `NamedNodeMap` |

#### Returns

`Promise`<`void`\>

#### Defined in

HotComponent.ts:147

___

### onCreated

▸ **onCreated**(`element`): `Promise`<`any`\>

Event that's called when this component is created. This is
called before output is called. Right after this is called,
the attributes from the HTMLElement will be processed. If
the functionality of the attributes processing need to be
overwritten, use the handleAttributes method to handle them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |

#### Returns

`Promise`<`any`\>

#### Defined in

HotComponent.ts:139

___

### output

▸ `Abstract` **output**(): `Promise`<`string`\>

Output the component.

#### Returns

`Promise`<`string`\>

#### Defined in

HotComponent.ts:157
