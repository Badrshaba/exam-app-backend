import { Router } from 'express';
import * as authController from './auth.controller.js';
import expressAsyncHandler from 'express-async-handler';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { signUpSchema } from './auth.validation.js';
const router = Router();

router.post('/', expressAsyncHandler(authController.signUp));
router.post('/signin', expressAsyncHandler(authController.signin));

export default router;
