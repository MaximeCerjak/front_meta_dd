/**
 * @swagger
 * tags:
 *  name: Chatbot
 *  description: API de gestion du chatbot
 */

import express from 'express';
import { generateResponse } from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * @swagger
 * /api/chatbot:
 *   post:
 *     summary: Converser avec le Sage Histoart
 *     description: Envoyez un message au sage gardien du metavers et recevez sa réponse mystique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Votre message au Sage
 *                 example: "Bonjour Sage Histoart, pouvez-vous me guider ?"
 *               conversationHistory:
 *                 type: array
 *                 description: Historique récent de la conversation (optionnel, géré par le frontend)
 *                 items:
 *                   type: object
 *                   properties:
 *                     sender:
 *                       type: string
 *                       enum: [user, sage]
 *                     content:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                 example: [
 *                   {
 *                     "sender": "user",
 *                     "content": "Bonjour !",
 *                     "timestamp": "2024-01-01T10:00:00Z"
 *                   },
 *                   {
 *                     "sender": "sage",
 *                     "content": "Salutations, noble voyageur !",
 *                     "timestamp": "2024-01-01T10:00:05Z"
 *                   }
 *                 ]
 *     responses:
 *       200:
 *         description: Réponse sage du gardien des connaissances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Réponse du Sage Histoart
 *                 sage:
 *                   type: string
 *                   description: Nom du sage
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Message manquant ou invalide
 *       500:
 *         description: Erreur mystique (problème serveur)
 */
router.post('/chatbot', generateResponse);

export default router;