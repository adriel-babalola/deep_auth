import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyRouter from './routes/verify.js';
import { generalRateLimiter } from './middleware/rateLimiter.js'
import path from "path";
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(generalRateLimiter); // Apply general rate limiter to all routes

// Routes
app.use('/api', verifyRouter);

// Health check (unrestricted by endpoint-specific limiter)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Fallback to index.html for React Router (must be after API routes)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`✅ API endpoint: http://localhost:${PORT}/api/verify`);
});