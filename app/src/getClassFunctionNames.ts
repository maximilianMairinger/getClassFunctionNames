

const constructorString: "constructor" = "constructor"

type TypeOfString = "string" | "object" | "number" | "boolean" | "bigint" | "function" | "symbol" | "undefined"
type InstanceOf = Object



type FunctionNameExclude = {
  excludeFunctionName?: string[]
}

type FunctionNameInclude = {
  includeFunctionName?: string[]
}

type InstanceOfExclude = {
  excludeInstanceOf?: (TypeOfString | InstanceOf)[]
}

type InstanceOfInclude = {
  includeInstanceOf?: (TypeOfString | InstanceOf)[]
}

type Filter = 
(FunctionNameInclude & InstanceOfExclude) |
(FunctionNameInclude & InstanceOfInclude) | 
(FunctionNameExclude & InstanceOfExclude) | 
(FunctionNameExclude & InstanceOfInclude)


function prepFilter(filter: Filter) {
  let allowName: (name: string) => boolean
  if ((filter as FunctionNameInclude).includeFunctionName) {
    const ar = (filter as FunctionNameInclude).includeFunctionName
    allowName = (name: string) => ar.includes(name)
  }
  else {
    const ar = (filter as FunctionNameExclude).excludeFunctionName || []
    if (!ar.includes(constructorString)) ar.push(constructorString)
    allowName = (name: string) => !ar.includes(name)
  }
  
  let bes: any[]
  let mustBe: (prop: any) => boolean
  if ((filter as InstanceOfInclude).includeInstanceOf) {
    bes = (filter as InstanceOfInclude).includeInstanceOf
    mustBe = (prop) => {
      for (let be of mustBes) {
        if (!be(prop)) return false
      }
      return true
    }
  }
  else if ((filter as InstanceOfExclude).excludeInstanceOf) {
    bes = (filter as InstanceOfExclude).excludeInstanceOf
    mustBe = (prop) => {
      for (let be of mustBes) {
        if (be(prop)) return false
      }
      return true
    }
  }
  else {
    bes = []
  }

  const mustBes = bes.map((e) => {
    if (typeof e === "string") {
      return q => typeof q === e
    }
    else {
      return q => q instanceof (e as any)
    }
  }) 
  


  return { allowName, mustBe }
}


export function getClassFunctionNames(Class: any, UpToBaseClass: any = Object, filter: Filter = {}) {
  const { allowName, mustBe } = prepFilter(filter)

  let functionNameList: string[] = []
  const isFree = name => !functionNameList.includes(name)
  let cur = Class
  let curProto = Class.prototype
  
  const add = mustBe ? (name: string) => {
    if (allowName(name) && mustBe(curProto[name]) && isFree(name)) functionNameList.push(name)
  } : (name: string) => {
    if (allowName(name) && isFree(name)) functionNameList.push(name)
  }

  // debugger
  while (curProto instanceof UpToBaseClass) {
    Object.getOwnPropertyNames(curProto).forEach(add)
    cur = Object.getPrototypeOf(cur)
    curProto = cur.prototype
  }

  return functionNameList
}

export default getClassFunctionNames
