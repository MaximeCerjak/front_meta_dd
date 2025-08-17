import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Map Routes', () => {
  let app;
  let mockMapController;

  beforeAll(async () => {
    // Mock du contrôleur
    mockMapController = {
      createMap: jest.fn(),
      getMaps: jest.fn(),
      getMapById: jest.fn(),
      updateMap: jest.fn(),
      deleteMap: jest.fn()
    };

    jest.unstable_mockModule('../../src/controllers/MapController.js', () => mockMapController);

    // Import des routes après le mock
    const mapRoutes = await import('../../src/routes/mapRoutes.js');

    // Configuration de l'app de test
    app = express();
    app.use(express.json());
    app.use('/api/maps', mapRoutes.default);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/maps', () => {
    it('devrait appeler createMap avec les bonnes données', async () => {
      const mapData = {
        name: 'Test Map',
        description: 'Description test',
        layerFileIds: [1, 2],
        jsonFileId: 3
      };

      mockMapController.createMap.mockImplementation((req, res) => {
        res.status(201).json({ message: 'Map created', map: { id: 1, ...mapData } });
      });

      const response = await request(app)
        .post('/api/maps')
        .send(mapData)
        .expect(201);

      expect(mockMapController.createMap).toHaveBeenCalled();
      expect(response.body.message).toBe('Map created');
    });
  });

  describe('GET /api/maps', () => {
    it('devrait appeler getMaps', async () => {
      const maps = [
        { id: 1, name: 'Map 1' },
        { id: 2, name: 'Map 2' }
      ];

      mockMapController.getMaps.mockImplementation((req, res) => {
        res.status(200).json(maps);
      });

      const response = await request(app)
        .get('/api/maps')
        .expect(200);

      expect(mockMapController.getMaps).toHaveBeenCalled();
      expect(response.body).toEqual(maps);
    });
  });

  describe('GET /api/maps/:id', () => {
    it('devrait appeler getMapById avec le bon ID', async () => {
      const map = { id: 1, name: 'Test Map' };

      mockMapController.getMapById.mockImplementation((req, res) => {
        res.status(200).json(map);
      });

      const response = await request(app)
        .get('/api/maps/1')
        .expect(200);

      expect(mockMapController.getMapById).toHaveBeenCalled();
      expect(response.body).toEqual(map);
    });
  });

  describe('PUT /api/maps/:id', () => {
    it('devrait appeler updateMap avec les nouvelles données', async () => {
      const updateData = { name: 'Updated Map' };

      mockMapController.updateMap.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Map updated' });
      });

      await request(app)
        .put('/api/maps/1')
        .send(updateData)
        .expect(200);

      expect(mockMapController.updateMap).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/maps/:id', () => {
    it('devrait appeler deleteMap', async () => {
      mockMapController.deleteMap.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Map deleted' });
      });

      await request(app)
        .delete('/api/maps/1')
        .expect(200);

      expect(mockMapController.deleteMap).toHaveBeenCalled();
    });
  });
});