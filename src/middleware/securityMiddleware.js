const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Middleware de seguridad
const applySecurity = (app) => {
  app.use(helmet());
  app.use(cors());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Limita las requests por IP a 100 cada 15 minutos
};

module.exports = applySecurity;