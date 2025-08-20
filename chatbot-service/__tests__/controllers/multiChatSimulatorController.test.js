import { jest } from '@jest/globals';

describe('MultiChatSimulatorController - Tests basiques', () => {
  let generateResponseToUser;
  let getVirtualPlayers;
  let generateSpontaneousMessage;
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeAll(async () => {
    const controller = await import('../../src/controllers/multiChatSimulatorController.js');
    generateResponseToUser = controller.generateResponseToUser;
    getVirtualPlayers = controller.getVirtualPlayers;
    generateSpontaneousMessage = controller.generateSpontaneousMessage;
  });

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

  describe('generateResponseToUser - Validation', () => {
    test('devrait retourner une erreur 400 si aucun message utilisateur', async () => {
      mockRequest.body = {};

      await generateResponseToUser(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message utilisateur requis"
      });
    });

    test('devrait retourner une erreur 400 si le message utilisateur est vide', async () => {
      mockRequest.body = { userMessage: "" };

      await generateResponseToUser(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message utilisateur requis"
      });
    });
  });

  describe('generateSpontaneousMessage - Test de fallback', () => {
    test('devrait générer un message (fallback avec fausse clé API)', async () => {
      await generateSpontaneousMessage(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          playerId: expect.any(String),
          playerName: expect.any(String),
          playerAvatar: expect.any(String),
          message: expect.any(String),
          timestamp: expect.any(String)
        })
      );
    });
  });
});