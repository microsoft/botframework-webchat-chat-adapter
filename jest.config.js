module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.json',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/__tests__/**'
  ],
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover', 'cobertura'],
  globals: {
    npm_package_version: '0.0.0-0.jest'
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/__jest__/setupDotEnv.js',
    '<rootDir>/__tests__/__jest__/setupGlobalAgent.js'
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/__tests__/__jest__/']
  // transform: {
  //   '\\.[jt]sx?$': './babel-jest-config.js'
  // }
};
