[hotstaq](../README.md) / [Modules](../modules.md) / MySQLSchema

# Class: MySQLSchema

The MySQL schema.

## Hierarchy

- [`HotDBSchema`](HotDBSchema.md)

  ↳ **`MySQLSchema`**

## Table of contents

### Constructors

- [constructor](MySQLSchema.md#constructor)

### Properties

- [name](MySQLSchema.md#name)
- [tables](MySQLSchema.md#tables)

### Methods

- [addFieldToTable](MySQLSchema.md#addfieldtotable)
- [addFieldsToTable](MySQLSchema.md#addfieldstotable)
- [addTable](MySQLSchema.md#addtable)
- [generateStructure](MySQLSchema.md#generatestructure)
- [generateTableStructure](MySQLSchema.md#generatetablestructure)

## Constructors

### constructor

• **new MySQLSchema**(`name`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Overrides

[HotDBSchema](HotDBSchema.md).[constructor](HotDBSchema.md#constructor)

#### Defined in

[schemas/mysql/MySQLSchema.ts:16](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L16)

## Properties

### name

• **name**: `string`

The name of this schema.

#### Inherited from

[HotDBSchema](HotDBSchema.md).[name](HotDBSchema.md#name)

#### Defined in

[schemas/HotDBSchema.ts:15](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBSchema.ts#L15)

___

### tables

• **tables**: `Object`

The tables in this schema.

#### Index signature

▪ [name: `string`]: [`MySQLSchemaTable`](MySQLSchemaTable.md)

#### Defined in

[schemas/mysql/MySQLSchema.ts:14](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L14)

## Methods

### addFieldToTable

▸ **addFieldToTable**(`tableName`, `field`): `void`

Add a field to a table.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `field` | [`MySQLSchemaField`](MySQLSchemaField.md) |

#### Returns

`void`

#### Defined in

[schemas/mysql/MySQLSchema.ts:34](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L34)

___

### addFieldsToTable

▸ **addFieldsToTable**(`tableName`, `fields`): `void`

Add a field to a table.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `fields` | [`MySQLSchemaField`](MySQLSchemaField.md)[] |

#### Returns

`void`

#### Defined in

[schemas/mysql/MySQLSchema.ts:45](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L45)

___

### addTable

▸ **addTable**(`table`): `void`

Add a table to this schema.

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | [`MySQLSchemaTable`](MySQLSchemaTable.md) |

#### Returns

`void`

#### Defined in

[schemas/mysql/MySQLSchema.ts:26](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L26)

___

### generateStructure

▸ **generateStructure**(`type?`, `db?`): `Promise`<`string`[][]\>

Generate the entire db structure. If type is set to modify, you must pass a db with an
active connection.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`HotDBGenerationType`](../enums/HotDBGenerationType.md) | `HotDBGenerationType.Create` |
| `db` | [`HotDBMySQL`](HotDBMySQL.md) | `null` |

#### Returns

`Promise`<`string`[][]\>

#### Defined in

[schemas/mysql/MySQLSchema.ts:77](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L77)

___

### generateTableStructure

▸ **generateTableStructure**(`tableName`, `type?`, `db?`): `Promise`<`string`[]\>

Generate a table's structure. If type is set to modify, you must pass a db with an
active connection.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `tableName` | `string` | `undefined` |
| `type` | [`HotDBGenerationType`](../enums/HotDBGenerationType.md) | `HotDBGenerationType.Create` |
| `db` | [`HotDBMySQL`](HotDBMySQL.md) | `null` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[schemas/mysql/MySQLSchema.ts:61](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/mysql/MySQLSchema.ts#L61)
