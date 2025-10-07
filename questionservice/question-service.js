// question-service.js
import express from 'express';
import mongoose from 'mongoose';
import questionRouter from './question-router.js';
import errorHandlerMiddleware from './middleware/errorhandler-middleware.js';

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri =
  process.env.MONGODB_QUESTION || 'mongodb://mongodb:27017/questiondb';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Conexión exitosa a questionDB');
  })
  .catch((err) => {
    console.error('Error de conexión a questionDB:', err);
  });

app.use('/', questionRouter);
app.use(errorHandlerMiddleware);

const server = app.listen(port, () => {
  console.log(`Question Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

export default server;
