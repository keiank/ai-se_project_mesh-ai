import { Router } from 'express';
import {
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from '../controllers/documents.js';

const documentsRouter = Router();
documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocumentById);

export { documentsRouter };
