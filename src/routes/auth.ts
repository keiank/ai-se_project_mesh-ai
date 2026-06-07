import { Router } from 'express';
import {
  authenticateUser,
  createNewUser,
  getCurrentUser,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.get('/me', getCurrentUser);
authRouter.post('/login', authenticateUser);
authRouter.post('/register', createNewUser);

export { authRouter };
