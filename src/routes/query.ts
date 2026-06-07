import { Router } from 'express';
import { askQuestionGetAnswer } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', askQuestionGetAnswer);

export { queryRouter };
