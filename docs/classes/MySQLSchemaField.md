[hotstaq](../README.md) / [Modules](../modules.md) / MySQLSchemaField

# Class: MySQLSchemaField

The database field.

## Implements

- `IMySQLSchemaField`

## Table of contents

### Constructors

- [constructor](MySQLSchemaField.md#constructor)

### Properties

- [autoIncrement](MySQLSchemaField.md#autoincrement)
- [binaryColumn](MySQLSchemaField.md#binarycolumn)
- [dataType](MySQLSchemaField.md#datatype)
- [defaultValue](MySQLSchemaField.md#defaultvalue)
- [fillZeroes](MySQLSchemaField.md#fillzeroes)
- [generatedColumn](MySQLSchemaField.md#generatedcolumn)
- [name](MySQLSchemaField.md#name)
- [notNull](MySQLSchemaField.md#notnull)
- [primaryKey](MySQLSchemaField.md#primarykey)
- [strAroundDefaultValue](MySQLSchemaField.md#strarounddefaultvalue)
- [uniqueIndex](MySQLSchemaField.md#uniqueindex)
- [unsignedDataType](MySQLSchemaField.md#unsigneddatatype)

### Methods

- [generate](MySQLSchemaField.md#generate)
- [compare](MySQLSchemaField.md#compare)
- [parse](MySQLSchemaField.md#parse)

## Constructors

### constructor

• **new MySQLSchemaField**(`name`, `dataType?`, `defaultValue?`, `primaryKey?`, `notNull?`, `uniqueIndex?`, `binaryColumn?`, `unsignedDataType?`, `fillZeroes?`, `autoIncrement?`, `generatedColumn?`, `strAroundDefaultValue?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` \| `IMySQLSchemaField` | `undefined` |
| `dataType` | `string` | `""` |
| `defaultValue` | `string` | `""` |
| `primaryKey` | `boolean` | `false` |
| `notNull` | `boolean` | `true` |
| `uniqueIndex` | `boolean` | `false` |
| `binaryColumn` | `boolean` | `false` |
| `unsignedDataType` | `boolean` | `false` |
| `fillZeroes` | `boolean` | `false` |
| `autoIncrement` | `boolean` | `false` |
| `generatedColumn` | `boolean` | `false` |
| `strAroundDefaultValue` | `string` | `"'"` |

#### Defined in

schemas/mysql/MySQLSchemaField.ts:145

## Properties

### autoIncrement

• **autoIncrement**: `boolean`

Set as an auto incrementing column.

#### Implementation of

IMySQLSchemaField.autoIncrement

#### Defined in

schemas/mysql/MySQLSchemaField.ts:129

___

### binaryColumn

• **binaryColumn**: `boolean`

Set as a binary column.

#### Implementation of

IMySQLSchemaField.binaryColumn

#### Defined in

schemas/mysql/MySQLSchemaField.ts:117

___

### dataType

• **dataType**: `string`

The data type, be sure to include the length of the
data type here as well.

#### Implementation of

IMySQLSchemaField.dataType

#### Defined in

schemas/mysql/MySQLSchemaField.ts:101

___

### defaultValue

• **defaultValue**: `string`

Set the default value. If this is set to null, a
MySQL NULL value will be used.

#### Implementation of

IMySQLSchemaField.defaultValue

#### Defined in

schemas/mysql/MySQLSchemaField.ts:138

___

### fillZeroes

• **fillZeroes**: `boolean`

If this column is a number, fill with zeroes.

#### Implementation of

IMySQLSchemaField.fillZeroes

#### Defined in

schemas/mysql/MySQLSchemaField.ts:125

___

### generatedColumn

• **generatedColumn**: `boolean`

Set as a generated column.

#### Implementation of

IMySQLSchemaField.generatedColumn

#### Defined in

schemas/mysql/MySQLSchemaField.ts:133

___

### name

• **name**: `string`

The name of the field.

#### Implementation of

IMySQLSchemaField.name

#### Defined in

schemas/mysql/MySQLSchemaField.ts:96

___

### notNull

• **notNull**: `boolean`

Set as a not null.

#### Implementation of

IMySQLSchemaField.notNull

#### Defined in

schemas/mysql/MySQLSchemaField.ts:109

___

### primaryKey

• **primaryKey**: `boolean`

Set as a primary key.

#### Implementation of

IMySQLSchemaField.primaryKey

#### Defined in

schemas/mysql/MySQLSchemaField.ts:105

___

### strAroundDefaultValue

• **strAroundDefaultValue**: `string`

Set the string to be used when setting the default
value. The default is: '

#### Implementation of

IMySQLSchemaField.strAroundDefaultValue

#### Defined in

schemas/mysql/MySQLSchemaField.ts:143

___

### uniqueIndex

• **uniqueIndex**: `boolean`

Set as a unique index.

#### Implementation of

IMySQLSchemaField.uniqueIndex

#### Defined in

schemas/mysql/MySQLSchemaField.ts:113

___

### unsignedDataType

• **unsignedDataType**: `boolean`

Set as an unsigned data type.

#### Implementation of

IMySQLSchemaField.unsignedDataType

#### Defined in

schemas/mysql/MySQLSchemaField.ts:121

## Methods

### generate

▸ **generate**(): `Promise`<[`MySQLSchemaFieldResult`](../interfaces/MySQLSchemaFieldResult.md)\>

Generate the db command.

#### Returns

`Promise`<[`MySQLSchemaFieldResult`](../interfaces/MySQLSchemaFieldResult.md)\>

#### Defined in

schemas/mysql/MySQLSchemaField.ts:326

___

### compare

▸ `Static` **compare**(`field1`, `field2`, `onlyKeys?`, `stringFilter?`): `boolean`

Compare two different fields. This will iterate through all keys in each field. Any
string values found will have stringFilter applied to it, removing everything that
is in that stringFilter regex. Additionally for any empty strings found it will
compare to any undefined/null on the other side, and treat them as the same.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `field1` | [`MySQLSchemaField`](MySQLSchemaField.md) | `undefined` | The first field to compare. |
| `field2` | [`MySQLSchemaField`](MySQLSchemaField.md) | `undefined` | The second field to compare. |
| `onlyKeys` | `string`[] | `null` | Only compare using the provided keys. If set to null, this will compare using all of the keys in these objects. |
| `stringFilter` | `RegExp` | `undefined` | The regex to be used to help make any filters on any detected strings. The default regex provided will remove any whitespaces, single/doube quotes, back ticks, and parenthesis. If this is set to null, it will not be used. |

#### Returns

`boolean`

#### Defined in

schemas/mysql/MySQLSchemaField.ts:201

___

### parse

▸ `Static` **parse**(`json`): [`MySQLSchemaField`](MySQLSchemaField.md)

Parse a JSON object and get a MySQLSchemaField object from it.
Warning! This is only partially implemented. This will not check
the following fields:
* Binary column
* unique
* zero-filled
* generated column

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |

#### Returns

[`MySQLSchemaField`](MySQLSchemaField.md)

#### Defined in

schemas/mysql/MySQLSchemaField.ts:266
