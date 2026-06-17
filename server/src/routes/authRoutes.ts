import { Router } from 'express';
import { register, login, getMe, registerValidation, loginValidation } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', authMiddleware, getMe);

export default router;
