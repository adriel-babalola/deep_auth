// services/geminiService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Fastest free model on OpenRouter
const MODEL = 'google/gemini-2.0-flash-exp:free';

export const verifyClaimWithSearch = async (claim) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: `You are a professional fact-checker. Verify this claim using your knowledge and reasoning: "${claim}"

IMPORTANT: Focus on claims from the PAST MONTH only. If the claim is about recent events, prioritize the most current information available.

Provide your analysis in this EXACT JSON format (no markdown, no backticks):
{
  "verdict": "SUPPORTED" or "CONTRADICTED" or "UNCLEAR",
  "confidence": 0-100,
  "summary": "2-3 sentence explanation of your verdict",
  "reasoning": "Detailed analysis explaining your fact-check process and key evidence",
  "sources": [
    {
      "title": "Source title or description",
      "url": "https://example.com (if applicable, otherwise use N/A)",
      "snippet": "Key information from this source"
    }
  ]
}`

          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'News Verifier',
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      }
    );

    const text = response.data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Extract JSON
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      // Ensure sources exist
      if (!result.sources || result.sources.length === 0) {
        result.sources = [{
          title: "AI Analysis",
          url: "N/A",
          snippet: "Analysis based on model knowledge up to training date"
        }];
      }

      return result;
    }

    // Fallback if JSON parsing fails
    return {
      verdict: 'UNCLEAR',
      confidence: 0,
      summary: 'Unable to parse AI response',
      reasoning: text,
      sources: []
    };
  } catch (error) {
    console.error('OpenRouter verification error:', error.response?.data || error.message);
    throw new Error('Failed to verify claim with AI');
  }
};