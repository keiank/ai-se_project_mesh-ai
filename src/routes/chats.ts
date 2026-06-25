import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  sendMessageGetReply,
} from '../controllers/chats.js';
import auth from '../middleware/auth.js';

const chatsRouter = Router();

chatsRouter.use(auth);
chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChat);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessageGetReply);

export { chatsRouter };
