

const constructorString: "constructor" = "constructor"

export default function(Class: any, UpToBaseClass: any = Object, removeFunctionNames: string[] = []) {
  let functionNameList: string[] = []
  let cur = Class

  if (!removeFunctionNames.includes(constructorString)) removeFunctionNames.push(constructorString)
  
  while (cur.prototype instanceof UpToBaseClass) {
    Object.getOwnPropertyNames(cur.prototype).forEach((e) => {
      if (!removeFunctionNames.includes(e)) {
        functionNameList.push(e)
        removeFunctionNames.push(e)
      }
    })
    cur = Object.getPrototypeOf(cur)
  }

  return functionNameList
}
