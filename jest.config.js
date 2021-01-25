module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  coverageDirectory: './coverage/',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  clearMocks: true
}
