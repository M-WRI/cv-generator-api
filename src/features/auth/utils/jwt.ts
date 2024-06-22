import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SECRET_KEY);
};