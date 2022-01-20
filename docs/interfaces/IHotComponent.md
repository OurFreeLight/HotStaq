[hotstaq](../README.md) / [Modules](../modules.md) / IHotComponent

# Interface: IHotComponent

A component to preprocess.

## Implemented by

- [`HotComponent`](../classes/HotComponent.md)

## Table of contents

### Properties

- [api](IHotComponent.md#api)
- [elementOptions](IHotComponent.md#elementoptions)
- [events](IHotComponent.md#events)
- [htmlElement](IHotComponent.md#htmlelement)
- [name](IHotComponent.md#name)
- [processor](IHotComponent.md#processor)
- [tag](IHotComponent.md#tag)
- [type](IHotComponent.md#type)
- [value](IHotComponent.md#value)

## Properties

### api

• `Optional` **api**: [`HotAPI`](../classes/HotAPI.md)

The connected API.

#### Defined in

HotComponent.ts:28

___

### elementOptions

• `Optional` **elementOptions**: `ElementDefinitionOptions`

The options to include with registering this component.

#### Defined in

HotComponent.ts:32

___

### events

• `Optional` **events**: `Object`

The events to trigger.

#### Index signature

▪ [name: `string`]: { `func`: `Function` ; `options?`: `any` ; `type`: `string`  }

#### Defined in

HotComponent.ts:44

___

### htmlElement

• `Optional` **htmlElement**: `HTMLElement`

The associated HTMLElement.

#### Defined in

HotComponent.ts:16

___

### name

• `Optional` **name**: `string`

The name of the page.

#### Defined in

HotComponent.ts:20

___

### processor

• **processor**: [`HotStaq`](../classes/HotStaq.md)

The processor to use.

#### Defined in

HotComponent.ts:12

___

### tag

• `Optional` **tag**: `string`

The name of the tag.

#### Defined in

HotComponent.ts:24

___

### type

• `Optional` **type**: `string`

The type of component.

#### Defined in

HotComponent.ts:36

___

### value

• `Optional` **value**: `any`

The value of the component.

#### Defined in

HotComponent.ts:40
