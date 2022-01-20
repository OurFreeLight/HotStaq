[hotstaq](../README.md) / [Modules](../modules.md) / HotTesterAPI

# Class: HotTesterAPI

## Hierarchy

- [`HotAPI`](HotAPI.md)

  ↳ **`HotTesterAPI`**

## Table of contents

### Constructors

- [constructor](HotTesterAPI.md#constructor)

### Properties

- [authCredentials](HotTesterAPI.md#authcredentials)
- [baseUrl](HotTesterAPI.md#baseurl)
- [connection](HotTesterAPI.md#connection)
- [createFunctions](HotTesterAPI.md#createfunctions)
- [db](HotTesterAPI.md#db)
- [executeEventsUsing](HotTesterAPI.md#executeeventsusing)
- [onPostRegister](HotTesterAPI.md#onpostregister)
- [onPreRegister](HotTesterAPI.md#onpreregister)
- [routes](HotTesterAPI.md#routes)
- [userAuth](HotTesterAPI.md#userauth)

### Methods

- [addRoute](HotTesterAPI.md#addroute)
- [call](HotTesterAPI.md#call)
- [executeTests](HotTesterAPI.md#executetests)
- [getDB](HotTesterAPI.md#getdb)
- [getDBSchema](HotTesterAPI.md#getdbschema)
- [pageLoaded](HotTesterAPI.md#pageloaded)
- [registerRoute](HotTesterAPI.md#registerroute)
- [registerRoutes](HotTesterAPI.md#registerroutes)
- [setDBSchema](HotTesterAPI.md#setdbschema)

## Constructors

### constructor

• **new HotTesterAPI**(`baseUrl`, `connection?`, `db?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `baseUrl` | `string` | `undefined` |
| `connection` | [`HotServer`](HotServer.md) \| [`HotClient`](HotClient.md) | `null` |
| `db` | `any` | `null` |

#### Overrides

[HotAPI](HotAPI.md).[constructor](HotAPI.md#constructor)

#### Defined in

HotTesterAPI.ts:11

## Properties

### authCredentials

• **authCredentials**: `any`

The authorization credentials to use throughout the application.

#### Inherited from

[HotAPI](HotAPI.md).[authCredentials](HotAPI.md#authcredentials)

#### Defined in

HotAPI.ts:50

___

### baseUrl

• **baseUrl**: `string`

The base url for the server.

#### Inherited from

[HotAPI](HotAPI.md).[baseUrl](HotAPI.md#baseurl)

#### Defined in

HotAPI.ts:33

___

### connection

• **connection**: [`HotServer`](HotServer.md) \| [`HotClient`](HotClient.md)

The server connection.

#### Inherited from

[HotAPI](HotAPI.md).[connection](HotAPI.md#connection)

#### Defined in

HotAPI.ts:29

___

### createFunctions

• **createFunctions**: `boolean`

If set, this will create the route variables and functions for
easy client/server calling.

#### Inherited from

[HotAPI](HotAPI.md).[createFunctions](HotAPI.md#createfunctions)

#### Defined in

HotAPI.ts:38

___

### db

• **db**: [`HotDB`](HotDB.md)<`any`, `any`, [`HotDBSchema`](HotDBSchema.md)\>

The database connection.

#### Inherited from

[HotAPI](HotAPI.md).[db](HotAPI.md#db)

#### Defined in

HotAPI.ts:46

___

### executeEventsUsing

• **executeEventsUsing**: [`EventExecutionType`](../enums/EventExecutionType.md)

The database connection.

#### Inherited from

[HotAPI](HotAPI.md).[executeEventsUsing](HotAPI.md#executeeventsusing)

#### Defined in

HotAPI.ts:42

___

### onPostRegister

• **onPostRegister**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Executed when the API has finished registering routes. If
this function returns false, the server will not start.

##### Returns

`Promise`<`boolean`\>

#### Inherited from

[HotAPI](HotAPI.md).[onPostRegister](HotAPI.md#onpostregister)

#### Defined in

HotAPI.ts:68

___

### onPreRegister

• **onPreRegister**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Executed when the API is about to start registering routes. If
this function returns false, the server will not start.

##### Returns

`Promise`<`boolean`\>

#### Inherited from

[HotAPI](HotAPI.md).[onPreRegister](HotAPI.md#onpreregister)

#### Defined in

HotAPI.ts:63

___

### routes

• **routes**: `Object`

The database connection.

#### Index signature

▪ [name: `string`]: [`HotRoute`](HotRoute.md)

#### Inherited from

[HotAPI](HotAPI.md).[routes](HotAPI.md#routes)

#### Defined in

HotAPI.ts:58

___

### userAuth

• **userAuth**: [`ServerAuthorizationFunction`](../modules.md#serverauthorizationfunction)

The function used for user authentication.

#### Inherited from

[HotAPI](HotAPI.md).[userAuth](HotAPI.md#userauth)

#### Defined in

HotAPI.ts:54

## Methods

### addRoute

▸ **addRoute**(`route`, `routeMethod?`, `executeFunction?`): `void`

Add a route. If this.createFunctions is set to true, this will take the incoming
route and create an object in this HotAPI object using the name of the route. If there's
any HotRouteMethods inside of the incoming HotRoute, it will create the methods
and attach them to the newly created HotRoute object.

Example:
```
export class Users extends HotRoute
{
		constructor (api: FreeLightAPI)
		{
			super (api.connection, "user");

			this.addMethod ("create", this._create, HTTPMethod.POST);
		}

		protected async _create (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
		{
			return (true);
		}
}
```

This in turn could be used like so:
```
Hot.API.user.create ({});
```

Additionally it would create the endpoint: ```http://127.0.0.1:8080/v1/user/create```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `route` | `string` \| [`HotRoute`](HotRoute.md) | `undefined` | The route to add. Can be either a full HotRoute object, or just the route's name. If a HotRoute object is supplied, the rest of the parameters will be ignored. |
| `routeMethod` | `string` \| [`HotRouteMethod`](HotRouteMethod.md) | `null` | The route's method to add. If the route parameter is a string, it will be interpreted as the route's name, and this will be the method added to the new route. |
| `executeFunction` | (`req`: `any`, `res`: `any`, `authorizedValue`: `any`, `jsonObj`: `any`, `queryObj`: `any`) => `Promise`<`any`\> | `null` | The function to execute when routeMethod is called by the API. |

#### Returns

`void`

#### Inherited from

[HotAPI](HotAPI.md).[addRoute](HotAPI.md#addroute)

#### Defined in

HotAPI.ts:159

___

### call

▸ **call**(`route`, `data`, `httpMethod?`): `Promise`<`any`\>

Make a call to the API.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `route` | `string` | `undefined` |
| `data` | `any` | `undefined` |
| `httpMethod` | `string` | `"POST"` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[HotAPI](HotAPI.md).[call](HotAPI.md#call)

#### Defined in

HotAPI.ts:335

___

### executeTests

▸ **executeTests**(`req`, `res`, `authorizedValue`, `jsonObj`, `queryObj`): `Promise`<`any`\>

Execute the tests for a page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `authorizedValue` | `any` |
| `jsonObj` | `any` |
| `queryObj` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

HotTesterAPI.ts:104

___

### getDB

▸ **getDB**(): [`HotDB`](HotDB.md)<`any`, `any`, [`HotDBSchema`](HotDBSchema.md)\>

Get the database being used.

#### Returns

[`HotDB`](HotDB.md)<`any`, `any`, [`HotDBSchema`](HotDBSchema.md)\>

#### Inherited from

[HotAPI](HotAPI.md).[getDB](HotAPI.md#getdb)

#### Defined in

HotAPI.ts:101

___

### getDBSchema

▸ **getDBSchema**(): [`HotDBSchema`](HotDBSchema.md)

Get the database schema being used.

#### Returns

[`HotDBSchema`](HotDBSchema.md)

#### Inherited from

[HotAPI](HotAPI.md).[getDBSchema](HotAPI.md#getdbschema)

#### Defined in

HotAPI.ts:112

___

### pageLoaded

▸ **pageLoaded**(`req`, `res`, `authorizedValue`, `jsonObj`, `queryObj`): `Promise`<`any`\>

This is called when the page has finished loading in development mode.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `authorizedValue` | `any` |
| `jsonObj` | `any` |
| `queryObj` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

HotTesterAPI.ts:26

___

### registerRoute

▸ **registerRoute**(`route`): `Promise`<`void`\>

Register a route with the server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | [`HotRoute`](HotRoute.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotAPI](HotAPI.md).[registerRoute](HotAPI.md#registerroute)

#### Defined in

HotAPI.ts:313

___

### registerRoutes

▸ **registerRoutes**(): `Promise`<`void`\>

Register all routes with the server.

#### Returns

`Promise`<`void`\>

#### Inherited from

[HotAPI](HotAPI.md).[registerRoutes](HotAPI.md#registerroutes)

#### Defined in

HotAPI.ts:322

___

### setDBSchema

▸ **setDBSchema**(`schema`): `void`

Set the database schema for use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`HotDBSchema`](HotDBSchema.md) |

#### Returns

`void`

#### Inherited from

[HotAPI](HotAPI.md).[setDBSchema](HotAPI.md#setdbschema)

#### Defined in

HotAPI.ts:87
