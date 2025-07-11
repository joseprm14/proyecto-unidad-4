const Product = require('../models/Product.js');

async function createProduct(req, res) {
  // Se crea un nuevo producto
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
}

async function getProducts(req, res) {
  // Obtener listado de productos
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching products'});
  }
}

async function updateProduct(req, res) {
  // Actualizar producto
  try {
    const { id } = req.params;
    await Product.update(req.body, { where: { id } });
    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
}

async function deleteProduct(req, res) {
  // Eliminar producto
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
}

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };