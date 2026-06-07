import { Router } from 'express';
import {
  createNewChat,
  deleteChat,
  getChatById,
  getChats,
  sendMessageGetReply,
} from '../controllers/chats.js';

const chatsRouter = Router();
chatsRouter.get('/', getChats);
chatsRouter.post('/', createNewChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessageGetReply);

export { chatsRouter };
