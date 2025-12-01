<div align="center">
  <a href="https://moonshot.hackclub.com" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/35ad2be8c916670f3e1ac63c1df04d76a4b337d1_moonshot.png" 
         alt="This project is part of Moonshot, a 4-day hackathon in Florida visiting Kennedy Space Center and Universal Studios!" 
         style="width: 100%;">
  </a>
</div>

# 📰 DeepAuth v2.1.0 - AI-Powered Fact-Checking Platform

DeepAuth is an intelligent, real-time fact-checking application that verifies claims using **Google Gemini 2.0 Flash Experimental** with integrated **Google Search grounding**. It combines cutting-edge AI analysis with real-time web search for comprehensive, up-to-date claim verification with confidence scoring.

**Status**: ✅ Production Ready | **Version**: 2.1.0 | **License**: ISC | **Author**: Adriel Babalola

---

## 🌟 Key Features

- **🤖 Gemini 2.0 Flash AI**: Next-generation AI model for intelligent claim verification
- **🔍 Google Search Grounding**: Real-time web search integrated directly into AI analysis
- **📊 Confidence Scoring**: Verdict (SUPPORTED/CONTRADICTED/PARTIALLY_SUPPORTED) with percentage confidence
- **⚡ Rate Limiting**: Built-in DDoS protection with Upstash Redis (10 req/min on verify endpoint)
- **🎨 Beautiful UI**: Modern responsive design with Tailwind CSS v4.1, Lucide React icons, Source Sans 3 font
- **📱 Mobile Optimized**: Fully responsive for all device sizes
- **🏥 Comprehensive Error Handling**: Detailed error messages with fallback UI
- **⏱️ Real-time Progress**: Visual progress indicator during verification
- **📈 Analytics Ready**: Rate limit analytics via Upstash dashboard

---

## 📋 Project Structure

```
DeepAuth/ (Monorepo)
├── backendv2/                       # Primary backend (v2.1.0)
│   ├── src/
│   │   ├── server.js               # Express.js entry point
│   │   ├── routes/
│   │   │   └── verify.js           # POST /api/verify endpoint
│   │   ├── services/
│   │   │   ├── geminiService.js    # Gemini 2.0 Flash + Google Search
│   │   │   └── newsService.js      # News processing
│   │   ├── middleware/
│   │   │   └── rateLimiter.js      # Rate limiting middleware
│   │   └── utils/
│   │       └── errorHandler.js     # Error utilities
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── nodemon.json
│
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app container
│   │   ├── main.jsx                # Vite entry point
│   │   ├── services/
│   │   │   └── api.js              # Backend API client
│   │   ├── components/
│   │   │   ├── Navigation.jsx      # Header component
│   │   │   ├── ClaimInput.jsx      # Claim input form
│   │   │   ├── ProgressIndicator.jsx # Progress bar
│   │   │   ├── AiResponse.jsx      # Verdict + confidence circle
│   │   │   ├── SearchQueries.jsx   # Generated queries display
│   │   │   └── Article.jsx         # Article card component
│   │   ├── App.css
│   │   ├── index.css               # Global styles + Source Sans 3 font
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── backend/                         # Legacy backend (v1)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
├── package.json                    # Root monorepo config
├── README.md                       # This file
└── .env                            # Root environment (optional)
```

---

## 🔧 Tech Stack

### Backend (backendv2)
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 4.21.2
- **AI Model**: Google Gemini 2.0 Flash Experimental (@google/generative-ai v0.21.0)
- **Web Search**: Google Search Tool (integrated into Gemini)
- **Rate Limiting**: Upstash Redis (@upstash/ratelimit v2.0.7)
- **HTTP Client**: Axios 1.13.2
- **Development**: Nodemon 3.0.2
- **Utilities**: CORS, Chalk, Cheerio, Dotenv

