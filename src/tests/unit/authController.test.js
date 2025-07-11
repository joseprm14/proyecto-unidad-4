const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { register, login } = require('../../controllers/authController');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token123'),
}));

describe('Auth Controller - register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('register', () => {
    it('debe registrar un usuario correctamente', async () => {
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPass');
      User.findOne.mockResolvedValue(null); // Simula que no existe el usuario
      User.create.mockResolvedValue({ id: 1, email: 'test@example.com' }); 

      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '123456'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({"message": "User created"});
    });
  });

  describe('login', () => {
    it('debe autenticar y retornar token', async () => {
      const user = { isValidPassword: jest.fn().mockResolvedValue(true), id: 1, password: 'hashedPass' }; 
      User.scope = jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue(user)
      }));

      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: expect.any(String),
      });
    });

    it('debe retornar error si usuario no existe', async () => {
      User.scope = jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue(null),
      }));


      const req = { body: { email: 'noexiste@test.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('debe retornar error si contraseña es incorrecta', async () => {
      const user = { isValidPassword: jest.fn().mockResolvedValue(false), id: 1, password: 'hashedPass' };
      User.scope = jest.fn(() => ({
        findOne: jest.fn()
      }));
      User.scope('withPassword').findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: { email: 'test@example.com', password: 'wrongpass' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});