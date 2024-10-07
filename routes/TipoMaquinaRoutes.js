import express from 'express';
import {
  getTipoMaquinas,
  getTipoMaquinaById,
  createTipoMaquina,
  updateTipoMaquina,
  deleteTipoMaquina
} from '../controllers/TipoMaquinaController.js';
import {
  authenticateToken
} from '../controllers/AuthMiddleware.js';

const router = express.Router();
router.get('/', authenticateToken,getTipoMaquinas);
router.get('/:id',authenticateToken, getTipoMaquinaById);
router.post('/', authenticateToken,createTipoMaquina);
router.put('/:id', authenticateToken,updateTipoMaquina);
router.delete('/:id',authenticateToken, deleteTipoMaquina);

export default router;
