const Product = require('../../models/Product');
const ProductController = require('../../controllers/productController');

jest.mock('../../models/Product');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe devolver lista de productos', async () => {
    const mockProducts = [{ name: 'Teclado', price: 50.0, stock: 5 }];
    Product.findAll.mockResolvedValue(mockProducts);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await ProductController.getProducts(req, res);

    expect(Product.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });

  it('debe crear un producto', async () => {
    const productData = { name: 'Mouse', price: 20, stock: 5 };
    Product.create.mockResolvedValue(productData);

    const req = { body: productData };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await ProductController.createProduct(req, res);

    expect(Product.create).toHaveBeenCalledWith(productData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(productData);
  });

  it('debe actualizar un producto', async () => {
    const productData = { name: 'Monitor', price: 150, stock: 5 };

    // Simula que la actualización fue exitosa y luego se obtiene el producto actualizado
    Product.update.mockResolvedValue([1]); 

    const req = { params: { id: '1' }, body: productData };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ProductController.updateProduct(req, res);

    expect(Product.update).toHaveBeenCalledWith(productData, { where: { id: '1' } });
    expect(res.json).toHaveBeenCalledWith({ message: 'Product updated' });
  });

  it('debe eliminar un producto', async () => {
    Product.destroy.mockResolvedValue(1); // Devuelve 1 si se eliminó correctamente

    const req = { params: { id: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ProductController.deleteProduct(req, res);

    expect(Product.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted' });
  });
});