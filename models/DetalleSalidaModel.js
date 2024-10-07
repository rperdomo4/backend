import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const DetalleSalida = sequelize.define('DetalleSalida', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  Articulo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Cant: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  CantRecibida: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Devolucion:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  FechaDevolucion:{
    type: DataTypes.DATE,
    allowNull: true
  },
  Salida: {
    type: DataTypes.STRING(255),  
    allowNull: false
  },
  
}, {
  tableName: 'DetalleSalida',
  timestamps: false
});


export default DetalleSalida;
