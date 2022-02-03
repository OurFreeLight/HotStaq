[hotstaq](../README.md) / [Modules](../modules.md) / MySQLSchemaTable

# Class: MySQLSchemaTable

The database table.

## Table of contents

### Constructors

- [constructor](MySQLSchemaTable.md#constructor)

### Properties

- [charset](MySQLSchemaTable.md#charset)
- [description](MySQLSchemaTable.md#description)
- [engine](MySQLSchemaTable.md#engine)
- [fields](MySQLSchemaTable.md#fields)
- [name](MySQLSchemaTable.md#name)

### Methods

- [addField](MySQLSchemaTable.md#addfield)
- [addFields](MySQLSchemaTable.md#addfields)
- [generate](MySQLSchemaTable.md#generate)

## Constructors

### constructor

• **new MySQLSchemaTable**(`name?`, `fields?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `""` |
| `fields` | [`MySQLSchemaField`](MySQLSchemaField.md)[] | `[]` |

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:31](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L31)

## Properties

### charset

• **charset**: `string`

The table's charset to use.

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:29](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L29)

___

### description

• **description**: `string`

The table's description.

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:17](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L17)

___

### engine

• **engine**: `string`

The table's engine to use.

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:25](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L25)

___

### fields

• **fields**: [`MySQLSchemaField`](MySQLSchemaField.md)[]

The fields in the table.

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:21](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L21)

___

### name

• **name**: `string`

The name of the table.

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:13](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L13)

## Methods

### addField

▸ **addField**(`field`): `void`

Add a field.

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`MySQLSchemaField`](MySQLSchemaField.md) |

#### Returns

`void`

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:43](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L43)

___

### addFields

▸ **addFields**(`fields`): `void`

Add a field.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`MySQLSchemaField`](MySQLSchemaField.md)[] |

#### Returns

`void`

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:51](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L51)

___

### generate

▸ **generate**(`type?`, `db?`): `Promise`<`string`[]\>

Generate the db command. If type is set to modify, you must pass a db with an
active connection. Since field parsing isn't completely implemented yet, not all
fields will be modified correctly. Use modifiying with caution. This will
skip checking for:
* Binary columnexistingFields
* unique
* zero-filled
* generated column

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`HotDBGenerationType`](../enums/HotDBGenerationType.md) | `HotDBGenerationType.Create` |
| `db` | [`HotDBMySQL`](HotDBMySQL.md) | `null` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[schemas/mysql/MySQLSchemaTable.ts:70](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/mysql/MySQLSchemaTable.ts#L70)
