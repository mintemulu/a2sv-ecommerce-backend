import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
    req.body = parsed.body ?? req.body;
    req.query = parsed.query ?? req.query;
    req.params = parsed.params ?? req.params as any;
    return next();
  } catch (err: any) {
    const issues = err?.issues?.map((i: any) => i.message) ?? ['Invalid input'];
    return res.status(400).json({ success: false, message: 'Validation error', object: null, errors: issues });
  }
};
