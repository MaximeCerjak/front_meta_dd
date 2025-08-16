/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: API de gestion des assets
 *   x-swagger-ui-url: http://localhost:4000/api-docs
 */

import express from 'express';
import {
  uploadFile,
  listAllFiles,
  listFileById,
  listFilesByScope,
  listFilesByType,
  listFilesByCategory,
  deleteFile,
} from '../controllers/assetController.js';

const router = express.Router();

/**
 * @swagger
 * /assets:
 *   get:
 *     summary: Récupère la liste de tous les assets.
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Liste des assets récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/', listAllFiles);

/**
 * @swagger
 * /assets/{id}:
 *   get:
 *     summary: Récupère un asset par son identifiant.
 *     tags: [Assets]
 *     parameters:
 *       in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de l'asset.
 *     responses:
 *       200:
 *         description: Asset trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       404:
 *         description: Asset non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', listFileById);

/**
 * @swagger
 * /assets/{scope}/{type}/{category}:
 *   get:
 *     summary: Récupère les assets filtrés par portée, type et catégorie.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *         description: Portée des assets.
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type d'assets.
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Catégorie des assets.
 *     responses:
 *       200:
 *         description: Liste des assets correspondant aux critères.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:scope/:type/:category', listFilesByCategory);

/**
 * @swagger
 * /assets/{scope}/{type}:
 *   get:
 *     summary: Récupère les assets filtrés par portée et type.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *         description: Portée des assets.
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type d'assets.
 *     responses:
 *       200:
 *         description: Liste des assets correspondant aux critères.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:scope/:type', listFilesByType);

/**
 * @swagger
 * /assets/{scope}:
 *   get:
 *     summary: Récupère les assets filtrés par portée.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *         description: Portée des assets.
 *     responses:
 *       200:
 *         description: Liste des assets correspondant à la portée.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:scope', listFilesByScope);

/**
 * @swagger
 * /assets/{scope}/{type}/{category}/upload:
 *   post:
 *     summary: Téléversement d'un nouvel asset.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *         description: Portée de l'asset (ex: public, privé).
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: "Type d'asset (ex: image, audio)".
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: "Catégorie de l'asset (ex: background, icon)".
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Le fichier à téléverser.
 *     responses:
 *       201:
 *         description: Asset téléversé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/:scope/:type/:category/upload', uploadFile);

/**
 * @swagger
 * /assets/{id}:
 *   delete:
 *     summary: Supprime un asset par son identifiant.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique de l'asset à supprimer.
 *     responses:
 *       200:
 *         description: Asset supprimé avec succès.
 *       404:
 *         description: Asset non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/:id', deleteFile);

export default router;
