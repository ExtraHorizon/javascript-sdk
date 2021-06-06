module.exports = {
  verbose: true,
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  preset: 'ts-jest',
  testRegex: '.*(\\.test|tests).*\\.(ts|js)$',
  // setupFiles: [
  //   "<rootDir>/tests/__helpers__/beforeEachSuite.ts"
  // ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/__helpers__/',
    '/tests/e2e/',
    '/build/',
  ],
  coverage: true,
  coverageDirectory: 'test-results/coverage',
  // reporters: ['default', 'jest-junit'],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'test-results',
        reportTitle: 'Test report generated with jest-stare!',
        additionalResultsProcessors: ['jest-junit'],
        coverageLink: 'coverage/lcov-report/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json',
      },
    ],
  ],
};
