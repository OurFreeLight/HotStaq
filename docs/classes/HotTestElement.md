[hotstaq](../README.md) / [Modules](../modules.md) / HotTestElement

# Class: HotTestElement

A test element.

## Implements

- [`IHotTestElement`](../interfaces/IHotTestElement.md)

## Table of contents

### Constructors

- [constructor](HotTestElement.md#constructor)

### Properties

- [func](HotTestElement.md#func)
- [name](HotTestElement.md#name)
- [value](HotTestElement.md#value)

## Constructors

### constructor

• **new HotTestElement**(`name`, `func?`, `value?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` \| [`IHotTestElement`](../interfaces/IHotTestElement.md) | `undefined` |
| `func` | `string` | `""` |
| `value` | `any` | `null` |

#### Defined in

[HotTestElement.ts:82](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L82)

## Properties

### func

• **func**: `string`

The name of the function to execute
while executing the test.

#### Implementation of

[IHotTestElement](../interfaces/IHotTestElement.md).[func](../interfaces/IHotTestElement.md#func)

#### Defined in

[HotTestElement.ts:76](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L76)

___

### name

• **name**: `string`

The name of the element.

#### Implementation of

[IHotTestElement](../interfaces/IHotTestElement.md).[name](../interfaces/IHotTestElement.md#name)

#### Defined in

[HotTestElement.ts:71](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L71)

___

### value

• **value**: `any`

The value to use.

#### Implementation of

[IHotTestElement](../interfaces/IHotTestElement.md).[value](../interfaces/IHotTestElement.md#value)

#### Defined in

[HotTestElement.ts:80](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L80)
