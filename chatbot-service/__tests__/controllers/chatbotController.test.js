import { jest } from '@jest/globals';
import { generateResponse } from '../../src/controllers/chatbotController.js';

// Mock d'OpenAI - CORRIGÉ
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
};

// Mock du module openai complet
jest.unstable_mockModule('../../src/config/openai.js', () => ({
  default: mockOpenAI
}));

// Importer après le mock
const { default: openai } = await import('../../src/config/openai.js');

describe('ChatbotController', () => {
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
    
    // Reset des mocks
    jest.clearAllMocks();
  });

  describe('generateResponse', () => {
    test('devrait retourner une erreur 400 si aucun message n\'est fourni', async () => {
      mockRequest.body = {};

      await generateResponse(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Un message est requis pour converser avec le Sage."
      });
    });

    test('devrait retourner une réponse valide quand un message est fourni', async () => {
      // Mock de la réponse OpenAI
      const mockOpenAIResponse = {
        choices: [{
          message: {
            content: "Salutations, noble voyageur ! Les mystères de l'art vous attendent dans ce metavers enchanté."
          }
        }]
      };

      // Utiliser le mock correctement
      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      mockRequest.body = {
        message: "Bonjour Sage Histoart",
        conversationHistory: []
      };

      await generateResponse(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.any(String),
          sage: "Sage Histoart",
          timestamp: expect.any(String),
          debug: expect.objectContaining({
            wordCount: expect.any(Number),
            isComplete: expect.any(Boolean)
          })
        })
      );
    });

    test('devrait gérer les erreurs OpenAI avec une réponse de fallback', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      mockRequest.body = {
        message: "Test message"
      };

      await generateResponse(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.stringContaining("Pardonnez-moi"),
          sage: "Sage Histoart",
          error: "Énergies mystiques perturbées"
        })
      );
    });

    test('devrait traiter l\'historique de conversation correctement', async () => {
      const mockOpenAIResponse = {
        choices: [{
          message: {
            content: "Votre question sur l'art est fort pertinente ! Laissez-moi vous éclairer sur ce mystère artistique."
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      mockRequest.body = {
        message: "Nouvelle question",
        conversationHistory: [
          { sender: "user", content: "Première question" },
          { sender: "sage", content: "Première réponse" }
        ]
      };

      await generateResponse(mockRequest, mockResponse);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "system" }),
            expect.objectContaining({ role: "user", content: "Première question" }),
            expect.objectContaining({ role: "assistant", content: "Première réponse" }),
            expect.objectContaining({ role: "user", content: "Nouvelle question" })
          ])
        })
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });
});
