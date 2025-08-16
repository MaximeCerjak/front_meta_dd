import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

// Configuration OpenAPI
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'Documentation des endpoints du User Service.',
      'x-swagger': {
        name: 'Swagger OPENAPI',
        url: 'http://localhost:3000/api-docs',
      }
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Identifiant unique de l\'utilisateur', example: 1 },
            username: { type: 'string', description: 'Nom d\'utilisateur', example: 'john_doe' },
            roles: { type: 'string', description: 'Rôles de l\'utilisateur', example: 'USER',},
            avatarId: { type: 'integer', nullable: true, description: 'ID de l\'avatar associé', example: 5 },
          },
          required: ['username', 'email'],
        },
        AnonymUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Identifiant unique de l\'utilisateur', example: null },
            username: { type: 'string', description: 'Nom d\'utilisateur', example: 'Anonym' },
            roles: { type: 'string', description: 'Rôles de l\'utilisateur', example: 'ANONYMOUS',},
            avatarId: { type: 'integer', nullable: true, description: 'ID de l\'avatar associé', example: 1 },
          },
          required: ['username'],
        },
        Login: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Nom d\'utilisateur', example: 'john_doe' },
            password: { type: 'string', description: 'Mot de passe', example: 'password' },
          },
          required: ['username', 'password'],
        },
        Avatar: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Identifiant unique de l\'avatar', example: 1 },
            name: { type: 'string', description: 'Nom de l\'avatar', example: 'avatar1' },
            walkField: { type: 'integer', description: 'Id du fichier du sprite de marche', example: 1 },
            idleField: { type: 'integer', description: 'Id du fichier du sprite d\'attente', example: 2 },
          },
          required: ['name', 'walkField', 'idleField'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};


// Génération des spécifications OpenAPI
const specs = swaggerJsdoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
router.get('/openapi.json', (req, res) => res.json(specs));

export default router;
