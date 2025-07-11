/**
 * AI Models Configuration
 * Centralized configuration for hierarchical fallback system
 */

export const AI_MODELS = {
  // Primary Model - Latest experimental version
  GEMINI_2_0_FLASH_EXP: {
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
    priority: 1,
    enabled: true,
    config: {
      temperature: 0.3,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
  },

  // Secondary - Current stable version
  GEMINI_1_5_FLASH: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    priority: 2,
    enabled: true,
    config: {
      temperature: 0.3,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
  },

  // Tertiary - More capable but slower
  GEMINI_1_5_PRO: {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    priority: 3,
    enabled: true,
    config: {
      temperature: 0.3,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
  },

  // Quaternary - Legacy stable version
  GEMINI_1_0_PRO: {
    provider: 'gemini',
    model: 'gemini-1.0-pro',
    priority: 4,
    enabled: true,
    config: {
      temperature: 0.3,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    }
  },

  // Final Fallback - Groq API
  GROQ_LLAMA_3_1_70B: {
    provider: 'groq',
    model: 'llama-3.1-70b-versatile',
    priority: 5,
    enabled: true,
    config: {
      temperature: 0.3,
      max_tokens: 8192,
      top_p: 0.95,
    }
  }
};

/**
 * Error conditions that trigger fallback to next model
 */
export const FALLBACK_ERROR_CONDITIONS = [
  // API Key issues
  'API key not valid',
  'API_KEY_INVALID',
  'invalid_api_key',
  'unauthorized',
  
  // Rate limiting
  'rate limit',
  'rate_limit_exceeded',
  'quota exceeded',
  'RATE_LIMIT_EXCEEDED',
  'QUOTA_EXCEEDED',
  
  // Service availability
  'service unavailable',
  'temporarily unavailable',
  'overloaded',
  'model not available',
  'MODEL_NOT_AVAILABLE',
  
  // Network issues
  'network error',
  'timeout',
  'connection refused',
  'ECONNREFUSED',
  'ETIMEDOUT',
  
  // Response format issues
  'invalid response format',
  'malformed response',
  'unexpected response',
];

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Get ordered list of enabled models for fallback chain
 */
export const getEnabledModels = () => {
  return Object.values(AI_MODELS)
    .filter(model => model.enabled)
    .sort((a, b) => a.priority - b.priority);
};

/**
 * Check if error should trigger fallback to next model
 */
export const shouldFallback = (error) => {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorStatus = error.status || error.code;
  
  // Check for specific error conditions
  const hasErrorCondition = FALLBACK_ERROR_CONDITIONS.some(condition => 
    errorMessage.includes(condition.toLowerCase())
  );
  
  // Check for specific HTTP status codes
  const hasErrorStatus = [
    429, // Too Many Requests
    503, // Service Unavailable
    502, // Bad Gateway
    504, // Gateway Timeout
    401, // Unauthorized
    403, // Forbidden
  ].includes(errorStatus);
  
  return hasErrorCondition || hasErrorStatus;
};

/**
 * Calculate delay for exponential backoff
 */
export const calculateBackoffDelay = (attempt) => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

/**
 * Sleep utility for delays
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
