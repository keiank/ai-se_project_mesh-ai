import { Router } from 'express';
import {
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from '../controllers/documents.js';
import auth from '../middleware/auth.js';

const documentsRouter = Router();
documentsRouter.use(auth);
documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocumentById);

export { documentsRouter };
