[hotstaq](../README.md) / [Modules](../modules.md) / IHotTestElementOptions

# Interface: IHotTestElementOptions

Hot test element options.

## Implemented by

- [`HotTestElementOptions`](../classes/HotTestElementOptions.md)

## Table of contents

### Properties

- [ignoreMissingElementError](IHotTestElementOptions.md#ignoremissingelementerror)
- [mustBeVisible](IHotTestElementOptions.md#mustbevisible)

## Properties

### ignoreMissingElementError

• `Optional` **ignoreMissingElementError**: `boolean`

If the test element is missing, ignore the error. This
will cause the rest of the function to return immediately
without any exceptions being thrown.

#### Defined in

[HotTestElement.ts:16](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L16)

___

### mustBeVisible

• `Optional` **mustBeVisible**: `boolean`

Indicates that the test element must be visible in
order to select it.

#### Defined in

[HotTestElement.ts:10](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestElement.ts#L10)
