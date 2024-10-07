import Requisicion from '../models/RequisicionModel.js';
import RepuestosRequisicion from '../models/RepuestosRequisicionModel.js';
import sequelize from '../config/db.js';
import Maquinas from '../models/MaquinaModel.js';
import Empleados from '../models/EmpleadoModel.js';
import TipoMaquinas from '../models/TipoMaquinaModel.js';

export const getRequisiciones = async (req, res) => {
  try {
    const requisiciones = await Requisicion.findAll({
      include: [
        {
          model: Maquinas,
          as: 'Maquina',
          attributes: ['Registro', 'Cod'],
          include: [
            {
              model: TipoMaquinas,
              as: 'TipoMaquina',
              attributes: ['Tipo']
            }
          ]
        },
        {
          model: Empleados,
          as: 'Empleado',
          attributes: ['CodEmpleado', 'Nombres','Apellidos']
        },
        {
          model: RepuestosRequisicion,
          as: 'Repuestos',
          attributes: ['Id', 'Repuesto', 'Cantidad', 'CantidadEnviada']
        }
      ],
      attributes: {
        include: [
          'Direccion',
          [sequelize.fn('FORMAT', sequelize.col('Fecha'), 'dd-MM-yyyy', 'es-ES'), 'Fecha']
        ]
      }
    });

    res.status(200).json(requisiciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Obtener una requisicion por NRequisicion
export const getRequisicionById = async (req, res) => {
  try {
   
    const requisicion = await Requisicion.findByPk(req.params.nrequisicion, {
      include: [
        {
          model: Maquinas,
          as: 'Maquina',
          attributes: ['Registro', 'Cod']
        },
        {
          model: Empleados,
          as: 'Empleado',
          attributes: ['CodEmpleado', 'Nombres','Apellidos']
        },
        {
          model: RepuestosRequisicion,
          as: 'Repuestos',
          attributes: ['Repuesto', 'Cantidad']
        }
      ],
      attributes: { include: ['Direccion'] }
    });
    if (requisicion) {
      res.status(200).json(requisicion);
    } else {
      res.status(404).json({ error: 'Requisicion no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 
/// Crear una nueva requisición
export const createRequisicion = async (req, res) => {
  try {
    const { repuestos,EstadoReq, ...requisicionData } = req.body;
 
    requisicionData.EstadoReq = EstadoReq;
   
    const requisicion = await Requisicion.create(requisicionData);
    if (repuestos && repuestos.length > 0) {
      const repuestosWithRequisicionId = repuestos.map(repuesto => ({
        ...repuesto,
        NRequisicion: requisicion.NRequisicion

      }));
      await RepuestosRequisicion.bulkCreate(repuestosWithRequisicionId);
    }
 
    res.status(201).json(requisicion);
  } catch (error) {
    console.error('Error en createRequisicion:', error);
    res.status(500).json({ error: 'Error en la creación de requisición: ' + error.message });
  }
};
export const actualizarRequisiciones = async (req, res) => {
  const { requisiciones } = req.body;
  const usuario = req.user;
  const usuarioDireccion = usuario.Empleado.Direccion;

  if (!Array.isArray(requisiciones) || requisiciones.length === 0) {
    return res.status(400).json({ error: 'Debe proporcionar una lista de requisiciones' });
  }

  try {
    const updatePromises = requisiciones.map(async ({ NRequisicion, EstadoReq, Observaciones, Repuestos, InstalacionNumero, RegistroFK, SolicitadaPor, Direccion,AprobadaPor }) => {
      if (!NRequisicion) {
        throw new Error('El campo NRequisicion es obligatorio');
      }

      const requisicion = await Requisicion.findByPk(NRequisicion);
      if (!requisicion) {
        throw new Error(`Requisición ${NRequisicion} no encontrada`);
      }

      // Actualización de los campos de la requisición
      requisicion.EstadoReq = EstadoReq ?? requisicion.EstadoReq;
      requisicion.Observaciones = Observaciones ?? requisicion.Observaciones;
      requisicion.InstalacionNumero = InstalacionNumero ?? requisicion.InstalacionNumero;
      requisicion.RegistroFK = RegistroFK ?? requisicion.RegistroFK; 
      requisicion.SolicitadaPor = SolicitadaPor ?? requisicion.SolicitadaPor; 
      requisicion.AprobadaPor = AprobadaPor?? requisicion.AprobadaPor; 
      requisicion.Direccion = Direccion ?? requisicion.Direccion; 

      console.log('Antes de guardar:', requisicion);

      try {
        await requisicion.save();
        console.log('Después de guardar:', requisicion);
      } catch (error) {
        console.error('Error al guardar la requisición:', error);
      }

      if (Repuestos) {
        const existingRepuestos = await RepuestosRequisicion.findAll({
          where: { NRequisicion }
        });

        const existingRepuestosMap = existingRepuestos.reduce((map, repuesto) => {
          map[repuesto.Repuesto] = repuesto;
          return map;
        }, {});

        const repuestosToUpdate = [];
        const repuestosToCreate = [];

        for (const repuesto of Repuestos) {
          if (existingRepuestosMap[repuesto.Repuesto]) {
            repuestosToUpdate.push({
              Repuesto: repuesto.Repuesto,
              Cantidad: repuesto.Cantidad,
              CantidadEnviada: repuesto.CantidadEnviada,
              Traslado: repuesto.Traslado,
              Ubicacion: repuesto.Ubicacion
            });
          } else {
            repuestosToCreate.push({
              NRequisicion,
              Repuesto: repuesto.Repuesto,
              Cantidad: repuesto.Cantidad,
              CantidadEnviada: repuesto.CantidadEnviada
            });
          }
        }

        if (repuestosToUpdate.length > 0) {
          await Promise.all(
            repuestosToUpdate.map(repuesto =>
              RepuestosRequisicion.update(
                {
                  Cantidad: repuesto.Cantidad,
                  CantidadEnviada: repuesto.CantidadEnviada,
                  Traslado: repuesto.Traslado,
                  Ubicacion: repuesto.Ubicacion
                },
                { where: { NRequisicion, Repuesto: repuesto.Repuesto } }
              )
            )
          );
        }

        if (repuestosToCreate.length > 0) {
          await RepuestosRequisicion.bulkCreate(repuestosToCreate);
        }
      }
    });

    await Promise.all(updatePromises);
    console.log('Requisiciones recibidas:', requisiciones);
    return res.status(200).json({ message: 'Requisiciones actualizadas correctamente' });
  } catch (error) {
    console.error('Error al actualizar las requisiciones:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

  export const eliminarRepuestoDeRequisicion = async (req, res) => {
    const { nrequisicion, repuestoId } = req.params;
  
    if (!nrequisicion || !repuestoId) {
      return res.status(400).json({ error: 'Faltan parámetros necesarios' });
    }
  
    try {
      const repuesto = await RepuestosRequisicion.findOne({
        where: {
          Id: repuestoId,
          NRequisicion: nrequisicion,
        },
      });
  
      if (!repuesto) {
        return res.status(404).json({ error: 'Repuesto no encontrado en la requisición' });
      }
  
      await repuesto.destroy();
      res.status(200).json({ message: 'Repuesto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el repuesto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };