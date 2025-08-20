import { jest } from '@jest/globals';
import { createChatbotController } from '../../src/controllers/chatbotController.js';

describe('ChatbotController - Tests basiques', () => {
  let generateResponse;
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeAll(async () => {
    const controller = await import('../../src/controllers/chatbotController.js');
    generateResponse = controller.generateResponse;
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

 describe('generateResponse - Validation des entrées', () => {
    beforeAll(() => {
      const fakeOpenAI = {
        chat: {
          completions: { create: jest.fn().mockResolvedValue({ choices: [{ message: { content: 'ok' } }] }) }
        }
      };
      ({ generateResponse } = createChatbotController({ openai: fakeOpenAI }));
    });

    test("retourne 400 si aucun message n'est fourni", async () => {
      mockRequest.body = {};
      await generateResponse(mockRequest, mockResponse);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Un message est requis pour converser avec le Sage."
      });
    });

    test("retourne 400 si message vide", async () => {
      mockRequest.body = { message: "" };
      await generateResponse(mockRequest, mockResponse);
      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    test("retourne 400 si message null", async () => {
      mockRequest.body = { message: null };
      await generateResponse(mockRequest, mockResponse);
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });
});