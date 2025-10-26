'use client'

import { useState } from 'react'
import { Search, Replace, Code2, Wand2 } from 'lucide-react'

interface CodeEditorToolbarProps {
  onFormat: () => void
  onSearch: (query: string) => void
  onReplace: (find: string, replace: string) => void
  onAIAssist: () => void
}

export default function CodeEditorToolbar({
  onFormat,
  onSearch,
  onReplace,
  onAIAssist
}: CodeEditorToolbarProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={onFormat}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center space-x-1"
        >
          <Code2 className="w-4 h-4" />
          <span>Format</span>
        </button>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center space-x-1"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setShowReplace(!showReplace)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center space-x-1"
        >
          <Replace className="w-4 h-4" />
          <span>Replace</span>
        </button>

        <button
          onClick={onAIAssist}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center space-x-1"
        >
          <Wand2 className="w-4 h-4" />
          <span>AI Assist</span>
        </button>
      </div>

      {showSearch && (
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in files..."
            className="flex-1 px-3 py-1 bg-gray-700 text-white rounded text-sm"
          />
          <button
            onClick={() => onSearch(searchQuery)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Search
          </button>
        </div>
      )}

      {showReplace && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find..."
              className="flex-1 px-3 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with..."
              className="flex-1 px-3 py-1 bg-gray-700 text-white rounded text-sm"
            />
            <button
              onClick={() => onReplace(findText, replaceText)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Replace All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

