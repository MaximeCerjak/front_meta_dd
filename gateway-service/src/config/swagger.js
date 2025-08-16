import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

// Configuration OpenAPI
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gateway Service API',
      version: '1.0.0',
      description: 'Documentation des endpoints du Gateway Service.',
    },
    servers: [
      {
        url: 'http://localhost:8080', 
      },
    ],
  },
  apis: ['./routes/*.js'], // Adapter aux fichiers routes
};

// Génération des spécifications OpenAPI
const specs = swaggerJsdoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
router.get('/openapi.json', (req, res) => res.json(specs));

export default router;
