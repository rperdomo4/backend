import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Token no proporcionado' });

  console.log('Token recibido:', token); 
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = {
      id: user.id,
      Usuario: user.Usuario,
      Empleado: {
        Direccion: user.Direccion,
        Nombres: user.Nombres,
        Apellidos: user.Apellidos,
 
      }
    };

    next();
  });
};
