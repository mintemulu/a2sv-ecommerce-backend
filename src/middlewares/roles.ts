import { NextFunction, Request, Response } from 'express';

export const requireRole = (role: 'ADMIN' | 'USER') => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized', object: null, errors: ['Not authenticated'] });
  if (req.user.role !== role) return res.status(403).json({ success: false, message: 'Forbidden', object: null, errors: ['Insufficient role'] });
  return next();
};
