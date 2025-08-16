module.exports = {
  testEnvironment: 'node',
  
  // Setup des tests
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Configuration de la couverture
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/swagger.js',
    '!src/config/database.js'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov', 
    'html',
    'cobertura', // Pour GitLab CI
    'json-summary'
  ],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Pattern des tests
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/src/**/*.test.js'
  ],
  
  // Transform pour ES modules
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Configuration Babel
  transformIgnorePatterns: [
    'node_modules/(?!(module-to-transform)/)'
  ],
  
  // Reporters pour CI
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
      usePathForSuiteName: true
    }]
  ],
  
  verbose: true,
  clearMocks: true,
  
  // Variables d'environnement pour les tests
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/env.js']
};