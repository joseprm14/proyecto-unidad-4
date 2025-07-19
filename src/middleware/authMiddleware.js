const jwt = require('jsonwebtoken');

// Middleware de autenticacion con jsonwebtoken
const auth = (req, res, next) => {
  // Comprueba si hay token y si este es valido
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = auth;