[hotstaq](../README.md) / [Modules](../modules.md) / HotTestDestination

# Class: HotTestDestination

The destination to take in a map.

## Table of contents

### Constructors

- [constructor](HotTestDestination.md#constructor)

### Properties

- [autoStart](HotTestDestination.md#autostart)
- [destination](HotTestDestination.md#destination)

## Constructors

### constructor

• **new HotTestDestination**(`destination?`, `autoStart?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destination` | `string` \| [`HotSiteMapPath`](../interfaces/HotSiteMapPath.md) \| [`HotTestDestination`](HotTestDestination.md) | `""` |
| `autoStart` | `boolean` | `true` |

#### Defined in

[HotTestMap.ts:25](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestMap.ts#L25)

## Properties

### autoStart

• **autoStart**: `boolean`

If set to true, this will automatically start executing it's
tests when it's time.

#### Defined in

[HotTestMap.ts:23](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestMap.ts#L23)

___

### destination

• **destination**: `string`

The destination to take.

#### Defined in

[HotTestMap.ts:18](https://github.com/OurFreeLight/HotStaq/blob/c443819/src/HotTestMap.ts#L18)
