[hotstaq](../README.md) / [Modules](../modules.md) / HotDB

# Class: HotDB<DBType, DBResultType, DBSchema\>

The server-side database connection.

## Type parameters

| Name | Type |
| :------ | :------ |
| `DBType` | `any` |
| `DBResultType` | `any` |
| `DBSchema` | [`HotDBSchema`](HotDBSchema.md) |

## Hierarchy

- **`HotDB`**

  ↳ [`HotDBMySQL`](HotDBMySQL.md)

  ↳ [`HotDBInflux`](HotDBInflux.md)

## Table of contents

### Constructors

- [constructor](HotDB.md#constructor)

### Properties

- [connectionStatus](HotDB.md#connectionstatus)
- [db](HotDB.md#db)
- [schema](HotDB.md#schema)
- [type](HotDB.md#type)

### Methods

- [connect](HotDB.md#connect)
- [disconnect](HotDB.md#disconnect)
- [multiQuery](HotDB.md#multiquery)
- [query](HotDB.md#query)
- [queryOne](HotDB.md#queryone)
- [tableCheck](HotDB.md#tablecheck)

## Constructors

### constructor

• **new HotDB**<`DBType`, `DBResultType`, `DBSchema`\>(`db?`, `type?`, `schema?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DBType` | `any` |
| `DBResultType` | `any` |
| `DBSchema` | [`HotDBSchema`](HotDBSchema.md) |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `db` | `DBType` | `null` |
| `type` | `string` | `""` |
| `schema` | `DBSchema` | `null` |

#### Defined in

HotDB.ts:37

## Properties

### connectionStatus

• **connectionStatus**: [`ConnectionStatus`](../enums/ConnectionStatus.md)

The connection status.

#### Defined in

HotDB.ts:30

___

### db

• **db**: `DBType`

The connection to the database (or the driver).

#### Defined in

HotDB.ts:26

___

### schema

• **schema**: `DBSchema`

The db schema. This will generate a database structure
and keep it maintained as needed.

#### Defined in

HotDB.ts:35

___

### type

• **type**: `string`

The database type.

#### Defined in

HotDB.ts:22

## Methods

### connect

▸ `Abstract` **connect**(`connectionInfo`): `Promise`<`any`[]\>

Connect to the database. This will only start connecting
if db is null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connectionInfo` | [`HotDBConnectionInterface`](../interfaces/HotDBConnectionInterface.md) |

#### Returns

`Promise`<`any`[]\>

#### Defined in

HotDB.ts:49

___

### disconnect

▸ `Abstract` **disconnect**(): `Promise`<`void`\>

Disconnect from the server.

#### Returns

`Promise`<`void`\>

#### Defined in

HotDB.ts:78

___

### multiQuery

▸ `Optional` `Abstract` **multiQuery**(`queryStrings`): `Promise`<`DBResultType`[]\>

Make multiple queries.

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryStrings` | `string`[] \| { `query`: `string` ; `values`: `any`[]  }[] |

#### Returns

`Promise`<`DBResultType`[]\>

#### Defined in

HotDB.ts:74

___

### query

▸ `Optional` `Abstract` **query**(`queryString`, `values?`): `Promise`<`DBResultType`\>

The query to make.

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryString` | `string` |
| `values?` | `any`[] |

#### Returns

`Promise`<`DBResultType`\>

#### Defined in

HotDB.ts:66

___

### queryOne

▸ `Optional` `Abstract` **queryOne**(`queryString`, `values?`): `Promise`<`DBResultType`\>

Make a single query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryString` | `string` |
| `values?` | `any`[] |

#### Returns

`Promise`<`DBResultType`\>

#### Defined in

HotDB.ts:70

___

### tableCheck

▸ `Optional` `Abstract` **tableCheck**(`tableName`): `Promise`<`boolean`\>

Checks if the table exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

HotDB.ts:62
