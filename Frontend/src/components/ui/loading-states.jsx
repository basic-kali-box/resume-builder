import React from 'react';
import { LoaderCircle, Sparkles, Upload, Download, FileText, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced loading spinner with different variants
export const LoadingSpinner = ({ 
  size = "default", 
  variant = "default", 
  className = "",
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5", 
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  const variantClasses = {
    default: "text-blue-600",
    primary: "text-primary",
    white: "text-white",
    muted: "text-gray-400"
  };

  return (
    <LoaderCircle 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

// AI-specific loading indicator
export const AILoadingIndicator = ({ 
  message = "AI is working...", 
  className = "",
  showIcon = true 
}) => {
  return (
    <div className={cn("flex items-center gap-2 text-blue-600", className)}>
      {showIcon && <Sparkles className="h-4 w-4 animate-pulse" />}
      <LoadingSpinner size="sm" variant="default" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Upload progress indicator
export const UploadProgress = ({ 
  progress = 0, 
  message = "Uploading...", 
  className = "" 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-blue-600">
        <Upload className="h-4 w-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-right">{Math.round(progress)}%</div>
    </div>
  );
};

// Enhanced button loading state
export const LoadingButton = ({ 
  loading = false, 
  loadingText = "Loading...", 
  children, 
  icon: Icon,
  loadingIcon: LoadingIcon = LoadingSpinner,
  className = "",
  ...props 
}) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200",
        loading && "cursor-not-allowed opacity-75",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingIcon size="sm" variant="white" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {children}
        </>
      )}
    </button>
  );
};

// Skeleton loading components
export const SkeletonCard = ({ className = "" }) => (
  <div className={cn("animate-pulse", className)}>
    <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={cn("animate-pulse space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className={cn(
          "bg-gray-200 rounded h-4",
          i === lines - 1 ? "w-2/3" : "w-full"
        )}
      />
    ))}
  </div>
);

// Processing states for different operations
export const ProcessingState = ({ 
  type = "default", 
  message, 
  progress,
  className = "" 
}) => {
  const configs = {
    ai: {
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      defaultMessage: "AI is processing your request..."
    },
    upload: {
      icon: Upload,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      defaultMessage: "Uploading file..."
    },
    download: {
      icon: Download,
      color: "text-green-600",
      bgColor: "bg-green-50", 
      borderColor: "border-green-200",
      defaultMessage: "Preparing download..."
    },
    processing: {
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200", 
      defaultMessage: "Processing..."
    }
  };

  const config = configs[type] || configs.default;
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("flex-shrink-0", config.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium", config.color)}>
            {message || config.defaultMessage}
          </p>
          {progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className={cn("h-2 rounded-full transition-all duration-300", 
                    config.color.replace('text-', 'bg-')
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <LoadingSpinner size="sm" className={config.color} />
      </div>
    </div>
  );
};
