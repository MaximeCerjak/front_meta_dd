import express from 'express';
import { createGrid, getGrid, updateGrid, deleteGrid } from '../controllers/GridController.js';

const router = express.Router();

router.post('/', createGrid);
router.get('/:id', getGrid);
router.put('/:id', updateGrid);
router.delete('/:id', deleteGrid);

export default router;
