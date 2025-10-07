import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import Stat from './stat-model';

// Sobrescribe `authenticateUser` antes de importar el servicio
jest.unstable_mockModule('./middleware/auth-middleware', () => ({
  authenticateUser: jest.fn((req, res, next) => {
    req.user = { userId: '507f1f77bcf86cd799439011', role: 'user' };
    next();
  }),
}));

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_STAT = mongoUri;
  app = (await import('./stat-service.js')).default; // Import app dynamically to ensure MONGODB_URI is set
});

afterAll(async () => {
  await Stat.deleteMany({});
  app.close();
  await mongoServer.stop();
});

describe('Stat Service', () => {
  it('should add a new stat on POST /addstat', async () => {
    const newStat = {
      gameId: 'testGameId',
      questionId: 'testQuestionId',
      right: false,
      time: 10,
      points: 0,
    };

    const response = await request(app).post('/addstat').send(newStat);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId', '507f1f77bcf86cd799439011');
  });

  it('should get stats on GET /stats', async () => {
    const response = await request(app).get('/stats');
    expect(response.status).toBe(200);
  });

  it('should get stats on GET /user-stats', async () => {
    const response = await request(app).get('/user-stats');
    expect(response.status).toBe(200);
  });

  it('should return the top ranking sorted by points and time', async () => {
    const userId1 = new mongoose.Types.ObjectId();
    const userId2 = new mongoose.Types.ObjectId();
    const stats = [
      {
        gameId: 'game1',
        userId: userId1,
        points: 300,
        time: 5,
        right: true,
        questionId: new mongoose.Types.ObjectId(),
      },
      {
        gameId: 'game1',
        userId: userId1,
        points: 300,
        time: 4,
        right: true,
        questionId: new mongoose.Types.ObjectId(),
      },
      {
        gameId: 'game2',
        userId: userId2,
        points: 200,
        time: 6,
        right: false,
        questionId: new mongoose.Types.ObjectId(),
      },
      {
        gameId: 'game2',
        userId: userId2,
        points: 100,
        time: 5,
        right: false,
        questionId: new mongoose.Types.ObjectId(),
      },
    ];

    await Stat.insertMany(stats);

    const response = await request(app).get('/ranking');

    expect(response.status).toBe(200);
    expect(response.body.topRanking).toHaveLength(3); // 2 entradas (por gameId y userId)
    expect(response.body.topRanking[0].totalPoints).toBeGreaterThan(
      response.body.topRanking[1].totalPoints
    );
    expect(response.body.topRanking[0].totalTime).toBeLessThan(
      response.body.topRanking[1].totalTime
    );
  });
});
