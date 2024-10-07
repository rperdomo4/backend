import Puesto from '../models/PuestoModel.js';

export const createPuesto = async (req, res) => {
  try {
    const puesto = await Puesto.create(req.body);
    res.status(201).json(puesto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los puestos
export const getPuestos = async (req, res) => {
  try {
    const puestos = await Puesto.findAll();
    res.status(200).json(puestos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un puesto por ID
export const getPuestoById = async (req, res) => {
  try {
    const puesto = await Puesto.findByPk(req.params.id);
    if (puesto) {
      res.status(200).json(puesto);
    } else {
      res.status(404).json({ error: 'Puesto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un puesto
export const updatePuesto = async (req, res) => {
  try {
    const [updated] = await Puesto.update(req.body, {
      where: { IdPuesto: req.params.id }
    });
    if (updated) {
      const puesto = await Puesto.findByPk(req.params.id);
      res.status(200).json(puesto);
    } else {
      res.status(404).json({ error: 'Puesto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un puesto
export const deletePuesto = async (req, res) => {
  try {
    const deleted = await Puesto.destroy({
      where: { IdPuesto: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Puesto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
