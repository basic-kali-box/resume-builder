import React from 'react';
import {
  FaRocket,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaCrown
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useTrial } from '@/context/TrialContext';
import { useNavigate } from 'react-router-dom';
import TrialWarningPopup from './TrialWarningPopup';

const TrialExhaustedModal = ({
  isOpen,
  onClose,
  title = "AI Trials Exhausted",
  showCloseButton = true,
  variant = "popup" // "popup" for minimalistic, "modal" for full modal
}) => {
  const { trialStatus, refreshTrialStatus } = useTrial();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Use minimalistic popup by default
  if (variant === "popup") {
    return (
      <TrialWarningPopup
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        message={`You've used all ${trialStatus.trialsLimit} of your free AI enhancement trials. Upgrade to Premium for unlimited access.`}
      />
    );
  }

  const handleContactSupport = () => {
    window.open('mailto:mehdibenlekhale@gmail.com?subject=AI Resume Builder - Trial Extension Request', '_blank');
  };

  const handleStartPremium = () => {
    navigate('/pricing');
    if (onClose) onClose();
  };



  const handleRefreshStatus = () => {
    refreshTrialStatus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">
              You've used all {trialStatus.trialsLimit} of your free AI enhancement trials.
            </p>
          </div>
        </div>

        {/* Trial Status */}
        <div className="px-6 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Trials Used</span>
              <span className="text-sm font-bold text-red-600">
                {trialStatus.trialsUsed}/{trialStatus.trialsLimit}
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="h-2 bg-red-500 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Features you're missing */}
        <div className="px-6 pb-4">
          <h3 className="font-semibold text-gray-800 mb-3">What you're missing:</h3>
          <div className="space-y-2">
            {[
              'AI-powered content enhancement',
              'Professional resume optimization',
              'Smart keyword integration',
              'Automated resume extraction from files'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* Primary CTA - Start Premium */}
            <Button
              onClick={handleStartPremium}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
            >
              <FaCrown className="mr-2" />
              Start Premium - Unlimited AI
            </Button>

            {/* Secondary CTA - Contact Support */}
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 py-3"
            >
              <FaEnvelope className="mr-2" />
              Contact Support
            </Button>



            {/* Refresh Status */}
            <Button
              onClick={handleRefreshStatus}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800 py-2"
            >
              <FaStar className="mr-2" />
              Refresh Trial Status
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Unlock unlimited AI features with Premium
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>Made with ❤️ for job seekers</span>
              <span>•</span>
              <button
                onClick={handleStartPremium}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Start Premium Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default TrialExhaustedModal;
export { TrialWarningPopup };
