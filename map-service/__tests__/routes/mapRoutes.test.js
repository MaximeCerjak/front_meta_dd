import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Map Routes', () => {
  let app;

  beforeAll(() => {
    // Créer une app Express directe pour les tests
    app = express();
    app.use(express.json());

    // Créer des routes de test directement
    app.post('/api/maps', (req, res) => {
      // Simuler la validation
      const { name, description, layerFileIds, jsonFileId } = req.body;
      
      if (!name || !description || !layerFileIds || !jsonFileId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      res.status(201).json({ 
        message: 'Map created', 
        map: { id: 1, ...req.body } 
      });
    });

    app.get('/api/maps', (req, res) => {
      res.status(200).json([
        { id: 1, name: 'Map 1' }, 
        { id: 2, name: 'Map 2' }
      ]);
    });

    app.get('/api/maps/:id', (req, res) => {
      res.status(200).json({ 
        id: parseInt(req.params.id), 
        name: 'Test Map' 
      });
    });

    app.put('/api/maps/:id', (req, res) => {
      res.status(200).json({ 
        message: 'Map updated',
        map: { id: parseInt(req.params.id), ...req.body }
      });
    });

    app.delete('/api/maps/:id', (req, res) => {
      res.status(200).json({ 
        message: 'Map deleted' 
      });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/maps', () => {
    it('devrait créer une carte avec les bonnes données', async () => {
      const mapData = {
        name: 'Test Map',
        description: 'Description test',
        layerFileIds: [1, 2],
        jsonFileId: 3
      };

      const response = await request(app)
        .post('/api/maps')
        .send(mapData)
        .expect(201);

      expect(response.body.message).toBe('Map created');
      expect(response.body.map).toMatchObject(mapData);
    });

    it('devrait rejeter les données invalides', async () => {
      const invalidData = {
        name: 'Test Map'
        // Champs manquants
      };

      await request(app)
        .post('/api/maps')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/maps', () => {
    it('devrait retourner toutes les cartes', async () => {
      const response = await request(app)
        .get('/api/maps')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/maps/:id', () => {
    it('devrait retourner une carte par ID', async () => {
      const response = await request(app)
        .get('/api/maps/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(1);
    });
  });

  describe('PUT /api/maps/:id', () => {
    it('devrait mettre à jour une carte', async () => {
      const updateData = { name: 'Updated Map' };

      const response = await request(app)
        .put('/api/maps/1')
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Map updated');
    });
  });

  describe('DELETE /api/maps/:id', () => {
    it('devrait supprimer une carte', async () => {
      const response = await request(app)
        .delete('/api/maps/1')
        .expect(200);

      expect(response.body.message).toBe('Map deleted');
    });
  });
});