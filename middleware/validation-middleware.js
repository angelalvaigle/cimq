import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customErrors.js';
import User from '../user-model.js';

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 20 })
    .withMessage('name must be no more than 20 characters long'),
  body('lastName')
    .notEmpty()
    .withMessage('last name is required')
    .isLength({ max: 40 })
    .withMessage('last name must be no more than 20 characters long'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isLength({ max: 40 })
    .withMessage('email must be no more than 20 characters long')
    .isEmail()
    .withMessage('invalid email format')
    .isLength({ max: 40 })
    .withMessage('email must be no more than 20 characters long')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError('email already exists');
    }),
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ max: 20 })
    .withMessage('username must be no more than 20 characters long')
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) throw new BadRequestError('username already exists');
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .isLength({ max: 20 })
    .withMessage('password must be no more than 20 characters long'),
]);

export const validateUpdateUserInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 20 })
    .withMessage('name must be no more than 20 characters long'),
  body('lastName')
    .notEmpty()
    .withMessage('last name is required')
    .isLength({ max: 40 })
    .withMessage('last name must be no more than 20 characters long'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isLength({ max: 40 })
    .withMessage('email must be no more than 20 characters long')
    .isEmail()
    .withMessage('invalid email format')
    .isLength({ max: 40 })
    .withMessage('email must be no more than 20 characters long')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ max: 20 })
    .withMessage('username must be no more than 20 characters long'),
]);
