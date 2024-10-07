import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const TipoMaquinas = sequelize.define('TipoMaquinas', {
  Id: {
    type: DataTypes.STRING(50), 
    primaryKey: true,
    allowNull: false
  },
  Tipo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'TipoMaquinas',
  timestamps: false 
});

export default TipoMaquinas;
