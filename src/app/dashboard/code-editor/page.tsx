'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import VisualEditor from '@/components/VisualEditor'
import CodeEditorToolbar from '@/components/CodeEditorToolbar'
import {
  Code2,
  Save,
  Rocket,
  FileCode,
  Folder,
  FolderOpen,
  Terminal,
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Sparkles,
  Zap,
  Eye,
  Play,
  RotateCcw,
  Search,
  Replace,
  Wand2,
  FileText,
  Settings,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Activity,
  Database,
  Globe,
  Lock,
  Cpu
} from 'lucide-react'

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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(null)
  const editorRef = useRef<any>(null)

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
        if (data.deployments && data.deployments.length > 0) {
          setActiveDeployment(data.deployments[0])
        }
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

  const rollbackToDeployment = async (deploymentId: string) => {
    if (!confirm('Are you sure you want to rollback to this deployment? This will overwrite your current code.')) {
      return
    }

    try {
      const response = await fetch('/api/code-editor/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentId })
      })

      if (response.ok) {
        alert('Rollback successful! Reloading files...')
        loadFiles()
        loadDeployments()
      } else {
        const data = await response.json()
        alert(`Rollback failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to rollback:', error)
      alert('Rollback failed. Please try again.')
    }
  }

  // Advanced editor features
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run()
    }
  }

  const searchInFiles = (query: string) => {
    if (editorRef.current && query) {
      editorRef.current.trigger('', 'actions.find', { searchString: query })
    }
  }

  const replaceInFiles = (find: string, replace: string) => {
    if (editorRef.current && find) {
      const model = editorRef.current.getModel()
      if (model) {
        const fullText = model.getValue()
        const newText = fullText.replace(new RegExp(find, 'g'), replace)
        model.setValue(newText)
        setCode(newText)
      }
    }
  }

  const getAIAssistance = async () => {
    if (!currentFile) return

    setShowAIPanel(true)
    try {
      const response = await fetch('/api/code-editor/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          filePath: currentFile.path
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('AI assist failed:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return <Code2 className="w-4 h-4 text-green-400" />
    if (filename.endsWith('.json')) return <Database className="w-4 h-4 text-green-400" />
    return <FileText className="w-4 h-4 text-green-400" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-500/20 border-green-500/50'
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'building': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'building': return <Loader2 className="w-4 h-4 animate-spin" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Organize files into folder structure
  const organizeFiles = () => {
    const structure: any = {}
    files.forEach(file => {
      const parts = file.path.split('/')
      let current = structure
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          if (!current._files) current._files = []
          current._files.push(file)
        } else {
          if (!current[part]) current[part] = {}
          current = current[part]
        }
      })
    })
    return structure
  }

  const renderFileTree = (node: any, path: string = '') => {
    const folders = Object.keys(node).filter(key => key !== '_files')
    const files = node._files || []

    return (
      <div className="space-y-1">
        {folders.map(folder => {
          const folderPath = path ? `${path}/${folder}` : folder
          const isExpanded = expandedFolders.has(folderPath)
          return (
            <div key={folderPath}>
              <div
                onClick={() => toggleFolder(folderPath)}
                className="flex items-center space-x-2 px-2 py-1.5 hover:bg-green-500/10 rounded cursor-pointer group"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-green-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-green-400" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-green-400" />
                ) : (
                  <Folder className="w-4 h-4 text-green-400" />
                )}
                <span className="text-sm text-green-300 font-mono">{folder}</span>
              </div>
              {isExpanded && (
                <div className="ml-6 border-l border-green-500/20">
                  {renderFileTree(node[folder], folderPath)}
                </div>
              )}
            </div>
          )
        })}
        {files.map((file: FileItem) => (
          <div
            key={file.path}
            onClick={() => {
              setCurrentFile(file)
              setCode(file.content)
            }}
            className={`flex items-center space-x-2 px-2 py-1.5 hover:bg-green-500/10 rounded cursor-pointer group ${
              currentFile?.path === file.path ? 'bg-green-500/20 border-l-2 border-green-400' : ''
            }`}
          >
            {getFileIcon(file.path)}
            <span className="text-sm text-green-300 font-mono truncate">{file.path.split('/').pop()}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} flex flex-col bg-black text-green-400`}>
      {/* Matrix Rain Background Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="matrix-rain"></div>
      </div>

      {/* Header - Matrix Style */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-black via-green-950 to-black border-b-2 border-green-500/50 p-4"
      >
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                <Terminal className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono text-green-400 flex items-center">
                  <span className="mr-2">{'>'}</span>
                  AFFILIFY CODE EDITOR
                  <span className="ml-2 animate-pulse">_</span>
                </h1>
                <p className="text-xs text-green-500/70 font-mono">ENTERPRISE EXCLUSIVE • MATRIX MODE</p>
              </div>
            </div>
          </div>

          {/* Center - Mode Toggle */}
          <div className="flex items-center space-x-2 bg-black/50 border border-green-500/30 rounded-lg p-1">
            <button
              onClick={() => setEditorMode('code')}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
                editorMode === 'code' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg shadow-green-500/50' 
                  : 'text-green-400 hover:bg-green-500/10'
              }`}
            >
              <Code2 className="w-4 h-4 inline-block mr-2" />
              CODE
            </button>
            <button
              onClick={() => setEditorMode('visual')}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
                editorMode === 'visual' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg shadow-green-500/50' 
                  : 'text-green-400 hover:bg-green-500/10'
              }`}
            >
              <Eye className="w-4 h-4 inline-block mr-2" />
              VISUAL
            </button>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={saveFile}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-black font-mono font-bold rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-green-500/30 flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE</span>
                </>
              )}
            </button>

            <button
              onClick={deployToNetlify}
              disabled={isDeploying}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-mono font-bold rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-green-500/30 flex items-center space-x-2"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DEPLOYING...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>DEPLOY</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDeployments(!showDeployments)}
              className={`px-4 py-2 border-2 border-green-500/50 hover:border-green-500 text-green-400 font-mono font-bold rounded-lg transition-all flex items-center space-x-2 ${
                showDeployments ? 'bg-green-500/20' : 'bg-black/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>DEPLOYMENTS</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-2 border-2 border-green-500/50 hover:border-green-500 text-green-400 rounded-lg transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-center justify-between text-xs font-mono"
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-green-500" />
              <span className="text-green-300">{files.length} FILES</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-green-500" />
              <span className="text-green-300">MAIN BRANCH</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-green-500" />
              <span className="text-green-300">MONACO ENGINE</span>
            </div>
          </div>
          {activeDeployment && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-green-500" />
              <span className="text-green-300">LAST DEPLOY: {new Date(activeDeployment.timestamp).toLocaleTimeString()}</span>
              <span className={`px-2 py-0.5 rounded ${getStatusColor(activeDeployment.status)}`}>
                {activeDeployment.status.toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* File Explorer - Left Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-80 bg-gradient-to-b from-black via-gray-950 to-black border-r-2 border-green-500/30 overflow-y-auto"
        >
          <div className="p-4">
            {/* Explorer Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/30">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold font-mono text-green-400">FILE EXPLORER</h2>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-green-500/10 rounded">
                  <Settings className="w-4 h-4 text-green-500" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-green-300 placeholder-green-500/50 focus:outline-none focus:border-green-500 font-mono text-sm"
                />
              </div>
            </div>

            {/* File Tree */}
            <div className="space-y-1">
              {files.length === 0 ? (
                <div className="text-center py-8 text-green-500/50 font-mono text-sm">
                  <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  NO FILES LOADED
                </div>
              ) : (
                renderFileTree(organizeFiles())
              )}
            </div>

            {/* File Stats */}
            <div className="mt-6 pt-4 border-t border-green-500/30">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-green-500/70">
                  <span>TOTAL FILES:</span>
                  <span className="text-green-400 font-bold">{files.length}</span>
                </div>
                <div className="flex justify-between text-green-500/70">
                  <span>CURRENT FILE:</span>
                  <span className="text-green-400 font-bold truncate ml-2">{currentFile?.path.split('/').pop() || 'NONE'}</span>
                </div>
                <div className="flex justify-between text-green-500/70">
                  <span>LINES:</span>
                  <span className="text-green-400 font-bold">{code.split('\n').length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor Area - Center */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {editorMode === 'code' ? (
            <>
              {/* File Tab Bar */}
              {currentFile && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-black via-green-950/30 to-black border-b border-green-500/30 px-4 py-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(currentFile.path)}
                    <span className="text-sm font-mono text-green-300">{currentFile.path}</span>
                    <span className="text-xs text-green-500/50 font-mono">
                      MODIFIED: {new Date(currentFile.lastModified).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-xs font-mono text-green-400 flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Advanced Toolbar */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-black/50 border-b border-green-500/30 px-4 py-2 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={formatCode}
                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-xs font-mono text-green-400 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>FORMAT</span>
                  </button>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-xs font-mono text-green-400 flex items-center space-x-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>SEARCH</span>
                  </button>
                  <button
                    onClick={getAIAssistance}
                    className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 rounded text-xs font-mono text-green-400 flex items-center space-x-1 shadow-lg shadow-green-500/20"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>AI ASSIST</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-green-500/70">
                  <span>TYPESCRIPT • JSX</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                </div>
              </motion.div>

              {/* Search Panel */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/80 border-b border-green-500/30 p-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-green-500 mb-1 block">FIND:</label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-green-500"
                          placeholder="Search in file..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-green-500 mb-1 block">REPLACE:</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={replaceQuery}
                            onChange={(e) => setReplaceQuery(e.target.value)}
                            className="flex-1 px-3 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-green-500"
                            placeholder="Replace with..."
                          />
                          <button
                            onClick={() => replaceInFiles(searchQuery, replaceQuery)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-xs font-mono text-green-400"
                          >
                            REPLACE ALL
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Monaco Editor */}
              <div className="flex-1 relative">
                <MonacoEditor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={(editor) => {
                    editorRef.current = editor
                    // Custom theme for Matrix look
                    editor.updateOptions({
                      theme: 'vs-dark',
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                      fontLigatures: true,
                    })
                  }}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                    fontLigatures: true,
                    wordWrap: 'on',
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                  }}
                />
                {/* Scanline Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-30"></div>
              </div>

              {/* AI Suggestions Panel */}
              <AnimatePresence>
                {showAIPanel && aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-gradient-to-r from-black via-green-950/50 to-black border-t-2 border-green-500/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-5 h-5 text-green-400" />
                        <h3 className="text-sm font-bold font-mono text-green-400">AI SUGGESTIONS</h3>
                        <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/50 rounded text-xs font-mono text-green-400">
                          GEMINI 2.0
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowAIPanel(false)
                          setAiSuggestions([])
                        }}
                        className="text-green-500 hover:text-green-400 text-xs font-mono"
                      >
                        DISMISS
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                        >
                          <Sparkles className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-300 font-mono">{suggestion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex-1 bg-gradient-to-br from-black via-green-950/30 to-black">
              <VisualEditor onCodeChange={(newCode) => setCode(newCode)} />
            </div>
          )}
        </div>

        {/* Deployments Panel - Right Sidebar */}
        <AnimatePresence>
          {showDeployments && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-96 bg-gradient-to-b from-black via-gray-950 to-black border-l-2 border-green-500/30 overflow-y-auto"
            >
              <div className="p-4">
                {/* Deployments Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-bold font-mono text-green-400">DEPLOYMENT HISTORY</h2>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs font-mono text-green-400">
                    {deployments.length} TOTAL
                  </span>
                </div>

                {/* Deployment List */}
                {deployments.length === 0 ? (
                  <div className="text-center py-12">
                    <Rocket className="w-16 h-16 mx-auto mb-4 text-green-500/30" />
                    <p className="text-green-500/50 font-mono text-sm">NO DEPLOYMENTS YET</p>
                    <p className="text-green-500/30 font-mono text-xs mt-2">Click DEPLOY to start</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deployments.map((deployment, index) => (
                      <motion.div
                        key={deployment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-black/50 border-2 border-green-500/30 rounded-lg p-4 hover:border-green-500/50 transition-all"
                      >
                        {/* Deployment Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${getStatusColor(deployment.status)}`}>
                            {getStatusIcon(deployment.status)}
                            <span className="text-xs font-bold font-mono">{deployment.status.toUpperCase()}</span>
                          </div>
                          <span className="text-xs text-green-500/70 font-mono">
                            {new Date(deployment.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {/* Deployment ID */}
                        <div className="mb-2">
                          <span className="text-xs text-green-500/50 font-mono">ID: </span>
                          <span className="text-xs text-green-400 font-mono">{deployment.id.substring(0, 12)}...</span>
                        </div>

                        {/* Live URL */}
                        {deployment.liveUrl && (
                          <a
                            href={deployment.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-green-400 hover:text-green-300 text-sm mb-3 font-mono group"
                          >
                            <Globe className="w-4 h-4" />
                            <span className="group-hover:underline">VIEW LIVE SITE</span>
                          </a>
                        )}

                        {/* Build Logs */}
                        {deployment.buildLogs && (
                          <div className="mb-3">
                            <div className="text-xs text-green-500/70 font-mono mb-1">BUILD LOGS:</div>
                            <pre className="text-xs bg-black border border-green-500/30 p-2 rounded overflow-x-auto max-h-32 text-green-300 font-mono">
                              {deployment.buildLogs}
                            </pre>
                          </div>
                        )}

                        {/* Error Details */}
                        {deployment.errorDetails && (
                          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/50 rounded">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-300 font-mono">{deployment.errorDetails}</span>
                            </div>
                          </div>
                        )}

                        {/* Rollback Button */}
                        {deployment.status === 'success' && (
                          <button
                            onClick={() => rollbackToDeployment(deployment.id)}
                            className="w-full px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded text-sm font-mono text-yellow-400 flex items-center justify-center space-x-2 transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>ROLLBACK TO THIS VERSION</span>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Deployment Info */}
                <div className="mt-6 pt-4 border-t border-green-500/30">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2 text-xs font-mono text-green-500/70">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Deployments are automatically pushed to your GitHub branch and deployed via Netlify.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-xs font-mono text-green-500/70">
                      <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Your code is isolated and secure. Only you have access to your deployments.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar - Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-black via-green-950 to-black border-t-2 border-green-500/50 px-4 py-2"
      >
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">CONNECTED</span>
            </div>
            {currentFile && (
              <>
                <span className="text-green-500/70">
                  LINE: {code.split('\n').length} • CHARS: {code.length}
                </span>
                <span className="text-green-500/70">
                  {currentFile.path}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-500/70">MONACO EDITOR v1.0</span>
            <span className="text-green-500/70">TYPESCRIPT • JSX</span>
            <span className="text-green-400">READY</span>
          </div>
        </div>
      </motion.div>

      {/* Welcome Banner for First Time Users */}
      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-950 to-black border-2 border-green-500/50 rounded-2xl shadow-2xl shadow-green-500/20">
            <div className="text-center">
              <Terminal className="w-20 h-20 mx-auto mb-6 text-green-400" />
              <h2 className="text-3xl font-bold font-mono text-green-400 mb-4">WELCOME TO THE MATRIX</h2>
              <p className="text-green-300 font-mono mb-6">
                The world's first in-app code editor. Customize your entire dashboard with professional-grade tools.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-black/50 border border-green-500/30 rounded-lg">
                  <Code2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-mono text-green-300">MONACO EDITOR</p>
                </div>
                <div className="p-4 bg-black/50 border border-green-500/30 rounded-lg">
                  <GitBranch className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-mono text-green-300">GITHUB INTEGRATION</p>
                </div>
                <div className="p-4 bg-black/50 border border-green-500/30 rounded-lg">
                  <Rocket className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-mono text-green-300">ONE-CLICK DEPLOY</p>
                </div>
                <div className="p-4 bg-black/50 border border-green-500/30 rounded-lg">
                  <Wand2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-mono text-green-300">AI ASSISTANCE</p>
                </div>
              </div>
              <button
                onClick={loadFiles}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-mono font-bold rounded-lg shadow-lg shadow-green-500/50 transition-all"
              >
                START CODING
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Matrix Rain CSS */}
      <style jsx global>{`
        .matrix-rain {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          animation: matrix-scroll 20s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100px);
          }
        }
      `}</style>
    </div>
  )
}
