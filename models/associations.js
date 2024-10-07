import Requisicion from './RequisicionModel.js';
import RepuestosRequisicion from './RepuestosRequisicionModel.js';
import Maquinas from './MaquinaModel.js';
import Empleado from './EmpleadoModel.js';
import Usuario from './UsuarioModel.js';
import TipoMaquinas from './TipoMaquinaModel.js';
import Puesto from './PuestoModel.js';
import Salida from './SalidaModel.js';
import DetalleSalida from './DetalleSalidaModel.js';


Requisicion.belongsTo(Maquinas, { foreignKey: 'RegistroFK', as: 'Maquina' });
Requisicion.belongsTo(Empleado, { foreignKey: 'SolicitadaPor', as: 'Empleado' });
Requisicion.hasMany(RepuestosRequisicion, { foreignKey: 'NRequisicion', as: 'Repuestos' });

RepuestosRequisicion.belongsTo(Requisicion, { foreignKey: 'NRequisicion', as: 'Requisicion' });

Usuario.belongsTo(Empleado, { foreignKey: 'IdEmpleadoFK' });
Empleado.hasMany(Usuario, { foreignKey: 'IdEmpleadoFK' });

Maquinas.belongsTo(TipoMaquinas, { foreignKey: 'TipoMaquinaID', as: 'TipoMaquina' });
TipoMaquinas.hasMany(Maquinas, { foreignKey: 'TipoMaquinaID' });

Puesto.hasMany(Empleado, { foreignKey: 'IdPuestoFK', as: 'Empleados' });
Empleado.belongsTo(Puesto, { foreignKey: 'IdPuestoFK', as: 'Puesto' });

Salida.belongsTo(Requisicion, { foreignKey: 'NRequisicionFK', as: 'Req' });
  
Salida.hasMany(DetalleSalida, { foreignKey: 'Salida', as: 'Detalles' });  
DetalleSalida.belongsTo(Salida, { foreignKey: 'Salida', as: 'SalidaData' });

export default function initializeAssociations() {
  
}
