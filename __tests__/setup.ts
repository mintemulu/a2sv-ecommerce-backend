import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
process.env.PORT = '0';

export const makeToken = (payload: { userId: string; username: string; role: 'USER' | 'ADMIN' }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
