import express from 'express';
import { getAssets, getAssetById, createAsset } from '../services/GatewayAssetService.js';

const router = express.Router();

// Récupérer tous les assets
router.get('/', async (req, res) => {
    try {
        const assets = await getAssets();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Créer un nouvel asset
router.post('/', async (req, res) => {
    try {
        const asset = await createAsset(req.body);
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer un asset par son id
router.get('/:id', async (req, res) => {
    try {
        const asset = await getAssetById(req.params.id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un asset
router.patch('/:id', async (req, res) => {
    try {
        const asset = await updateAsset(req.params.id, req.body);
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // Supprimer un asset
// router.delete('/:id', async (req, res) => {
//     try {
//         await deleteAsset(req.params.id);
//         res.json({ message: 'Asset deleted' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Téléverser un fichier avec des paramètres de stockage
// router.post('/:scope/:type/:category/upload', async (req, res) => {
//     try {
//         const { scope, type, category } = req.params;
//         const file = await uploadFile(scope, type, category, req.body);
//         res.status(201).json(file);
//     } catch (error) {
//         console.error('Erreur lors du téléversement du fichier:', error);
//         res.status(500).json({ message: 'Error uploading file', error: error.message });
//     }
// });

// // Lister les fichiers d'une catégorie
// router.get('/:scope/:type/:category', async (req, res) => {
//     try {
//         const { scope, type, category } = req.params;
//         const assets = await getAssets(scope, type, category);
//         res.json(assets);
//     } catch (error) {
//         console.error('Erreur lors de la récupération des fichiers:', error);
//         res.status(500).json({ message: 'Error fetching files', error: error.message });
//     }
// });

export default router;