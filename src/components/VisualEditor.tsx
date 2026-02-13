'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Layout, 
  Square,
  Circle,
  MousePointer,
  Trash2,
  Copy,
  Move,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'

interface Component {
  id: string
  type: 'navbar' | 'hero' | 'card' | 'button' | 'text' | 'image' | 'footer' | 'section'
  x: number
  y: number
  width: number
  height: number
  content?: string
  styles: {
    backgroundColor?: string
    color?: string
    fontSize?: string
    fontWeight?: string
    padding?: string
    margin?: string
    borderRadius?: string
    border?: string
  }
}

interface VisualEditorProps {
  code: string
  onCodeChange: (code: string) => void
}

export default function VisualEditor({ code, onCodeChange }: VisualEditorProps) {
  const [components, setComponents] = useState<Component[]>([])
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const canvasRef = useRef<HTMLDivElement>(null)

  // Component templates
  const componentTemplates = [
    {
      type: 'navbar',
      icon: Layout,
      label: 'Navbar',
      defaultProps: {
        width: 100,
        height: 60,
        styles: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '1rem'
        }
      }
    },
    {
      type: 'hero',
      icon: Square,
      label: 'Hero Section',
      defaultProps: {
        width: 100,
        height: 400,
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '4rem'
        }
      }
    },
    {
      type: 'card',
      icon: Square,
      label: 'Card',
      defaultProps: {
        width: 300,
        height: 200,
        styles: {
          backgroundColor: '#ffffff',
          color: '#000000',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }
      }
    },
    {
      type: 'button',
      icon: Circle,
      label: 'Button',
      defaultProps: {
        width: 150,
        height: 50,
        content: 'Click Me',
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem'
        }
      }
    },
    {
      type: 'text',
      icon: Type,
      label: 'Text',
      defaultProps: {
        width: 300,
        height: 100,
        content: 'Edit this text',
        styles: {
          color: '#000000',
          fontSize: '1rem'
        }
      }
    },
    {
      type: 'image',
      icon: ImageIcon,
      label: 'Image',
      defaultProps: {
        width: 300,
        height: 200,
        styles: {
          backgroundColor: '#e5e7eb',
          borderRadius: '0.5rem'
        }
      }
    }
  ]

  // Add component to canvas
  const addComponent = (type: string) => {
    const template = componentTemplates.find(t => t.type === type)
    if (!template) return

    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x: 50,
      y: 50 + components.length * 20,
      width: template.defaultProps.width,
      height: template.defaultProps.height,
      content: template.defaultProps.content,
      styles: template.defaultProps.styles
    }

    setComponents([...components, newComponent])
    generateCode([...components, newComponent])
  }

  // Handle component selection
  const selectComponent = (component: Component) => {
    setSelectedComponent(component)
  }

  // Handle component drag
  const handleMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation()
    setIsDragging(true)
    setSelectedComponent(component)
    
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedComponent || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y

    setComponents(components.map(c => 
      c.id === selectedComponent.id 
        ? { ...c, x: newX, y: newY }
        : c
    ))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    generateCode(components)
  }

  // Delete component
  const deleteComponent = (id: string) => {
    const newComponents = components.filter(c => c.id !== id)
    setComponents(newComponents)
    setSelectedComponent(null)
    generateCode(newComponents)
  }

  // Duplicate component
  const duplicateComponent = (component: Component) => {
    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      x: component.x + 20,
      y: component.y + 20
    }
    const newComponents = [...components, newComponent]
    setComponents(newComponents)
    generateCode(newComponents)
  }

  // Update component styles
  const updateComponentStyle = (property: string, value: string) => {
    if (!selectedComponent) return

    const newComponents = components.map(c =>
      c.id === selectedComponent.id
        ? { ...c, styles: { ...c.styles, [property]: value } }
        : c
    )
    setComponents(newComponents)
    setSelectedComponent({ ...selectedComponent, styles: { ...selectedComponent.styles, [property]: value } })
    generateCode(newComponents)
  }

  // Update component content
  const updateComponentContent = (content: string) => {
    if (!selectedComponent) return

    const newComponents = components.map(c =>
      c.id === selectedComponent.id
        ? { ...c, content }
        : c
    )
    setComponents(newComponents)
    setSelectedComponent({ ...selectedComponent, content })
    generateCode(newComponents)
  }

  // Generate React code from components
  const generateCode = (comps: Component[]) => {
    const code = `
import React from 'react'

export default function GeneratedPage() {
  return (
    <div className="min-h-screen">
${comps.map(comp => {
  const styles = Object.entries(comp.styles)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(', ')
  
  return `      <div 
        style={{ 
          position: 'absolute',
          left: '${comp.x}px',
          top: '${comp.y}px',
          width: '${comp.width}px',
          height: '${comp.height}px',
          ${styles}
        }}
      >
        ${comp.content || comp.type}
      </div>`
}).join('\n')}
    </div>
  )
}
`
    onCodeChange(code)
  }

  // Get canvas width based on view mode
  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
    }
  }

  return (
    <div className="flex h-full bg-gray-900">
      {/* Component Palette */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-4">🎨 Components</h2>
        <div className="space-y-2">
          {componentTemplates.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.type}
                onClick={() => addComponent(template.type)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
              >
                <Icon className="w-5 h-5" />
                <span>{template.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Monitor className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Tablet className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Smartphone className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="text-white text-sm">
            {components.length} components
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-700 p-8">
          <div
            ref={canvasRef}
            className="bg-white mx-auto relative"
            style={{ 
              width: getCanvasWidth(),
              minHeight: '800px',
              boxShadow: '0 0 50px rgba(0,0,0,0.3)'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {components.map((component) => (
              <div
                key={component.id}
                onClick={() => selectComponent(component)}
                onMouseDown={(e) => handleMouseDown(e, component)}
                className={`absolute cursor-move ${
                  selectedComponent?.id === component.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: `${component.x}px`,
                  top: `${component.y}px`,
                  width: `${component.width}px`,
                  height: `${component.height}px`,
                  ...component.styles
                }}
              >
                <div className="flex items-center justify-center h-full">
                  {component.content || component.type}
                </div>
                {selectedComponent?.id === component.id && (
                  <div className="absolute -top-8 right-0 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateComponent(component)
                      }}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteComponent(component.id)
                      }}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Inspector */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-4">⚙️ Properties</h2>
        {selectedComponent ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Content</label>
              <input
                type="text"
                value={selectedComponent.content || ''}
                onChange={(e) => updateComponentContent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Background Color</label>
              <input
                type="color"
                value={selectedComponent.styles.backgroundColor || '#ffffff'}
                onChange={(e) => updateComponentStyle('backgroundColor', e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Text Color</label>
              <input
                type="color"
                value={selectedComponent.styles.color || '#000000'}
                onChange={(e) => updateComponentStyle('color', e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Font Size</label>
              <input
                type="text"
                value={selectedComponent.styles.fontSize || '1rem'}
                onChange={(e) => updateComponentStyle('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                placeholder="e.g., 1rem, 16px"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Padding</label>
              <input
                type="text"
                value={selectedComponent.styles.padding || '0'}
                onChange={(e) => updateComponentStyle('padding', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                placeholder="e.g., 1rem, 10px"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Border Radius</label>
              <input
                type="text"
                value={selectedComponent.styles.borderRadius || '0'}
                onChange={(e) => updateComponentStyle('borderRadius', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                placeholder="e.g., 0.5rem, 8px"
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Select a component to edit its properties</p>
        )}
      </div>
    </div>
  )
}

