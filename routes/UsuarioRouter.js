import express from 'express';
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} from '../controllers/UsuarioController.js';
import {
  authenticateToken
} from '../controllers/AuthMiddleware.js';

const router = express.Router();
router.post('/',createUsuario);
router.get('/', getUsuarios);
router.get('/:id',authenticateToken, getUsuarioById);
router.put('/:id',updateUsuario);
router.delete('/:id', authenticateToken,deleteUsuario);

export default router;
