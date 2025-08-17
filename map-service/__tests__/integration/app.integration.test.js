import { jest } from '@jest/globals';
import request from 'supertest';

// Mock de la base de données
const mockSequelize = {
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
  close: jest.fn().mockResolvedValue(true)
};

jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: mockSequelize
}));

// Mock des modèles
const mockMap = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn()
};

const mockGrid = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn()
};

const mockTeleporter = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn()
};

jest.unstable_mockModule('../../src/models/Map.js', () => ({
  default: mockMap
}));

jest.unstable_mockModule('../../src/models/Grid.js', () => ({
  default: mockGrid
}));

jest.unstable_mockModule('../../src/models/Teleporter.js', () => ({
  default: mockTeleporter
}));

// Import de l'app après les mocks
const app = await import('../../src/app.js');

describe('Application Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Swagger Documentation', () => {
    it('devrait servir la documentation Swagger', async () => {
      const response = await request(app.default)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger-ui');
    });

    it('devrait fournir le fichier OpenAPI JSON', async () => {
      const response = await request(app.default)
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

      const createdMap = { id: 1, ...mapData };
      mockMap.create.mockResolvedValue(createdMap);
      mockMap.findByPk.mockResolvedValue(createdMap);

      // Créer la carte
      const createResponse = await request(app.default)
        .post('/api/maps')
        .send(mapData)
        .expect(201);

      expect(createResponse.body.message).toBe('Map created successfully.');
      expect(createResponse.body.map).toMatchObject(mapData);

      // Récupérer la carte créée
      const getResponse = await request(app.default)
        .get('/api/maps/1')
        .expect(200);

      expect(getResponse.body).toMatchObject(mapData);
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

      const createdGrid = { id: 1, ...gridData };
      mockGrid.create.mockResolvedValue(createdGrid);

      const response = await request(app.default)
        .post('/api/maps/grids')
        .send(gridData)
        .expect(201);

      expect(response.body.message).toBe('Grid created successfully.');
      expect(mockGrid.create).toHaveBeenCalledWith(gridData);
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

      const createdTeleporter = { id: 1, ...teleporterData };
      mockTeleporter.create.mockResolvedValue(createdTeleporter);

      const response = await request(app.default)
        .post('/api/maps/teleporters')
        .send(teleporterData)
        .expect(201);

      expect(response.body.message).toBe('Teleporter created successfully.');
      expect(mockTeleporter.create).toHaveBeenCalledWith(teleporterData);
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les erreurs 404 pour les routes inexistantes', async () => {
      await request(app.default)
        .get('/api/nonexistent')
        .expect(404);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      mockMap.findAll.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app.default)
        .get('/api/maps')
        .expect(500);

      expect(response.body.message).toBe('Error retrieving maps.');
    });
  });
});