// AI Service for GPT-4o integration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

/**
 * Send a query to GPT-4o through our backend
 * @param {string} query - User query
 * @param {Array} context - Previous conversation context
 * @returns {Promise<string>} - AI response
 */
export async function askAI(query, context = []) {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...context,
      { role: 'user', content: query }
    ];

    const response = await fetch(`${BACKEND_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error querying AI:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
} 