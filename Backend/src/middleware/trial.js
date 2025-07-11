import { hasTrialsRemaining, getTrialStatus } from "../services/trial.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Trial Validation Middleware
 * Checks if user has trials remaining before allowing AI-powered operations
 */

/**
 * Middleware to check if user has trials remaining
 * Should be used after isUserAvailable middleware
 */
export const checkTrialLimit = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User authentication required"));
    }

    const userId = req.user._id;
    
    // Check if user has trials remaining
    const hasTrials = await hasTrialsRemaining(userId);
    
    if (!hasTrials) {
      // Get detailed trial status for response
      const trialStatus = await getTrialStatus(userId);
      
      console.log(`🚫 Trial limit exceeded for user ${userId}: ${trialStatus.trialsUsed}/${trialStatus.trialsLimit}`);
      
      return res.status(403).json(
        new ApiError(
          403, 
          "Trial limit exceeded. You have used all your free AI enhancements. Please upgrade your account to continue.",
          {
            code: "TRIAL_LIMIT_EXCEEDED",
            trialStatus: {
              trialsUsed: trialStatus.trialsUsed,
              trialsLimit: trialStatus.trialsLimit,
              remainingTrials: trialStatus.remainingTrials
            }
          }
        )
      );
    }

    // User has trials remaining, proceed to next middleware
    console.log(`✅ Trial check passed for user ${userId}`);
    next();
    
  } catch (error) {
    console.error("Error in trial validation middleware:", error);
    return res.status(500).json(
      new ApiError(500, "Internal server error during trial validation", [], error.stack)
    );
  }
};

/**
 * Middleware to check trial limit and attach trial status to request
 * Useful for endpoints that need trial information but don't consume trials
 */
export const attachTrialStatus = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User authentication required"));
    }

    const userId = req.user._id;
    
    // Get trial status and attach to request
    const trialStatus = await getTrialStatus(userId);
    req.trialStatus = trialStatus;
    
    console.log(`📊 Trial status attached for user ${userId}: ${trialStatus.trialsUsed}/${trialStatus.trialsLimit}`);
    
    next();
    
  } catch (error) {
    console.error("Error attaching trial status:", error);
    return res.status(500).json(
      new ApiError(500, "Internal server error during trial status check", [], error.stack)
    );
  }
};

/**
 * Middleware for operations that consume trials
 * Checks trial limit and consumes a trial if available
 */
export const consumeTrialMiddleware = (operationName = "AI operation") => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json(new ApiError(401, "User authentication required"));
      }

      const userId = req.user._id;
      
      // Import consumeTrial here to avoid circular dependency
      const { consumeTrial } = await import("../services/trial.service.js");
      
      // Check and consume trial
      const updatedTrialStatus = await consumeTrial(userId, operationName);
      
      // Attach updated trial status to request for use in response
      req.trialStatus = updatedTrialStatus;
      
      console.log(`🔥 Trial consumed for user ${userId}: ${operationName} (${updatedTrialStatus.trialsUsed}/${updatedTrialStatus.trialsLimit})`);
      
      next();
      
    } catch (error) {
      console.error("Error in consume trial middleware:", error);
      
      // Handle specific trial exhaustion error
      if (error.statusCode === 403) {
        return res.status(403).json(
          new ApiError(
            403,
            error.message,
            {
              code: "TRIAL_LIMIT_EXCEEDED",
              operation: operationName
            }
          )
        );
      }
      
      return res.status(500).json(
        new ApiError(500, "Internal server error during trial consumption", [], error.stack)
      );
    }
  };
};
