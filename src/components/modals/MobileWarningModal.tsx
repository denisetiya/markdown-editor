import React, { useEffect, useState } from 'react';

interface MobileWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileWarningModal: React.FC<MobileWarningModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  // Handle closing the modal
  const handleClose = () => {
    setIsVisible(false);
    // Add a small delay to allow the animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEsc);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      // Re-enable scrolling
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 transform transition-all duration-300 scale-95 animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500 bg-opacity-20 mb-4">
              <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mobile View Not Supported</h3>
            <div className="mt-4">
              <p className="text-gray-300 mb-4">
                This application is not optimized for mobile devices. For the best experience, please use a desktop or tablet.
              </p>
              <p className="text-gray-400 text-sm">
                You can continue using the app on mobile, but some features may not work as expected.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center p-6 border-t border-gray-700">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={handleClose}
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};