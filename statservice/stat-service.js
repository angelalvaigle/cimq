// stat-service.js
import express from 'express';
import mongoose from 'mongoose';
import statRouter from './stat-router.js';

const app = express();
const port = 8004;

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_STAT || 'mongodb://mongodb:27017/statdb';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Conexión exitosa a statDB');
  })
  .catch((err) => {
    console.error('Error de conexión a statDB:', err);
  });

app.use('/', statRouter);

const server = app.listen(port, () => {
  console.log(`Stat Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

export default server;
