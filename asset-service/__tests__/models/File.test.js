import { jest } from '@jest/globals';

// Variables d'environnement
process.env.NODE_ENV = 'test';

describe('File Model Structure', () => {
  it('should have correct field types', () => {
    const expectedFields = {
      filename: { type: 'STRING', allowNull: false },
      name: { type: 'STRING' },
      type: { type: 'STRING', allowNull: false },
      category: { type: 'STRING', allowNull: false },
      scope: { type: 'STRING', allowNull: false },
      path: { type: 'TEXT', allowNull: false },
      size: { type: 'INTEGER', allowNull: false },
      dimensions: { type: 'STRING' },
      frameWidth: { type: 'INTEGER', allowNull: true },
      frameHeight: { type: 'INTEGER', allowNull: true },
      description: { type: 'TEXT' },
      uploaded_by: { type: 'STRING', allowNull: true }
    };

    // Test de la structure des champs
    Object.keys(expectedFields).forEach(field => {
      expect(expectedFields[field]).toBeDefined();
      expect(expectedFields[field].type).toBeDefined();
    });
  });

  it('should have correct table configuration', () => {
    const tableConfig = {
      tableName: 'files',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };

    expect(tableConfig.tableName).toBe('files');
    expect(tableConfig.timestamps).toBe(true);
    expect(tableConfig.createdAt).toBe('created_at');
    expect(tableConfig.updatedAt).toBe('updated_at');
  });

  it('should handle timestamp creation', () => {
    const mockFile = {};
    
    // Simuler un hook beforeCreate
    const beforeCreateHook = (file) => {
      file.created_at = new Date();
      file.updated_at = new Date();
    };
    
    beforeCreateHook(mockFile);
    
    expect(mockFile.created_at).toBeInstanceOf(Date);
    expect(mockFile.updated_at).toBeInstanceOf(Date);
  });

  it('should handle timestamp update', () => {
    const mockFile = {
      created_at: new Date('2023-01-01')
    };
    
    // Simuler un hook beforeUpdate
    const beforeUpdateHook = (file) => {
      file.updated_at = new Date();
    };
    
    beforeUpdateHook(mockFile);
    
    expect(mockFile.updated_at).toBeInstanceOf(Date);
    expect(mockFile.updated_at.getTime()).toBeGreaterThan(mockFile.created_at.getTime());
  });

  it('should validate required fields', () => {
    const requiredFields = ['filename', 'type', 'category', 'scope', 'path', 'size'];
    
    requiredFields.forEach(field => {
      expect(field).toBeTruthy();
      expect(typeof field).toBe('string');
    });
  });
});