import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError('unauthorized to access this route');
    next();
  };
};
