import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChatBot Service API',
      version: '1.0.0',
      description: 'Documentation des endpoints du Chatbot Service.',
    },
    servers: [{ url: 'http://localhost:6000' }],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

console.log('OpenAPI Specs:', JSON.stringify(specs, null, 2));

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
router.get('/openapi.json', (req, res) => res.json(specs));

export default router;
