const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const validateProduct = require('../middleware/validationMiddleware.js');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController.js');

const router = express.Router();

// Usamos middleware de autenticacion y validacion en las rutas correspondientes
router.post('/', auth, validateProduct, createProduct);
router.get('/', getProducts);
router.put('/:id', auth, validateProduct, updateProduct);
router.delete('/:id', auth, validateProduct, deleteProduct);

module.exports = router;