import { VITE_APP_URL } from "../config/config";

/**
 * Backend AI Service
 * Uses backend API for AI enhancement instead of direct Gemini calls
 * This is the secure, production-ready approach
 */

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production, always use the current domain (same origin)
  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  // In development, use VITE_APP_URL if available, otherwise current domain
  return VITE_APP_URL || window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Make authenticated API request to backend
 */
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api/ai${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Enhance single content using backend AI service
 */
export const enhanceContentViaBackend = async (prompt, type = 'general') => {
  try {
    console.log(`🚀 Backend AI Enhancement Request - Type: ${type}`);
    
    const response = await makeAuthenticatedRequest('/enhance', {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        type
      })
    });

    if (response.success && response.data) {
      console.log(`✅ Backend AI Enhancement successful`);
      return {
        response: {
          text: () => response.data.enhancedContent
        },
        modelUsed: response.data.modelUsed,
        trialStatus: response.data.trialStatus
      };
    } else {
      throw new Error(response.message || 'Enhancement failed');
    }

  } catch (error) {
    console.error(`❌ Backend AI Enhancement failed:`, error);
    throw error;
  }
};

/**
 * Batch enhance multiple content items using backend AI service
 */
export const batchEnhanceContentViaBackend = async (items) => {
  try {
    console.log(`🚀 Backend Batch AI Enhancement Request - ${items.length} items`);
    
    const response = await makeAuthenticatedRequest('/batch-enhance', {
      method: 'POST',
      body: JSON.stringify({ items })
    });

    if (response.success && response.data) {
      console.log(`✅ Backend Batch AI Enhancement successful: ${response.data.summary.successful}/${response.data.summary.total}`);
      return response.data.results;
    } else {
      throw new Error(response.message || 'Batch enhancement failed');
    }

  } catch (error) {
    console.error(`❌ Backend Batch AI Enhancement failed:`, error);
    throw error;
  }
};

/**
 * Check AI service status
 */
export const checkAIServiceStatus = async () => {
  try {
    const response = await makeAuthenticatedRequest('/status');
    
    if (response.success && response.data) {
      return {
        status: response.data.status,
        modelUsed: response.data.modelUsed,
        timestamp: response.data.timestamp
      };
    } else {
      throw new Error(response.message || 'Status check failed');
    }

  } catch (error) {
    console.error(`❌ AI Service status check failed:`, error);
    throw error;
  }
};

/**
 * Backend AI Chat Session - Compatible with existing frontend code
 * This replaces the direct Gemini API calls with backend API calls
 */
export const BackendAIChatSession = {
  sendMessage: async (prompt, type = 'general') => {
    return await enhanceContentViaBackend(prompt, type);
  }
};

/**
 * Error handling utilities
 */
export const isRetryableError = (error) => {
  const retryableErrors = [
    'network error',
    'timeout',
    'temporarily unavailable',
    'rate limit',
    'service unavailable'
  ];
  
  const errorMessage = error.message?.toLowerCase() || '';
  return retryableErrors.some(condition => errorMessage.includes(condition));
};

export const getErrorMessage = (error) => {
  if (error.message?.includes('AI service temporarily unavailable')) {
    return 'AI enhancement is temporarily unavailable due to high demand. Please try again in a few moments.';
  }
  
  if (error.message?.includes('configuration error')) {
    return 'AI service configuration issue. Please contact support.';
  }
  
  if (error.message?.includes('User not authenticated')) {
    return 'Please log in to use AI enhancement features.';
  }
  
  return error.message || 'AI enhancement failed. Please try again.';
};
