/**
 * @swagger
 * tags:
 *   name: Multiplayer Simulation
 *   description: API de simulation de joueurs virtuels pour le chat multijoueur
 */

import express from 'express';
import { 
    generateSpontaneousMessage, 
    generateResponseToUser, 
    getVirtualPlayers 
} from '../controllers/multiChatSimulatorController.js';

const router = express.Router();

/**
 * @swagger
 * /api/multiplayer/spontaneous:
 *   post:
 *     summary: Générer un message spontané d'un joueur virtuel
 *     description: Génère un message naturel d'un joueur virtuel pour alimenter le chat
 *     tags: [Multiplayer Simulation]
 *     responses:
 *       200:
 *         description: Message spontané généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playerId:
 *                   type: string
 *                   description: Identifiant du joueur virtuel
 *                   example: "alice"
 *                 playerName:
 *                   type: string
 *                   description: Nom du joueur
 *                   example: "Alice"
 *                 playerAvatar:
 *                   type: string
 *                   description: Avatar du joueur
 *                   example: "🎨"
 *                 message:
 *                   type: string
 *                   description: Message généré
 *                   example: "Quelqu'un a déjà testé la technique de l'aquarelle sur papier texturé ?"
 *                 type:
 *                   type: string
 *                   description: Type de message
 *                   example: "spontaneous"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erreur de génération (utilise un fallback)
 */
router.post('/spontaneous', generateSpontaneousMessage);

/**
 * @swagger
 * /api/multiplayer/response:
 *   post:
 *     summary: Générer une réponse à un message utilisateur
 *     description: Génère une réponse naturelle d'un joueur virtuel à un message d'utilisateur
 *     tags: [Multiplayer Simulation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userMessage
 *             properties:
 *               userMessage:
 *                 type: string
 *                 description: Message de l'utilisateur auquel répondre
 *                 example: "Bonjour ! Quelqu'un connaît la technique de Van Gogh ?"
 *               conversationContext:
 *                 type: array
 *                 description: Contexte récent de la conversation (optionnel)
 *                 items:
 *                   type: object
 *                   properties:
 *                     senderName:
 *                       type: string
 *                     content:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                 example: [
 *                   {
 *                     "senderName": "Joueur",
 *                     "content": "Salut tout le monde !",
 *                     "timestamp": "2024-01-01T10:00:00Z"
 *                   }
 *                 ]
 *     responses:
 *       200:
 *         description: Réponse générée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playerId:
 *                   type: string
 *                   example: "bob"
 *                 playerName:
 *                   type: string
 *                   example: "Bob"
 *                 playerAvatar:
 *                   type: string
 *                   example: "🖼️"
 *                 message:
 *                   type: string
 *                   example: "Intéressant ! Van Gogh utilisait des empâtements épais pour créer du relief et du mouvement."
 *                 type:
 *                   type: string
 *                   example: "response"
 *                 respondingTo:
 *                   type: string
 *                   example: "Bonjour ! Quelqu'un connaît la technique de Van Gogh ?"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Message utilisateur manquant
 *       500:
 *         description: Erreur de génération (utilise un fallback)
 */
router.post('/response', (req, res, next) => {
    console.log('🎯 Route /response appelée avec:', req.body);
    next();
}, generateResponseToUser);

/**
 * @swagger
 * /api/multiplayer/players:
 *   get:
 *     summary: Obtenir la liste des joueurs virtuels
 *     description: Récupère la liste des joueurs virtuels disponibles avec leurs caractéristiques
 *     tags: [Multiplayer Simulation]
 *     responses:
 *       200:
 *         description: Liste des joueurs virtuels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "alice"
 *                       name:
 *                         type: string
 *                         example: "Alice"
 *                       avatar:
 *                         type: string
 *                         example: "🎨"
 *                       interests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["peinture", "art moderne", "techniques"]
 *                       status:
 *                         type: string
 *                         example: "online"
 */
router.get('/players', getVirtualPlayers);

export default router;