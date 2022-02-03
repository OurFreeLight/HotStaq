[hotstaq](../README.md) / [Modules](../modules.md) / InfluxSchema

# Class: InfluxSchema

The Influx schema.

## Hierarchy

- [`HotDBSchema`](HotDBSchema.md)

  ↳ **`InfluxSchema`**

## Table of contents

### Constructors

- [constructor](InfluxSchema.md#constructor)

### Properties

- [buckets](InfluxSchema.md#buckets)
- [name](InfluxSchema.md#name)

## Constructors

### constructor

• **new InfluxSchema**(`name`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Overrides

[HotDBSchema](HotDBSchema.md).[constructor](HotDBSchema.md#constructor)

#### Defined in

[schemas/influx/InfluxSchema.ts:13](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/influx/InfluxSchema.ts#L13)

## Properties

### buckets

• **buckets**: `Object`

The buckets in this schema.

#### Index signature

▪ [name: `string`]: `any`

#### Defined in

[schemas/influx/InfluxSchema.ts:11](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/influx/InfluxSchema.ts#L11)

___

### name

• **name**: `string`

The name of this schema.

#### Inherited from

[HotDBSchema](HotDBSchema.md).[name](HotDBSchema.md#name)

#### Defined in

[schemas/HotDBSchema.ts:15](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBSchema.ts#L15)
