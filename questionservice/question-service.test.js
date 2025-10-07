import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals'; // Importa jest desde @jest/globals

// Sobrescribe `auth-middleware` antes de importar el servicio
jest.unstable_mockModule('./middleware/auth-middleware', () => ({
  authenticateUser: jest.fn((req, res, next) => {
    req.user = { userId: '507f1f77bcf86cd799439011', role: 'user' };
    next();
  }),
  authorizePermissions: jest.fn((...roles) => {
    return (req, res, next) => {
      next();
    };
  }),
}));

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_QUESTION = mongoUri;
  app = (await import('./question-service.js')).default; // Import app dynamically to ensure MONGODB_URI is set
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Question Service', () => {
  it('should add a new question on POST /addquestion', async () => {
    const newQuestion = {
      type: 'testType',
      name: 'testName',
      path: 'testPath',
      right: 'testRight',
      wrong1: 'testWrong1',
      wrong2: 'testWrong2',
      wrong3: 'testWrong3',
    };

    // El usuario se loguea
    await request(app).post('/login').send({
      username: 'testuser',
      password: 'testpassword',
    });
    const response = await request(app).post('/addquestion').send(newQuestion);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('type', 'testType');
  });

  it('should get questions on GET /game1-questions', async () => {
    // El usuario se loguea
    await request(app).post('/login').send({
      username: 'testuser',
      password: 'testpassword',
    });
    const response = await request(app).get('/game1-questions');
    expect(response.status).toBe(200);
  });

  it('should get questions on GET /game2-questions', async () => {
    // El usuario se loguea
    await request(app).post('/login').send({
      username: 'testuser',
      password: 'testpassword',
    });
    const response = await request(app).get('/game2-questions');
    expect(response.status).toBe(200);
  });

  it('should get questions on GET /questions', async () => {
    const response = await request(app).get('/questions');
    expect(response.status).toBe(200);
  });
});
