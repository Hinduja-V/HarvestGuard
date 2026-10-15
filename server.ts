import express, { NextFunction, Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

async function startServer() {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.get('/api/health', async (_req: Request, res: Response) => {
    await forwardGet('/api/health', res);
  });

  app.get('/api/produce-types', async (_req: Request, res: Response) => {
    await forwardGet('/api/produce-types', res);
  });

  app.post(
    '/api/predict',
    upload.single('file'),
    async (req: Request, res: Response) => {
      const produce = req.body.produce;
      if (typeof produce !== 'string' || !['tomato', 'potato'].includes(produce.trim().toLowerCase())) {
        res.status(400).json({
          detail: `Unsupported produce type '${String(produce)}'. Supported produce types are Tomato and Potato.`,
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ detail: 'Please upload a produce image first.' });
        return;
      }

      try {
        const formData = new FormData();
        formData.append(
          'file',
          new Blob([new Uint8Array(req.file.buffer)], {
            type: req.file.mimetype,
          }),
          req.file.originalname || `${produce.toLowerCase()}.jpg`,
        );
        formData.append('produce', produce.trim());

        const response = await fetch(`${BACKEND_URL}/api/predict`, {
          method: 'POST',
          body: formData,
        });
        const responseText = await response.text();

        res
          .status(response.status)
          .type('application/json')
          .send(responseText);
      } catch (error) {
        console.error('FastAPI prediction forwarding failed:', error);
        res.status(502).json({
          detail: 'Could not connect to the AI prediction service. Ensure FastAPI is running on port 8000.',
        });
      }
    },
  );

  app.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (error instanceof multer.MulterError) {
        const isTooLarge = error.code === 'LIMIT_FILE_SIZE';
        res.status(isTooLarge ? 413 : 400).json({
          detail: isTooLarge
            ? 'Image is too large. Upload an image smaller than 10 MB.'
            : 'The image upload could not be processed. Please try again.',
        });
        return;
      }

      console.error('Image upload failed:', error);
      res.status(500).json({ detail: 'Image upload failed unexpectedly.' });
    },
  );

  async function forwardGet(endpoint: string, res: Response) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`);
      res
        .status(response.status)
        .type('application/json')
        .send(await response.text());
    } catch (error) {
      console.error(`FastAPI request failed for ${endpoint}:`, error);
      res.status(502).json({
        detail: 'Could not connect to the AI prediction service. Ensure FastAPI is running on port 8000.',
      });
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`HarvestGuard AI server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error('Server failed to start:', error.message);
  });
}

startServer();
