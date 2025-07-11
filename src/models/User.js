const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require('bcryptjs');

// Definimos esquema de base de datos para usuarios
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  hooks: {
    // Almacenamos las contraseñas de forma segura utilizando bcrypt
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { }
    }
  }
});

// Método para validar contraseña en el login
User.prototype.isValidPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = User;