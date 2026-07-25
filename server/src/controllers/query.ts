import type { Request, Response } from 'express';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { buildContext, getClient, stripThinking, LLM_MODEL } from '../utils/openai-client.js';

/**
 * Handle a user's question, returning an answer.
 *
 * @param {Request} req - Express request object containing the query.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
async function queryDocuments(req: Request, res: Response) {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  // Find relevant chunks to the question
  const userId = req.user!.userId;
  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);

  const chunkRecords = await Chunk.find({ documentId: { $in: docIds }});
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);

  // Generate answer with relevant context from user
  // uploaded documents.
  const client = getClient();
  const context = buildContext(ranked);
  
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful research assistant. Answer the question using only the provided context. If the context does not contain enough information to answer, say so.',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
    temperature: 0.2,
  });

  const answer = stripThinking(response.choices[0]!.message.content ?? 'No answer returned.');

  res.status(200).json({
    success: true,
    data: { question, answer },
    error: null,
  });
}

export { queryDocuments };
