import { Router } from 'express';
import {
  createNewChat,
  deleteChat,
  getChatById,
  getChats,
  sendMessageGetReply,
} from '../controllers/chats.js';
import auth from '../middleware/auth.js';

const chatsRouter = Router();

chatsRouter.use(auth);
chatsRouter.get('/', getChats);
chatsRouter.post('/', createNewChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessageGetReply);

export { chatsRouter };
