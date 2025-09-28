import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls, useGLTF, Box, Plane } from '@react-three/drei'
import LoadingSpinner from './LoadingSpinner'
import ErrorPanel from './ErrorPanel'
import ModelDiagnostic from './ModelDiagnostic'
import './ArenaView.css'


interface ArenaViewProps {
  onBack: () => void
}

const ARENA_MODEL_URLS = [
  '/models/sonii.glb', // Local file in public/models/
  'https://raw.githubusercontent.com/GaurRitika/ClusterAI/main/public/models/sonii.glb', // GitHub raw URL
  'https://github.com/GaurRitika/ClusterAI/raw/main/public/models/sonii.glb', // Alternative GitHub raw URL
]

const Arena: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  try {
    console.log('Loading GLB model from:', modelUrl)
    const gltf = useGLTF(modelUrl)
    
    if (!gltf || !gltf.scene) {
      throw new Error('GLB model loaded but scene is empty')
    }
    
    console.log('GLB model loaded successfully:', gltf)
    return <primitive object={gltf.scene} />
  } catch (error) {
    console.error('Error loading GLB model:', error)
    throw error
  }
}

const ArenaView: React.FC<ArenaViewProps> = ({ onBack }) => {
  const [isPointerLocked, setIsPointerLocked] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const [currentModelUrl, setCurrentModelUrl] = useState(ARENA_MODEL_URLS[0])

  useEffect(() => {
    console.log(`Attempting to load model from: ${currentModelUrl}`)
    setIsLoading(true)
    setHasError(false)
    
    // Simple timeout to allow model loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Give more time for GLB loading
    
    return () => clearTimeout(loadingTimer)
  }, [currentModelIndex, currentModelUrl])

  // Handle model loading errors from the ErrorBoundary
  const handleModelError = () => {
    console.error(`Failed to load model from ${currentModelUrl}`)
    console.log(`Trying model ${currentModelIndex + 1} of ${ARENA_MODEL_URLS.length}`)
    
    // Try next URL if available
    if (currentModelIndex < ARENA_MODEL_URLS.length - 1) {
      const nextIndex = currentModelIndex + 1
      console.log(`Switching to next model URL: ${ARENA_MODEL_URLS[nextIndex]}`)
      setCurrentModelIndex(nextIndex)
      setCurrentModelUrl(ARENA_MODEL_URLS[nextIndex])
    } else {
      console.error('All model URLs failed to load')
      setHasError(true)
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setCurrentModelIndex(0)
    setCurrentModelUrl(ARENA_MODEL_URLS[0])
    
    // Clear GLTF cache for all URLs
    ARENA_MODEL_URLS.forEach(url => {
      useGLTF.clear(url)
    })


  }

  if (hasError) {
    return <ErrorPanel onRetry={handleRetry} onBack={onBack} />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Show error message if model validation failed, but still render the fallback arena
  if (modelLoadError) {
    console.warn(`Model loading issue: ${modelLoadError}. Using fallback arena.`)
  }

  return (
    <div className="arena-view">
      <ModelDiagnostic modelUrl={currentModelUrl} />
      
      <button className="back-button" onClick={onBack}>
        <span className="back-icon">←</span>
        Back
      </button>
      
      {!isPointerLocked && (
        <div className="controls-hint">
          <p>Click to lock pointer. Use WASD to move.</p>
          {modelLoadError && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9em', marginTop: '8px' }}>
              ⚠️ Using fallback arena (model loading failed)
            </p>
          )}
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
          <ErrorBoundary onError={handleModelError}>
            <Arena modelUrl={currentModelUrl} />
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


useGLTF.preload(ARENA_MODEL_URLS[0])


export default ArenaView
