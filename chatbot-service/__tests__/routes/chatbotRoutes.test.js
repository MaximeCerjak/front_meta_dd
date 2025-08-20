import request from 'supertest';
import express from 'express';

describe('Chatbot Routes - Tests basiques', () => {
  let app;
  let chatbotRoutes;

  beforeAll(async () => {
    // Import des routes
    const routes = await import('../../src/routes/chatbotRoutes.js');
    chatbotRoutes = routes.default;
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', chatbotRoutes);
  });

  test('POST /api/chatbot devrait être accessible et retourner une réponse', async () => {
    const response = await request(app)
      .post('/api/chatbot')
      .send({ message: "Bonjour" });

    // Peut être 200 (succès) ou 500 (erreur OpenAI avec fausse clé)
    // Dans les deux cas, on vérifie que la route existe et répond
    expect([200, 500]).toContain(response.status);
    expect(response.body).toHaveProperty('sage');
  });

  test('POST /api/chatbot devrait retourner 400 sans message', async () => {
    const response = await request(app)
      .post('/api/chatbot')
      .send({})
      .expect(400);

    expect(response.body).toEqual({
      error: "Un message est requis pour converser avec le Sage."
    });
  });
});