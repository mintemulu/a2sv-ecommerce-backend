import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { created, ok } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { cache } from '../utils/cache';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct({ ...req.body, userId: req.user!.userId });
    cache.clear();
    return res.status(201).json(created(product, 'Product created successfully'));
  } catch (err) {
    return next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    cache.clear();
    return res.status(200).json(ok(updated, 'Product updated successfully'));
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    cache.clear();
    return res.status(200).json(ok({ id: req.params.id }, 'Product deleted successfully'));
  } catch (err) {
    return next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return res.status(200).json(ok(product, 'Product fetched successfully'));
  } catch (err) {
    return next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize, skip, take } = parsePagination(req.query);
    const search = (req.query.search as string) || '';
    const cacheKey = `products:${page}:${pageSize}:${search}`;
    const cached = cache.get<any>(cacheKey);
    if (cached) return res.status(200).json(cached);

    const { category } = req.query as any;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const inStock = req.query.inStock ? req.query.inStock === 'true' : undefined;
    const sortBy = (req.query.sortBy as any) || undefined;
    const sortOrder = (req.query.sortOrder as any) || undefined;
    const { total, products } = await productService.listProducts({ skip, take, search, category, minPrice, maxPrice, inStock, sortBy, sortOrder });
    const totalPages = Math.ceil(total / pageSize) || 1;
    const response = {
      currentPage: page,
      pageSize,
      totalPages,
      totalProducts: total,
      products,
    };
    cache.set(cacheKey, response, 30 * 1000);
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};
