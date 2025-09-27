import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls, useGLTF } from '@react-three/drei'
import LoadingSpinner from './LoadingSpinner'
import ErrorPanel from './ErrorPanel'
import './ArenaView.css'

interface ArenaViewProps {
  onBack: () => void
}

const ARENA_MODEL_URL = 'https://drive.google.com/uc?export=download&id=1DcjmKgArwf955QnF0qHikLh_t7wBlEte'

const Arena: React.FC = () => {
  try {
    const { scene } = useGLTF(ARENA_MODEL_URL)
    return <primitive object={scene} />
  } catch (error) {
    throw error
  }
}

const ArenaView: React.FC<ArenaViewProps> = ({ onBack }) => {
  const [isPointerLocked, setIsPointerLocked] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time and handle potential errors
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    // Force re-render by clearing the GLTF cache
    useGLTF.clear(ARENA_MODEL_URL)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  if (hasError) {
    return <ErrorPanel onRetry={handleRetry} onBack={onBack} />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="arena-view">
      <button className="back-button" onClick={onBack}>
        <span className="back-icon">←</span>
        Back
      </button>
      
      {!isPointerLocked && (
        <div className="controls-hint">
          <p>Click to lock pointer. Use WASD to move.</p>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0b0d10')
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <Suspense fallback={null}>
          <ErrorBoundary onError={() => setHasError(true)}>
            <Arena />
          </ErrorBoundary>
        </Suspense>
        
        <PointerLockControls
          onLock={() => setIsPointerLocked(true)}
          onUnlock={() => setIsPointerLocked(false)}
        />
      </Canvas>
    </div>
  )
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Arena loading error:', error, errorInfo)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

// Preload the model
useGLTF.preload(ARENA_MODEL_URL)

export default ArenaView