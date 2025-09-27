import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Loading Arena...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner