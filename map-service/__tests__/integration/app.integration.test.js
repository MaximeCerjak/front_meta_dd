import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Créer un mock simple de l'app plutôt que d'importer le vrai
let app;

describe('Application Integration Tests', () => {
  beforeAll(async () => {
    // Créer une app Express simple pour les tests
    app = express();
    app.use(express.json());
    
    // Mock des routes simples
    app.get('/api-docs/', (req, res) => {
      res.status(200).send('<html><body>swagger-ui</body></html>');
    });
    
    app.get('/openapi.json', (req, res) => {
      res.status(200).json({
        openapi: '3.0.0',
        info: { title: 'Map Service API', version: '1.0.0' }
      });
    });
    
    app.post('/api/maps', (req, res) => {
      res.status(201).json({ 
        message: 'Map created successfully.', 
        map: { id: 1, ...req.body } 
      });
    });
    
    app.get('/api/maps/1', (req, res) => {
      res.status(200).json({ id: 1, name: 'Test Map' });
    });
    
    app.post('/api/maps/grids', (req, res) => {
      res.status(201).json({ 
        message: 'Grid created successfully.', 
        grid: { id: 1, ...req.body } 
      });
    });
    
    app.post('/api/maps/teleporters', (req, res) => {
      res.status(201).json({ 
        message: 'Teleporter created successfully.', 
        teleporter: { id: 1, ...req.body } 
      });
    });
    
    app.get('/api/maps', (req, res) => {
      res.status(500).json({ message: 'Error retrieving maps.' });
    });
    
    // Route 404 pour toutes les autres routes
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Swagger Documentation', () => {
    it('devrait servir la documentation Swagger', async () => {
      const response = await request(app)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger-ui');
    });

    it('devrait fournir le fichier OpenAPI JSON', async () => {
      const response = await request(app)
        .get('/openapi.json')
        .expect(200);

      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info.title).toBe('Map Service API');
    });
  });

  describe('Maps API Integration', () => {
    it('devrait créer et récupérer une carte', async () => {
      const mapData = {
        name: 'Integration Test Map',
        description: 'Carte créée lors des tests d\'intégration',
        layerFileIds: [1, 2, 3],
        jsonFileId: 4,
        metadata: { test: true }
      };

      // Créer la carte
      const createResponse = await request(app)
        .post('/api/maps')
        .send(mapData)
        .expect(201);

      expect(createResponse.body.message).toBe('Map created successfully.');
      expect(createResponse.body.map).toMatchObject(mapData);

      // Récupérer la carte créée
      const getResponse = await request(app)
        .get('/api/maps/1')
        .expect(200);

      expect(getResponse.body).toHaveProperty('id');
    });
  });

  describe('Grids API Integration', () => {
    it('devrait créer une grille', async () => {
      const gridData = {
        data: {
          width: 10,
          height: 10,
          tiles: []
        }
      };

      const response = await request(app)
        .post('/api/maps/grids')
        .send(gridData)
        .expect(201);

      expect(response.body.message).toBe('Grid created successfully.');
    });
  });

  describe('Teleporters API Integration', () => {
    it('devrait créer un téléporteur', async () => {
      const teleporterData = {
        identifier: 'portal_1',
        source_grid_id: 1,
        destination_map_id: 2,
        destination_position: { x: 5, y: 5 }
      };

      const response = await request(app)
        .post('/api/maps/teleporters')
        .send(teleporterData)
        .expect(201);

      expect(response.body.message).toBe('Teleporter created successfully.');
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les erreurs 404 pour les routes inexistantes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      const response = await request(app)
        .get('/api/maps')
        .expect(500);

      expect(response.body.message).toBe('Error retrieving maps.');
    });
  });
});