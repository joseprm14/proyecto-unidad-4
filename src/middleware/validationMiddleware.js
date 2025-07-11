const joi = require('joi');

// Definir el esquema de validación
const productSchema = joi.object({
  name: joi.string().trim().min(1).max(100).required(),
  stock: joi.number().positive().required(),
  price: joi.number().positive().required()
});

// Middleware
const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message
    }));
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateProduct;