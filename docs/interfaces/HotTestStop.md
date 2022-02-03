[hotstaq](../README.md) / [Modules](../modules.md) / HotTestStop

# Interface: HotTestStop

The test stop that is executed as either a destination or
a path.

## Table of contents

### Properties

- [cmd](HotTestStop.md#cmd)
- [dest](HotTestStop.md#dest)
- [path](HotTestStop.md#path)

## Properties

### cmd

• **cmd**: `string`

A command to execute. Can be:
* print(x)
  * Print a message to the server's console.
* println(x)
  * Print a message with a new line to the server's console.
* url(x)
  * Open a url. Must be an absolute url.
* waitForTesterAPIData
  * This will wait for the tester API to receive data.
* wait(x)
  * This will wait for x number of milliseconds.
* waitForTestObject(x)
  * This will wait for a test object to be loaded.

#### Defined in

[HotTester.ts:28](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotTester.ts#L28)

___

### dest

• **dest**: `string`

The destination to execute.

#### Defined in

[HotTester.ts:32](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotTester.ts#L32)

___

### path

• **path**: `string`

The path to execute.

#### Defined in

[HotTester.ts:36](https://github.com/OurFreeLight/HotStaq/blob/3e452c5/src/HotTester.ts#L36)
