import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getEnabledModels,
  shouldFallback,
  calculateBackoffDelay,
  sleep,
  RETRY_CONFIG
} from "../config/aiModels.config.js";

// Lazy initialization of Gemini AI
let genAI = null;
let geminiModels = new Map();

/**
 * Initialize Gemini AI client
 */
const getGeminiClient = () => {
  if (!genAI) {
    if (!GEMENI_API_KEY) {
      throw new Error("GEMENI_API_KEY is not set");
    }

    console.log("Initializing Gemini AI with API key:", `${GEMENI_API_KEY.substring(0, 10)}...`);
    genAI = new GoogleGenerativeAI(GEMENI_API_KEY);
  }
  return genAI;
};

/**
 * Get or create Gemini model instance
 */
const getGeminiModel = (modelName) => {
  if (!geminiModels.has(modelName)) {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: modelName });
    geminiModels.set(modelName, model);
  }
  return geminiModels.get(modelName);
};

/**
 * Create chat session for a specific model
 */
const createChatSession = (modelConfig) => {
  if (modelConfig.provider === 'gemini') {
    const model = getGeminiModel(modelConfig.model);
    return model.startChat({
      generationConfig: modelConfig.config,
      history: [],
    });
  } else {
    throw new Error(`Unsupported AI provider in frontend: ${modelConfig.provider}`);
  }
};

/**
 * Send message with retry logic for a single model
 */
const sendMessageWithRetry = async (chatSession, prompt, modelConfig, maxRetries = RETRY_CONFIG.maxRetries) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempting ${modelConfig.provider}:${modelConfig.model} (attempt ${attempt + 1}/${maxRetries})`);

      const result = await chatSession.sendMessage(prompt);

      console.log(`✅ Success with ${modelConfig.provider}:${modelConfig.model}`);
      return {
        result,
        modelUsed: modelConfig,
        attempt: attempt + 1,
      };
    } catch (error) {
      lastError = error;
      console.warn(`❌ ${modelConfig.provider}:${modelConfig.model} failed (attempt ${attempt + 1}):`, error.message);

      // If this is the last attempt, don't wait
      if (attempt < maxRetries - 1) {
        const delay = calculateBackoffDelay(attempt);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed
  throw lastError;
};

/**
 * Send message with hierarchical fallback system (frontend - Gemini only)
 */
const sendMessageWithFallback = async (prompt) => {
  const enabledModels = getEnabledModels().filter(model => model.provider === 'gemini');

  if (enabledModels.length === 0) {
    throw new Error("No Gemini models are enabled in the frontend configuration");
  }

  console.log(`🚀 Starting frontend AI request with ${enabledModels.length} Gemini models in fallback chain`);

  let lastError = null;

  for (const modelConfig of enabledModels) {
    try {
      console.log(`🔄 Trying ${modelConfig.provider}:${modelConfig.model} (priority ${modelConfig.priority})`);

      const chatSession = createChatSession(modelConfig);
      const result = await sendMessageWithRetry(chatSession, prompt, modelConfig);

      console.log(`🎉 Successfully completed request with ${result.modelUsed.provider}:${result.modelUsed.model}`);
      return result;

    } catch (error) {
      lastError = error;
      console.error(`💥 ${modelConfig.provider}:${modelConfig.model} failed completely:`, error.message);

      // Check if we should try the next model
      if (shouldFallback(error)) {
        console.log(`🔄 Error condition met, falling back to next model...`);
        continue;
      } else {
        console.log(`🛑 Non-fallback error, stopping chain:`, error.message);
        break;
      }
    }
  }

  // All models failed
  console.error("💀 All Gemini models in the fallback chain have failed");
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Create a hierarchical chat session for frontend use
 */
export const AIChatSession = {
  sendMessage: async (prompt) => {
    const result = await sendMessageWithFallback(prompt);
    return result.result;
  },
};
