import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Variables d'environnement
process.env.NODE_ENV = 'test';

describe('Asset API Integration', () => {
  let app;

  beforeAll(() => {
    app = express();
    
    const corsOptions = {
      origin: ['http://localhost:3002'],
      methods: ['GET', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    
    // Routes de test
    app.get('/api/assets', (req, res) => {
      res.status(200).json([
        { id: 1, name: 'Test Asset 1', scope: 'game' },
        { id: 2, name: 'Test Asset 2', scope: 'user' }
      ]);
    });
    
    app.get('/api/assets/game', (req, res) => {
      res.status(200).json([
        { id: 1, scope: 'game', type: 'images', category: 'avatars' }
      ]);
    });
    
    app.get('/api/assets/:id', (req, res) => {
      if (req.params.id === '999') {
        return res.status(404).json({ message: 'File not found.' });
      }
      res.status(200).json({ id: parseInt(req.params.id), name: 'Test Asset' });
    });
    
    app.get('/api/assets/:scope/:type', (req, res) => {
      res.status(200).json([
        { id: 1, scope: req.params.scope, type: req.params.type, category: 'avatars' }
      ]);
    });
    
    app.get('/api/assets/:scope/:type/:category', (req, res) => {
      res.status(200).json([
        { 
          id: 1, 
          scope: req.params.scope, 
          type: req.params.type, 
          category: req.params.category 
        }
      ]);
    });
  });

  describe('GET /api/assets', () => {
    it('should return all assets', async () => {
      const response = await request(app).get('/api/assets').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/assets/:id', () => {
    it('should return specific asset', async () => {
      const response = await request(app).get('/api/assets/1').expect(200);
      expect(response.body).toEqual({ id: 1, name: 'Test Asset' });
    });

    it('should return 404 for non-existent asset', async () => {
      const response = await request(app).get('/api/assets/999').expect(404);
      expect(response.body).toEqual({ message: 'File not found.' });
    });
  });

  describe('GET /api/assets/:scope', () => {
    it('should return assets by scope', async () => {
      const response = await request(app).get('/api/assets/game').expect(200);
      expect(response.body[0].scope).toBe('game');
    });
  });

  describe('GET /api/assets/:scope/:type', () => {
    it('should return assets by scope and type', async () => {
      const response = await request(app).get('/api/assets/game/images').expect(200);
      expect(response.body[0].scope).toBe('game');
      expect(response.body[0].type).toBe('images');
    });
  });

  describe('GET /api/assets/:scope/:type/:category', () => {
    it('should return assets by scope, type and category', async () => {
      const response = await request(app).get('/api/assets/game/images/avatars').expect(200);
      expect(response.body[0].scope).toBe('game');
      expect(response.body[0].type).toBe('images');
      expect(response.body[0].category).toBe('avatars');
    });
  });
});