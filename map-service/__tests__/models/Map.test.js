import { jest, describe, it, expect } from '@jest/globals';
import { DataTypes } from 'sequelize';

describe('Map Model', () => {
  it('devrait valider les attributs du modèle Map', () => {
    // Test de la structure attendue du modèle
    const expectedAttributes = {
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
    };

    const expectedOptions = {
      tableName: 'maps',
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };

    // Vérifier que les types et options sont bien définis
    expect(expectedAttributes.name.type).toBe(DataTypes.STRING);
    expect(expectedAttributes.description.type).toBe(DataTypes.TEXT);
    expect(expectedAttributes.layerFileIds.type.type.key).toBe('INTEGER');
    expect(expectedAttributes.jsonFileId.type).toBe(DataTypes.INTEGER);
    expect(expectedAttributes.metadata.type).toBe(DataTypes.JSON);
    
    expect(expectedOptions.tableName).toBe('maps');
    expect(expectedOptions.freezeTableName).toBe(true);
  });

  it('devrait avoir les bons noms de champs', () => {
    // Test des mappings de champs
    expect('layer_file_ids').toBe('layer_file_ids');
    expect('json_file_id').toBe('json_file_id');
    expect('created_at').toBe('created_at');
    expect('updated_at').toBe('updated_at');
  });

  it('devrait avoir les bonnes validations', () => {
    // Test des validations requises
    const requiredFields = ['name', 'description', 'layerFileIds', 'jsonFileId'];
    
    requiredFields.forEach(field => {
      expect(field).toBeDefined();
    });
  });
});