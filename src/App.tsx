import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import ArenaView from './components/ArenaView'

export type AppState = 'landing' | 'arena'

function App() {
  const [currentView, setCurrentView] = useState<AppState>('landing')

  const handleEnterArena = () => {
    setCurrentView('arena')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  return (
    <div className="app">
      {currentView === 'landing' ? (
        <LandingPage onEnterArena={handleEnterArena} />
      ) : (
        <ArenaView onBack={handleBackToLanding} />
      )}
    </div>
  )
}

export default App