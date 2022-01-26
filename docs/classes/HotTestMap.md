[hotstaq](../README.md) / [Modules](../modules.md) / HotTestMap

# Class: HotTestMap

Maps the paths that are taken to complete a test.

## Table of contents

### Constructors

- [constructor](HotTestMap.md#constructor)

### Properties

- [destinationOrder](HotTestMap.md#destinationorder)
- [destinations](HotTestMap.md#destinations)
- [pages](HotTestMap.md#pages)

## Constructors

### constructor

• **new HotTestMap**(`destinations?`, `pages?`, `destinationOrder?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destinations` | `string`[] \| [`HotTestDestination`](HotTestDestination.md)[] \| { [name: string]: `string` \| [`HotTestDestination`](HotTestDestination.md);  } | `[]` |
| `pages` | `Object` | `{}` |
| `destinationOrder` | `string`[] | `[]` |

#### Defined in

[HotTestMap.ts:100](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestMap.ts#L100)

## Properties

### destinationOrder

• **destinationOrder**: `string`[]

The order in which destinations are supposed to execute. This is
ignored if the destinations are an array.

#### Defined in

[HotTestMap.ts:92](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestMap.ts#L92)

___

### destinations

• **destinations**: [`HotTestDestination`](HotTestDestination.md)[] \| { [name: string]: [`HotTestDestination`](HotTestDestination.md);  }

The order in which paths are to be taken. Each destination is a string
in a type -> path order. The type could be either a page or api route.
For example:
```
[
     "page:signin_page -> signin_path",
     "page:account_page -> change_username_path",
     "page:account_page -> change_password_path",
     "page:account_page -> change_name_path -> change_address_path",
		"page:account_page -> signout_path",
		"api:account_api_route -> signout_route_method -> signout_test_path"
]
```

The first string to the left of the -> will always be the type, such as a
page or an api route. Any strings to the right of the -> will be a path, even
when chaining addtional ->'s.

#### Defined in

[HotTestMap.ts:87](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestMap.ts#L87)

___

### pages

• **pages**: `Object`

The test pages to execute.

#### Index signature

▪ [name: `string`]: [`HotTestPage`](../interfaces/HotTestPage.md)

#### Defined in

[HotTestMap.ts:96](https://github.com/OurFreeLight/HotStaq/blob/1bc3620/src/HotTestMap.ts#L96)
