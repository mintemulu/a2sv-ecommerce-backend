import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { ok } from '../utils/response';

export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded', object: null, errors: ['file required'] });
    const imageUrl = `/uploads/${req.file.filename}`;
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Product not found', object: null, errors: ['Product not found'] });
    const updated = await prisma.product.update({ where: { id }, data: { imageUrl } });
    return res.status(200).json(ok(updated, 'Image uploaded'));
  } catch (err) {
    return next(err);
  }
};
