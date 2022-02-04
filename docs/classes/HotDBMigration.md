[hotstaq](../README.md) / [Modules](../modules.md) / HotDBMigration

# Class: HotDBMigration

Migration data related to table changes.

## Table of contents

### Constructors

- [constructor](HotDBMigration.md#constructor)

### Properties

- [version](HotDBMigration.md#version)

### Methods

- [down](HotDBMigration.md#down)
- [up](HotDBMigration.md#up)

## Constructors

### constructor

• **new HotDBMigration**(`version?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `version` | `number` | `1` |

#### Defined in

[schemas/HotDBMigration.ts:11](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMigration.ts#L11)

## Properties

### version

• **version**: `number`

The version of this migration. **NOTE USE WHOLE INTEGERS ONLY**

#### Defined in

[schemas/HotDBMigration.ts:9](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMigration.ts#L9)

## Methods

### down

▸ `Abstract` **down**(): `Promise`<`void`\>

Executes when migrating the table downwards, or undoing actions.

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBMigration.ts:23](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMigration.ts#L23)

___

### up

▸ `Abstract` **up**(): `Promise`<`void`\>

Executes when migrating the table upwards.

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBMigration.ts:19](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMigration.ts#L19)
