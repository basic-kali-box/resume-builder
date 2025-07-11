import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info, Sparkles, Crown, Upload, Download } from 'lucide-react';

// Enhanced toast configurations
const toastConfigs = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50',
    iconColor: 'text-green-600'
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50',
    iconColor: 'text-red-600'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50',
    iconColor: 'text-blue-600'
  },
  ai: {
    icon: Sparkles,
    className: 'border-purple-200 bg-purple-50',
    iconColor: 'text-purple-600'
  },
  premium: {
    icon: Crown,
    className: 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-600'
  }
};

// Enhanced toast function
export const enhancedToast = (message, type = 'info', options = {}) => {
  const config = toastConfigs[type] || toastConfigs.info;
  const Icon = config.icon;

  const toastOptions = {
    duration: type === 'error' ? 6000 : 4000,
    className: `${config.className} border`,
    description: options.description,
    action: options.action,
    ...options
  };

  const content = (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{message}</div>
        {options.description && (
          <div className="text-sm text-gray-600 mt-1">{options.description}</div>
        )}
      </div>
    </div>
  );

  return toast.custom(content, toastOptions);
};

// Specialized toast functions
export const aiToast = {
  success: (message, options = {}) => enhancedToast(message, 'ai', {
    description: 'AI enhancement completed successfully',
    ...options
  }),
  
  error: (message, options = {}) => enhancedToast(message, 'error', {
    description: 'AI processing failed. Please try again.',
    ...options
  }),
  
  processing: (message = 'AI is working on your request...', options = {}) => enhancedToast(message, 'ai', {
    description: 'This may take a few moments',
    duration: 8000,
    ...options
  }),
  
  trialExhausted: (options = {}) => enhancedToast('AI Trials Exhausted', 'premium', {
    description: 'Upgrade to Premium for unlimited AI features',
    action: {
      label: 'Upgrade Now',
      onClick: () => window.location.href = '/pricing'
    },
    duration: 8000,
    ...options
  })
};

export const uploadToast = {
  progress: (progress, message = 'Uploading...') => {
    const progressBar = (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{message}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    );

    return toast.custom(
      <div className="flex items-start gap-3">
        <Upload className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
        <div className="flex-1">
          <div className="font-medium text-gray-900">File Upload</div>
          {progressBar}
        </div>
      </div>,
      {
        duration: Infinity,
        className: 'border-blue-200 bg-blue-50 border'
      }
    );
  },

  success: (message = 'File uploaded successfully!', options = {}) => enhancedToast(message, 'success', {
    description: 'Your file has been processed',
    ...options
  }),

  error: (message = 'Upload failed', options = {}) => enhancedToast(message, 'error', {
    description: 'Please check your file and try again',
    ...options
  })
};

export const resumeToast = {
  saved: (options = {}) => enhancedToast('Resume Saved', 'success', {
    description: 'Your changes have been saved successfully',
    ...options
  }),
  
  created: (options = {}) => enhancedToast('Resume Created', 'success', {
    description: 'Your new resume is ready for editing',
    ...options
  }),
  
  deleted: (options = {}) => enhancedToast('Resume Deleted', 'info', {
    description: 'Resume has been permanently removed',
    ...options
  }),
  
  exported: (format = 'PDF', options = {}) => enhancedToast(`Resume Exported as ${format}`, 'success', {
    description: 'Download will start automatically',
    ...options
  })
};

// Form validation toasts
export const validationToast = {
  required: (fieldName) => enhancedToast(`${fieldName} is required`, 'warning', {
    description: 'Please fill in this field to continue'
  }),
  
  invalid: (fieldName, reason) => enhancedToast(`Invalid ${fieldName}`, 'error', {
    description: reason || 'Please check the format and try again'
  }),
  
  success: (message = 'Form submitted successfully') => enhancedToast(message, 'success')
};

// Network and API toasts
export const networkToast = {
  offline: () => enhancedToast('Connection Lost', 'error', {
    description: 'Please check your internet connection',
    duration: 8000
  }),
  
  online: () => enhancedToast('Connection Restored', 'success', {
    description: 'You are back online'
  }),
  
  timeout: () => enhancedToast('Request Timeout', 'error', {
    description: 'The request took too long. Please try again.',
    action: {
      label: 'Retry',
      onClick: () => window.location.reload()
    }
  }),
  
  serverError: () => enhancedToast('Server Error', 'error', {
    description: 'Something went wrong on our end. Please try again later.',
    duration: 8000
  })
};

// Export the main enhanced toast function as default
export default enhancedToast;
