const dotenv = require('dotenv');
const express = require('express');
const sequelize = require('./config/db.js');
const applySecurity = require('./middleware/securityMiddleware.js');

dotenv.config();
const app = express();

app.use(express.json());
// Aplicamos middleware de seguridad
//applySecurity(app);


// Definimos donde se encuentran las rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Testear DB y sync
sequelize.sync().then(() => console.log('DB connected'));

module.exports = app;