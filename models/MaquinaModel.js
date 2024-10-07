import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const Maquinas = sequelize.define('Maquinas', {
  Registro: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  Cod: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  TipoMaquinaID: {
    type: DataTypes.STRING(10),  
    allowNull: false
  },
  Estado: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'Maquinas',
  timestamps: false 
});

export default Maquinas;
