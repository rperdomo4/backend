import express from 'express';
import {
  createEmpleado,
  getEmpleados,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado
} from '../controllers/EmpleadoController.js';
import {
  authenticateToken
} from '../controllers/AuthMiddleware.js';


const router = express.Router();
router.post('/', authenticateToken,createEmpleado);
router.get('/',authenticateToken, getEmpleados);
router.get('/:id',authenticateToken, getEmpleadoById);
router.put('/:id', authenticateToken, updateEmpleado);
router.delete('/:id',authenticateToken, deleteEmpleado);

export default router;

