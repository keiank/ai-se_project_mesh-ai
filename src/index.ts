import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';

const app = express();
const PORT = 3000;

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

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
