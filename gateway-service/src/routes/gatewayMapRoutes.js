import express from 'express';
import multer from 'multer';
import { createMap, getMap, getAllMaps } from '../controllers/GatewayMapController.js';

const router = express.Router();

// Configuration de Multer
const upload = multer({ dest: 'temp/' });

/**
 * @swagger
 * /maps:
 *   post:
 *     summary: Créer une carte
 *     description: Crée une nouvelle carte.
 *     requestBody:
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *           properties: 
 *             title: 
 *               type: string
 *             description:
 *               type: string
 *             tags: 
 *               type: array
 *             items:
 *               type: string
 *           required:
 *             - title
 *             - description
 *             - tags
 *     responses:
 *       201: 
 *         description: Carte créée avec succès.
 *       400: 
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/', upload.fields([
    { name: 'layers', maxCount: 10 },
    { name: 'json', maxCount: 1 },
]), createMap);

/**
 * @swagger
 * /maps/{id}:
 *  get:
 *   summary: Récupérer une carte
 *   description: Retourne une carte en fonction de son identifiant.
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Carte récupérée avec succès.
 *    404:
 *     description: Carte non trouvée.
 */
router.get('/:id', getMap);

/**
 * @swagger
 * /maps:
 *  get:
 *   summary: Récupérer toutes les cartes
 *   description: Retourne la liste de toutes les cartes disponibles.
 *   responses:
 *    200:
 *     description: Liste des cartes récupérée avec succès.
 */
router.get('/', getAllMaps);

export default router;
