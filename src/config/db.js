const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Definimos la base de datos para sequelize utilizando variables de entorno
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;