### Frontend (React + Vite)
- **Framework**: React 19.2.0 with Vite 7.2.2
- **Styling**: Tailwind CSS 4.1.17
- **Font**: Source Sans 3 (from Google Fonts)
- **Icons**: Lucide React 0.553.0
- **Build Tool**: Vite
- **Linting**: ESLint 9.39.1
- **HTTP Client**: Axios 1.13.2

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ with npm/yarn
- **Google Gemini API Key** (free): https://aistudio.google.com/apikey
- **Upstash Redis URL & Token** (free tier): https://upstash.com

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/adriel-babalola/DeepAuth.git
   cd DeepAuth
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup backend environment**
   
   Create `backendv2/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

4. **Install dependencies**
   ```bash
   # Install all workspaces
   npm install
   ```

### Running Locally

**Development (Both Services)**
```bash
# From root directory
npm run dev
```

This runs:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

**Production Build**
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### POST `/api/verify`

Verifies a claim using Gemini 2.0 Flash with Google Search grounding.

**Request:**
```json
{
  "claim": "Electric vehicle sales increased by 40% in 2024"
}
```

**Response (200 OK):**
```json
{
  "verdict": "SUPPORTED",
  "confidence": 87,
  "summary": "Recent news sources confirm significant EV sales growth",
  "reasoning": "Multiple credible sources report EV market expansion in 2024...",
  "articles": [
    {
      "title": "Global EV Sales Surge to Record High in 2024",
      "description": "Electric vehicle adoption accelerates worldwide...",
      "url": "https://news.example.com/ev-sales-2024",
      "source": "Reuters",
      "publishedAt": "2024-11-28T14:30:00Z"
    }
  ],
  "queries": ["EV sales 2024", "electric vehicle market growth", "EV adoption statistics"],
  "processingTime": 3250
}
```

**Rate Limit Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1732823400000
```

**Error Responses:**
- `400`: Invalid claim (< 10 characters)
- `429`: Rate limit exceeded (10 requests/minute per IP)
- `500`: Server error with diagnostic info

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "services": {
    "server": "operational",
    "gemini": "operational"
  },
  "timestamp": "2024-11-28T14:35:00Z"
}
```

---

## 🧠 How It Works

### Verification Pipeline

```
User Input (Claim)
      ↓
[Rate Limit Check]
      ↓
Gemini 2.0 Flash + Google Search
  ├─ Real-time web search
  ├─ Parse search results
  ├─ Analyze claim against findings
  └─ Generate verdict + confidence
      ↓
Format Response
      ↓
Return Verdict + Articles + Metadata
```

### Step-by-Step Flow

1. **Claim Validation** - Minimum 10 characters required
2. **Rate Limit Check** - Verify IP hasn't exceeded 10 req/min limit
3. **Google Search Integration** - Gemini performs real-time web search
4. **News Analysis** - AI analyzes search results against the claim
5. **Verdict Generation** - Determines verdict type and confidence score
6. **Response Formatting** - Structure results with articles and metadata
7. **Return to Client** - Send verdict, confidence, articles, and search queries

**Response Time**: Typically 2-5 seconds (includes AI analysis + web search)

---

## 🔐 Rate Limiting Strategy

**Three-Tier Architecture:**

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/verify` | 10 | Per minute | Strict - AI intensive |
| Other `/api/*` | 30 | Per minute | Moderate - API calls |
| Global (`/health`) | 100 | Per minute | Permissive - monitoring |

**Rate Limit Exceeded (429):**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

**Powered by**: Upstash Redis with sliding window algorithm

---

## 🧪 Testing

### Using cURL
```bash
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"claim":"The stock market rose 15% in 2024"}'
```

### Health Check
```bash
curl http://localhost:5000/health
```

### Example Test Claims
- "Electric vehicle sales increased by 40% in 2024"
- "AI technology created 2 million new jobs this year"
- "The unemployment rate hit a 50-year low in 2024"
- "Global temperatures reached record highs in 2024"

---

## 🎨 Frontend Components

### Navigation
- DeepAuth branding/header
- Social media links
- Responsive hamburger menu (mobile)

### ClaimInput
- Textarea with character counter
- 10-character minimum requirement
- Example claim buttons (3 on desktop, 1 on mobile)
- Submit button with loading spinner

### ProgressIndicator
- Animated progress bar (0-100%)
- Processing stages: Initializing → Searching → Processing → Extracting → Finalizing
- Time estimation display
- Smooth animations during verification

### AiResponse
- Verdict display with color-coded icon (✓/✗/⚠)
- Circular confidence indicator (SVG)
- Summary section
- Detailed reasoning
- Responsive flex layout (horizontal on desktop, vertical on mobile)

