import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

// Configuration OpenAPI
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Map Service API',
      version: '1.0.0',
      description: 'Documentation des endpoints du Map Service.',
      'x-swagger': {
        name: 'Swagger OPENAPI',
        url: 'http://localhost:5000/api-docs',
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api', 
      },
    ],
    components: {
      schemas: {
        Map: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Identifiant unique de la carte', example: 1 },
            name: { type: 'string', description: 'Nom de la carte', example: 'carte1' },
            description: { type: 'string', description: 'Description de la carte', example: 'Description de la carte' },
            layerFileIds: { type: 'array', items: { type: 'integer' }, description: 'Identifiants des fichiers de calques', example: [1, 2] },
            jsonFileId: { type: 'integer', description: 'Identifiant du fichier JSON', example: 3 },
            metadata: { type: 'object', description: 'Métadonnées de la carte', example: { key: 'value' } },
          },
          required: ['name', 'description', 'layerFileIds', 'jsonFileId'],
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
