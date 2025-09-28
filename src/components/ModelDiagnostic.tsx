import React, { useEffect, useState } from 'react'

interface ModelDiagnosticProps {
  modelUrl: string
}

const ModelDiagnostic: React.FC<ModelDiagnosticProps> = ({ modelUrl }) => {
  const [diagnostics, setDiagnostics] = useState<string[]>([])

  useEffect(() => {
    const runDiagnostics = async () => {
      const logs: string[] = []
      
      try {
        logs.push(`🔍 Testing model URL: ${modelUrl}`)
        
        // Test 1: Check if URL is accessible
        try {
          const response = await fetch(modelUrl, { method: 'HEAD' })
          logs.push(`✅ URL accessible: ${response.status} ${response.statusText}`)
          logs.push(`📊 Content-Type: ${response.headers.get('content-type') || 'unknown'}`)
          logs.push(`📏 Content-Length: ${response.headers.get('content-length') || 'unknown'}`)
        } catch (error) {
          logs.push(`❌ URL not accessible: ${error}`)
        }
        
        // Test 2: Try to fetch first few bytes
        try {
          const response = await fetch(modelUrl, { 
            method: 'GET',
            headers: { 'Range': 'bytes=0-100' }
          })
          const buffer = await response.arrayBuffer()
          const bytes = new Uint8Array(buffer)
          
          // Check GLB magic number (glTF binary format starts with "glTF")
          const magic = String.fromCharCode(...bytes.slice(0, 4))
          logs.push(`🔮 File magic: "${magic}" (should be "glTF" for GLB)`)
          
          if (magic === 'glTF') {
            logs.push(`✅ Valid GLB file detected`)
          } else {
            logs.push(`❌ Invalid GLB file - wrong magic number`)
          }
        } catch (error) {
          logs.push(`❌ Could not read file content: ${error}`)
        }
        
      } catch (error) {
        logs.push(`❌ Diagnostic failed: ${error}`)
      }
      
      setDiagnostics(logs)
    }
    
    runDiagnostics()
  }, [modelUrl])

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 1001
    }}>
      <h4>Model Diagnostic</h4>
      {diagnostics.map((log, index) => (
        <div key={index} style={{ marginBottom: '2px' }}>
          {log}
        </div>
      ))}
    </div>
  )
}

export default ModelDiagnostic