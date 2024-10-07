import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const RepuestosRequisicion = sequelize.define('RepuestosRequisicion', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  NRequisicion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Repuesto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CantidadEnviada: {
    type: DataTypes.INTEGER,
    allowNull:true,
  },
  Ubicacion:{
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Estado:{
    type:DataTypes.STRING(255),
    allowNull: true
  },
  Traslado:{
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'RepuestosRequisicion',
  timestamps: false
});

export default RepuestosRequisicion;
