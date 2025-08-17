import request from 'supertest';
import express from 'express';
import chatbotRoutes from '../../src/routes/chatbotRoutes.js';

// Mock du controller
jest.mock('../../src/controllers/chatbotController.js', () => ({
  generateResponse: jest.fn((req, res) => {
    if (!req.body.message) {
      return res.status(400).json({ error: "Message requis" });
    }
    res.status(200).json({ 
      response: "Réponse test",
      sage: "Sage Histoart"
    });
  })
}));

describe('Chatbot Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', chatbotRoutes);
  });

  test('POST /api/chatbot devrait fonctionner avec un message valide', async () => {
    const response = await request(app)
      .post('/api/chatbot')
      .send({ message: "Bonjour" })
      .expect(200);

    expect(response.body).toEqual({
      response: "Réponse test",
      sage: "Sage Histoart"
    });
  });

  test('POST /api/chatbot devrait retourner 400 sans message', async () => {
    const response = await request(app)
      .post('/api/chatbot')
      .send({})
      .expect(400);

    expect(response.body).toEqual({
      error: "Message requis"
    });
  });
});