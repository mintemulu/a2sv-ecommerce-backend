import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { created, ok } from '../utils/response';

export const place = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.placeOrder(req.user!.userId, req.body);
    return res.status(201).json(created(order, 'Order placed successfully'));
  } catch (err) {
    return next(err);
  }
};

export const listMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.listMyOrders(req.user!.userId);
    return res.status(200).json(ok(orders, 'Orders fetched successfully'));
  } catch (err) {
    return next(err);
  }
};
