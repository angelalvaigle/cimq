// user-service.js
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './user-router.js';
import errorHandlerMiddleware from './middleware/errorhandler-middleware.js';

const app = express();
const port = 8001;

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_USER || 'mongodb://mongodb:27017/userdb';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Conexión exitosa a userDB');
  })
  .catch((err) => {
    console.error('Error de conexión a userDB:', err);
  });

// userRouter
app.use('/', userRouter);
app.use(errorHandlerMiddleware);

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

export default server;
