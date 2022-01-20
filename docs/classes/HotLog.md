[hotstaq](../README.md) / [Modules](../modules.md) / HotLog

# Class: HotLog

The logger.

## Table of contents

### Constructors

- [constructor](HotLog.md#constructor)

### Properties

- [logLevel](HotLog.md#loglevel)

### Methods

- [error](HotLog.md#error)
- [info](HotLog.md#info)
- [log](HotLog.md#log)
- [verbose](HotLog.md#verbose)
- [warning](HotLog.md#warning)

## Constructors

### constructor

• **new HotLog**(`logLevel?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `logLevel` | [`HotLogLevel`](../enums/HotLogLevel.md) | `HotLogLevel.All` |

#### Defined in

[HotLog.ts:42](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L42)

## Properties

### logLevel

• **logLevel**: [`HotLogLevel`](../enums/HotLogLevel.md)

The logging level.

#### Defined in

[HotLog.ts:40](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L40)

## Methods

### error

▸ **error**(`message`): `void`

Log an error message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` \| `Error` |

#### Returns

`void`

#### Defined in

[HotLog.ts:136](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L136)

___

### info

▸ **info**(`message`): `void`

Log a message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[HotLog.ts:110](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L110)

___

### log

▸ **log**(`level`, `message`): `void`

Log a message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | [`HotLogLevel`](../enums/HotLogLevel.md) |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[HotLog.ts:50](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L50)

___

### verbose

▸ **verbose**(`message`): `void`

Log a verbose message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[HotLog.ts:101](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L101)

___

### warning

▸ **warning**(`message`): `void`

Log a warning.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[HotLog.ts:123](https://github.com/OurFreeLight/HotStaq/blob/3f2c5d8/src/HotLog.ts#L123)
