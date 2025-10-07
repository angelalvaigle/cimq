import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import User from './user-model.js';

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export const addUserController = async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['username', 'password']);

    // Encrypt the password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const isFirstAccount = (await User.countDocuments()) === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';
    const newUser = new User({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users, only return username field for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserController = async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.query.userId }); // Fetch user by id
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }); // Fetch current user
    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const newUser = { ...req.body };
    delete newUser.password;
    await User.findByIdAndUpdate(req.user.userId, newUser);
    res.status(StatusCodes.OK).json({ msg: 'update user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
