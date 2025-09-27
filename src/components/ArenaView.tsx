import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls, useGLTF, Box, Plane } from '@react-three/drei'
import LoadingSpinner from './LoadingSpinner'
import ErrorPanel from './ErrorPanel'
import './ArenaView.css'


interface ArenaViewProps {
  onBack: () => void
}

const ARENA_MODEL_URL = '/models/soni.glb';

// Fallback procedural arena
const FallbackArena: React.FC = () => {
  return (
    <group>
      {/* Ground plane */}
      <Plane 
        args={[50, 50]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
      >
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Arena walls */}
      <Box args={[1, 8, 50]} position={[25, 3, 0]}>
        <meshStandardMaterial color="#404040" />
      </Box>
      <Box args={[1, 8, 50]} position={[-25, 3, 0]}>
        <meshStandardMaterial color="#404040" />
      </Box>
      <Box args={[50, 8, 1]} position={[0, 3, 25]}>
        <meshStandardMaterial color="#404040" />
      </Box>
      <Box args={[50, 8, 1]} position={[0, 3, -25]}>
        <meshStandardMaterial color="#404040" />
      </Box>
      
      {/* Some decorative elements */}
      <Box args={[2, 2, 2]} position={[10, 0, 10]}>
        <meshStandardMaterial color="#ff6b6b" />
      </Box>
      <Box args={[2, 2, 2]} position={[-10, 0, -10]}>
        <meshStandardMaterial color="#4ecdc4" />
      </Box>
      <Box args={[2, 2, 2]} position={[10, 0, -10]}>
        <meshStandardMaterial color="#45b7d1" />
      </Box>
      <Box args={[2, 2, 2]} position={[-10, 0, 10]}>
        <meshStandardMaterial color="#f9ca24" />
      </Box>
    </group>
  )
}

const Arena: React.FC = () => {
  const [usesFallback, setUsesFallback] = useState(false)
  
  if (usesFallback) {
    return <FallbackArena />
  }

  try {
    const { scene } = useGLTF(ARENA_MODEL_URL)
    
    // Validate the loaded model
    if (!scene || !scene.children || scene.children.length === 0) {
      console.warn('Loaded GLB model appears to be empty, using fallback arena')
      setUsesFallback(true)
      return <FallbackArena />
    }
    
    return <primitive object={scene} />
  } catch (error) {
    console.error('Failed to load GLB model:', error)
    setUsesFallback(true)
    return <FallbackArena />
  }
}

const ArenaView: React.FC<ArenaViewProps> = ({ onBack }) => {
  const [isPointerLocked, setIsPointerLocked] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [modelLoadError, setModelLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Check if the GLB file is accessible and valid
    const checkModel = async () => {
      try {
        const response = await fetch(ARENA_MODEL_URL)
        if (!response.ok) {
          throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`)
        }
        
        const contentLength = response.headers.get('content-length')
        if (contentLength && parseInt(contentLength) < 100) {
          throw new Error('Model file appears to be too small or empty')
        }
        
        // Try to read a bit of the file to validate it's not just text
        const arrayBuffer = await response.arrayBuffer()
        if (arrayBuffer.byteLength < 100) {
          throw new Error('Model file is too small to be a valid GLB')
        }
        
        // Check for GLB magic number (first 4 bytes should be 'glTF')
        const view = new DataView(arrayBuffer)
        const magic = view.getUint32(0, true)
        if (magic !== 0x46546C67) { // 'glTF' in little endian
          console.warn('File does not appear to be a valid GLB file, but continuing anyway...')
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Model validation failed:', error)
        setModelLoadError(error instanceof Error ? error.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    checkModel()
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setModelLoadError(null)
    setIsLoading(true)
    // Force re-render by clearing the GLTF cache
    useGLTF.clear(ARENA_MODEL_URL)
    
    // Re-check the model
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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

// Note: Model preloading is handled in the component with validation

export default ArenaView
