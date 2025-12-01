import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BRAVE_SEARCH_API_URL = 'https://api.search.brave.com/res/v1/news/search';
const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY;
export const fetchNews = async (queries) => {
  try {
    // Fetch all queries in parallel instead of sequential
    const articlePromises = queries.map(async (query) => {
      try {
        const response = await axios.get(BRAVE_SEARCH_API_URL, {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': BRAVE_API_KEY
          },
          params: {
            q: query,
            count: 10,
            freshness: 'pm',
            text_decorations: false
          }
        });
        

        if (response.data.results) {
          return response.data.results.map(article => ({
            title: article.title,
            description: article.description || article.extra_snippets?.[0] || 'No description available',
            url: article.url,
            source: {
              name: article.meta_url?.hostname || new URL(article.url).hostname
            },
            publishedAt: article.page_age || new Date().toISOString(),
            urlToImage: article.thumbnail?.src || null
          }));
        }
        return [];
      } catch (error) {
        console.error(`Error fetching for query "${query}":`, error.message);
        return [];
      }
    });

    const allArticles = (await Promise.all(articlePromises)).flat();

    // Remove duplicates and filter
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.url, article])).values()
    );

    return uniqueArticles
      .filter(a => a.description && a.title)
      .slice(0, 15);
  } catch (error) {
    console.error('Brave Search API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch news articles');
  }
};