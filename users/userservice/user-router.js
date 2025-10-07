// userRouter.js
import express from 'express';
import {
  addUserController,
  getUsersController,
  getUserController,
  getCurrentUserController,
  updateUserController,
} from './user-controller.js';
import { authenticateUser } from './middleware/auth-middleware.js';
import {
  validateRegisterInput,
  validateUpdateUserInput,
} from './middleware/validation-middleware.js';

const userRouter = express.Router();

// Define la ruta para el login y asocia el controlador
userRouter.post('/adduser', validateRegisterInput, addUserController);
userRouter.get('/users', getUsersController);
userRouter.get('/user', getUserController);
userRouter.get('/current-user', authenticateUser, getCurrentUserController);
userRouter.patch(
  '/update-user',
  authenticateUser,
  validateUpdateUserInput,
  updateUserController
);

export default userRouter;
