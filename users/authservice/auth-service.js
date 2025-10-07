import express from 'express';
import mongoose from 'mongoose';
import authRouter from './auth-router.js';

const app = express();
const port = 8002;

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_USER || 'mongodb://mongodb:27017/userdb';
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conexión exitosa a userDB');
  })
  .catch((err) => {
    console.error('Error de conexión a userDB:', err);
  });

// Route for user login
app.use('/', authRouter);

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

export default server;
