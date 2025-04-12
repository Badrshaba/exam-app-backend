import { Router } from 'express';
import * as authController from './auth.controller.js';
import expressAsyncHandler from 'express-async-handler';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { setPasswordSchema, signInSchema, signUpSchema } from './auth.validation.js';
import { auth } from '../../middlewares/auth.middleware.js';
const router = Router();

router.post('/', validationMiddleware(signUpSchema), expressAsyncHandler(authController.signUp));
router.post('/signin', validationMiddleware(signInSchema), expressAsyncHandler(authController.signin));
router.patch('/set-password', auth(), validationMiddleware(setPasswordSchema), expressAsyncHandler(authController.setPassword));

export default router;
