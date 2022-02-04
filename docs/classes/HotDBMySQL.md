[hotstaq](../README.md) / [Modules](../modules.md) / HotDBMySQL

# Class: HotDBMySQL

The MySQL database connection.

## Hierarchy

- [`HotDB`](HotDB.md)<`mysql.Connection`, [`MySQLResults`](../interfaces/MySQLResults.md), [`MySQLSchema`](MySQLSchema.md)\>

  ↳ **`HotDBMySQL`**

## Table of contents

### Constructors

- [constructor](HotDBMySQL.md#constructor)

### Properties

- [connectionStatus](HotDBMySQL.md#connectionstatus)
- [db](HotDBMySQL.md#db)
- [schema](HotDBMySQL.md#schema)
- [type](HotDBMySQL.md#type)

### Methods

- [connect](HotDBMySQL.md#connect)
- [dbCheck](HotDBMySQL.md#dbcheck)
- [disconnect](HotDBMySQL.md#disconnect)
- [multiQuery](HotDBMySQL.md#multiquery)
- [query](HotDBMySQL.md#query)
- [queryOne](HotDBMySQL.md#queryone)
- [syncMigrationsTableTracker](HotDBMySQL.md#syncmigrationstabletracker)
- [tableCheck](HotDBMySQL.md#tablecheck)

## Constructors

### constructor

• **new HotDBMySQL**(`db?`, `type?`, `schema?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `db` | `Connection` | `null` |
| `type` | `string` | `"mysql"` |
| `schema` | [`MySQLSchema`](MySQLSchema.md) | `null` |

#### Overrides

[HotDB](HotDB.md).[constructor](HotDB.md#constructor)

#### Defined in

[schemas/HotDBMySQL.ts:27](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L27)

## Properties

### connectionStatus

• **connectionStatus**: [`ConnectionStatus`](../enums/ConnectionStatus.md)

The connection status.

#### Inherited from

[HotDB](HotDB.md).[connectionStatus](HotDB.md#connectionstatus)

#### Defined in

[HotDB.ts:30](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotDB.ts#L30)

___

### db

• **db**: `Connection`

The connection to the database (or the driver).

#### Inherited from

[HotDB](HotDB.md).[db](HotDB.md#db)

#### Defined in

[HotDB.ts:26](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotDB.ts#L26)

___

### schema

• **schema**: [`MySQLSchema`](MySQLSchema.md)

The db schema. This will generate a database structure
and keep it maintained as needed.

#### Inherited from

[HotDB](HotDB.md).[schema](HotDB.md#schema)

#### Defined in

[HotDB.ts:35](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotDB.ts#L35)

___

### type

• **type**: `string`

The database type.

#### Inherited from

[HotDB](HotDB.md).[type](HotDB.md#type)

#### Defined in

[HotDB.ts:22](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/HotDB.ts#L22)

## Methods

### connect

▸ **connect**(`connectionInfo`): `Promise`<`any`[]\>

Connect to the database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connectionInfo` | [`HotDBConnectionInterface`](../interfaces/HotDBConnectionInterface.md) |

#### Returns

`Promise`<`any`[]\>

#### Overrides

[HotDB](HotDB.md).[connect](HotDB.md#connect)

#### Defined in

[schemas/HotDBMySQL.ts:35](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L35)

___

### dbCheck

▸ `Protected` **dbCheck**(): `void`

Checks to see if this has a database connection.

#### Returns

`void`

#### Defined in

[schemas/HotDBMySQL.ts:65](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L65)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Disconnect from the server.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotDB](HotDB.md).[disconnect](HotDB.md#disconnect)

#### Defined in

[schemas/HotDBMySQL.ts:306](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L306)

___

### multiQuery

▸ **multiQuery**(`queryStrings`): `Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)[]\>

Make multiple queries. **Warning! This can be a security vulnerability
if misused! Ideally this should only be used when making changes to tables!
Additionally, this could overwhelm the server and each command sent is not
guaranteed to be done in order.**

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryStrings` | `string`[] \| { `query`: `string` ; `values`: `any`[]  }[] |

#### Returns

`Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)[]\>

#### Overrides

[HotDB](HotDB.md).[multiQuery](HotDB.md#multiquery)

#### Defined in

[schemas/HotDBMySQL.ts:267](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L267)

___

### query

▸ **query**(`queryString`, `values?`): `Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)\>

The query to make.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `queryString` | `string` | `undefined` |
| `values` | `any`[] | `[]` |

#### Returns

`Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)\>

#### Overrides

[HotDB](HotDB.md).[query](HotDB.md#query)

#### Defined in

[schemas/HotDBMySQL.ts:218](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L218)

___

### queryOne

▸ **queryOne**(`queryString`, `values?`): `Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)\>

Make a single query. If there are no results, null will be in MySQLResults.results

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `queryString` | `string` | `undefined` |
| `values` | `any`[] | `[]` |

#### Returns

`Promise`<[`MySQLResults`](../interfaces/MySQLResults.md)\>

#### Overrides

[HotDB](HotDB.md).[queryOne](HotDB.md#queryone)

#### Defined in

[schemas/HotDBMySQL.ts:237](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L237)

___

### syncMigrationsTableTracker

▸ **syncMigrationsTableTracker**(): `Promise`<`void`\>

Sync the migrations table tracker. This keeps track of all database table migrations.
If the "migrations" table is missing, it will be created.

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBMySQL.ts:177](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L177)

___

### tableCheck

▸ **tableCheck**(`tableName`): `Promise`<`boolean`\>

Checks if the table exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[HotDB](HotDB.md).[tableCheck](HotDB.md#tablecheck)

#### Defined in

[schemas/HotDBMySQL.ts:191](https://github.com/OurFreeLight/HotStaq/blob/a27c8f4/src/schemas/HotDBMySQL.ts#L191)
