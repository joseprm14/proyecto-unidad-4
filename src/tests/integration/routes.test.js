const request = require('supertest');
const sequelize = require("../../config/db");
const app = require('../../app');
const User = require('../../models/User');
const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Borra y crea tablas

  // Crear usuario y token
  const user = await User.create({ email: 'p@test.com', password: '123456' });
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('devuelve lista de productos', async () => {
      await Product.create({ name: 'Producto1', price: 10.0, stock: 5 });

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/products', () => {
    it('crea producto con token válido', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Producto nuevo', price: 30.0, stock: 5 });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Producto nuevo');
    });

    it('no crea producto sin token', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Producto sin token', price: 20.0, stock: 5 });

      expect(res.statusCode).toBe(401);
    });

    it('no crea producto con datos inválidos', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '', price: -10 });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({ name: 'Producto para editar', price: 50.0, stock: 5 });
      productId = product.id;
    });

    it('actualiza producto con token válido', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Producto editado', price: 60.0,stock: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product updated');
    });

    it('no actualiza sin token', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'Producto editado', price: 60.0, stock: 1 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({ name: 'Producto para eliminar', price: 70.0, stock: 5 });
      productId = product.id;
    });

    it('elimina producto con token válido', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product deleted');
    });

    it('no elimina sin token', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('registra un nuevo usuario correctamente', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'user@test.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User created');
    });

    it('no permite registrar un usuario ya existente', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'user@test.com',
        password: '123456'
      });
      const res = await request(app).post('/api/auth/register').send({
        email: 'user@test.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('loguea usuario con credenciales válidas', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'p@test.com', 
        password: '123456'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('no loguea usuario con credenciales inválidas', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'user@test.com',
        password: 'wrongpass'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });
});