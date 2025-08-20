import { jest } from '@jest/globals';

// Variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.PORT = '6001';
process.env.OPENAI_API_KEY = 'test-key-fake';

// Configuration des timeouts globaux
jest.setTimeout(15000);

// Mock console pour réduire le bruit pendant les tests
const originalConsole = { ...console };

beforeAll(() => {
  // Conserver les erreurs et warnings importants
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  // Restaurer console
  global.console = originalConsole;
});

// Nettoyage entre les tests
beforeEach(() => {
  jest.clearAllMocks();
});