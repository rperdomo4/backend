import express from 'express';
import multer from 'multer';
import path from 'path'; 
import { uploadFile, saveData, getSalidasConDetalles, actualizarSalida } from '../controllers/OCRController.js'; 
import {
  authenticateToken
} from '../controllers/AuthMiddleware.js';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });
router.post('/upload', upload.single('pdfFile'), authenticateToken,uploadFile);
router.post('/save', authenticateToken,saveData);
router.get('/', authenticateToken,getSalidasConDetalles);
router.patch('/actualizar', authenticateToken,actualizarSalida);
export default router;
