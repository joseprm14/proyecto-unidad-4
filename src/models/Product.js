const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

// Definimos esquema de base de datos para productos
const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER },
    price: { type: DataTypes.FLOAT }
});

module.exports = Product