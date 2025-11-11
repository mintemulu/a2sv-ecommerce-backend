import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

type OrderItemInput = { productId: string; quantity: number };

export const placeOrder = async (userId: string, items: OrderItemInput[]) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const products = await tx.product.findMany({ where: { id: { in: items.map((i) => i.productId) } } });
    if (products.length !== items.length) {
      throw { status: 404, message: 'One or more products not found' };
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId)! as { id: string; name: string; stock: number; price: Prisma.Decimal };
      if (product.stock < item.quantity) {
        throw { status: 400, message: `Insufficient stock for ${product.name}` };
      }
    }

    let total = 0;
    for (const item of items) {
      const product = productMap.get(item.productId)! as { id: string; name: string; stock: number; price: Prisma.Decimal };
      const unitPrice = product.price.toNumber();
      total += unitPrice * item.quantity;
    }

    const order = await tx.order.create({
      data: {
        userId,
        totalPrice: new Prisma.Decimal(total),
        status: 'PENDING',
      },
    });

    for (const item of items) {
      const product = productMap.get(item.productId)! as { id: string; name: string; stock: number; price: Prisma.Decimal };
      const unitPrice = product.price.toNumber();
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(unitPrice),
        },
      });
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }

    const fullOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    return fullOrder!;
  });
};

export const listMyOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
  return orders;
};
