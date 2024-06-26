module.exports = {
  extends: [
    '@extrahorizon/eslint-config-node'
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
    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["tests/**/*.ts"] }],
    "max-len": ["error", { "code": 150, "ignoreComments": true }],
  }
};