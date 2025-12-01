
import axios from 'axios';

// Get API base URL from Vite environment variables
// Falls back to auto-detection if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (() => {
  // Fallback: Auto-detect based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/api';
})();

console.log(`🔗 API Base URL: ${API_BASE_URL}`);

export const verifyClaim = async (claim) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, { claim });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error.response?.data || { error: 'Network error. Make sure backend is running.' };
  }
};
