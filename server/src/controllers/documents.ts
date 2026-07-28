import type { Request, Response } from 'express';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import mongoose from 'mongoose';
import { deleteCacheValue, getCacheValue, setCacheValue } from '../utils/cache.js';

/**
 * Handle document upload.
 *
 * @param {Request} req - Express request object with upload payload.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function uploadDocument(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Must include a document to upload' },
    });
    return;
  }

  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });

  const { text } = await parser.getText();

  const chunks = chunkText(text);

  const title = req.body.title || req.file.originalname;

  const document = await Document.create({
      title,
      fileName: req.file.originalname,
      userId: req.user!.userId
    });

  // invalidate cache when new document is created
  // to force fresh retrieval of entire document list
  const cacheKey = `documents-list:${req.user!.userId}`;
  deleteCacheValue(cacheKey);

  await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await createEmbedding(chunk);
      return Chunk.create({ documentId: document._id, text: chunk, embedding });
    })
  );

  res.status(201).json({
    success: true,
    data: document,
    error: null,
  });
}

/**
 * Retrieve a list of documents for the current user.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function getDocuments(req: Request, res: Response): Promise<void> {
  const cacheKey = `documents-list:${req.user!.userId}`;
  const cached = getCacheValue(cacheKey);

  if (cached) {
    res.status(200).json(cached);
    return;
  }
  
  const documents = await Document.find({ userId: req.user!.userId });
  
  const responseData = { data: documents };
  setCacheValue(cacheKey, responseData, 30 * 1000);

  res.status(200).json(responseData);
}

/**
 * Retrieve a single document by its id.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the document id.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function getDocumentById(req: Request, res: Response): Promise<void> {
  const documentId = new mongoose.Types.ObjectId(req.params.id as string);
  const userId = new mongoose.Types.ObjectId(req.user!.userId as string);
  // Should only be able to get documents
  // of the current logged-in user.
  const document = await Document.findOne({ _id: documentId, userId });
  if (!document) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Document does not exist' },
    });
    return;
  }
  res.status(200).json({
    success: true,
    data: document,
    error: null,
  });
}

/**
 * Delete a document by its id.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the document id.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function deleteDocumentById(req: Request, res: Response): Promise<void> {
  const documentId = new mongoose.Types.ObjectId(req.params.id as string);
  const userId = new mongoose.Types.ObjectId(req.user!.userId as string);
  // Should only be able to delete documents
  // of the current logged-in user.
  const document = await Document.findOneAndDelete({ _id: documentId, userId });
  if (!document) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document does not exist' },
    });
    return;
  }

  // invalidate cache when new document is created
  // to force fresh retrieval of entire document list
  const cacheKey = `documents-list:${req.user!.userId}`;
  deleteCacheValue(cacheKey);

  res.status(200).json({
    success: true,
    data: document,
    error: null,
  });
}

export { uploadDocument, getDocuments, getDocumentById, deleteDocumentById };
