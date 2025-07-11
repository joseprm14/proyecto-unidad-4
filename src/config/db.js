const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Definimos la base de datos para sequelize utilizando variables de entorno
const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;