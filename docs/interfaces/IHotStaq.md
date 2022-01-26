[hotstaq](../README.md) / [Modules](../modules.md) / IHotStaq

# Interface: IHotStaq

The main class that handles all HTML preprocessing, then outputs the
results.

## Implemented by

- [`HotStaq`](../classes/HotStaq.md)

## Table of contents

### Properties

- [api](IHotStaq.md#api)
- [components](IHotStaq.md#components)
- [files](IHotStaq.md#files)
- [hotSite](IHotStaq.md#hotsite)
- [mode](IHotStaq.md#mode)
- [pages](IHotStaq.md#pages)
- [testerAPI](IHotStaq.md#testerapi)

## Properties

### api

• `Optional` **api**: [`HotAPI`](../classes/HotAPI.md)

The api that's used to communicate with.

#### Defined in

[HotStaq.ts:342](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L342)

___

### components

• `Optional` **components**: `Object`

The components that can be constructed.

#### Index signature

▪ [name: `string`]: [`HotComponent`](../classes/HotComponent.md)

#### Defined in

[HotStaq.ts:358](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L358)

___

### files

• `Optional` **files**: `Object`

The files that can be stored for later use.

#### Index signature

▪ [name: `string`]: [`HotFile`](../classes/HotFile.md)

#### Defined in

[HotStaq.ts:362](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L362)

___

### hotSite

• `Optional` **hotSite**: [`HotSite`](HotSite.md)

The loaded hotsite.

#### Defined in

[HotStaq.ts:366](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L366)

___

### mode

• `Optional` **mode**: [`DeveloperMode`](../enums/DeveloperMode.md)

Indicates what type of execution this is.

#### Defined in

[HotStaq.ts:350](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L350)

___

### pages

• `Optional` **pages**: `Object`

The pages that can be constructed.

#### Index signature

▪ [name: `string`]: [`HotPage`](../classes/HotPage.md)

#### Defined in

[HotStaq.ts:354](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L354)

___

### testerAPI

• `Optional` **testerAPI**: [`HotAPI`](../classes/HotAPI.md)

The tester api that's used to communicate with.

#### Defined in

[HotStaq.ts:346](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L346)
