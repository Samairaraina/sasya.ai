import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

export const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Parsing Middlewares
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(cookieParser());

// Static uploads directory (temp before Supabase Storage)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Swagger API Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, './config/swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error("Could not load swagger.yaml");
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Main API Routes
app.use('/api', apiRoutes);

// Frontend proxy
app.use(express.static(distDir));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Global Error Handler
app.use(errorHandler);
