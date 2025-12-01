import express from 'express';
import { verifyClaimWithRealNews } from '../services/geminiService.js';
import { verifyRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/verify
 * Verify a claim using AI and real news sources
 */
router.post('/verify', verifyRateLimiter, async (req, res) => {
  const startTime = Date.now();

  try {
    const { claim } = req.body;

    // Validation
    if (!claim) {
      return res.status(400).json({ 
        error: 'Missing claim',
        message: 'Please provide a claim to verify'
      });
    }

    if (typeof claim !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid claim type',
        message: 'Claim must be a string'
      });
    }

    const trimmedClaim = claim.trim();

    if (trimmedClaim.length < 10) {
      return res.status(400).json({ 
        error: 'Claim too short',
        message: 'Claim must be at least 10 characters long'
      });
    }

    if (trimmedClaim.length > 500) {
      return res.status(400).json({ 
        error: 'Claim too long',
        message: 'Claim must be less than 500 characters'
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 NEW VERIFICATION REQUEST');
    console.log('📝 Claim:', trimmedClaim);
    console.log('🌐 IP:', req.ip);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Call Gemini service
    const result = await verifyClaimWithRealNews(trimmedClaim);

    const duration = Date.now() - startTime;
    console.log(`⏱️  Request completed in ${duration}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Format response to match frontend expectations
    const response = {
      verdict: result.verdict,
      confidence: result.confidence,
      summary: result.summary,
      reasoning: result.reasoning,
      articles: result.sources.map((source) => ({
        title: source.title,
        description: source.snippet || source.date || 'No description available',
        url: source.url,
        source: {
          name: source.publisher || 'Unknown Source'
        },
        publishedAt: source.date || new Date().toISOString(),
        urlToImage: null
      })),
      queries: [trimmedClaim], // Single query used
      processingTime: duration,
      logs: result.logs || [] // Include logs from service
    };

    res.json(response);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ VERIFICATION ERROR');
    console.error('Error:', error.message);
    console.error(`⏱️  Failed after ${duration}ms`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(500).json({ 
      error: 'Verification failed',
      message: error.message || 'An unexpected error occurred',
      processingTime: duration
    });
  }
});

export default router;