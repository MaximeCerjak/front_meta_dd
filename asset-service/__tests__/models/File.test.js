import { jest } from '@jest/globals';
import { DataTypes } from 'sequelize';

// Mock de la base de données
const mockSequelize = {
  define: jest.fn(),
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue()
};

jest.mock('../../src/config/database.js', () => ({
  default: mockSequelize
}));

describe('File Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should define File model with correct attributes', async () => {
    // Import du modèle après le mock
    await import('../../src/models/File.js');

    expect(mockSequelize.define).toHaveBeenCalledWith(
      'File',
      expect.objectContaining({
        filename: expect.objectContaining({
          type: DataTypes.STRING,
          allowNull: false
        }),
        name: expect.objectContaining({
          type: DataTypes.STRING
        }),
        type: expect.objectContaining({
          type: DataTypes.STRING,
          allowNull: false
        }),
        category: expect.objectContaining({
          type: DataTypes.STRING,
          allowNull: false
        }),
        scope: expect.objectContaining({
          type: DataTypes.STRING,
          allowNull: false
        }),
        path: expect.objectContaining({
          type: DataTypes.TEXT,
          allowNull: false
        }),
        size: expect.objectContaining({
          type: DataTypes.INTEGER,
          allowNull: false
        }),
        dimensions: expect.objectContaining({
          type: DataTypes.STRING
        }),
        frameWidth: expect.objectContaining({
          type: DataTypes.INTEGER,
          allowNull: true
        }),
        frameHeight: expect.objectContaining({
          type: DataTypes.INTEGER,
          allowNull: true
        }),
        description: expect.objectContaining({
          type: DataTypes.TEXT
        }),
        uploaded_by: expect.objectContaining({
          type: DataTypes.STRING,
          allowNull: true
        }),
        created_at: expect.objectContaining({
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }),
        updated_at: expect.objectContaining({
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        })
      }),
      expect.objectContaining({
        tableName: 'files',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: expect.objectContaining({
          beforeCreate: expect.any(Function),
          beforeUpdate: expect.any(Function)
        })
      })
    );
  });

  test('should set timestamps in beforeCreate hook', async () => {
    await import('../../src/models/File.js');
    
    const [, , options] = mockSequelize.define.mock.calls[0];
    const file = {};
    
    // Simuler l'exécution du hook beforeCreate
    options.hooks.beforeCreate(file);
    
    expect(file.created_at).toBeInstanceOf(Date);
    expect(file.updated_at).toBeInstanceOf(Date);
  });

  test('should update timestamp in beforeUpdate hook', async () => {
    await import('../../src/models/File.js');
    
    const [, , options] = mockSequelize.define.mock.calls[0];
    const file = {
      created_at: new Date('2023-01-01')
    };
    
    // Simuler l'exécution du hook beforeUpdate
    options.hooks.beforeUpdate(file);
    
    expect(file.updated_at).toBeInstanceOf(Date);
    expect(file.updated_at.getTime()).toBeGreaterThan(file.created_at.getTime());
  });
});