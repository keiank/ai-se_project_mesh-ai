import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/auth.js';
import auth from '../middleware/auth.js';

const authRouter = Router();
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.use(auth);
authRouter.get('/me', getCurrentUser);

export { authRouter };
