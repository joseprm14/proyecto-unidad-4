const User = require("../models/User.js");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  // Registro de nuevo usuario
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
};

const login = async (req, res) => {
  // Login de usuario
  try {
    const { email, password } = req.body;
    const user = await User.scope('withPassword').findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const valid = await user.isValidPassword(password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Se devuelve el token jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });

  } catch (error) {
    res.status(400).json(error);
  }
  
};

module.exports = { register, login };