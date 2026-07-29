import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import router from './routes/index.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import cors from "cors";
import { logger } from './utils/logger.js';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());
app.use(requestLogger);

// routes
app.set('trust proxy', 1);
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});
app.get('/test-error', (_req, _res) => {
  throw new Error('Test error');
});
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(port, () => {
      logger.info('Server started', { port: port, env: process.env.NODE_ENV });
      if (isProduction) {
        logger.info(
          JSON.stringify({
            event: 'server-start',
            port: port,
            env: process.env.NODE_ENV
          })
        );
      } else {
        logger.info(
          `[dev] Server running on port ${port}`
        );
      }
    });
  })
  .catch((err) => {
    logger.error(`MongoDB connection error ${err}`);
    process.exit(1);
  });

