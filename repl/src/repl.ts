import getClassFunctionNames from "./../../app/src/getClassFunctionNames"
//const testElem = document.querySelector("#test")

class AAA extends Array {
  qq() {

  }
  ww() {

  }
}

//@ts-ignore
AAA.prototype.ok = 2

console.log(getClassFunctionNames(AAA, Array, {includeInstanceOf: ["number"]}))
