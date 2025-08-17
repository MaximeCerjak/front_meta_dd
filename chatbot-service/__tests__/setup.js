import { jest } from '@jest/globals';

// Variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.PORT = '6001';
process.env.OPENAI_API_KEY = 'test-key-fake';

// Mock console pour réduire le bruit pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn, // Garder warnings
  error: console.error, // Garder erreurs
};