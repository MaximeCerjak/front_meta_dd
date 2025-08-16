import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import assetRoutes from '../../src/routes/assetRoutes.js';

// Mock des contrôleurs
const mockControllers = {
  uploadFile: jest.fn(),
  listAllFiles: jest.fn(),
  listFileById: jest.fn(),
  listFilesByScope: jest.fn(),
  listFilesByType: jest.fn(),
  listFilesByCategory: jest.fn(),
  deleteFile: jest.fn()
};

jest.mock('../../src/controllers/assetController.js', () => mockControllers);

describe('Asset Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/assets', assetRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuration par défaut des mocks
    Object.values(mockControllers).forEach(mock => {
      mock.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });
    });
  });

  describe('GET /api/assets', () => {
    test('should call listAllFiles controller', async () => {
      await request(app)
        .get('/api/assets')
        .expect(200);

      expect(mockControllers.listAllFiles).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/assets/:id', () => {
    test('should call listFileById controller with correct id', async () => {
      const testId = '123';
      
      await request(app)
        .get(`/api/assets/${testId}`)
        .expect(200);

      expect(mockControllers.listFileById).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.listFileById.mock.calls[0][0];
      expect(req.params.id).toBe(testId);
    });
  });

  describe('GET /api/assets/:scope', () => {
    test('should call listFilesByScope controller with correct scope', async () => {
      const testScope = 'game';
      
      await request(app)
        .get(`/api/assets/${testScope}`)
        .expect(200);

      expect(mockControllers.listFilesByScope).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.listFilesByScope.mock.calls[0][0];
      expect(req.params.scope).toBe(testScope);
    });
  });

  describe('GET /api/assets/:scope/:type', () => {
    test('should call listFilesByType controller with correct parameters', async () => {
      const testScope = 'game';
      const testType = 'images';
      
      await request(app)
        .get(`/api/assets/${testScope}/${testType}`)
        .expect(200);

      expect(mockControllers.listFilesByType).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.listFilesByType.mock.calls[0][0];
      expect(req.params.scope).toBe(testScope);
      expect(req.params.type).toBe(testType);
    });
  });

  describe('GET /api/assets/:scope/:type/:category', () => {
    test('should call listFilesByCategory controller with correct parameters', async () => {
      const testScope = 'game';
      const testType = 'images';
      const testCategory = 'avatars';
      
      await request(app)
        .get(`/api/assets/${testScope}/${testType}/${testCategory}`)
        .expect(200);

      expect(mockControllers.listFilesByCategory).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.listFilesByCategory.mock.calls[0][0];
      expect(req.params.scope).toBe(testScope);
      expect(req.params.type).toBe(testType);
      expect(req.params.category).toBe(testCategory);
    });
  });

  describe('POST /api/assets/:scope/:type/:category/upload', () => {
    test('should call uploadFile controller with correct parameters', async () => {
      const testScope = 'game';
      const testType = 'images';
      const testCategory = 'avatars';
      
      await request(app)
        .post(`/api/assets/${testScope}/${testType}/${testCategory}/upload`)
        .attach('file', Buffer.from('fake file content'), 'test.png')
        .expect(200);

      expect(mockControllers.uploadFile).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.uploadFile.mock.calls[0][0];
      expect(req.params.scope).toBe(testScope);
      expect(req.params.type).toBe(testType);
      expect(req.params.category).toBe(testCategory);
    });
  });

  describe('DELETE /api/assets/:id', () => {
    test('should call deleteFile controller with correct id', async () => {
      const testId = '123';
      
      await request(app)
        .delete(`/api/assets/${testId}`)
        .expect(200);

      expect(mockControllers.deleteFile).toHaveBeenCalledTimes(1);
      
      const req = mockControllers.deleteFile.mock.calls[0][0];
      expect(req.params.id).toBe(testId);
    });
  });

  describe('Route parameter validation', () => {
    test('should handle special characters in parameters', async () => {
      const specialId = 'test-123_special';
      
      await request(app)
        .get(`/api/assets/${specialId}`)
        .expect(200);

      expect(mockControllers.listFileById).toHaveBeenCalledTimes(1);
    });

    test('should handle numeric parameters', async () => {
      const numericId = '12345';
      
      await request(app)
        .get(`/api/assets/${numericId}`)
        .expect(200);

      const req = mockControllers.listFileById.mock.calls[0][0];
      expect(req.params.id).toBe(numericId);
    });
  });
});