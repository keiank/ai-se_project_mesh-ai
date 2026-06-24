import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(logger);

// routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});
app.get('/test-error', (req, res) => {
  throw new Error('Test error');
});
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
