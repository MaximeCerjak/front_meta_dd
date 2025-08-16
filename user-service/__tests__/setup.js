// __tests__/setup.js
import { jest } from '@jest/globals';

// Variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock de Sequelize AVANT que les modèles soient chargés
jest.unstable_mockModule('../config/database.js', () => ({
  default: {
    define: jest.fn(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      sync: jest.fn().mockResolvedValue(true),
      belongsTo: jest.fn(),
      hasOne: jest.fn()
    })),
    sync: jest.fn().mockResolvedValue(true),
    authenticate: jest.fn().mockResolvedValue(true)
  }
}));

// Mock des DataTypes Sequelize
jest.unstable_mockModule('sequelize', () => ({
  DataTypes: {
    INTEGER: 'INTEGER',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE'
  }
}));

// Configuration globale Jest
global.jest = jest;