import { createHierarchicalChatSession } from "../services/hierarchicalAI.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * AI Enhancement Controller
 * Handles AI enhancement requests from frontend
 */

/**
 * Enhance text content using AI with hierarchical fallback
 */
export const enhanceContent = async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json(
        new ApiError(400, "Prompt is required for AI enhancement")
      );
    }

    console.log(`🤖 AI Enhancement Request - Type: ${type || 'general'}`);
    console.log(`📝 Prompt length: ${prompt.length} characters`);

    // Use hierarchical AI service with built-in retry and fallback logic
    const chatSession = createHierarchicalChatSession();
    const result = await chatSession.sendMessage(prompt);

    const responseText = result.response.text();
    console.log(`✅ AI Enhancement completed successfully`);

    return res.status(200).json(
      new ApiResponse(200, {
        enhancedContent: responseText,
        type: type || 'general',
        modelUsed: result.modelUsed || 'unknown',
        trialStatus: req.trialStatus || null
      }, "Content enhanced successfully")
    );

  } catch (error) {
    console.error("❌ AI Enhancement failed:", error);
    
    // Provide specific error messages for different failure types
    if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
      return res.status(500).json(
        new ApiError(500, "AI service configuration error. Please contact support.")
      );
    }

    if (error.message.includes("quota") || error.message.includes("rate limit")) {
      return res.status(429).json(
        new ApiError(429, "AI service temporarily unavailable due to high demand. Please try again later.")
      );
    }

    if (error.message.includes("All") && error.message.includes("models failed")) {
      return res.status(503).json(
        new ApiError(503, "AI enhancement service is temporarily unavailable. Please try again later.")
      );
    }

    return res.status(500).json(
      new ApiError(500, "Failed to enhance content with AI", [], error.stack)
    );
  }
};

/**
 * Batch enhance multiple content items
 */
export const batchEnhanceContent = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(
        new ApiError(400, "Items array is required for batch enhancement")
      );
    }

    if (items.length > 10) {
      return res.status(400).json(
        new ApiError(400, "Maximum 10 items allowed per batch request")
      );
    }

    console.log(`🤖 Batch AI Enhancement Request - ${items.length} items`);

    const chatSession = createHierarchicalChatSession();
    const results = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.prompt || !item.prompt.trim()) {
        results.push({
          index: i,
          success: false,
          error: "Empty prompt",
          originalContent: item.originalContent || ""
        });
        continue;
      }

      try {
        const result = await chatSession.sendMessage(item.prompt);
        const responseText = result.response.text();
        
        results.push({
          index: i,
          success: true,
          enhancedContent: responseText,
          type: item.type || 'general',
          originalContent: item.originalContent || ""
        });

        console.log(`✅ Item ${i + 1}/${items.length} enhanced successfully`);

      } catch (error) {
        console.error(`❌ Item ${i + 1}/${items.length} enhancement failed:`, error.message);
        
        results.push({
          index: i,
          success: false,
          error: error.message,
          originalContent: item.originalContent || ""
        });
      }

      // Add small delay between requests to avoid rate limiting
      if (i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`🎉 Batch enhancement completed: ${successCount}/${items.length} successful`);

    return res.status(200).json(
      new ApiResponse(200, {
        results,
        summary: {
          total: items.length,
          successful: successCount,
          failed: items.length - successCount
        },
        trialStatus: req.trialStatus || null
      }, `Batch enhancement completed: ${successCount}/${items.length} items enhanced`)
    );

  } catch (error) {
    console.error("❌ Batch AI Enhancement failed:", error);
    
    return res.status(500).json(
      new ApiError(500, "Failed to process batch enhancement request", [], error.stack)
    );
  }
};

/**
 * Get AI service status
 */
export const getAIStatus = async (req, res) => {
  try {
    // Test AI service availability
    const chatSession = createHierarchicalChatSession();
    const testResult = await chatSession.sendMessage("Test message for service health check");
    
    return res.status(200).json(
      new ApiResponse(200, {
        status: "healthy",
        modelUsed: testResult.modelUsed || 'unknown',
        timestamp: new Date().toISOString()
      }, "AI service is operational")
    );

  } catch (error) {
    console.error("❌ AI Service health check failed:", error);
    
    return res.status(503).json(
      new ApiError(503, "AI service is currently unavailable", [], error.stack)
    );
  }
};
