
'use client'

import { motion } from 'framer-motion'
import { 
  Save, 
  Rocket, 
  Sparkles, 
  Eye, 
  Code2, 
  Loader2, 
  Search 
} from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface FileItem {
  path: string
  content: string
  lastModified: Date
}

interface CodeEditorToolbarProps {
  currentFile: FileItem | null
  saveFile: () => Promise<void>
  isSaving: boolean
  deployToNetlify: () => Promise<void>
  isDeploying: boolean
  editorMode: 'code' | 'visual'
  setEditorMode: Dispatch<SetStateAction<'code' | 'visual'>>
  getAISuggestions: () => Promise<void>
  setShowAIPanel: Dispatch<SetStateAction<boolean>>
  showAIPanel: boolean
}

export default function CodeEditorToolbar({
  currentFile,
  saveFile,
  isSaving,
  deployToNetlify,
  isDeploying,
  editorMode,
  setEditorMode,
  getAISuggestions,
  setShowAIPanel,
  showAIPanel
}: CodeEditorToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b border-green-900/50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="flex bg-green-900/20 rounded-lg p-1">
          <button 
            onClick={() => setEditorMode('code')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center space-x-2 ${
              editorMode === 'code' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-green-500 hover:bg-green-900/30'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>CODE</span>
          </button>
          <button 
            onClick={() => setEditorMode('visual')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center space-x-2 ${
              editorMode === 'visual' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-green-500 hover:bg-green-900/30'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>VISUAL</span>
          </button>
        </div>
        
        {currentFile && (
          <div className="text-xs font-mono text-green-500/70 truncate max-w-[200px]">
            {currentFile.path}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getAISuggestions}
          className={`p-2 rounded-md transition-all flex items-center space-x-2 border ${
            showAIPanel ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black border-green-900/50 text-green-500 hover:border-green-500'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-mono hidden md:inline">AI ASSIST</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveFile}
          disabled={isSaving || !currentFile}
          className="p-2 rounded-md bg-black border border-green-900/50 text-green-500 hover:border-green-500 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="text-xs font-mono hidden md:inline">SAVE</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={deployToNetlify}
          disabled={isDeploying}
          className="p-2 rounded-md bg-green-500 text-black font-bold hover:bg-green-400 transition-all flex items-center space-x-2 disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          {isDeploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          <span className="text-xs font-mono hidden md:inline">DEPLOY</span>
        </motion.button>
      </div>
    </div>
  )
}
