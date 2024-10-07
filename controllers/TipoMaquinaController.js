import TipoMaquinas from '../models/TipoMaquinaModel.js';

// Obtener todos los tipos de máquinas
export const getTipoMaquinas = async (req, res) => {
  try {
    const tipoMaquinas = await TipoMaquinas.findAll();
    res.status(200).json(tipoMaquinas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un tipo de máquina por ID
export const getTipoMaquinaById = async (req, res) => {
  try {
    const tipoMaquina = await TipoMaquinas.findByPk(req.params.id);
    if (tipoMaquina) {
      res.status(200).json(tipoMaquina);
    } else {
      res.status(404).json({ error: 'Tipo de máquina no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Crear un nuevo tipo de máquina
export const createTipoMaquina = async (req, res) => {
  try {
    const tipoMaquina = await TipoMaquinas.create(req.body);
    res.status(201).json(tipoMaquina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un tipo de máquina
export const updateTipoMaquina = async (req, res) => {
  try {
    const [updated] = await TipoMaquinas.update(req.body, {
      where: { Id: req.params.id }
    });
    if (updated) {
      const tipoMaquina = await TipoMaquinas.findByPk(req.params.id);
      res.status(200).json(tipoMaquina);
    } else {
      res.status(404).json({ error: 'Tipo de máquina no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un tipo de máquina
export const deleteTipoMaquina = async (req, res) => {
  try {
    const deleted = await TipoMaquinas.destroy({
      where: { Id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tipo de máquina no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
