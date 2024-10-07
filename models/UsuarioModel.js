import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 
const Usuario = sequelize.define('Usuario', {
  IdUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Contrasenia: {
    type: DataTypes.STRING(255), 
    allowNull: false
  },
  IdEmpleadoFK: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CambioContrasenia: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false
  },
}, {
  freezeTableName: true,
  timestamps: false
});
export default Usuario;
