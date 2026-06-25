import type { Request, Response } from 'express';
import Chat from '../models/chat.js';
import Message from '../models/message.js';

/**
 * Retrieve a list of chats of the logged in user.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function getChats(req: Request, res: Response) {
  const chats = await Chat.find({ userId: req.user!.userId });
  
  res.status(200).json({
    success: true,
    data: chats,
    error: null,
  });
}

/**
 * Create a new chat for the logged in user.
 *
 * @param {Request} req - Express request object with chat payload.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function createChat(req: Request, res: Response): void {
  const { title } = req.body;
  
  if (!title) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Missing chat title' },
    });
    return;
  }

  const chat = await Chat.create({ title, userId: req.user!.userId });
  if (!chat) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Unable to create new chat' },
    });
    return;
  }

  res.status(201).json({
    success: true,
    data: chat,
    error: null,
  });
}

/**
 * Retrieve a single chat by its id for the logged in user.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the chat id.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function getChat(req: Request, res: Response) {
  const chat = await Chat.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat does not exist' },
    });
    return;
  }

  const messages = await Message.find({ chatId: chat._id })
    .sort({'createdAt': 'asc'});

  res.status(200).json({
    success: true,
    data: { chat, messages},
    error: null,
  });
}

/**
 * Delete a chat by its id for a logged in user.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the chat id.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
function deleteChat(req: Request, res: Response): void {
  res.status(204).json({
    success: true,
    data: {},
    error: null,
  });
}

/**
 * Send a message in a chat and return the reply for the logged in user.
 *
 * @param {Request} req - Express request object with message payload.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
function sendMessageGetReply(req: Request, res: Response): void {
  res.status(201).json({
    success: true,
    data: {},
    error: null,
  });
}

export {
  getChats,
  createChat,
  getChat,
  deleteChat,
  sendMessageGetReply,
};
