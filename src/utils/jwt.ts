import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export type JwtPayload = {
  userId: string;
  username: string;
  role: 'USER' | 'ADMIN';
};

export const signJwt = (payload: JwtPayload, expiresIn: string = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
