import { Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: { message: 'Too many attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetAuthLimiter = (req: Request): void => {
  authLimiter.resetKey(ipKeyGenerator(req.ip ?? ''));
};
