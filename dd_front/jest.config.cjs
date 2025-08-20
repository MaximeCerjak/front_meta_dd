module.exports = {
  // Environnement de test pour navigateur
  testEnvironment: 'jsdom',
  
  // Configuration pour Phaser.js
  setupFilesAfterEnv: [
    'jest-canvas-mock/lib/index.js'
    // '<rootDir>/tests/setup.js' - Temporairement commenté
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/assets/**',
    '!src/**/*.config.js',
    '!src/main.jsx', // Point d'entrée
    '!**/node_modules/**'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'cobertura',
    'html',
    'json-summary'
  ],
  
  // Test patterns
  testMatch: [
    '**/tests/**/*.test.{js,jsx,ts,tsx}',
    '**/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/?(*.)+(spec|test).{js,jsx,ts,tsx}'
  ],
  
  // CORRECTION: moduleNameMapper (pas moduleNameMapping)
  moduleNameMapper: {
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@scenes/(.*)$': '<rootDir>/src/scenes/$1',
    '^@objects/(.*)$': '<rootDir>/src/objects/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@game/(.*)$': '<rootDir>/src/game/$1',
    // Mock des fichiers statiques
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  
  // CORRECTION: Suppression de jest-transform-css
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // Ignore patterns pour les transformations
  transformIgnorePatterns: [
    'node_modules/(?!(phaser|phaser3-rex-plugins)/)'
  ],
  
  // Configuration spécifique à Phaser
  globals: {
    'WEBGL_RENDERER': true,
    'CANVAS_RENDERER': true
  },
  
  // Timeout pour les tests (important pour Phaser)
  testTimeout: 10000,
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  
  // Verbose output
  verbose: true,
  
  // Collect coverage
  collectCoverage: true,
  
  // Clear mocks between tests
  clearMocks: true
};