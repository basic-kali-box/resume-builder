/**
 * Groq AI Service
 * Handles Groq API integration for fallback AI operations
 */

import Groq from 'groq-sdk';

let groqClient = null;

/**
 * Initialize Groq client with lazy loading
 */
const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    
    console.log("Initializing Groq AI with API key:", `${process.env.GROQ_API_KEY.substring(0, 10)}...`);
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
};

/**
 * Send message to Groq API
 * @param {string} prompt - The prompt to send
 * @param {Object} config - Model configuration
 * @param {string} modelName - Model name to use
 * @returns {Promise<Object>} - Response object with text() method
 */
export const sendGroqMessage = async (prompt, config, modelName) => {
  try {
    const client = getGroqClient();
    
    console.log(`Sending request to Groq model: ${modelName}`);
    
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: modelName,
      temperature: config.temperature || 0.3,
      max_tokens: config.max_tokens || 8192,
      top_p: config.top_p || 0.95,
      stream: false,
    });

    // Return response in format compatible with Gemini API
    return {
      response: {
        text: () => completion.choices[0]?.message?.content || '',
      },
    };
  } catch (error) {
    console.error(`Groq API error with model ${modelName}:`, error);
    
    // Standardize error format
    const standardError = new Error(error.message || 'Groq API request failed');
    standardError.status = error.status || error.code;
    standardError.provider = 'groq';
    standardError.model = modelName;
    
    throw standardError;
  }
};

/**
 * Create a chat session compatible with Gemini API format
 * @param {Object} config - Generation configuration
 * @param {string} modelName - Model name to use
 * @returns {Object} - Chat session object
 */
export const createGroqChatSession = (config, modelName) => {
  return {
    sendMessage: async (prompt) => {
      return await sendGroqMessage(prompt, config, modelName);
    },
  };
};

/**
 * Check if Groq API is available
 * @returns {Promise<boolean>} - True if API is available
 */
export const isGroqAvailable = async () => {
  try {
    const client = getGroqClient();
    
    // Simple test request
    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: "test" }],
      model: "llama-3.1-70b-versatile",
      max_tokens: 1,
    });
    
    return true;
  } catch (error) {
    console.warn("Groq API availability check failed:", error.message);
    return false;
  }
};
