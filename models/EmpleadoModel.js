import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 
import Puesto from './PuestoModel.js'; 

const Empleado = sequelize.define('Empleado', {
  CodEmpleado: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  Nombres: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Apellidos: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  IdPuestoFK: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Puesto, 
      key: 'id' 
    }
  },
  Estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Activo'
  },
  Direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
}, {
  tableName: 'Empleado',
  freezeTableName: true,
  timestamps: false
});

export default Empleado;
