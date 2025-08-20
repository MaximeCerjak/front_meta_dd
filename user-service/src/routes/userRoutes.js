/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API de gestion des utilisateurs
 *   x-swagger-ui-url: http://localhost:3000/api-docs
 */

import express from 'express';
import { 
    getAvailableAvatars, 
    createAvatar, 
    getAvatarById ,
} from '../controllers/AvatarController.js';
import {
    getAll,
    register,
    login,
    updateUserAvatar,
    getUserById, 
    testToken,
    getAnonymUser
} from '../controllers/UserController.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Récupérer tous les utilisateurs
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Liste des utilisateurs récupérée avec succès.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *      500:
 *        description: Erreur serveur.
 */
router.get('/', getAll);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide.
 */
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Se connecter
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/login', login);

/**
 * @swagger
 * /users/avatars:
 *   get:
 *     summary: Récupérer tous les avatars
 *     description: Retourne tous les avatars disponibles.
 *     tags: [Avatars]
 *     responses:
 *       200:
 *         description: Liste des avatars récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avatar'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/avatars', getAvailableAvatars);

/**
 * @swagger
 * /users/avatars:
 *   post:
 *     summary: Créer un nouvel avatar
 *     tags: [Avatars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Avatar'
 *     responses:
 *       201:
 *         description: Avatar créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/avatars', createAvatar);

/**
 * @swagger
 * /users/anonym:
 *   get:
 *     summary: Récupérer un utilisateur anonyme
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Utilisateur anonyme récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnonymUser'
 *       500:
 *         description: Erreur serveur. 
 */
router.get('/anonym', getAnonymUser);

/**
 * @swagger
 * /users/test:
 *   get:
 *     summary: Tester le token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token valide.
 *       401:
 *         description: Token invalide.
 *       500:
 *         description: Erreur serveur.
 */    
router.get('/test', testToken);

/**
 * @swagger
 * /users/{id}/avatar:
 *   patch:
 *     summary: Mettre à jour l'avatar d'un utilisateur
 *     tags: [Avatars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *             properties:
 *               avatarId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avatar mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.patch('/:id/avatar', updateUserAvatar);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé.
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users/avatars/{id}:
 *   get:
 *     summary: Récupérer un avatar
 *     tags: [Avatars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'avatar
 *     responses:
 *       200:
 *         description: Avatar récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
 *       404:
 *         description: Avatar non trouvé.
 */
router.get('/avatars/:id', getAvatarById);

export default router;
