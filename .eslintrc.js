module.exports = {
  extends: [
    '@qompium/eslint-config-q-node'
  ],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },  
  plugins: [
    '@typescript-eslint',
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "max-classes-per-file": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "**/*.spec.ts"]}],
    "max-len": ["error", { "code": 150, "ignoreComments": true }],
  }
};