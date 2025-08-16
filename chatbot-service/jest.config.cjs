module.exports = {
  testEnvironment: 'node',
  
  // Ajoutez le setup
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/swagger.js'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  verbose: true,
  clearMocks: true
};