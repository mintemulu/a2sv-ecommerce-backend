import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, example: john12 }
 *               email: { type: string, format: email, example: john12@example.com }
 *               password: { type: string, example: StrongP@ss1 }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and obtain a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), authController.login);

export default router;
