/**
 * @swagger
 * tags:
 *  name: Chatbot
 *  description: Endpoints pour la gestion du Sage Ethereal via Gateway
 */

import express from "express";
import { getChatbot } from "../controllers/GatewayChatbotController.js";

const router = express.Router();

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Converser avec le Sage Ethereal
 *     description: Envoie un message au Sage Ethereal et récupère sa réponse mystique
 *     tags: [Chatbot]
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
 *                 description: Message à envoyer au Sage
 *                 example: "Bonjour Sage Ethereal, pouvez-vous me guider ?"
 *               conversationHistory:
 *                 type: array
 *                 description: Historique récent de la conversation (optionnel)
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
 *         description: Réponse du Sage Ethereal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Réponse du Sage Ethereal
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
router.post('/chatbot', getChatbot);

export default router;