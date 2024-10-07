import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/db.js'; 
import SequelizeStore from 'connect-session-sequelize';
import usuarioRoutes from './routes/UsuarioRouter.js'; 
import empleadoRoute from'./routes/EmpleadoRoutes.js';
import authRoutes from './routes/AuthRoute.js';
import TipoMaquina from './routes/TipoMaquinaRoutes.js';
import maquina from './routes/MaquinaRoutes.js';
//import Requisicion from './routes/RequisicionRoutes.js';
import Salida from './routes/SalidaRoute.js'
import Puestos from './routes/PuestoRoutes.js'
import './models/associations.js'; 
import Puesto from './models/PuestoModel.js';
import Requisicion from './models/RequisicionModel.js';

dotenv.config();
const app = express();
app.use(express.json()); 
app.get('/puestos', async (req, res) => {
    try {
      const puestos = await Puesto.findAll();
      console.log('Puestos:', puestos); 
      res.json(puestos);
    } catch (error) {
      console.error('Error al obtener los puestos:', error.message);
      res.status(500).json({ error: 'Error al obtener los puestos' });
    }
  });
  app.get('/requisicion', async (req, res) => {
    try {
      const puestos = await Requisicion.findAll();
      console.log('Puestos:', puestos); 
      res.json(puestos);
    } catch (error) {
      console.error('Error al obtener los puestos:', error.message);
      res.status(500).json({ error: 'Error al obtener los puestos' });
    }
  });
/*
app.use('/api', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/empleado', empleadoRoute);
app.use('/tipoMaquina', TipoMaquina);
app.use('/maquina', maquina);
app.use('/requisicion', Requisicion);
app.use('/salida', Salida);
app.use('/puestos', Puestos);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Errot!');
  });
*/
app.listen(process.env.PORT || 4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});
