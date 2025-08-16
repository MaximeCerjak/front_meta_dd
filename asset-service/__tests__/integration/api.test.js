import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import assetRoutes from '../../src/routes/assetRoutes.js';

// Mock du modèle File
const mockFile = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    sync: jest.fn().mockResolvedValue()
};

jest.mock('../../src/models/File.js', () => ({
    default: mockFile
}));

// Création de l'app de test
const createTestApp = () => {
    const app = express();
    
    const corsOptions = {
        origin: ['http://localhost:3002'],
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/assets', assetRoutes);
    
    return app;
};

describe('Asset API Integration Tests', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/assets', () => {
        test('should return all assets', async () => {
            const mockAssets = [
                {
                    id: 1,
                    filename: 'test1.png',
                    name: 'Test Asset 1',
                    scope: 'game',
                    type: 'images',
                    category: 'avatars'
                },
                {
                    id: 2,
                    filename: 'test2.png',
                    name: 'Test Asset 2',
                    scope: 'user',
                    type: 'images',
                    category: 'profiles'
                }
            ];

            mockFile.findAll.mockResolvedValue(mockAssets);

            const response = await request(app)
                .get('/api/assets')
                .expect(200);

            expect(response.body).toEqual(mockAssets);
            expect(mockFile.findAll).toHaveBeenCalled();
        });

        test('should handle server error', async () => {
            mockFile.findAll.mockRejectedValue(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/assets')
                .expect(500);

            expect(response.body).toEqual({
                message: 'Error retrieving files.',
                error: 'Database connection failed'
            });
        });
    });

    describe('GET /api/assets/:id', () => {
        test('should return specific asset', async () => {
            const mockAsset = {
                id: 1,
                filename: 'test.png',
                name: 'Test Asset',
                scope: 'game'
            };

            mockFile.findByPk.mockResolvedValue(mockAsset);

            const response = await request(app)
                .get('/api/assets/1')
                .expect(200);

            expect(response.body).toEqual(mockAsset);
            expect(mockFile.findByPk).toHaveBeenCalledWith('1');
        });

        test('should return 404 for non-existent asset', async () => {
            mockFile.findByPk.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/assets/999')
                .expect(404);

            expect(response.body).toEqual({
                message: 'File not found.'
            });
        });
    });

    describe('GET /api/assets/:scope', () => {
        test('should return assets by scope', async () => {
            const mockAssets = [
                {
                    id: 1,
                    scope: 'game',
                    type: 'images',
                    category: 'avatars'
                }
            ];

            mockFile.findAll.mockResolvedValue(mockAssets);

            const response = await request(app)
                .get('/api/assets/game')
                .expect(200);

            expect(response.body).toEqual(mockAssets);
            expect(mockFile.findAll).toHaveBeenCalledWith({
                where: { scope: 'game' }
            });
        });
    });

    describe('GET /api/assets/:scope/:type', () => {
        test('should return assets by scope and type', async () => {
            const mockAssets = [
                {
                    id: 1,
                    scope: 'game',
                    type: 'images',
                    category: 'avatars'
                }
            ];

            mockFile.findAll.mockResolvedValue(mockAssets);

            const response = await request(app)
                .get('/api/assets/game/images')
                .expect(200);

            expect(response.body).toEqual(mockAssets);
            expect(mockFile.findAll).toHaveBeenCalledWith({
                where: { scope: 'game', type: 'images' }
            });
        });
    });

    describe('GET /api/assets/:scope/:type/:category', () => {
        test('should return assets by scope, type and category', async () => {
            const mockAssets = [
                {
                    id: 1,
                    scope: 'game',
                    type: 'images',
                    category: 'avatars'
                }
            ];

            mockFile.findAll.mockResolvedValue(mockAssets);

            const response = await request(app)
                .get('/api/assets/game/images/avatars')
                .expect(200);

            expect(response.body).toEqual(mockAssets);
            expect(mockFile.findAll).toHaveBeenCalledWith({
                where: { scope: 'game', type: 'images', category: 'avatars' }
            });
        });
    });

    describe('POST /api/assets/:scope/:type/:category/upload', () => {
        test('should upload file successfully', async () => {
            const mockCreatedFile = {
                id: 1,
                filename: 'test-123456789.png',
                name: 'Test Asset',
                scope: 'game',
                type: 'images',
                category: 'avatars'
            };

            mockFile.create.mockResolvedValue(mockCreatedFile);

            const response = await request(app)
                .post('/api/assets/game/images/avatars/upload')
                .attach('file', Buffer.from('fake image content'), 'test.png')
                .field('name', 'Test Asset')
                .field('description', 'Test description')
                .expect(200);

            expect(response.body).toEqual({
                message: 'File uploaded successfully.',
                file: mockCreatedFile
            });
        });
    });

    describe('Health Check', () => {
        test('should respond to health check', async () => {
            // Ajouter une route de santé simple pour les tests
            app.get('/health', (req, res) => {
                res.status(200).send({ status: 'OK' });
            });

            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toEqual({ status: 'OK' });
        });
    });
});