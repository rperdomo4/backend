import express from 'express';
import { 
  createPuesto,
  getPuestos,
  getPuestoById,
  updatePuesto,
  deletePuesto 
} from '../controllers/PuestoController.js';
import {
  authenticateToken
} from '../controllers/AuthMiddleware.js';

const router = express.Router();

router.post('/',authenticateToken, createPuesto);
router.get('/',getPuestos);
router.get('/puestos/:id', authenticateToken,getPuestoById);
router.put('/puestos/:id', authenticateToken,updatePuesto);
router.delete('/puestos/:id',authenticateToken, deletePuesto);

export default router;
