
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testTimeout: 15000,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/app.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // Améliorer la gestion des mocks pour ES modules
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};