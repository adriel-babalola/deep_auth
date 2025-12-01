import express from 'express';
import { generateSearchQueries, analyzeResults } from '../services/geminiService.js';
import { fetchNews } from '../services/newsService.js';
import { verifyRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply strict rate limiting to verify endpoint
router.post('/verify', verifyRateLimiter, async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim || claim.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Claim must be at least 10 characters long' 
      });
    }

    // Step 1: Generate search queries using Gemini
    console.log('Generating search queries...');
    const queries = await generateSearchQueries(claim);
    console.log('Queries:', queries);

    // Step 2: Fetch news articles
    console.log('Fetching news articles...');
    const articles = await fetchNews(queries);
    console.log(`Found ${articles.length} articles`);

    if (articles.length === 0) {
      return res.json({
        verdict: 'UNCLEAR',
        confidence: 0,
        summary: 'No relevant news articles found',
        articles: [],
        queries
      });
    }
    

    // Step 3: Analyze with Gemini
    console.log('Analyzing results...');
    const analysis = await analyzeResults(claim, articles);

    res.json({
      ...analysis,
      articles: articles.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source.name,
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage
      })),
      queries
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Verification failed',
      message: error.message 
    });
  }
});

export default router;