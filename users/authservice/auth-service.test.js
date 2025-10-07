import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import User from './auth-model.js';

let mongoServer;
let app;

//test user
const user = {
  username: 'testuser',
  password: 'testpassword',
};

async function addUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });
  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_USER = mongoUri;
  app = (await import('./auth-service.js')).default; // Import app dynamically to ensure MONGODB_URI is set
  // Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('missing password - should not perform a login operation /login', async () => {
    const response = await request(app).post('/login').send({
      username: user.username,
      password: '',
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('missing username - should not perform a login operation /login', async () => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const response = await request(app).post('/login').send({
      username: '',
      password: hashedPassword,
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('wrong password - should not perform a login operation /login', async () => {
    const response = await request(app).post('/login').send({
      username: user.username,
      password: 'wrongPassword',
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('Should perform a logout operation /logout', async () => {
    const response = await request(app).get('/logout');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'user logged out');
  });
});
