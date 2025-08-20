import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

// Configuration OpenAPI
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Asset Service API',
      version: '1.0.0',
      description: 'Documentation des endpoints du Asset Service.',
      'x-swagger': {
        name: 'Swagger OPENAPI',
        url: 'http://localhost:4000/api-docs',
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/api', 
      },
    ],
    components: {
      schemas: {
        Asset: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Identifiant unique de l\'asset', example: 1 },
            filename: { type: 'string', description: 'Nom du fichier', example: 'asset1' },
            name: { type: 'string', description: 'Nom de l\'asset', example: 'asset1' },
            type: { type: 'string', description: 'Type de l\'asset', example: 'image' },
            category: { type: 'string', description: 'Catégorie de l\'asset', example: 'background' },
            scope: { type: 'string', description: 'Portée de l\'asset', example: 'public' },
            path: { type: 'string', description: 'Chemin de l\'asset', example: '/path/to/asset' },
            size: { type: 'integer', description: 'Taille de l\'asset', example: 1024 },
            dimensions: { type: 'string', description: 'Dimensions de l\'asset', example: '1024x768' },
            frameWidth: { type: 'integer', description: 'Largeur de la frame', example: 1024 },
            frameHeight: { type: 'integer', description: 'Hauteur de la frame', example: 768 },
            description: { type: 'string', description: 'Description de l\'asset', example: 'Description de l\'asset' },
            uploaded_by: { type: 'string', description: 'Utilisateur ayant uploadé l\'asset', example: 'user1' },
            created_at: { type: 'string', description: 'Date de création de l\'asset', example: '2021-01-01' },
          },
          required: ['name', 'description', 'type'],
        },
      }
    }
  },
  apis: ['./src/routes/*.js'], 
};

// Génération des spécifications OpenAPI
const specs = swaggerJsdoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
router.get('/openapi.json', (req, res) => res.json(specs));

export default router;
