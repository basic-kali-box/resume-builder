import React from 'react';
import { useTrial } from '@/context/TrialContext';
import { FaRocket, FaStar, FaInfoCircle, FaSpinner, FaCrown, FaCheckCircle, FaGem } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TrialCounter = ({
  showDetails = true,
  compact = false,
  className = "",
  onUpgradeClick = null
}) => {
  const { trialStatus, getTrialWarning } = useTrial();
  const navigate = useNavigate();

  const handleUpgradeClick = onUpgradeClick || (() => navigate('/pricing'));

  if (trialStatus.loading) {
    return (
      <div className={`dashboard-card animate-pulse ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (trialStatus.error) {
    return (
      <div className={`dashboard-card border-gray-200 ${className}`}>
        <div className="flex items-center gap-3 text-gray-500">
          <div className="icon-container bg-gray-100 text-gray-400">
            <FaInfoCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Trial Status</h3>
            <p className="text-sm text-gray-500">Unable to load trial information</p>
          </div>
        </div>
      </div>
    );
  }

  const warning = getTrialWarning();
  const { remainingTrials, trialsUsed, trialsLimit } = trialStatus;

  // Determine colors and icons based on trial status with professional approach
  const getStatusConfig = () => {
    if (remainingTrials === 0) {
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: FaCrown,
        progressColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
        statusText: 'Ready to Upgrade',
        statusBadge: 'bg-purple-100 text-purple-700'
      };
    } else if (remainingTrials === 1) {
      return {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: FaStar,
        progressColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
        statusText: 'Almost There',
        statusBadge: 'bg-amber-100 text-amber-700'
      };
    } else {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: FaRocket,
        progressColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        statusText: 'Active',
        statusBadge: 'bg-blue-100 text-blue-700'
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const progressPercentage = (trialsUsed / trialsLimit) * 100;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`icon-container-sm ${config.statusBadge}`}>
          <Icon className="text-xs" />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {remainingTrials}/{trialsLimit} trials
        </span>
      </div>
    );
  }

  return (
    <div className={`dashboard-card ${config.bgColor} ${config.borderColor} border-2 ${className} group hover:shadow-lg transition-all duration-300 animate-fade-in-up`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`icon-container bg-gradient-to-br ${config.bgColor} ${config.color} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">AI Trials</h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.statusBadge} 2xl:rounded-md 2xl:px-2.5 2xl:font-semibold 2xl:border 2xl:border-white/20`}>
                {config.statusText}
              </span>
              <span className="text-xs text-gray-500 2xl:hidden">•</span>
              <span className="text-xs text-gray-500 2xl:hidden">Free tier</span>
              <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-600">Free</span>
              </div>
            </div>
          </div>
        </div>
        {remainingTrials === 0 && (
          <Button
            size="sm"
            onClick={handleUpgradeClick}
            className="btn-modern-primary text-sm group/btn 2xl:hidden"
          >
            <FaCrown className="mr-2 text-sm group-hover/btn:animate-bounce" />
            Upgrade
          </Button>
        )}
      </div>

      {/* Enhanced Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-800">Trial Usage</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-lg ${config.color}`}>
              {remainingTrials}
            </span>
            <span className="text-gray-400 text-sm">/ {trialsLimit}</span>
            <span className="text-xs text-gray-500">remaining</span>
          </div>
        </div>

        {/* Enhanced Progress Bar with Modern Design */}
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-4 rounded-full transition-all duration-700 ease-out ${config.progressColor} relative overflow-hidden shadow-sm`}
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Enhanced Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

            {/* Subtle highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>

          {/* Progress indicator dot */}
          {progressPercentage > 0 && progressPercentage < 100 && (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md transition-all duration-700 border border-gray-300"
              style={{ left: `calc(${progressPercentage}% - 4px)` }}
            ></div>
          )}
        </div>

        {/* Progress labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500" />
            Used: {trialsUsed}
          </span>
          <span className="flex items-center gap-1">
            <FaGem className={config.color} />
            Available: {remainingTrials}
          </span>
        </div>
      </div>



      {/* Premium Upgrade CTA - Professional Design */}
      {remainingTrials === 0 && showDetails && (
        <div className="dashboard-card-compact bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-purple-200 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full transform -translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative text-center">
            <div className="icon-container-lg bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 mx-auto mb-4 shadow-sm">
              <FaCrown className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">
              Unlock Premium Features
            </h4>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
              Continue your journey with unlimited AI-powered resume enhancements, advanced templates, and priority support.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Unlimited AI</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Premium Templates</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Advanced Export</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                onClick={handleUpgradeClick}
                className="btn-modern-primary flex-1 2xl:max-w-48 2xl:mx-auto group/upgrade"
              >
                <FaCrown className="mr-2 text-sm group-hover/upgrade:animate-bounce" />
                Start Premium
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  $4.99
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('mailto:mehdibenlekhale@gmail.com', '_blank')}
                className="btn-modern-secondary flex-1 2xl:hidden"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini version for header/navbar
export const TrialCounterMini = ({ className = "" }) => {
  const { trialStatus } = useTrial();

  if (trialStatus.loading || trialStatus.error) {
    return null;
  }

  const { remainingTrials } = trialStatus;

  const getConfig = () => {
    if (remainingTrials === 0) return {
      color: 'text-purple-600 bg-purple-100',
      icon: FaCrown
    };
    if (remainingTrials === 1) return {
      color: 'text-amber-600 bg-amber-100',
      icon: FaStar
    };
    return {
      color: 'text-blue-600 bg-blue-100',
      icon: FaRocket
    };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${config.color} shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <Icon className="text-xs" />
      <span>{remainingTrials} trials</span>
    </div>
  );
};

// Badge version for buttons
export const TrialBadge = ({ className = "" }) => {
  const { trialStatus } = useTrial();

  if (trialStatus.loading || trialStatus.error) {
    return null;
  }

  const { remainingTrials } = trialStatus;

  if (remainingTrials > 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full ${className}`}>
        <FaGem className="text-xs" />
        {remainingTrials} left
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full ${className}`}>
      <FaCrown className="text-xs" />
      Upgrade
    </span>
  );
};

export default TrialCounter;
