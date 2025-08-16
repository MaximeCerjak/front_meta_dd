import express from 'express';
import { createTeleporter, getTeleportersByGrid, updateTeleporter, deleteTeleporter } from '../controllers/TeleporterController.js';

const router = express.Router();

router.post('/', createTeleporter); 
router.get('/grid/:grid_id', getTeleportersByGrid);
router.put('/:id', updateTeleporter);
router.delete('/:id', deleteTeleporter);

export default router;
