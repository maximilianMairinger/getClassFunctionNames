import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/getClassFunctionNames.ts',
  output: {
    file: 'app/dist/cjs/getClassFunctionNames.js',
    format: 'cjs'
  },
})