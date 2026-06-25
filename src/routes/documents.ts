import { Router } from 'express';
import {
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from '../controllers/documents.js';
import auth from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const documentsRouter = Router();
documentsRouter.use(auth);
documentsRouter.post('/', upload.single('file'), uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocumentById);

export { documentsRouter };
