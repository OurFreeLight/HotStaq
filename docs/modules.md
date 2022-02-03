[hotstaq](README.md) / Modules

# hotstaq

## Table of contents

### Enumerations

- [ConnectionStatus](enums/ConnectionStatus.md)
- [DeveloperMode](enums/DeveloperMode.md)
- [EventExecutionType](enums/EventExecutionType.md)
- [HTTPMethod](enums/HTTPMethod.md)
- [HotDBGenerationType](enums/HotDBGenerationType.md)
- [HotLogLevel](enums/HotLogLevel.md)

### Classes

- [Hot](classes/Hot.md)
- [HotAPI](classes/HotAPI.md)
- [HotClient](classes/HotClient.md)
- [HotComponent](classes/HotComponent.md)
- [HotDB](classes/HotDB.md)
- [HotDBInflux](classes/HotDBInflux.md)
- [HotDBMigration](classes/HotDBMigration.md)
- [HotDBMySQL](classes/HotDBMySQL.md)
- [HotDBSchema](classes/HotDBSchema.md)
- [HotFile](classes/HotFile.md)
- [HotHTTPServer](classes/HotHTTPServer.md)
- [HotLog](classes/HotLog.md)
- [HotPage](classes/HotPage.md)
- [HotRoute](classes/HotRoute.md)
- [HotRouteMethod](classes/HotRouteMethod.md)
- [HotServer](classes/HotServer.md)
- [HotStaq](classes/HotStaq.md)
- [HotTestDestination](classes/HotTestDestination.md)
- [HotTestDriver](classes/HotTestDriver.md)
- [HotTestElement](classes/HotTestElement.md)
- [HotTestElementOptions](classes/HotTestElementOptions.md)
- [HotTestMap](classes/HotTestMap.md)
- [HotTestSeleniumDriver](classes/HotTestSeleniumDriver.md)
- [HotTester](classes/HotTester.md)
- [HotTesterAPI](classes/HotTesterAPI.md)
- [HotTesterMocha](classes/HotTesterMocha.md)
- [HotTesterMochaSelenium](classes/HotTesterMochaSelenium.md)
- [HotTesterServer](classes/HotTesterServer.md)
- [InfluxSchema](classes/InfluxSchema.md)
- [MySQLSchema](classes/MySQLSchema.md)
- [MySQLSchemaField](classes/MySQLSchemaField.md)
- [MySQLSchemaTable](classes/MySQLSchemaTable.md)

### Interfaces

- [HotDBConnectionInterface](interfaces/HotDBConnectionInterface.md)
- [HotDestination](interfaces/HotDestination.md)
- [HotSite](interfaces/HotSite.md)
- [HotSiteMapPath](interfaces/HotSiteMapPath.md)
- [HotSiteRoute](interfaces/HotSiteRoute.md)
- [HotStartOptions](interfaces/HotStartOptions.md)
- [HotTestPage](interfaces/HotTestPage.md)
- [HotTestStop](interfaces/HotTestStop.md)
- [IHotComponent](interfaces/IHotComponent.md)
- [IHotStaq](interfaces/IHotStaq.md)
- [IHotTestElement](interfaces/IHotTestElement.md)
- [IHotTestElementOptions](interfaces/IHotTestElementOptions.md)
- [MySQLResults](interfaces/MySQLResults.md)
- [MySQLSchemaFieldResult](interfaces/MySQLSchemaFieldResult.md)

### Type aliases

- [APItoLoad](modules.md#apitoload)
- [HotTestPath](modules.md#hottestpath)
- [ServerAuthorizationFunction](modules.md#serverauthorizationfunction)
- [ServerExecutionFunction](modules.md#serverexecutionfunction)

## Type aliases

### APItoLoad

Ƭ **APItoLoad**: `Object`

The API to load.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exportedClassName` | `string` |
| `path` | `string` |

#### Defined in

[HotAPI.ts:14](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotAPI.ts#L14)

___

### HotTestPath

Ƭ **HotTestPath**: (`driver`: [`HotTestDriver`](classes/HotTestDriver.md), ...`args`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`driver`, ...`args`): `Promise`<`any`\>

Create a test path for later execution.

##### Parameters

| Name | Type |
| :------ | :------ |
| `driver` | [`HotTestDriver`](classes/HotTestDriver.md) |
| `...args` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[HotTestMap.ts:8](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotTestMap.ts#L8)

___

### ServerAuthorizationFunction

Ƭ **ServerAuthorizationFunction**: (`req`: `any`, `res`: `any`, `jsonObj`: `any`, `queryObj`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`req`, `res`, `jsonObj`, `queryObj`): `Promise`<`any`\>

A function that will be executed by the server for authorization. Any value
returned from this function will be passed to the ServerExecutionFunction.
If an undefined value is returned, this indicates the server was not able
to authenticate the user, so the ServerExecutionFunction will not be
executed.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `jsonObj` | `any` |
| `queryObj` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[HotRouteMethod.ts:36](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L36)

___

### ServerExecutionFunction

Ƭ **ServerExecutionFunction**: (`req`: `any`, `res`: `any`, `authorizedValue`: `any`, `jsonObj`: `any`, `queryObj`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`req`, `res`, `authorizedValue`, `jsonObj`, `queryObj`): `Promise`<`any`\>

A function that will be executed by the server.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `authorizedValue` | `any` |
| `jsonObj` | `any` |
| `queryObj` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[HotRouteMethod.ts:23](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotRouteMethod.ts#L23)
