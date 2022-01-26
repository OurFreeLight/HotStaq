[hotstaq](../README.md) / [Modules](../modules.md) / HotSite

# Interface: HotSite

A HotSite to load. This SHOULD NOT contain any private secret keys, passwords,
or database connection information related to the server. As such, future
versions of the HotSite interface should not contain any database related
connection info.

## Table of contents

### Properties

- [apis](HotSite.md#apis)
- [components](HotSite.md#components)
- [files](HotSite.md#files)
- [hotsitePath](HotSite.md#hotsitepath)
- [name](HotSite.md#name)
- [publicSecrets](HotSite.md#publicsecrets)
- [routes](HotSite.md#routes)
- [server](HotSite.md#server)
- [testing](HotSite.md#testing)

## Properties

### apis

• `Optional` **apis**: `Object`

The available APIs on the server. The server must already have these
loaded.

#### Index signature

▪ [name: `string`]: { `apiName?`: `string` ; `filepath?`: `string` ; `jsapi?`: `string` ; `libraryName?`: `string` ; `map?`: `string`[] ; `port?`: `number` ; `url?`: `string`  }

#### Defined in

[HotStaq.ts:221](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L221)

___

### components

• `Optional` **components**: `Object`

The components to load and register.

#### Index signature

▪ [name: `string`]: { `url`: `string`  }

#### Defined in

[HotStaq.ts:272](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L272)

___

### files

• `Optional` **files**: `Object`

The files to load and save in memory.

#### Index signature

▪ [name: `string`]: { `url`: `string`  }

#### Defined in

[HotStaq.ts:283](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L283)

___

### hotsitePath

• `Optional` **hotsitePath**: `string`

The path to the current HotSite. This is filled in during parsing.

#### Defined in

[HotStaq.ts:88](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L88)

___

### name

• **name**: `string`

The name of this HotSite.

#### Defined in

[HotStaq.ts:84](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L84)

___

### publicSecrets

• `Optional` **publicSecrets**: `Object`

Secrets that can be publicly embedded into the page.

#### Index signature

▪ [name: `string`]: `string` \| { `env?`: `string` ; `passSecretFromAPI?`: `string`  }

#### Defined in

[HotStaq.ts:256](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L256)

___

### routes

• `Optional` **routes**: `Object`

The routes to load.

#### Index signature

▪ [routeName: `string`]: [`HotSiteRoute`](HotSiteRoute.md)

#### Defined in

[HotStaq.ts:214](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L214)

___

### server

• `Optional` **server**: `Object`

Additional web server configuration.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `globalApi?` | `string` | The name of the API to interface with across all pages. |
| `jsSrcPath?` | `string` | The JavaScript source path. |
| `name?` | `string` | The default name for a served Hott file. |
| `ports?` | `Object` | The ports to use. |
| `ports.http?` | `number` | The HTTP port to serve on. |
| `ports.https?` | `number` | The HTTPS port to serve on. |
| `ports.redirectHTTPtoHTTPS?` | `boolean` | If set to true, this will redirect from HTTP to HTTPS. |
| `serveDirectories?` | { `localPath`: `string` ; `route`: `string`  }[] | The list of directory to serve to the client from the server. |
| `serveHottFiles?` | `boolean` | Serve hott files when requested. |
| `url?` | `string` | The base url for the server. |

#### Defined in

[HotStaq.ts:92](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L92)

___

### testing

• `Optional` **testing**: `Object`

Testing related functionality.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `api?` | `Object` |
| `api.createNewTester?` | `boolean` |
| `api.driver?` | `string` |
| `api.launchpadUrl?` | `string` |
| `api.maps?` | `string`[] |
| `api.tester?` | `string` |
| `api.testerAPIUrl?` | `string` |
| `api.testerName?` | `string` |
| `web?` | `Object` |
| `web.createNewTester?` | `boolean` |
| `web.driver?` | `string` |
| `web.launchpadUrl?` | `string` |
| `web.maps?` | `string`[] |
| `web.tester?` | `string` |
| `web.testerAPIUrl?` | `string` |
| `web.testerName?` | `string` |

#### Defined in

[HotStaq.ts:147](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotStaq.ts#L147)
