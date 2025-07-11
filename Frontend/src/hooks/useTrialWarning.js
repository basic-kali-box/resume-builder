import { useState, useCallback } from 'react';
import { useTrial } from '@/context/TrialContext';

export const useTrialWarning = () => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const { trialStatus } = useTrial();

  // Check if user has trials remaining
  const hasTrialsRemaining = trialStatus.remainingTrials > 0;

  // Show warning popup if no trials remaining
  const checkTrialsAndWarn = useCallback(() => {
    if (!hasTrialsRemaining) {
      setIsWarningOpen(true);
      return false; // Prevent action
    }
    return true; // Allow action
  }, [hasTrialsRemaining]);

  // Close warning popup
  const closeWarning = useCallback(() => {
    setIsWarningOpen(false);
  }, []);

  // Force show warning (for testing or manual triggers)
  const showWarning = useCallback(() => {
    setIsWarningOpen(true);
  }, []);

  return {
    isWarningOpen,
    hasTrialsRemaining,
    checkTrialsAndWarn,
    closeWarning,
    showWarning,
    trialStatus
  };
};
