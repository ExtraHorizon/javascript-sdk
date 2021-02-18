const { off } = require("process")

module.exports = {
  extends: ['@qompium/eslint-config-q-node'],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  rules: {
    "max-classes-per-file": 0
  }
};