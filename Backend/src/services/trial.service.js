import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Trial Management Service
 * Handles all trial-related operations for the AI Resume Builder
 */

/**
 * Get trial status for a user
 * @param {string} userId - User ID
 * @returns {Object} Trial status information
 */
export const getTrialStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const remainingTrials = Math.max(0, user.trialsLimit - user.trialsUsed);
    const hasTrialsRemaining = remainingTrials > 0;

    return {
      trialsUsed: user.trialsUsed,
      trialsLimit: user.trialsLimit,
      remainingTrials,
      hasTrialsRemaining,
      trialResetDate: user.trialResetDate
    };
  } catch (error) {
    console.error("Error getting trial status:", error);
    throw error;
  }
};

/**
 * Check if user has trials remaining
 * @param {string} userId - User ID
 * @returns {boolean} True if user has trials remaining
 */
export const hasTrialsRemaining = async (userId) => {
  try {
    const trialStatus = await getTrialStatus(userId);
    return trialStatus.hasTrialsRemaining;
  } catch (error) {
    console.error("Error checking trial availability:", error);
    throw error;
  }
};

/**
 * Consume a trial for a user
 * @param {string} userId - User ID
 * @param {string} operation - Description of the operation consuming the trial
 * @returns {Object} Updated trial status
 */
export const consumeTrial = async (userId, operation = "AI operation") => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if user has trials remaining
    const remainingTrials = Math.max(0, user.trialsLimit - user.trialsUsed);
    
    if (remainingTrials <= 0) {
      throw new ApiError(403, "No trials remaining. Please upgrade your account to continue using AI features.");
    }

    // Increment trials used
    user.trialsUsed += 1;
    await user.save();

    console.log(`🔥 Trial consumed for user ${userId}: ${operation} (${user.trialsUsed}/${user.trialsLimit})`);

    // Return updated trial status
    return await getTrialStatus(userId);
  } catch (error) {
    console.error("Error consuming trial:", error);
    throw error;
  }
};

/**
 * Reset trials for a user (admin function)
 * @param {string} userId - User ID
 * @param {number} newLimit - New trial limit (optional)
 * @returns {Object} Updated trial status
 */
export const resetTrials = async (userId, newLimit = null) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.trialsUsed = 0;
    if (newLimit !== null) {
      user.trialsLimit = Math.max(0, newLimit);
    }
    user.trialResetDate = new Date();
    
    await user.save();

    console.log(`🔄 Trials reset for user ${userId}: ${user.trialsUsed}/${user.trialsLimit}`);

    return await getTrialStatus(userId);
  } catch (error) {
    console.error("Error resetting trials:", error);
    throw error;
  }
};

/**
 * Update trial limit for a user (admin function)
 * @param {string} userId - User ID
 * @param {number} newLimit - New trial limit
 * @returns {Object} Updated trial status
 */
export const updateTrialLimit = async (userId, newLimit) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.trialsLimit = Math.max(0, newLimit);
    await user.save();

    console.log(`📊 Trial limit updated for user ${userId}: ${user.trialsUsed}/${user.trialsLimit}`);

    return await getTrialStatus(userId);
  } catch (error) {
    console.error("Error updating trial limit:", error);
    throw error;
  }
};

/**
 * Get trial statistics (for admin dashboard)
 * @returns {Object} Trial usage statistics
 */
export const getTrialStatistics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const usersWithTrialsRemaining = await User.countDocuments({
      $expr: { $lt: ["$trialsUsed", "$trialsLimit"] }
    });
    const usersExhausted = await User.countDocuments({
      $expr: { $gte: ["$trialsUsed", "$trialsLimit"] }
    });

    const avgTrialsUsed = await User.aggregate([
      {
        $group: {
          _id: null,
          avgTrialsUsed: { $avg: "$trialsUsed" },
          totalTrialsUsed: { $sum: "$trialsUsed" }
        }
      }
    ]);

    return {
      totalUsers,
      usersWithTrialsRemaining,
      usersExhausted,
      avgTrialsUsed: avgTrialsUsed[0]?.avgTrialsUsed || 0,
      totalTrialsUsed: avgTrialsUsed[0]?.totalTrialsUsed || 0
    };
  } catch (error) {
    console.error("Error getting trial statistics:", error);
    throw error;
  }
};
