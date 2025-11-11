import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import { createProductSchema, getByIdSchema, listProductsSchema, updateProductSchema } from '../validations/product';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';
import { upload } from '../utils/upload';
import { uploadProductImage } from '../controllers/upload.controller';

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products (paginated)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [name, price, createdAt] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', validate(listProductsSchema), productController.list);
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 */
router.get('/:id', validate(getByIdSchema), productController.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a product (Admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, stock, category]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               category: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', requireAuth, requireRole('ADMIN'), validate(createProductSchema), productController.create);
/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product (Admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), validate(updateProductSchema), productController.update);
/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (Admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), validate(getByIdSchema), productController.remove);

/**
 * @openapi
 * /products/{id}/image:
 *   post:
 *     summary: Upload product image (Admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
router.post('/:id/image', requireAuth, requireRole('ADMIN'), validate(getByIdSchema), upload.single('image'), uploadProductImage);

export default router;
