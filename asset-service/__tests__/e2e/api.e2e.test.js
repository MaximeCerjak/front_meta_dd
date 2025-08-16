import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';

// Mock minimal pour les tests E2E
jest.mock('../../src/config/database.js', () => ({
  default: {
    define: jest.fn(() => ({
      sync: jest.fn().mockResolvedValue(),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findByPk: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1 }),
      destroy: jest.fn().mockResolvedValue()
    }))
  }
}));

describe('Asset Service E2E Tests', () => {
  let app;

  beforeAll(async () => {
    // Import dynamique de l'app après les mocks
    const appModule = await import('../../src/app.js');
    app = appModule.default;
  });

  afterAll(async () => {
    // Nettoyage si nécessaire
    if (app && app.close) {
      await app.close();
    }
  });

  describe('Service Health', () => {
    test('should respond to health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'OK' });
    });
  });

  describe('API Documentation', () => {
    test('should serve OpenAPI specification', async () => {
      const response = await request(app)
        .get('/openapi.json')
        .expect(200);

      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info.title).toBe('Asset Service API');
    });

    test('should serve Swagger UI', async () => {
      await request(app)
        .get('/api-docs/')
        .expect(200);
    });
  });

  describe('CORS Configuration', () => {
    test('should handle CORS preflight request', async () => {
      const response = await request(app)
        .options('/api/assets')
        .set('Origin', 'http://localhost:3002')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3002');
    });

    test('should reject requests from unauthorized origins', async () => {
      await request(app)
        .get('/api/assets')
        .set('Origin', 'http://malicious-site.com')
        .expect(500); // CORS error
    });
  });

  describe('Static File Serving', () => {
    test('should serve uploaded files', async () => {
      // Créer un fichier de test temporaire
      const testDir = path.join(process.cwd(), 'src/uploads/test');
      const testFile = path.join(testDir, 'test.txt');
      
      // Créer le répertoire et le fichier
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, 'test content');

      try {
        await request(app)
          .get('/uploads/test/test.txt')
          .expect(200);
      } finally {
        // Nettoyage
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDir, { recursive: true });
      }
    });

    test('should return 404 for non-existent files', async () => {
      await request(app)
        .get('/uploads/non-existent/file.txt')
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });

    test('should handle malformed requests', async () => {
      await request(app)
        .post('/api/assets/invalid/route')
        .send('invalid-data')
        .expect(404);
    });
  });

  describe('Request Logging', () => {
    test('should log requests', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await request(app)
        .get('/health')
        .expect(200);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/health/)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    test('should respond to health check within acceptable time', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100); // Should respond within 100ms
    });

    test('should handle multiple concurrent requests', async () => {
      const promises = Array(10).fill().map(() => 
        request(app).get('/health').expect(200)
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.body).toEqual({ status: 'OK' });
      });
    });
  });
});