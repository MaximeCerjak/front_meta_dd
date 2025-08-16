import { jest } from '@jest/globals';

// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'asset_service_test';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.SERVICE_URL = 'http://localhost:4000';
process.env.FRONT_URL = 'http://localhost:3002';

// Mock de la base de données pour les tests
jest.mock('../src/config/database.js', () => {
    const mockSequelize = {
        define: jest.fn(() => ({
            sync: jest.fn().mockResolvedValue(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn()
        })),
        authenticate: jest.fn().mockResolvedValue(),
        sync: jest.fn().mockResolvedValue()
    };
    return { default: mockSequelize };
});

// Mock du système de fichiers
jest.mock('fs', () => ({
    mkdir: jest.fn((path, options, callback) => callback(null)),
    unlink: jest.fn((path, callback) => callback(null)),
    readFileSync: jest.fn(() => '{"layers": [], "tilesets": [], "width": 100, "height": 100}')
}));

// Mock de multer
jest.mock('multer', () => {
    const multer = () => ({
        single: () => (req, res, next) => {
            req.file = {
                filename: 'test-file.png',
                originalname: 'test.png',
                mimetype: 'image/png',
                size: 1024
            };
            next();
        }
    });
    multer.diskStorage = jest.fn();
    multer.MulterError = class MulterError extends Error {
        constructor(message) {
            super(message);
            this.name = 'MulterError';
        }
    };
    return multer;
});

// Timeout global pour les tests
jest.setTimeout(30000);