import { jest } from '@jest/globals';

/**
 * Crée un mock d'objet Request Express
 */
export const createMockRequest = (body = {}, params = {}, query = {}, headers = {}) => ({
  body,
  params,
  query,
  headers,
  get: jest.fn((header) => headers[header])
});

/**
 * Crée un mock d'objet Response Express
 */
export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Crée des données de test pour une carte
 */
export const createMockMapData = (overrides = {}) => ({
  name: 'Test Map',
  description: 'Une carte de test',
  layerFileIds: [1, 2, 3],
  jsonFileId: 4,
  metadata: { difficulty: 'easy', theme: 'forest' },
  ...overrides
});

/**
 * Crée des données de test pour une grille
 */
export const createMockGridData = (overrides = {}) => ({
  data: {
    width: 10,
    height: 10,
    tiles: [
      { x: 0, y: 0, type: 'grass', walkable: true },
      { x: 1, y: 0, type: 'stone', walkable: false },
      { x: 0, y: 1, type: 'water', walkable: false }
    ],
    ...overrides.data
  },
  ...overrides
});

/**
 * Crée des données de test pour un téléporteur
 */
export const createMockTeleporterData = (overrides = {}) => ({
  identifier: 'portal_1',
  source_grid_id: 1,
  destination_map_id: 2,
  destination_position: { x: 5, y: 5 },
  ...overrides
});

/**
 * Simule une erreur de base de données
 */
export const createDatabaseError = (message = 'Database connection failed') => {
  const error = new Error(message);
  error.name = 'SequelizeConnectionError';
  return error;
};

/**
 * Simule une erreur de validation
 */
export const createValidationError = (field, message = 'Validation error') => {
  const error = new Error(message);
  error.name = 'SequelizeValidationError';
  error.errors = [{ path: field, message }];
  return error;
};

/**
 * Utilitaire pour attendre un délai (utile pour les tests d'intégration)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Valide la structure d'une réponse d'API
 */
export const validateApiResponse = (response, expectedStatus, expectedFields = []) => {
  expect(response.status).toBe(expectedStatus);
  
  if (expectedFields.length > 0) {
    expectedFields.forEach(field => {
      expect(response.body).toHaveProperty(field);
    });
  }
};

/**
 * Mock pour les logs pendant les tests
 */
export const mockConsole = () => {
  const originalConsole = global.console;
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };
  
  return () => {
    global.console = originalConsole;
  };
};

/**
 * Crée un mock complet de Sequelize pour les tests
 */
export const createSequelizeMock = () => ({
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
  close: jest.fn().mockResolvedValue(true),
  transaction: jest.fn().mockResolvedValue({
    commit: jest.fn(),
    rollback: jest.fn()
  })
});

/**
 * Crée un mock complet d'un modèle Sequelize
 */
export const createModelMock = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
  findAndCountAll: jest.fn(),
  bulkCreate: jest.fn(),
  findOrCreate: jest.fn()
});

/**
 * Réinitialise tous les mocks
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

// Constantes pour les tests
export const TEST_CONSTANTS = {
  DEFAULT_TIMEOUT: 5000,
  API_BASE_URL: '/api',
  TEST_USER_ID: 1,
  TEST_MAP_ID: 1,
  TEST_GRID_ID: 1,
  TEST_TELEPORTER_ID: 1
};