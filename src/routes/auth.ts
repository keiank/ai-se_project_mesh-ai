import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.get('/me', getCurrentUser);
authRouter.post('/login', login);
authRouter.post('/register', register);

export { authRouter };
