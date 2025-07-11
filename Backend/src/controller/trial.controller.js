import { 
  getTrialStatus, 
  resetTrials, 
  updateTrialLimit, 
  getTrialStatistics 
} from "../services/trial.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Trial Management Controller
 * Handles trial-related API endpoints
 */

/**
 * Get current trial status for authenticated user
 */
export const getCurrentTrialStatus = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User authentication required"));
    }

    const userId = req.user._id;
    const trialStatus = await getTrialStatus(userId);

    console.log(`📊 Trial status requested for user ${userId}: ${trialStatus.trialsUsed}/${trialStatus.trialsLimit}`);

    return res.status(200).json(
      new ApiResponse(200, trialStatus, "Trial status retrieved successfully")
    );

  } catch (error) {
    console.error("Error getting trial status:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to retrieve trial status", [], error.stack)
    );
  }
};

/**
 * Reset trials for current user (admin function)
 */
export const resetUserTrials = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User authentication required"));
    }

    const userId = req.user._id;
    const { newLimit } = req.body;

    const updatedTrialStatus = await resetTrials(userId, newLimit);

    console.log(`🔄 Trials reset for user ${userId}: ${updatedTrialStatus.trialsUsed}/${updatedTrialStatus.trialsLimit}`);

    return res.status(200).json(
      new ApiResponse(200, updatedTrialStatus, "Trials reset successfully")
    );

  } catch (error) {
    console.error("Error resetting trials:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to reset trials", [], error.stack)
    );
  }
};

/**
 * Update trial limit for current user (admin function)
 */
export const updateUserTrialLimit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "User authentication required"));
    }

    const userId = req.user._id;
    const { newLimit } = req.body;

    if (typeof newLimit !== 'number' || newLimit < 0) {
      return res.status(400).json(new ApiError(400, "Invalid trial limit. Must be a non-negative number."));
    }

    const updatedTrialStatus = await updateTrialLimit(userId, newLimit);

    console.log(`📊 Trial limit updated for user ${userId}: ${updatedTrialStatus.trialsUsed}/${updatedTrialStatus.trialsLimit}`);

    return res.status(200).json(
      new ApiResponse(200, updatedTrialStatus, "Trial limit updated successfully")
    );

  } catch (error) {
    console.error("Error updating trial limit:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to update trial limit", [], error.stack)
    );
  }
};

/**
 * Get trial statistics (admin function)
 */
export const getTrialStats = async (req, res) => {
  try {
    const statistics = await getTrialStatistics();

    console.log(`📈 Trial statistics requested`);

    return res.status(200).json(
      new ApiResponse(200, statistics, "Trial statistics retrieved successfully")
    );

  } catch (error) {
    console.error("Error getting trial statistics:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to retrieve trial statistics", [], error.stack)
    );
  }
};
