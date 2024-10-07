import express from 'express';
import {
  getRequisiciones,
eliminarRepuestoDeRequisicion,
  actualizarRequisiciones,
  createRequisicion
} from '../controllers/RequisicionController.js';
import { authenticateToken } from '../controllers/AuthMiddleware.js';

const router = express.Router();


router.get('/',getRequisiciones);


router.post('/', authenticateToken,createRequisicion);

router.patch('/actualizar', authenticateToken,actualizarRequisiciones);
router.delete('/:nrequisicion/repuestos/:repuestoId', eliminarRepuestoDeRequisicion);

export default router;
