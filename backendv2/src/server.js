import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

import verifyRouter from './routes/verify.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { checkGeminiHealth } from './services/geminiService.js';


const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Trust proxy (important for rate limiting with real IPs)
app.set('trust proxy', 1);

// Apply general rate limiter to all routes
app.use(generalRateLimiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', verifyRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const geminiHealthy = await checkGeminiHealth();
    
    res.json({ 
      status: 'OK',
      message: 'Server is running',
      services: {
        server: 'operational',
        gemini: geminiHealthy ? 'operational' : 'degraded'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Fallback to index.html for React Router (must be after API routes)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});


// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('🚨 UNHANDLED ERROR');
  console.error(err.stack);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('\n' + chalk.cyan('━'.repeat(45)));
  console.log(chalk.green.bold('🚀 NEWS VERIFIER SERVER STARTED'));
  console.log(chalk.cyan('━'.repeat(45)));
  console.log(chalk.blue(`📍 Server running on: http://localhost:${PORT}`));
  console.log(chalk.blue(`📊 Health check: http://localhost:${PORT}/health`));
  console.log(chalk.blue(`✅ API endpoint: http://localhost:${PORT}/api/verify`));
  console.log(chalk.yellow(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`));
  
  try {
    const geminiHealthy = await checkGeminiHealth();
    if (geminiHealthy) {
      console.log(chalk.green('✅ Google Gemini: Connected'));
    } else {
      console.log(chalk.yellow('⚠️  Google Gemini: Connection issue detected'));
    }
  } catch (error) {
    console.log(chalk.red('❌ Google Gemini: Failed to connect'));
  }
  
  console.log(chalk.cyan('━'.repeat(45)) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});