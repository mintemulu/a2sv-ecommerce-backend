import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validate';
import { placeOrderSchema } from '../validations/order';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';

const router = Router();

router.post('/', requireAuth, requireRole('USER'), validate(placeOrderSchema), orderController.place);
router.get('/', requireAuth, orderController.listMine);

export default router;
