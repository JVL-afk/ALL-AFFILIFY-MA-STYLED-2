'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface FileItem {
  path: string
  content: string
  lastModified: Date
}

interface Deployment {
  id: string
  timestamp: Date
  status: 'pending' | 'building' | 'success' | 'failed'
  buildLogs?: string
  liveUrl?: string
  errorDetails?: string
}

export default function CodeEditorPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null)
  const [code, setCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [showDeployments, setShowDeployments] = useState(false)
  const [editorMode, setEditorMode] = useState<'code' | 'visual'>('code')

  // Load files on mount
  useEffect(() => {
    loadFiles()
    loadDeployments()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/code-editor/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
        if (data.files.length > 0) {
          setCurrentFile(data.files[0])
          setCode(data.files[0].content)
        }
      }
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  const loadDeployments = async () => {
    try {
      const response = await fetch('/api/code-editor/deploy')
      if (response.ok) {
        const data = await response.json()
        setDeployments(data.deployments || [])
      }
    } catch (error) {
      console.error('Failed to load deployments:', error)
    }
  }

  const saveFile = async () => {
    if (!currentFile) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/code-editor/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: currentFile.path,
          content: code
        })
      })

      if (response.ok) {
        // Update local file list
        setFiles(files.map(f => 
          f.path === currentFile.path 
            ? { ...f, content: code, lastModified: new Date() }
            : f
        ))
      }
    } catch (error) {
      console.error('Failed to save file:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const deployToNetlify = async () => {
    setIsDeploying(true)
    try {
      const response = await fetch('/api/code-editor/deploy', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        // Poll for deployment status
        pollDeploymentStatus(data.deploymentId)
      }
    } catch (error) {
      console.error('Failed to deploy:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  const pollDeploymentStatus = async (deploymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/code-editor/deploy?deploymentId=${deploymentId}`)
        if (response.ok) {
          const data = await response.json()
          const deployment = data.deployment

          if (deployment.status === 'success' || deployment.status === 'failed') {
            clearInterval(interval)
            loadDeployments()
          }
        }
      } catch (error) {
        console.error('Failed to poll deployment status:', error)
        clearInterval(interval)
      }
    }, 3000)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">🚀 AFFILIFY Code Editor</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditorMode('code')}
              className={`px-4 py-2 rounded ${editorMode === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              💻 Code Editor
            </button>
            <button
              onClick={() => setEditorMode('visual')}
              className={`px-4 py-2 rounded ${editorMode === 'visual' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              🎨 Visual Editor
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={saveFile}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
          >
            {isSaving ? '💾 Saving...' : '💾 Save'}
          </button>
          <button
            onClick={deployToNetlify}
            disabled={isDeploying}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
          >
            {isDeploying ? '🚀 Deploying...' : '🚀 Deploy to Netlify'}
          </button>
          <button
            onClick={() => setShowDeployments(!showDeployments)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            📜 Deployments
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">📁 Files</h2>
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => {
                  setCurrentFile(file)
                  setCode(file.content)
                }}
                className={`p-2 mb-1 rounded cursor-pointer hover:bg-gray-700 ${
                  currentFile?.path === file.path ? 'bg-gray-700' : ''
                }`}
              >
                <div className="text-sm truncate">{file.path.split('/').pop()}</div>
                <div className="text-xs text-gray-400 truncate">{file.path}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {editorMode === 'code' ? (
            <>
              {/* File Tab */}
              {currentFile && (
                <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
                  <span className="text-sm">{currentFile.path}</span>
                </div>
              )}

              {/* Monaco Editor */}
              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">🎨 Visual Editor</h2>
                <p className="text-gray-400 mb-4">Coming soon! The most advanced visual editor on the market.</p>
                <button
                  onClick={() => setEditorMode('code')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Switch to Code Editor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Deployments Panel */}
        {showDeployments && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">📜 Deployment History</h2>
              {deployments.length === 0 ? (
                <p className="text-gray-400">No deployments yet</p>
              ) : (
                deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="mb-4 p-3 bg-gray-700 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        deployment.status === 'success' ? 'bg-green-600' :
                        deployment.status === 'failed' ? 'bg-red-600' :
                        deployment.status === 'building' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      }`}>
                        {deployment.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(deployment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {deployment.liveUrl && (
                      <a
                        href={deployment.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm block mb-2"
                      >
                        🌐 View Live
                      </a>
                    )}
                    {deployment.buildLogs && (
                      <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                        {deployment.buildLogs}
                      </pre>
                    )}
                    {deployment.errorDetails && (
                      <div className="mt-2 p-2 bg-red-900 rounded text-sm">
                        ❌ {deployment.errorDetails}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

