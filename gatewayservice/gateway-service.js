import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import promBundle from 'express-prom-bundle';
// Libraries required for OpenAPI-Swagger
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import morgan from 'morgan';

const schemesList = ['http:', 'https:'];
const domainsList = [
  'authservice',
  'userservice',
  'questionservice',
  'statservice',
  'localhost',
  '127.0.0.1',
  process.env.DEPLOY_HOST,
];

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const app = express();
const port = 8000;
dotenv.config();

let originUrl = process.env.ORIGIN_URL || 'http://localhost:3000';
if (process.env.NODE_ENV === 'development') {
  console.log('Using development origin URL');
  originUrl = 'http://localhost:3000';
}

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionServiceUrl =
  process.env.QUESTION_SERVICE_URL || 'http://localhost:8003';
const statServiceUrl = process.env.STAT_SERVICE_URL || 'http://localhost:8004';

app.use(
  cors({
    origin: originUrl,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

const isJwtValid = (auth) => {
  if (auth === undefined) {
    return true;
  }
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  if (auth.startsWith('Bearer ')) {
    auth = auth.slice(7).trim(); // Remover "Bearer " y espacios adicionales
  }
  return jwtRegex.test(auth);
};

app.post('/login', async (req, res) => {
  const url = new URL(authServiceUrl + '/login');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the login request to the authentication service
      const authResponse = await axios.post(url, req.body);
      res.json(authResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/logout', async (req, res) => {
  const url = new URL(authServiceUrl + '/logout');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the logout request to the authentication service
      const authResponse = await axios.get(url);
      res.json(authResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.post('/adduser', async (req, res) => {
  const url = new URL(userServiceUrl + '/adduser');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the add user request to the user service
      const userResponse = await axios.post(url, req.body);
      res.json(userResponse.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  }
});

app.get('/users', async (req, res) => {
  const url = new URL(userServiceUrl + '/users');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the get users request to the user service
      const userResponse = await axios.get(url);
      res.json(userResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/user', async (req, res) => {
  const url = new URL(userServiceUrl + '/user');
  const userId = req.query.userId;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the get users request to the user service
      const userResponse = await axios.get(url, {
        params: { userId: userId },
      });
      res.json(userResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/current-user', async (req, res) => {
  const url = new URL(userServiceUrl + '/current-user');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the get current user request to the user service
      const userResponse = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(userResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.patch('/update-user', async (req, res) => {
  const url = new URL(userServiceUrl + '/update-user');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the update user request to the user service
      const userResponse = await axios.patch(url, req.body, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(userResponse.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  }
});

app.post('/addquestion', async (req, res) => {
  const url = new URL(questionServiceUrl + '/addquestion');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the add question request to the question service
      const addQuestionResponse = await axios.post(url, req.body, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(addQuestionResponse.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  }
});

app.get('/questions', async (req, res) => {
  const url = new URL(questionServiceUrl + '/questions');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the get questions request to the question asking service
      const getQuestionResponse = await axios.get(url);
      res.json(getQuestionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/game1-questions', async (req, res) => {
  const url = new URL(questionServiceUrl + '/game1-questions');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the game1 questions request to the question service
      const getQuestionResponse = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(getQuestionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/game2-questions', async (req, res) => {
  const url = new URL(questionServiceUrl + '/game2-questions');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the game2 questions request to the question service
      const getQuestionResponse = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(getQuestionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/game-questions', async (req, res) => {
  const url = new URL(questionServiceUrl + '/game-questions');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the game2 questions request to the question service
      const getQuestionResponse = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(getQuestionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.post('/addstat', async (req, res) => {
  const url = new URL(statServiceUrl + '/addstat');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the add stat request to the stat service
      const addStatResponse = await axios.post(url, req.body, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(addStatResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/stats', async (req, res) => {
  const url = new URL(statServiceUrl + '/stats');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the get stats request to the stat service
      const getStatsResponse = await axios.get(url);
      res.json(getStatsResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/user-stats', async (req, res) => {
  const url = new URL(statServiceUrl + '/user-stats');
  const auth = req.headers.authorization;
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname) &&
    isJwtValid(auth)
  ) {
    try {
      // Forward the get user-stats request to the stat service
      const getStatsResponse = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      res.json(getStatsResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

app.get('/ranking', async (req, res) => {
  const url = new URL(statServiceUrl + '/ranking');
  if (
    schemesList.includes(url.protocol) &&
    domainsList.includes(url.hostname)
  ) {
    try {
      // Forward the get user-stats request to the stat service
      const getStatsResponse = await axios.get(url);
      res.json(getStatsResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  }
});

// Read the OpenAPI YAML file synchronously
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log('Not configuring OpenAPI. Configuration file not present.');
}

// Start the gateway service
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

export default server;
