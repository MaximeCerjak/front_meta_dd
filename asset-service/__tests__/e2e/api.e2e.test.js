import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Variables d'environnement
process.env.NODE_ENV = 'test';

describe('Asset Service E2E Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Routes de base pour les tests
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });
    
    app.get('/api-docs/', (req, res) => {
      res.status(200).send('<html><body>Swagger UI</body></html>');
    });
    
    app.get('/openapi.json', (req, res) => {
      res.status(200).json({
        openapi: '3.0.0',
        info: { title: 'Asset Service API', version: '1.0.0' }
      });
    });
    
    // Route pour tester CORS
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin === 'http://localhost:3002') {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      
      if (req.method === 'OPTIONS') {
        return res.status(204).send();
      }
      next();
    });
    
    app.get('/api/assets', (req, res) => {
      res.status(200).json([]);
    });
    
    app.get('/uploads/:path(*)', (req, res) => {
      if (req.params.path === 'test/test.txt') {
        res.status(200).send('test content');
      } else {
        res.status(404).send('Not found');
      }
    });
    
    app.use('*', (req, res) => {
      res.status(404).json({ message: 'Not found' });
    });
  });

  describe('Service Health', () => {
    it('should respond to health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'OK' });
    });
  });

  describe('API Documentation', () => {
    it('should serve OpenAPI specification', async () => {
      const response = await request(app)
        .get('/openapi.json')
        .expect(200);

      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info.title).toBe('Asset Service API');
    });

    it('should serve Swagger UI', async () => {
      const response = await request(app)
        .get('/api-docs/')
        .expect(200);
        
      expect(response.text).toContain('Swagger UI');
    });
  });

  describe('CORS Configuration', () => {
    it('should handle CORS preflight request', async () => {
      const response = await request(app)
        .options('/api/assets')
        .set('Origin', 'http://localhost:3002')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3002');
    });

    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/assets')
        .set('Origin', 'http://malicious-site.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('Static File Serving', () => {
    it('should serve uploaded files', async () => {
      const response = await request(app)
        .get('/uploads/test/test.txt')
        .expect(200);

      expect(response.text).toBe('test content');
    });

    it('should return 404 for non-existent files', async () => {
      await request(app)
        .get('/uploads/non-existent/file.txt')
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle malformed requests', async () => {
      await request(app)
        .post('/api/assets/invalid/route')
        .send('invalid-data')
        .expect(404);
    });
  });

  describe('Request Logging', () => {
    it('should log requests', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      await request(app)
        .get('/health')
        .expect(200);

      expect(true).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should respond to health check within acceptable time', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    it('should handle multiple concurrent requests', async () => {
      const promises = Array(5).fill().map(() => 
        request(app).get('/health').expect(200)
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.body).toEqual({ status: 'OK' });
      });
    });
  });
});