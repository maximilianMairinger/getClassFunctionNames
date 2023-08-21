

const constructorString: "constructor" = "constructor"

type TypeOfString = "string" | "object" | "number" | "boolean" | "bigint" | "function" | "symbol" | "undefined"
type InstanceOf = Object



type FunctionNameExclude = {
  excludeFunctionName?: string[]
}

type FunctionNameInclude = {
  includeFunctionName?: string[]
}

type FunctionSymExclude = {
  excludeFunctionName?: symbol[]
}

type FunctionSymInclude = {
  includeFunctionName?: symbol[]
}

type InstanceOfExclude = {
  excludeInstanceOf?: (TypeOfString | InstanceOf)[]
}

type InstanceOfInclude = {
  includeInstanceOf?: (TypeOfString | InstanceOf)[]
}

type NameFilter = 
(FunctionNameInclude & InstanceOfExclude) |
(FunctionNameInclude & InstanceOfInclude) | 
(FunctionNameExclude & InstanceOfExclude) | 
(FunctionNameExclude & InstanceOfInclude)

type SymbolFiler = 
(FunctionSymInclude & InstanceOfExclude) |
(FunctionSymInclude & InstanceOfInclude) |
(FunctionSymExclude & InstanceOfExclude) |
(FunctionSymExclude & InstanceOfInclude)



function prepFilter<Name extends string | symbol, Filter extends Name extends string ? NameFilter : SymbolFiler>(filter: Filter) {
  let allowName: (name: Name) => boolean
  if ((filter as Name extends string ? FunctionNameInclude : FunctionSymInclude).includeFunctionName) {
    const ar = (filter as Name extends string ? FunctionNameInclude : FunctionSymInclude).includeFunctionName as any[]
    allowName = (name: Name) => ar.includes(name)
  }
  else {
    if ((filter as Name extends string ? FunctionNameExclude : FunctionSymExclude).excludeFunctionName === undefined) allowName = () => true 
    else {
      const ar = (filter as Name extends string ? FunctionNameExclude : FunctionSymExclude).excludeFunctionName as any[]
      if (!ar.includes(constructorString)) ar.push(constructorString)
      allowName = (name: Name) => !ar.includes(name)
    }
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


type Instantiable = {
  new(...a: any[]): any
}


function constrGetFunctionIds<Filter extends Ret extends string ? NameFilter : SymbolFiler, Ret extends symbol | string>(getFuncIds: (o: any) => Ret[]) {
  function getClassFunctionIds(Class: Instantiable, UpToBaseClass?: Instantiable, filter?: Filter): Ret[]
  function getClassFunctionIds(Class: Instantiable, filter: Filter): Ret[]
  function getClassFunctionIds(Class: Instantiable, UpToBaseClass: Instantiable | Filter = Object, filter?: Filter) {
    const { allowName, mustBe } = prepFilter<Ret, Partial<Filter>>(UpToBaseClass instanceof Function ? filter === undefined ? {} : filter : UpToBaseClass)
      


    let functionNameList: Ret[] = []
    const isFree = name => !functionNameList.includes(name)
    let cur = Class
    let curProto = Class.prototype
    
    const add = mustBe ? (name: Ret) => {
      if (allowName(name) && mustBe(curProto[name]) && isFree(name)) functionNameList.push(name)
    } : (name: Ret) => {
      if (allowName(name) && isFree(name)) functionNameList.push(name)
    }

    while (curProto instanceof (UpToBaseClass as any)) {
      getFuncIds(curProto).forEach(add)
      cur = Object.getPrototypeOf(cur)
      curProto = cur.prototype
    }

    return functionNameList
  }

  return getClassFunctionIds
}

export const getClassFunctionNames = constrGetFunctionIds<NameFilter, string>(Object.getOwnPropertyNames)
export const getClassFunctionSymbols = constrGetFunctionIds<SymbolFiler, symbol>(Object.getOwnPropertySymbols)


export default getClassFunctionNames
