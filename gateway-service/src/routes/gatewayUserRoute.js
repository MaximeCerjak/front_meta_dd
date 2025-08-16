import express from 'express';
import {register, login, postAvatar, testToken} from '../services/GatewayUserService.js';
import { getAvatar } from '../controllers/GatewayUserController.js';
import authMiddleware from '../middlewares/auth.js'
import {RolesEnum} from "../model/rolesEnum.js";

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *  post:
 *   summary: Enregistrer un nouvel utilisateur
 *   description: Crée un nouvel utilisateur dans le système.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       pseudonyme:
 *        type: string
 *       password:
 *        type: string
 *   responses:
 *    201:
 *     description: Utilisateur créé avec succès.
 */
router.post('/register', async (req, res) => {
    try {
        const user = await register(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /users/login:
 *  post:
 *   summary: Se connecter
 *   description: Connecte un utilisateur au système.
 *   requestBody:
 *    required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *       properties:
 *        pseudonyme:
 *         type: string
 *        password:
 *         type: string
 *       required: 
 *        - pseudonyme
 *        - password
 *   responses:
 *    200:
 *     description: Utilisateur connecté avec succès.
 *    400:
 *     description: Requête invalide.
 *    500:
 *     description: Erreur serveur.
 */ 
router.post('/login', async (req, res) => {
    try {
        const user = await login(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /avatars/{id}:
 *  get:
 *   summary: Récupérer un avatar
 *   description: Retourne un avatar en fonction de son identifiant.
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Avatar récupéré avec succès.
 *    404:
 *     description: Avatar non trouvé.
 */
router.get('/avatars/:id', async (req, res) => {
    try {
        console.log("Route getAvatarById");
        const avatar = await getAvatar(req.params.id);
        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found.' });
        }
        res.json(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// post avatar
/**
 * @swagger
 * /users/{id}/avatar:
 *  post:
 *    summary: Ajouter un avatar
 *    description: Ajoute un avatar à un utilisateur.
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *       properties:
 *        avatar:
 *         type: string
 *         format: binary
 *       required:
 *        - avatar
 *   responses:
 *     201:
 *       description: Avatar ajouté avec succès.
 *     400:
 *       description: Requête invalide.
 *     500:
 *      description: Erreur serveur.
 */
router.post('/avatars', async (req, res) => {
    try {
        const user = await postAvatar(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//test token
router.get('/test', authMiddleware([RolesEnum.USER, RolesEnum.SUPER_USER, RolesEnum.ADMIN]), async (req, res) => {
    try {
        const test = await testToken();
        res.json(test);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
});

export default router;
