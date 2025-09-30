import React from 'react'
import './LandingPage.css'

interface LandingPageProps {
  onEnterArena: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterArena }) => {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1 className="title">ClusterAI</h1>
        <p className="subtitle">Developer Metaverse Hub</p>
        <button 
          className="enter-button"
          onClick={onEnterArena}
          aria-label="Enter the 3D Metaverse"
        >
          Enter the 3D Metaverse
        </button>
      </div>
    </div>
  )
}

export default LandingPage