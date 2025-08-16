// __tests__/UserController.test.js
import { getAnonymUser } from '../src/controllers/UserController.js';

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAnonymUser', () => {
    it('should return anonymous user object', async () => {
      await getAnonymUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: null,
        username: 'Anonyme',
        role: 'ANONYMOUS',
        avatar: 'default_avatar.png',
        position: { map: 'reception', x: 300, y: 400 }
      });
    });
  });
});