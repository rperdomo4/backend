import Empleado from '../models/EmpleadoModel.js';
import Puesto from '../models/PuestoModel.js';


export const createEmpleado = async (req, res) => {
  try {
    const empleadoData = {
      ...req.body,
      Estado: req.body.Estado || 'Activo',  
    };
    const empleado = await Empleado.create(empleadoData);
    console.log(empleadoData);
    res.status(201).json(empleado);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(400).json({ error: error.message, details: error.errors });
  }
};


// Obtener todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{
        model: Puesto,
        as: 'Puesto',
        attributes: ['Descripcion']
      }]
    });
    res.status(200).json(empleados);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un empleado por ID
export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id, {
      include: [{
        model: Puesto,
        as: 'Puesto',
        attributes: ['Descripcion']
      }]
    });
    if (empleado) {
      res.status(200).json(empleado);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un empleado
export const updateEmpleado = async (req, res) => {
  try {
    const [updated] = await Empleado.update(req.body, {
      where: { CodEmpleado: req.params.id }
    });
    if (updated) {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: [{
          model: Puesto,
          as: 'Puesto',
          attributes: ['Descripcion']
        }]
      });
      res.status(200).json(empleado);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un empleado
export const deleteEmpleado = async (req, res) => {
  try {
    const deleted = await Empleado.destroy({
      where: { CodEmpleado: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
