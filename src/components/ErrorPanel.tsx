import React from 'react'
import './ErrorPanel.css'

interface ErrorPanelProps {
  onRetry: () => void
  onBack: () => void
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ onRetry, onBack }) => {
  return (
    <div className="error-overlay">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Failed to Load Arena</h2>
        <p className="error-message">
          We couldn't load the 3D arena. This might be due to a network issue or the model file being temporarily unavailable.
        </p>
        <div className="error-buttons">
          <button className="retry-button" onClick={onRetry}>
            Try Again
          </button>
          <button className="back-button-error" onClick={onBack}>
            Back to Landing
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPanel