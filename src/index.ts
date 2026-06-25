import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 3000;

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

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server listening on port ${port}`))
  })
  .catch((err) => {
    console.error('Connection error', err);
  })

