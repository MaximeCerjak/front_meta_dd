import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import userRoutes from '../src/routes/userRoutes.js';

// Mock des contrôleurs
jest.mock('../src/controllers/UserController.js', () => ({
  getAll: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  getUserById: jest.fn(),
  updateUserAvatar: jest.fn(),
  getAnonymUser: jest.fn(),
  testToken: jest.fn()
}));

jest.mock('../src/controllers/AvatarController.js', () => ({
  getAvailableAvatars: jest.fn(),
  createAvatar: jest.fn(),
  getAvatarById: jest.fn()
}));

import * as UserController from '../src/controllers/UserController.js';
import * as AvatarController from '../src/controllers/AvatarController.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should call getAll controller', async () => {
      UserController.getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(UserController.getAll).toHaveBeenCalled();
    });
  });

  describe('POST /api/users/register', () => {
    it('should call register controller', async () => {
      UserController.register.mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered' });
      });

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(UserController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/users/login', () => {
    it('should call login controller', async () => {
      UserController.login.mockImplementation((req, res) => {
        res.status(200).json({ token: 'jwt-token' });
      });

      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(UserController.login).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/anonym', () => {
    it('should call getAnonymUser controller', async () => {
      UserController.getAnonymUser.mockImplementation((req, res) => {
        res.status(200).json({ username: 'Anonyme' });
      });

      const response = await request(app).get('/api/users/anonym');

      expect(response.status).toBe(200);
      expect(UserController.getAnonymUser).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should call getUserById controller', async () => {
      UserController.getUserById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(UserController.getUserById).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/users/:id/avatar', () => {
    it('should call updateUserAvatar controller', async () => {
      UserController.updateUserAvatar.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Avatar updated' });
      });

      const response = await request(app)
        .patch('/api/users/1/avatar')
        .send({ avatarId: 5 });

      expect(response.status).toBe(200);
      expect(UserController.updateUserAvatar).toHaveBeenCalled();
    });
  });
});