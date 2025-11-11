import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { created, ok } from '../utils/response';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(created(user, 'User registered successfully'));
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json(ok(data, 'Login successful'));
  } catch (err) {
    return next(err);
  }
};
