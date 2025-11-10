import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';

export type AuthUser = {
  userId: string;
  username: string;
  role: 'USER' | 'ADMIN';
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized', object: null, errors: ['Missing token'] });
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized', object: null, errors: ['Invalid token'] });
  }
};
