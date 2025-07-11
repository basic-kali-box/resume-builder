import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// Trial API service
const trialAPI = {
  getStatus: async () => {
    try {
      const baseURL = import.meta.env.PROD ? '/api/' : (import.meta.env.VITE_APP_URL || 'http://localhost:5001/') + 'api/';
      
      const response = await fetch(`${baseURL}trials/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trial status:', error);
      throw error;
    }
  }
};

// Create Trial Context
const TrialContext = createContext();

// Trial Context Provider
export const TrialProvider = ({ children }) => {
  const [trialStatus, setTrialStatus] = useState({
    trialsUsed: 0,
    trialsLimit: 2,
    remainingTrials: 2,
    hasTrialsRemaining: true,
    trialResetDate: null,
    loading: true,
    error: null
  });

  const user = useSelector((state) => state.editUser.userData);

  // Fetch trial status when user is available
  const fetchTrialStatus = async () => {
    if (!user) {
      setTrialStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setTrialStatus(prev => ({ ...prev, loading: true, error: null }));
      const response = await trialAPI.getStatus();
      
      if (response.success && response.data) {
        setTrialStatus({
          ...response.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.message || 'Failed to fetch trial status');
      }
    } catch (error) {
      console.error('Error fetching trial status:', error);
      setTrialStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Update trial status from API response
  const updateTrialStatusFromResponse = (responseData) => {
    if (responseData && responseData.trialStatus) {
      setTrialStatus(prev => ({
        ...prev,
        ...responseData.trialStatus,
        loading: false,
        error: null
      }));
    }
  };

  // Check if user can perform AI operations
  const canUseAI = () => {
    return trialStatus.hasTrialsRemaining && !trialStatus.loading;
  };

  // Get trial warning message based on remaining trials
  const getTrialWarning = () => {
    const remaining = trialStatus.remainingTrials;
    
    if (remaining === 0) {
      return {
        type: 'error',
        message: 'No trials remaining. Please upgrade to continue using AI features.'
      };
    } else if (remaining === 1) {
      return {
        type: 'warning',
        message: 'Only 1 trial remaining. Consider upgrading soon.'
      };
    } else if (remaining === 2) {
      return {
        type: 'info',
        message: `You have ${remaining} AI enhancement trials remaining.`
      };
    }
    
    return null;
  };

  // Handle trial exhaustion
  const handleTrialExhaustion = () => {
    toast.error('Trial limit exceeded! Please upgrade your account to continue using AI features.', {
      duration: 5000,
      action: {
        label: 'Learn More',
        onClick: () => {
          // Could open upgrade modal or redirect to pricing page
          console.log('Upgrade action clicked');
        }
      }
    });
  };

  // Show trial warning toast
  const showTrialWarning = () => {
    const warning = getTrialWarning();
    if (warning) {
      const toastFunction = warning.type === 'error' ? toast.error : 
                           warning.type === 'warning' ? toast.warning : toast.info;
      
      toastFunction(warning.message, {
        duration: warning.type === 'error' ? 5000 : 3000
      });
    }
  };

  // Refresh trial status
  const refreshTrialStatus = () => {
    fetchTrialStatus();
  };

  // Effect to fetch trial status when user changes
  useEffect(() => {
    fetchTrialStatus();
  }, [user]);

  // Context value
  const contextValue = {
    trialStatus,
    fetchTrialStatus,
    updateTrialStatusFromResponse,
    canUseAI,
    getTrialWarning,
    handleTrialExhaustion,
    showTrialWarning,
    refreshTrialStatus
  };

  return (
    <TrialContext.Provider value={contextValue}>
      {children}
    </TrialContext.Provider>
  );
};

// Custom hook to use trial context
export const useTrial = () => {
  const context = useContext(TrialContext);
  
  if (!context) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  
  return context;
};

// HOC to wrap components that need trial context
export const withTrial = (Component) => {
  return function WrappedComponent(props) {
    return (
      <TrialProvider>
        <Component {...props} />
      </TrialProvider>
    );
  };
};
