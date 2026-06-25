import type { Request, Response } from 'express';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { create } from 'domain';

/**
 * Handle document upload.
 *
 * @param {Request} req - Express request object with upload payload.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function uploadDocument(req: Request, res: Response) {
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
async function getDocuments(req: Request, res: Response) {
  const documents = await Document.find({ userId: req.user!.userId });
  
  res.status(200).json({
    success: true,
    data: documents,
    error: null,
  });
}

/**
 * Retrieve a single document by its id.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the document id.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
function getDocumentById(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
}

/**
 * Delete a document by its id.
 *
 * @param {Request} req - Express request object; `req.params.id` contains the document id.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
function deleteDocumentById(req: Request, res: Response): void {
  res.status(204).json({
    success: true,
    data: {},
    error: null,
  });
}

export { uploadDocument, getDocuments, getDocumentById, deleteDocumentById };
