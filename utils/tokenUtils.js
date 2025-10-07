import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  const token = jwt.sign(payload, 'your-secret-key', {
    // process.env.JWT_SECRET
    expiresIn: '1d', // process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, 'your-secret-key'); // process.env.JWT_SECRET);
  return decoded;
};
