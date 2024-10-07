import express from 'express';
import {
    getMaquinas,
    getMaquinaByRegistro,
    createMaquina,
    updateMaquina,
    deleteMaquina
  } from '../controllers/MaquinaController.js';
  const router = express.Router();
  import {
    authenticateToken
  } from '../controllers/AuthMiddleware.js';
  

router.get('/',authenticateToken, getMaquinas);
router.get('/:registro',authenticateToken, getMaquinaByRegistro);
router.post('/', authenticateToken,createMaquina);
router.put('/:registro', authenticateToken,updateMaquina);
router.delete('/:registro', authenticateToken,deleteMaquina);

export default router;