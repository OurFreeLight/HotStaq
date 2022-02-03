[hotstaq](../README.md) / [Modules](../modules.md) / HotDBInflux

# Class: HotDBInflux

The Influx database connection.

## Hierarchy

- [`HotDB`](HotDB.md)<`InfluxDB`, `void`, [`InfluxSchema`](InfluxSchema.md)\>

  ↳ **`HotDBInflux`**

## Table of contents

### Constructors

- [constructor](HotDBInflux.md#constructor)

### Properties

- [connectionStatus](HotDBInflux.md#connectionstatus)
- [db](HotDBInflux.md#db)
- [multiQuery](HotDBInflux.md#multiquery)
- [queryApi](HotDBInflux.md#queryapi)
- [queryOne](HotDBInflux.md#queryone)
- [schema](HotDBInflux.md#schema)
- [syncTable](HotDBInflux.md#synctable)
- [tableCheck](HotDBInflux.md#tablecheck)
- [type](HotDBInflux.md#type)
- [writeApi](HotDBInflux.md#writeapi)

### Methods

- [addPoint](HotDBInflux.md#addpoint)
- [addPoints](HotDBInflux.md#addpoints)
- [connect](HotDBInflux.md#connect)
- [dbCheck](HotDBInflux.md#dbcheck)
- [disconnect](HotDBInflux.md#disconnect)
- [query](HotDBInflux.md#query)
- [sendPoints](HotDBInflux.md#sendpoints)
- [write](HotDBInflux.md#write)
- [writePoints](HotDBInflux.md#writepoints)

## Constructors

### constructor

• **new HotDBInflux**(`db?`, `type?`, `schema?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `db` | `InfluxDB` | `null` |
| `type` | `string` | `"influx"` |
| `schema` | [`InfluxSchema`](InfluxSchema.md) | `null` |

#### Overrides

[HotDB](HotDB.md).[constructor](HotDB.md#constructor)

#### Defined in

[schemas/HotDBInflux.ts:21](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L21)

## Properties

### connectionStatus

• **connectionStatus**: [`ConnectionStatus`](../enums/ConnectionStatus.md)

The connection status.

#### Inherited from

[HotDB](HotDB.md).[connectionStatus](HotDB.md#connectionstatus)

#### Defined in

[HotDB.ts:30](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotDB.ts#L30)

___

### db

• **db**: `InfluxDB`

The connection to the database (or the driver).

#### Inherited from

[HotDB](HotDB.md).[db](HotDB.md#db)

#### Defined in

[HotDB.ts:26](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotDB.ts#L26)

___

### multiQuery

• **multiQuery**: `undefined`

#### Overrides

[HotDB](HotDB.md).[multiQuery](HotDB.md#multiquery)

#### Defined in

[schemas/HotDBInflux.ts:69](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L69)

___

### queryApi

• **queryApi**: `QueryApi`

The Influx query api.

#### Defined in

[schemas/HotDBInflux.ts:19](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L19)

___

### queryOne

• **queryOne**: `undefined`

#### Overrides

[HotDB](HotDB.md).[queryOne](HotDB.md#queryone)

#### Defined in

[schemas/HotDBInflux.ts:70](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L70)

___

### schema

• **schema**: [`InfluxSchema`](InfluxSchema.md)

The db schema. This will generate a database structure
and keep it maintained as needed.

#### Inherited from

[HotDB](HotDB.md).[schema](HotDB.md#schema)

#### Defined in

[HotDB.ts:35](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotDB.ts#L35)

___

### syncTable

• **syncTable**: `undefined`

#### Defined in

[schemas/HotDBInflux.ts:72](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L72)

___

### tableCheck

• **tableCheck**: `undefined`

#### Overrides

[HotDB](HotDB.md).[tableCheck](HotDB.md#tablecheck)

#### Defined in

[schemas/HotDBInflux.ts:73](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L73)

___

### type

• **type**: `string`

The database type.

#### Inherited from

[HotDB](HotDB.md).[type](HotDB.md#type)

#### Defined in

[HotDB.ts:22](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotDB.ts#L22)

___

### writeApi

• **writeApi**: `WriteApi`

The Influx write api.

#### Defined in

[schemas/HotDBInflux.ts:15](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L15)

## Methods

### addPoint

▸ **addPoint**(`point`): `void`

Write to the database. This will only store the point. It will not send to the database
unless sendPoints is called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `point` | `Point` |

#### Returns

`void`

#### Defined in

[schemas/HotDBInflux.ts:88](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L88)

___

### addPoints

▸ **addPoints**(`points`): `void`

Write to the database. This will only store the points. It will not send to the database
unless sendPoints is called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | `Point`[] |

#### Returns

`void`

#### Defined in

[schemas/HotDBInflux.ts:100](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L100)

___

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

[schemas/HotDBInflux.ts:29](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L29)

___

### dbCheck

▸ `Protected` **dbCheck**(): `void`

Checks to see if this has a database connection.

#### Returns

`void`

#### Defined in

[schemas/HotDBInflux.ts:78](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L78)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Disconnect from the server.

#### Returns

`Promise`<`void`\>

#### Overrides

[HotDB](HotDB.md).[disconnect](HotDB.md#disconnect)

#### Defined in

[schemas/HotDBInflux.ts:203](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L203)

___

### query

▸ **query**(`queryString`, `values?`, `nextFunc?`, `errorFunc?`): `Promise`<`void`\>

The query to make.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `queryString` | `string` | `undefined` |
| `values` | `any`[] | `[]` |
| `nextFunc` | (`row`: `string`[], `tableMeta`: `FluxTableMetaData`) => `void` | `null` |
| `errorFunc` | (`error`: `Error`) => `void` | `null` |

#### Returns

`Promise`<`void`\>

#### Overrides

[HotDB](HotDB.md).[query](HotDB.md#query)

#### Defined in

[schemas/HotDBInflux.ts:160](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L160)

___

### sendPoints

▸ **sendPoints**(): `Promise`<`void`\>

Writes all stored points to the database.

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBInflux.ts:111](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L111)

___

### write

▸ **write**(`point`): `Promise`<`void`\>

Write to the database. This will call close and send the point immediately to the database.
Do not use this to send lots of data. If you're sending batches of data, be sure to use
writePoints.

#### Parameters

| Name | Type |
| :------ | :------ |
| `point` | `Point` |

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBInflux.ts:134](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L134)

___

### writePoints

▸ **writePoints**(`points`): `Promise`<`void`\>

Write points to the database. This will call close and send the point immediately to the database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | `Point`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[schemas/HotDBInflux.ts:147](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/schemas/HotDBInflux.ts#L147)
