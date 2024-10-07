import Maquinas from '../models/MaquinaModel.js';  
import TipoMaquinas from '../models/TipoMaquinaModel.js'; 

// Obtener todas las máquinas
export const getMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquinas.findAll({
      include: [{
        model: TipoMaquinas,
        as: 'TipoMaquina',
        attributes: ['Tipo']
      }]
    });
    res.status(200).json(maquinas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener una máquina por Registro
export const getMaquinaByRegistro = async (req, res) => {
  try {
    const maquina = await Maquinas.findByPk(req.params.registro, {
      include: [{
        model: TipoMaquinas,
        as: 'TipoMaquina',
        attributes: ['Tipo']
      }]
    });
    if (maquina) {
      res.status(200).json(maquina);
    } else {
      res.status(404).json({ error: 'Máquina no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Crear una nueva máquina
export const createMaquina = async (req, res) => {
  try {
    const maquinaData = {
      ...req.body,
      Estado: req.body.Estado || 'Activa',  
    };
    const maquina = await Maquinas.create(maquinaData);
    res.status(201).json(maquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una máquina
export const updateMaquina = async (req, res) => {
  try {
    const [updated] = await Maquinas.update(req.body, {
      where: { Registro: req.params.registro }
    });
    if (updated) {
      const maquina = await Maquinas.findByPk(req.params.registro, {
        include: [{
          model: TipoMaquinas,
          as: 'TipoMaquina',
          attributes: ['Tipo']
        }]
      });
      res.status(200).json(maquina);
    } else {
      res.status(404).json({ error: 'Máquina no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una máquina
export const deleteMaquina = async (req, res) => {
  try {
    const deleted = await Maquinas.destroy({
      where: { Registro: req.params.registro }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Máquina no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
