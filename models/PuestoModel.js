import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const Puesto = sequelize.define('Puesto', {
  IdPuesto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Puesto',
  timestamps: false 
});

export default Puesto;
