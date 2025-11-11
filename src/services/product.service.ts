import { prisma } from '../utils/prisma';

export const createProduct = async (args: { name: string; description: string; price: number; stock: number; category: string; userId: string; }) => {
  const product = await prisma.product.create({
    data: {
      name: args.name,
      description: args.description,
      price: args.price,
      stock: args.stock,
      category: args.category,
      userId: args.userId,
    },
  });
  return product;
};

export const updateProduct = async (id: string, data: Partial<{ name: string; description: string; price: number; stock: number; category: string; }>) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw { status: 404, message: 'Product not found' };
  const updated = await prisma.product.update({ where: { id }, data });
  return updated;
};

export const deleteProduct = async (id: string) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw { status: 404, message: 'Product not found' };
  await prisma.product.delete({ where: { id } });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: 'Product not found' };
  return product;
};

export const listProducts = async (args: {
  skip: number;
  take: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) => {
  const where: any = {};
  if (args.search && args.search.trim() !== '') {
    where.name = { contains: args.search, mode: 'insensitive' as const };
  }
  if (args.category && args.category.trim() !== '') {
    where.category = { equals: args.category };
  }
  if (args.minPrice != null || args.maxPrice != null) {
    where.price = {};
    if (args.minPrice != null) (where.price as any).gte = args.minPrice;
    if (args.maxPrice != null) (where.price as any).lte = args.maxPrice;
  }
  if (args.inStock != null) {
    if (args.inStock) where.stock = { gt: 0 };
  }

  const orderBy: any = {};
  const sortField = args.sortBy ?? 'createdAt';
  const sortOrder = args.sortOrder ?? 'desc';
  orderBy[sortField] = sortOrder;

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, skip: args.skip, take: args.take, orderBy }),
  ]);
  return { total, products };
};
