import argon2 from 'argon2';
import Usuario from '../models/UsuarioModel.js';
import Puesto from '../models/PuestoModel.js';
import Empleado from '../models/EmpleadoModel.js';
// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { Usuario: usuarioName, Contrasenia, IdEmpleadoFK } = req.body;

    if (!usuarioName || !Contrasenia || !IdEmpleadoFK) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const hashedPassword = await argon2.hash(Contrasenia);

    const usuario = await Usuario.create({
      Usuario: usuarioName,
      Contrasenia: hashedPassword,
      IdEmpleadoFK
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({

      include: [
        { 
          model: Empleado, 
          as: 'Empleado' ,
          attributes: ['Nombres', 'Apellidos','Direccion'],
        include: [
          { 
            model: Puesto, 
            as: 'Puesto',
            attributes: ['Descripcion'],
          }]
        },
        ],
      })
      
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario por ID
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { Usuario: usuarioName, Contrasenia, IdEmpleadoFK } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (Contrasenia) {
      usuario.Contrasenia = await argon2.hash(Contrasenia);
    }

    usuario.Usuario = usuarioName || usuario.Usuario;
    usuario.IdEmpleadoFK = IdEmpleadoFK || usuario.IdEmpleadoFK;

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario por ID
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();

    res.status(204).send(); si 
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
