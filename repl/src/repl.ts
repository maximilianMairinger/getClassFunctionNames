import getClassFunctionNames from "./../../app/src/getClassFunctionNames"
//const testElem = document.querySelector("#test")

class AAA extends Array {
  qq() {

  }
  ww() {

  }
}

console.log(getClassFunctionNames(AAA, Array))
