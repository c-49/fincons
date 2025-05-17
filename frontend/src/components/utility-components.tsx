import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// ErrorMessage component
interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => (
  <div className="error-message">
    <p>{message}</p>
    {onDismiss && (
      <button onClick={onDismiss} className="dismiss-btn">
        Dismiss
      </button>
    )}
  </div>
);