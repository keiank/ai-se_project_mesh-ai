import express from 'express';

const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
