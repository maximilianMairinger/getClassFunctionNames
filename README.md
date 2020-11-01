# Get class function names

Get all function names of a class up to a specified prototype.


## Installation

```shell
 $ npm i get-class-function-names
```

## Usage

Given the class `AAA`:

```ts
class AAA extends Array {
  qq() {

  }
  ww() {

  }
}
```

The method names up to `Array` / `Object` can be found like below:

```ts
import getClassFunctionNames from "get-class-function-names"

getClassFunctionNames(AA, Array)   // ["qq", "ww"]
getClassFunctionNames(AA)          // ["qq", "ww", "length", "concat", "copyWithin", "fill", ...]
```

### Filter

If you wanted to filter out only function names (thus omitting properties like length) you could:

```ts
getClassFunctionNames(AA, Object, {includeInstanceOf: Function})   // ["qq", "ww", "concat", "copyWithin", "fill", ...]
getClassFunctionNames(AA, Object, {excludeInstanceOf: "number"})   // ["qq", "ww", "concat", "copyWithin", "fill", ...]
```

> Note: that the constructor is always omitted

If you want to white / blacklist additional names do:

```ts
getClassFunctionNames(AA, Object, {excludeInstanceOf: "number"})   // ["qq", "ww", "concat", "copyWithin", "fill", ...]s
getClassFunctionNames(AA, Object, {includeInstanceOf: Function})   // ["qq", "ww", "concat", "copyWithin", "fill", ...]s
```

> Note: that length is missing in the above example


## Contribute

All feedback is appreciated. Create a pull request or write an issue.
