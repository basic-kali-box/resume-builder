import React, { useEffect } from 'react';
import { FaCrown, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TrialWarningPopup = ({ 
  isOpen, 
  onClose, 
  title = "AI Trials Exhausted",
  message = "You've used all your free AI enhancements. Upgrade to Premium for unlimited access."
}) => {
  const navigate = useNavigate();

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleStartPremium = () => {
    navigate('/pricing');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-warning-title"
      aria-describedby="trial-warning-message"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <FaCrown className="text-blue-600 text-2xl" />
          </div>

          {/* Title */}
          <h2 
            id="trial-warning-title"
            className="text-xl font-bold text-gray-900 mb-3"
          >
            {title}
          </h2>

          {/* Message */}
          <p 
            id="trial-warning-message"
            className="text-gray-600 text-sm leading-relaxed mb-8"
          >
            {message}
          </p>

          {/* Action Button */}
          <Button
            onClick={handleStartPremium}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaCrown className="mr-2 h-4 w-4" />
            Start Premium
          </Button>

          {/* Subtle footer */}
          <p className="text-xs text-gray-400 mt-4">
            Unlimited AI features • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialWarningPopup;
