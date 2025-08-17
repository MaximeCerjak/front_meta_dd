import request from 'supertest';
import app from '../../src/app.js';

// Mock OpenAI pour les tests d'intégration
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
};

jest.unstable_mockModule('../../src/config/openai.js', () => ({
  default: mockOpenAI
}));

describe('Application Integration Tests', () => {
  describe('Server Health', () => {
    test('devrait démarrer et répondre au health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: 'OK',
          service: 'chatbot-service'
        })
      );
    });

    test('devrait répondre à la route racine', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.stringContaining('Chatbot Service'),
          endpoints: expect.any(Object)
        })
      );
    });
  });

  describe('API Integration', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('devrait gérer une conversation complète', async () => {
      // Mock de réponse OpenAI
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: "Salutations, noble voyageur ! Bienvenue dans ce metavers artistique."
          }
        }]
      });

      const response = await request(app)
        .post('/api/chatbot')
        .send({
          message: "Bonjour Sage Histoart",
          conversationHistory: []
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          response: expect.any(String),
          sage: "Sage Histoart",
          timestamp: expect.any(String)
        })
      );

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4o-mini",
          messages: expect.any(Array)
        })
      );
    });

    test('devrait gérer les erreurs de validation', async () => {
      const response = await request(app)
        .post('/api/chatbot')
        .send({})
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.stringContaining("message")
        })
      );
    });

    test('devrait gérer les routes inexistantes', async () => {
      await request(app)
        .get('/api/inexistant')
        .expect(404);
    });
  });

  describe('Multiplayer API Integration', () => {
    test('devrait retourner la liste des joueurs virtuels', async () => {
      const response = await request(app)
        .get('/api/multiplayer/players')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          players: expect.any(Array)
        })
      );
      
      expect(response.body.players.length).toBeGreaterThan(0);
    });

    test('devrait générer un message spontané', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: "Quelqu'un a déjà visité l'exposition ?"
          }
        }]
      });

      const response = await request(app)
        .post('/api/multiplayer/spontaneous')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          playerId: expect.any(String),
          playerName: expect.any(String),
          message: expect.any(String),
          type: expect.any(String)
        })
      );
    });
  });
});