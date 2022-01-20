[hotstaq](../README.md) / [Modules](../modules.md) / HotTestElementOptions

# Class: HotTestElementOptions

Hot test element options.

## Implements

- [`IHotTestElementOptions`](../interfaces/IHotTestElementOptions.md)

## Table of contents

### Constructors

- [constructor](HotTestElementOptions.md#constructor)

### Properties

- [ignoreMissingElementError](HotTestElementOptions.md#ignoremissingelementerror)
- [mustBeVisible](HotTestElementOptions.md#mustbevisible)

## Constructors

### constructor

• **new HotTestElementOptions**(`copy?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `copy` | [`IHotTestElementOptions`](../interfaces/IHotTestElementOptions.md) |

#### Defined in

[HotTestElement.ts:36](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestElement.ts#L36)

## Properties

### ignoreMissingElementError

• **ignoreMissingElementError**: `boolean`

If the test element is missing, ignore the error. This
will cause the rest of the function to return immediately
without any exceptions being thrown.

#### Implementation of

[IHotTestElementOptions](../interfaces/IHotTestElementOptions.md).[ignoreMissingElementError](../interfaces/IHotTestElementOptions.md#ignoremissingelementerror)

#### Defined in

[HotTestElement.ts:34](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestElement.ts#L34)

___

### mustBeVisible

• **mustBeVisible**: `boolean`

Indicates that the test element must be visible in
order to select it.

#### Implementation of

[IHotTestElementOptions](../interfaces/IHotTestElementOptions.md).[mustBeVisible](../interfaces/IHotTestElementOptions.md#mustbevisible)

#### Defined in

[HotTestElement.ts:28](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotTestElement.ts#L28)
