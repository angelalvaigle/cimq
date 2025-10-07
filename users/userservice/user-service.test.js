import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

// Sobrescribe `authenticateUser` antes de importar el servicio
jest.unstable_mockModule('./middleware/auth-middleware', () => ({
  authenticateUser: jest.fn((req, res, next) => {
    req.user = { userId: '507f1f77bcf86cd799439010', role: 'user' };
    next();
  }),
}));

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_USER = mongoUri;
  app = (await import('./user-service.js')).default; // Import app dynamically to ensure MONGODB_URI is set
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: 'test1@test.com',
      username: 'testuser1',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser1');
  });

  it('missing name - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: '',
      lastName: 'test',
      email: 'test2@test.com',
      username: 'testuser2',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'name is required');
  });

  it('missing last name - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: '',
      email: 'test2@test.com',
      username: 'testuser2',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'last name is required');
  });

  it('missing email - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: '',
      username: 'testuser2',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'msg',
      'email is required,invalid email format'
    );
  });

  it('missing username - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: 'test2@test.com',
      username: '',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'username is required');
  });

  it('missing password - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: 'test2@test.com',
      username: 'testuser2',
      password: '',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'msg',
      'password is required,password must be at least 8 characters long'
    );
  });

  it('email already exists - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test2',
      lastName: 'test',
      email: 'test1@test.com',
      username: 'testuser2',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'email already exists');
  });

  it('username already exists - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test2',
      lastName: 'test',
      email: 'test2@test.com',
      username: 'testuser1',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'username already exists');
  });

  it('wrong email format - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: 'wrong',
      username: 'testuser2',
      password: 'testpassword',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'invalid email format');
  });

  it('short password - should not add a new user on POST /adduser', async () => {
    const newUser = {
      name: 'test',
      lastName: 'test',
      email: 'test2@test.com',
      username: 'testuser2',
      password: 'short',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'msg',
      'password must be at least 8 characters long'
    );
  });

  it('should update a user on PATCH /update-user', async () => {
    const updateUser = {
      name: 'update',
      lastName: 'update',
      email: 'update1@test.com',
      username: 'update1',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'update user');
  });

  it('missing name - should not add a new user on POST /adduser', async () => {
    const updateUser = {
      name: '',
      lastName: 'update',
      email: 'update2@test.com',
      username: 'update2',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'name is required');
  });

  it('missing last name - should not add a new user on POST /adduser', async () => {
    const updateUser = {
      name: 'update',
      lastName: '',
      email: 'update2@test.com',
      username: 'update2',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'last name is required');
  });

  it('missing email - should not add a new user on POST /adduser', async () => {
    const updateUser = {
      name: 'update',
      lastName: 'update',
      email: '',
      username: 'update2',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'msg',
      'email is required,invalid email format'
    );
  });

  it('missing username - should not add a new user on POST /adduser', async () => {
    const updateUser = {
      name: 'update',
      lastName: 'update',
      email: 'update2@test.com',
      username: '',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'username is required');
  });

  it('wrong email format - should not add a new user on POST /adduser', async () => {
    const updateUser = {
      name: 'update',
      lastName: 'update',
      email: 'wrong',
      username: 'update2',
    };
    const response = await request(app).patch('/update-user').send(updateUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'invalid email format');
  });

  it('should get the users on GET /users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });

  it('should get the user on GET /user', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(200);
  });

  it('should get the user on GET /current-user', async () => {
    const response = await request(app).get('/current-user');
    expect(response.status).toBe(200);
  });
});
