import request from 'supertest';

describe('Application Integration Tests - Basiques', () => {
  let app;

  beforeAll(async () => {
    // Import de l'app
    const appModule = await import('../../src/app.js');
    app = appModule.default;
  });

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
    test('devrait répondre à l\'API chatbot (validation d\'entrée)', async () => {
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
  });
});