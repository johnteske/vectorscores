const { eslintrc } = require("@vectorscores/configs")
module.exports = {
  ...eslintrc,
  // maybe these shouldn't be defaults in configs
  env: {
    es2020: true, //
    node: true, // this should change when changing require -> import
    browser: true,
  },
  globals: {
    d3: false,
    VS: false
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0 // ignore for now, will resolve with import style
  }
}
