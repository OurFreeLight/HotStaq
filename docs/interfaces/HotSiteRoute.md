[hotstaq](../README.md) / [Modules](../modules.md) / HotSiteRoute

# Interface: HotSiteRoute

A route used in a HotSite.

## Table of contents

### Properties

- [api](HotSiteRoute.md#api)
- [destinationOrder](HotSiteRoute.md#destinationorder)
- [map](HotSiteRoute.md#map)
- [name](HotSiteRoute.md#name)
- [url](HotSiteRoute.md#url)

## Properties

### api

• `Optional` **api**: `string`

The name of the API to interface with.

#### Defined in

HotStaq.ts:58

___

### destinationOrder

• `Optional` **destinationOrder**: `string`[]

The order in which destinations are supposed to execute. This is
ignored if the destinations are an array.

#### Defined in

HotStaq.ts:63

___

### map

• `Optional` **map**: `string` \| `string`[] \| { [name: string]: `string` \| [`HotSiteMapPath`](HotSiteMapPath.md);  } \| [`HotSiteMapPath`](HotSiteMapPath.md)[]

The HotTesterMap to use. This can be the name of an
existing one attached to the selected tester, or
can be an array of destinations that will be used to
create a new map.

#### Defined in

HotStaq.ts:70

___

### name

• **name**: `string`

The name of the route. Will appear in the title.

#### Defined in

HotStaq.ts:50

___

### url

• **url**: `string`

The url to the file to load.

#### Defined in

HotStaq.ts:54
