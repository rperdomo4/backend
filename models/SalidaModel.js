import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const Salida = sequelize.define('Salida', {
  Salida: {
    type: DataTypes.STRING(255),  
    primaryKey: true,
    allowNull: false
  },
 
  NRequisicionFK: {
    type: DataTypes.STRING(50),  
    allowNull: false  
  },
  
  RecibidoPor: {
    type: DataTypes.STRING(50),  
    allowNull: true
  },
  Firma: {
    type: DataTypes.BLOB,  
    allowNull: true
  },
  Imgs: {
    type: DataTypes.BLOB,  
    allowNull: true
  },
  CodEnvio: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Estado: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  FechaRecibido: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CreadaPor:{
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'Salida',
  timestamps: false
});

export default Salida;