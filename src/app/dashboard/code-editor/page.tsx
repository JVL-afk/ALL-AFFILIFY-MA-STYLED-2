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
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; filePath: string; isFolder: boolean } | null>(null)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [newFileParentPath, setNewFileParentPath] = useState('')
  const [newFolderParentPath, setNewFolderParentPath] = useState('')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renamePath, setRenamePath] = useState('')
  const [renameNewName, setRenameNewName] = useState('')
  const [isRenamingFolder, setIsRenamingFolder] = useState(false)
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

  const deleteFile = async (filePath: string) => {
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) {
      return
    }
    try {
      const response = await fetch('/api/code-editor/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });

      if (response.ok) {
        setFiles(files.filter((f) => f.path !== filePath));
        if (currentFile?.path === filePath) {
          setCurrentFile(files.length > 1 ? files[0] : null);
          setCode(files.length > 1 ? files[0].content : '');
        }
        alert('File deleted successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to delete file: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const renameFile = async (oldPath: string, newPath: string) => {
    if (oldPath === newPath) return;
    if (!confirm(`Are you sure you want to rename ${oldPath} to ${newPath}?`)) {
      return
    }
    try {
      const response = await fetch('/api/code-editor/files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      });

      if (response.ok) {
        setFiles(files.map((f) => (f.path === oldPath ? { ...f, path: newPath } : f)));
        if (currentFile?.path === oldPath) {
          setCurrentFile({ ...currentFile, path: newPath });
        }
        alert('File renamed successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to rename file: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to rename file:', error);
      alert('Failed to rename file. Please try again.');
    }
  };

  const createNewFile = async (parentPath: string, fileName: string) => {
    const filePath = parentPath ? `${parentPath}/${fileName}` : fileName;
    try {
      const response = await fetch('/api/code-editor/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content: '', isFolder: false }),
      });

      if (response.ok) {
        const data = await response.json();
        setFiles([...files, { ...data.file, lastModified: new Date(data.file.lastModified) }]);
        alert('File created successfully!');
        setShowNewFileDialog(false);
        setNewFileName('');
      } else {
        const data = await response.json();
        alert(`Failed to create file: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file. Please try again.');
    }
  };

  const createNewFolder = async (parentPath: string, folderName: string) => {
    const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
    try {
      const response = await fetch('/api/code-editor/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: folderPath, content: '', isFolder: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setFiles([...files, { ...data.file, lastModified: new Date(data.file.lastModified) }]);
        alert('Folder created successfully!');
        setShowNewFolderDialog(false);
        setNewFolderName('');
      } else {
        const data = await response.json();
        alert(`Failed to create folder: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

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
      } else {
        const data = await response.json()
        alert(`Rollback failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to rollback:', error)
      alert('An error occurred during rollback.')
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const handleFileSelect = (file: FileItem) => {
    setCurrentFile(file)
    setCode(file.content)
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const getAISuggestions = async () => {
    if (!currentFile) return

    try {
      const response = await fetch('/api/code-editor/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestions(data.suggestions)
        setShowAIPanel(true)
      } else {
        alert('Failed to get AI suggestions.')
      }
    } catch (error) {
      console.error('AI suggestion error:', error)
      alert('An error occurred while getting AI suggestions.')
    }
  }

  const applyAISuggestion = (suggestion: string) => {
    setCode(suggestion)
    setShowAIPanel(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const toggleFolder = (folderPath: string) => {
    const newExpandedFolders = new Set(expandedFolders)
    if (newExpandedFolders.has(folderPath)) {
      newExpandedFolders.delete(folderPath)
    } else {
      newExpandedFolders.add(folderPath)
    }
    setExpandedFolders(newExpandedFolders)
  }

  const handleSearch = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      const matches = model.findMatches(searchQuery, true, false, true, null, true)
      // You can highlight matches here if needed
    }
  }

  const handleReplace = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      const matches = model.findMatches(searchQuery, true, false, true, null, true)
      editorRef.current.executeEdits('replace', matches.map((match: any) => ({
        range: match.range,
        text: replaceQuery
      })))
    }
  }

  const handleContextMenu = (event: React.MouseEvent, filePath: string, isFolder: boolean) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, filePath, isFolder });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCreateNewFile = (parentPath: string) => {
    setNewFileParentPath(parentPath);
    setShowNewFileDialog(true);
    setContextMenu(null);
  };

  const handleCreateNewFolder = (parentPath: string) => {
    setNewFolderParentPath(parentPath);
    setShowNewFolderDialog(true);
    setContextMenu(null);
  };

  const handleRename = (path: string, isFolder: boolean) => {
    setRenamePath(path);
    setIsRenamingFolder(isFolder);
    setRenameNewName(path.split('/').pop() || '');
    setShowRenameDialog(true);
    setContextMenu(null);
  };

  const handleDelete = (path: string) => {
    deleteFile(path);
    setContextMenu(null);
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    const tree: { [key: string]: any } = {};

    items.forEach(item => {
      const parts = item.path.split('/');
      let currentLevel = tree;
      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = { _files: [] };
        }
        if (index === parts.length - 1) {
          currentLevel[part]._files.push(item);
        } else {
          currentLevel = currentLevel[part];
        }
      });
    });

    const renderNodes = (nodes: any, pathPrefix = '') => {
      return Object.entries(nodes).map(([name, node]) => {
        if (name === '_files') {
          return (node as any[]).map((file: FileItem) => (
            <div 
              key={file.path} 
              className={`pl-${level * 4} flex items-center space-x-2 cursor-pointer hover:bg-green-900/50 p-1 rounded ${currentFile?.path === file.path ? 'bg-green-800/70' : ''}`}
              onClick={() => handleFileSelect(file)}
              onContextMenu={(e) => handleContextMenu(e, file.path, false)}
            >
              <FileCode className="h-4 w-4 text-green-400" />
              <span>{file.path.split('/').pop()}</span>
            </div>
          ));
        }

        const folderPath = pathPrefix ? `${pathPrefix}/${name}` : name;
        const isExpanded = expandedFolders.has(folderPath);

        return (
          <div key={folderPath}>
            <div 
              className={`pl-${level * 4} flex items-center space-x-2 cursor-pointer hover:bg-green-900/50 p-1 rounded`}
              onClick={() => toggleFolder(folderPath)}
              onContextMenu={(e) => handleContextMenu(e, folderPath, true)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {isExpanded ? <FolderOpen className="h-4 w-4 text-yellow-400" /> : <Folder className="h-4 w-4 text-yellow-400" />}
              <span>{name}</span>
            </div>
            {isExpanded && (
              <div className="pl-4">
                {renderNodes(node, folderPath)}
              </div>
            )}
          </div>
        );
      });
    };

    return <div>{renderNodes(tree)}</div>;
  };

  return (
    <>
      <main className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} flex flex-col bg-black text-green-400`}>
        {/* Matrix Rain Background Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="matrix-rain"></div>
        </div>

        {/* Header - Matrix Style */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between p-2 border-b border-green-900/50 bg-black/30 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-4">
            <Code2 className="h-6 w-6 text-green-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider">AFFILIFY Code Editor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => router.push('/dashboard')} className="text-sm hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-green-900/50 rounded">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-1 overflow-hidden">
          {/* File Explorer */}
          <motion.div 
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-64 bg-black/50 p-2 border-r border-green-900/50 overflow-y-auto font-mono text-sm"
          >
            <h2 className="text-lg font-semibold mb-2 flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>File Explorer</span>
            </h2>
            {renderFileTree(files)}
          </motion.div>

          {/* Main Content: Editor and Visualizer */}
          <div className="flex-1 flex flex-col">
            <CodeEditorToolbar 
              currentFile={currentFile}
              saveFile={saveFile}
              isSaving={isSaving}
              deployToNetlify={deployToNetlify}
              isDeploying={isDeploying}
              editorMode={editorMode}
              setEditorMode={setEditorMode}
              getAISuggestions={getAISuggestions}
              setShowAIPanel={setShowAIPanel}
              showAIPanel={showAIPanel}
            />

            <div className="flex-1 relative">
              {editorMode === 'code' ? (
                <MonacoEditor
                  height="100%"
                  language={currentFile?.path.split('.').pop() || 'javascript'}
                  theme="vs-dark"
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: '"Fira Code", monospace',
                    fontLigatures: true,
                    wordWrap: 'on',
                    padding: { top: 10 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              ) : (
                <VisualEditor code={code} />
              )}
              
              <AnimatePresence>
                {showAIPanel && (
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute top-0 right-0 h-full w-1/3 bg-black/80 backdrop-blur-md border-l border-green-900/50 p-4 overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        <span>AI Suggestions</span>
                      </h3>
                      <button onClick={() => setShowAIPanel(false)} className="p-1 hover:bg-green-900/50 rounded">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.length > 0 ? (
                        aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="bg-gray-800/50 p-3 rounded border border-gray-700">
                            <pre className="whitespace-pre-wrap font-mono text-sm">{suggestion}</pre>
                            <button 
                              onClick={() => applyAISuggestion(suggestion)}
                              className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Apply Suggestion
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">No suggestions available.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar: Deployments & Status */}
          <motion.div 
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-72 bg-black/50 p-2 border-l border-green-900/50 overflow-y-auto font-mono text-sm"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Deployments</span>
              </h2>
              <div className="space-y-2">
                {deployments.map(dep => (
                  <div key={dep.id} className="bg-gray-800/50 p-2 rounded border border-gray-700 cursor-pointer" onClick={() => setActiveDeployment(dep)}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${dep.status === 'success' ? 'text-green-400' : dep.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {dep.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(dep.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">ID: {dep.id}</p>
                  </div>
                ))}
              </div>
            </div>

            {activeDeployment && (
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center space-x-2">
                  <Terminal className="h-4 w-4" />
                  <span>Deployment Details</span>
                </h3>
                <div className="bg-gray-900/70 p-3 rounded border border-gray-700 text-xs space-y-1">
                  <p><span className="font-bold">ID:</span> {activeDeployment.id}</p>
                  <p><span className="font-bold">Timestamp:</span> {new Date(activeDeployment.timestamp).toLocaleString()}</p>
                  <p><span className="font-bold">Status:</span> <span className={`font-bold ${activeDeployment.status === 'success' ? 'text-green-400' : activeDeployment.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>{activeDeployment.status}</span></p>
                  {activeDeployment.liveUrl && <p><span className="font-bold">URL:</span> <a href={activeDeployment.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{activeDeployment.liveUrl}</a></p>}
                  <div className="pt-2">
                    <h4 className="font-bold mb-1">Build Logs:</h4>
                    <pre className="bg-black p-2 rounded max-h-40 overflow-y-auto">{activeDeployment.buildLogs || 'No logs available.'}</pre>
                  </div>
                  {activeDeployment.status === 'success' && (
                    <button 
                      onClick={() => rollbackToDeployment(activeDeployment.id)}
                      className="mt-2 w-full px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Rollback to this version</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between p-1 border-t border-green-900/50 bg-black/30 text-xs"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <GitBranch className="h-3 w-3" />
              <span>main</span>
            </div>
            <div className="flex items-center space-x-1">
              {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 text-green-400" />}
              <span>{isSaving ? 'Saving...' : 'Saved'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last saved: {currentFile ? new Date(currentFile.lastModified).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
            <span>UTF-8</span>
            <span>{currentFile?.path.split('.').pop()?.toUpperCase()}</span>
          </div>
        </motion.div>
      </main>

      {contextMenu && (
        <div
          className="absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-lg py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={handleCloseContextMenu}
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            onClick={() => handleCreateNewFile(contextMenu.filePath)}
          >
            New File
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            onClick={() => handleCreateNewFolder(contextMenu.filePath)}
          >
            New Folder
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            onClick={() => handleRename(contextMenu.filePath, contextMenu.isFolder)}
          >
            Rename
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            onClick={() => handleDelete(contextMenu.filePath)}
          >
            Delete
          </button>
        </div>
      )}

      {/* New File Dialog */}
      <AnimatePresence>
        {showNewFileDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Create New File</h3>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
                placeholder="File Name (e.g., index.js)"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => setShowNewFileDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => createNewFile(newFileParentPath, newFileName)}
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Folder Dialog */}
      <AnimatePresence>
        {showNewFolderDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Create New Folder</h3>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
                placeholder="Folder Name (e.g., components)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => setShowNewFolderDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => createNewFolder(newFolderParentPath, newFolderName)}
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Dialog */}
      <AnimatePresence>
        {showRenameDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Rename {isRenamingFolder ? 'Folder' : 'File'}</h3>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-green-500 focus:border-green-500"
                placeholder={`New ${isRenamingFolder ? 'Folder' : 'File'} Name`}
                value={renameNewName}
                onChange={(e) => setRenameNewName(e.target.value)}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => setShowRenameDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    renameFile(renamePath, renameNewName);
                    setShowRenameDialog(false);
                  }}
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