### SearchQueries
- Display AI-generated search queries
- Query chips/pills
- Scrollable container

### Article
- Title (line-clamped)
- Description preview
- Source badge + publication date
- External link icon
- Click-to-open functionality

### Layout
- **Desktop**: 2-column (left: input/response, right: articles)
- **Tablet**: Adjusted grid spacing
- **Mobile**: Single column, stacked layout

---

## 🛠️ Environment Configuration

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini API
GOOGLE_API_KEY=AIzaSy...your_key_here

# Upstash Redis Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Optional: Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

---

## 📦 Key Dependencies

### Backend
- `@google/generative-ai` - Gemini API SDK
- `@upstash/ratelimit` - Rate limiting
- `express` - HTTP framework
- `axios` - HTTP client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `chalk` - Terminal colors
- `cheerio` - HTML parsing
- `nodemon` - Dev auto-reload

### Frontend
- `react` - UI framework
- `react-dom` - React DOM rendering
- `vite` - Build tool
- `tailwindcss` - Utility CSS
- `lucide-react` - Icon library
- `axios` - HTTP client
- `eslint` - Code linting

---

## 🚢 Deployment

### Render (Recommended)

1. Push code to GitHub
2. Connect repository to Render
3. Create Web Service:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add environment variables from `.env`
5. Deploy!

**Live URL**: `https://deepauth-<project>.onrender.com`

### Vercel (Frontend Only)

1. Deploy `client/` folder to Vercel
2. Update `VITE_API_URL` to production backend

### Other Platforms

See `DEPLOYMENT.md` for detailed guides (coming soon).

---

## 📊 Performance Metrics

- **Verification Time**: 2-5 seconds
  - Search execution: <1s
  - AI analysis: 1-3s
  - Response formatting: <500ms
- **Throughput**: 10 requests/minute per IP (rate limited)
- **Uptime SLA**: 99.9% (Upstash + Render)

---

## 🔍 Troubleshooting

### "GOOGLE_API_KEY is not set"
**Solution**: Ensure `backendv2/.env` contains valid API key
```bash
# Get key from: https://aistudio.google.com/apikey
grep GOOGLE_API_KEY backendv2/.env
```

### "Network error. Make sure backend is running"
**Solution**: Verify backend port 5000
```bash
curl http://localhost:5000/health
```

### Rate limit errors (429)
**Solution**: Wait 60 seconds, or check Upstash dashboard for quota

### "Gemini: Connection issue detected"
**Solution**: 
- Verify API key validity
- Check internet connectivity
- Confirm Upstash Redis credentials

### Frontend shows "Failed to verify claim"
**Solution**:
- Check browser console for error details
- Verify backend is running
- Ensure CORS is properly configured

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

---

## 📚 Resources & Documentation

- **Google Gemini API**: https://ai.google.dev/
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Upstash**: https://upstash.com
- **Lucide Icons**: https://lucide.dev

---

## 🔮 Roadmap v2.2+

- [ ] User authentication & saved verifications
- [ ] Verification history with caching
- [ ] Multi-language support
- [ ] Advanced result filtering & sorting
- [ ] PDF/document upload verification
- [ ] API dashboard for key management
- [ ] WebSocket for real-time updates
- [ ] Confidence calibration improvements
- [ ] Integration with fact-checking databases
- [ ] Email result sharing

---

## 📞 Connect

- **GitHub**: [@adriel-babalola](https://github.com/adriel-babalola)
- **LinkedIn**: [adriel-babalola](https://linkedin.com/in/adriel-babalola)
- **Twitter/X**: [@AdrielBaba57136](https://x.com/AdrielBaba57136)

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **AI**: [Google Gemini 2.0 Flash Experimental](https://ai.google.dev/)
- **Web Search**: [Google Search Tool](https://ai.google.dev/)
- **Rate Limiting**: [Upstash Redis](https://upstash.com)
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com) + [Lucide React](https://lucide.dev)
- **Font**: [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3)

---

**Last Updated**: November 2025  
**Current Version**: 2.1.0  
**Status**: ✅ Production Ready  
**Built with ❤️ by Adriel Babalola**

