import { jest } from '@jest/globals';
import { 
  generateSpontaneousMessage, 
  generateResponseToUser, 
  getVirtualPlayers 
} from '../../src/controllers/multiChatSimulatorController.js';

// Mock d'OpenAI - même pattern corrigé
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

const { default: openai } = await import('../../src/config/openai.js');

describe('MultiChatSimulatorController', () => {
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = { body: {} };
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
    
    jest.clearAllMocks();
  });

  describe('generateSpontaneousMessage', () => {
    test('devrait générer un message spontané avec succès', async () => {
      const mockOpenAIResponse = {
        choices: [{
          message: {
            content: "Quelqu'un a déjà visité la nouvelle exposition de Van Gogh ?"
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      await generateSpontaneousMessage(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          playerId: expect.any(String),
          playerName: expect.any(String),
          playerAvatar: expect.any(String),
          message: expect.any(String),
          type: 'spontaneous',
          timestamp: expect.any(String)
        })
      );
    });

    test('devrait utiliser un fallback en cas d\'erreur', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      await generateSpontaneousMessage(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fallback'
        })
      );
    });
  });

  describe('generateResponseToUser', () => {
    test('devrait retourner une erreur 400 si aucun message utilisateur', async () => {
      mockRequest.body = {};

      await generateResponseToUser(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message utilisateur requis"
      });
    });

    test('devrait générer une réponse à un message utilisateur', async () => {
      const mockOpenAIResponse = {
        choices: [{
          message: {
            content: "Intéressant ! Je pense que cette technique est fascinante."
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      mockRequest.body = {
        userMessage: "Que pensez-vous de l'impressionnisme ?",
        conversationContext: []
      };

      await generateResponseToUser(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          playerId: expect.any(String),
          playerName: expect.any(String),
          message: expect.any(String),
          type: 'response',
          respondingTo: "Que pensez-vous de l'impressionnisme ?"
        })
      );
    });
  });

  describe('getVirtualPlayers', () => {
    test('devrait retourner la liste des joueurs virtuels', async () => {
      await getVirtualPlayers(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        players: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            avatar: expect.any(String),
            interests: expect.any(Array),
            status: 'online'
          })
        ])
      });
    });
  });
});
