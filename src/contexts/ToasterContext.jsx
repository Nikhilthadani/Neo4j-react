import React, { createContext, useContext, useState } from 'react';
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';

export const ToasterContext = createContext();

export const ToasterProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setIsVisible(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Small delay before removing the toast to allow for fade out animation
      setTimeout(() => setToast(null), 300);
    }, 5000);
  };

  const hideToast = () => {
    setIsVisible(false);
    setTimeout(() => setToast(null), 300);
  };

  return (
    <ToasterContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div
          className={`fixed top-5 right-6 z-[1000] p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 transform ${isVisible
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
            } ${toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
            }`}
          role="alert"
        >
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <FiCheckCircle className="mr-2 text-xl" />
            ) : (
              <FiAlertCircle className="mr-2 text-xl" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={hideToast}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};
