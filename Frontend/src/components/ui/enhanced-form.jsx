import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced Input with validation
export const ValidatedInput = ({ 
  label, 
  error, 
  success, 
  hint, 
  required = false,
  className = "",
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          className={cn(
            "transition-all duration-200",
            hasError && "border-red-300 focus:border-red-500 focus:ring-red-500",
            hasSuccess && "border-green-300 focus:border-green-500 focus:ring-green-500",
            focused && !hasError && !hasSuccess && "border-blue-300 focus:border-blue-500"
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {/* Status Icon */}
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Feedback Messages */}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <XCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          {success}
        </div>
      )}
      
      {hint && !error && !success && (
        <div className="text-sm text-gray-500">{hint}</div>
      )}
    </div>
  );
};

// Enhanced Textarea with validation
export const ValidatedTextarea = ({ 
  label, 
  error, 
  success, 
  hint, 
  required = false,
  maxLength,
  showCount = false,
  className = "",
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(props.value || props.defaultValue || '');
  
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;
  
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);
  
  const handleChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          {showCount && maxLength && (
            <span className={cn(
              "text-xs",
              isOverLimit ? "text-red-500" : isNearLimit ? "text-yellow-600" : "text-gray-400"
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <Textarea
          className={cn(
            "transition-all duration-200 resize-none",
            hasError && "border-red-300 focus:border-red-500 focus:ring-red-500",
            hasSuccess && "border-green-300 focus:border-green-500 focus:ring-green-500",
            focused && !hasError && !hasSuccess && "border-blue-300 focus:border-blue-500",
            isOverLimit && "border-red-300"
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        
        {/* Status Icon */}
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-3">
            {hasError ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Feedback Messages */}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <XCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          {success}
        </div>
      )}
      
      {hint && !error && !success && (
        <div className="text-sm text-gray-500">{hint}</div>
      )}
      
      {isOverLimit && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertTriangle className="h-3 w-3" />
          Character limit exceeded
        </div>
      )}
    </div>
  );
};

// Password Input with visibility toggle
export const PasswordInput = ({ 
  label = "Password", 
  error, 
  success, 
  hint, 
  required = false,
  showStrength = false,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(props.value || '');
  
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];
    
    return { score, ...levels[score] };
  };
  
  const strength = showStrength ? getPasswordStrength(password) : null;
  
  const handleChange = (e) => {
    setPassword(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            "pr-10 transition-all duration-200",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            success && "border-green-300 focus:border-green-500 focus:ring-green-500"
          )}
          onChange={handleChange}
          value={password}
          {...props}
        />
        
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrength && password && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  level <= strength.score ? strength.color : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <div className="text-xs text-gray-600">
            Strength: <span className="font-medium">{strength.label}</span>
          </div>
        </div>
      )}
      
      {/* Feedback Messages */}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <XCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          {success}
        </div>
      )}
      
      {hint && !error && !success && (
        <div className="text-sm text-gray-500">{hint}</div>
      )}
    </div>
  );
};
