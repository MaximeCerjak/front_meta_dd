import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { DataTypes } from 'sequelize';

describe('Map Model', () => {
  let mockSequelize;
  let Map;

  beforeAll(async () => {
    // Mock de Sequelize
    mockSequelize = {
      define: jest.fn(),
      authenticate: jest.fn().mockResolvedValue(true),
      sync: jest.fn().mockResolvedValue(true)
    };

    jest.unstable_mockModule('../../src/config/database.js', () => ({
      default: mockSequelize
    }));

    // Import du modèle après le mock
    Map = await import('../../src/models/Map.js');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait définir le modèle Map avec les bons attributs', async () => {
    expect(mockSequelize.define).toHaveBeenCalledWith('Map', {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      layerFileIds: { 
        field: "layer_file_ids", 
        type: DataTypes.ARRAY(DataTypes.INTEGER), 
        allowNull: false 
      },
      jsonFileId: { 
        field: "json_file_id", 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      metadata: { type: DataTypes.JSON, defaultValue: {} }
    }, {
      tableName: 'maps',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  });

  it('devrait exporter le modèle Map', () => {
    expect(Map.default).toBeDefined();
  });
});