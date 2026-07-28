import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/auth.js';
import auth from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.js';

const authRouter = Router();
authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);
authRouter.use(auth);
authRouter.get('/me', getCurrentUser);

export { authRouter };
