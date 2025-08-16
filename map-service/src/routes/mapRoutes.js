/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: API de gestion des cartes
 *   x-swagger-ui-url: http://localhost:5000/api-docs
 */

import express from 'express';
import { createMap, getMaps, getMapById, updateMap, deleteMap } from '../controllers/MapController.js';

const router = express.Router();

/**
 * @swagger
 * /maps:
 *   post:
 *     summary: Crée une nouvelle carte.
 *     tags: [Maps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Map'
 *     responses:
 *       201:
 *         description: Carte créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Map'
 *       400: 
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/', createMap);

/**
 * @swagger
 * /maps:
 *   get:
 *    summary: Retourne toutes les cartes.
 *    tags: [Maps]
 *    responses:
 *      200:
 *        description: Liste des cartes récupérée avec succès.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Map'
 *      500:
 *        description: Erreur serveur.
 */
router.get('/', getMaps);

/**
 * @swagger
 * /maps/{id}:
 *   get:
 *     summary: Retourne une carte en fonction de son identifiant.
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la carte
 *     responses:
 *       200:
 *         description: Carte récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Map'
 *       404:
 *         description: Carte non trouvée.
 */
router.get('/:id', getMapById);

/**
 * @swagger
 * /maps/{id}:
 *   put:
 *     summary: Met à jour une carte dans le système.
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Map'
 *     responses:
 *       200:
 *         description: Carte mise à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Map'
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', updateMap);

/**
 * @swagger
 * /maps/{id}:
 *   delete:
 *     summary: Supprime une carte du système.
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carte supprimée avec succès.
 *       404:
 *         description: Carte non trouvée.
 */
router.delete('/:id', deleteMap);


export default router;
