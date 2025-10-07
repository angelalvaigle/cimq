import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoserver;
let gatewayservice;
let userservice;
let authservice;
let questionservice;
let statservice;

async function startServer() {
  console.log('Starting MongoDB memory server...');
  mongoserver = await MongoMemoryServer.create();
  const mongoUri = mongoserver.getUri();
  process.env.MONGODB_USER = mongoUri;

  gatewayservice = (await import('../../gatewayservice/gateway-service.js'))
    .default;
  userservice = (await import('../../users/userservice/user-service.js'))
    .default;
  authservice = (await import('../../users/authservice/auth-service.js'))
    .default;
  questionservice = (await import('../../questionservice/question-service.js'))
    .default;
  statservice = (await import('../../statservice/stat-service.js')).default;
}

startServer();
