'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown,
  Copy,
  Loader2,
  Bot,
  User,
  Sparkles,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  rating?: 'up' | 'down'
}

interface ChatSession {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount?: number
  lastMessage?: string
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChatSessions()
  }, [])

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId)
    }
  }, [currentSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatSessions = async () => {
    try {
      setLoadingSessions(true)
      const response = await fetch('/api/chatbot/sessions')
      const data = await response.json()

      if (response.ok) {
        setChatSessions(data.sessions || [])
        
        // If no sessions exist, create a default one
        if (data.sessions.length === 0) {
          await createNewSession('Getting Started with AFFILIFY')
        } else {
          // Load the most recent session
          setCurrentSessionId(data.sessions[0].id)
        }
      } else {
        setError('Failed to load chat sessions')
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      setError('Failed to load chat sessions')
    } finally {
      setLoadingSessions(false)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chatbot/messages?sessionId=${sessionId}`)
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages || [])
      } else {
        setError('Failed to load messages')
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setError('Failed to load messages')
    }
  }

  const createNewSession = async (title: string = 'New Chat') => {
    try {
      const response = await fetch('/api/chatbot/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (response.ok) {
        const newSession = data.session
        setChatSessions(prev => [newSession, ...prev])
        setCurrentSessionId(newSession.id)
        setMessages([])
        
        // Load the welcome message
        setTimeout(() => loadMessages(newSession.id), 500)
      } else {
        setError('Failed to create new session')
      }
    } catch (error) {
      console.error('Error creating session:', error)
      setError('Failed to create new session')
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return

    try {
      const response = await fetch(`/api/chatbot/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        
        if (currentSessionId === sessionId) {
          const remainingSessions = chatSessions.filter(s => s.id !== sessionId)
          if (remainingSessions.length > 0) {
            setCurrentSessionId(remainingSessions[0].id)
          } else {
            await createNewSession('New Chat')
          }
        }
      } else {
        setError('Failed to delete session')
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      setError('Failed to delete session')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentSessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: currentSessionId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(prev => [...prev, data.message])
        
        // Update session list to reflect new activity
        loadChatSessions()
      } else {
        setError(data.message || 'Failed to get AI response')
        
        // Add error message to chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message')
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const rateMessage = async (messageId: string, rating: 'up' | 'down') => {
    try {
      const response = await fetch('/api/chatbot/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, rating }),
      })

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, rating } : msg
        ))
      }
    } catch (error) {
      console.error('Error rating message:', error)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loadingSessions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-600" />
          AFFILIFY AI Assistant
        </h1>
        <p className="text-gray-600">Get expert affiliate marketing advice powered by advanced AI</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat Sessions</CardTitle>
                <Button
                  onClick={() => createNewSession()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto p-4">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{session.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                        {session.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {session.lastMessage}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about affiliate marketing, website optimization, or business strategy
              </CardDescription>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-400px)]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {message.type === 'bot' && (
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => rateMessage(message.id, 'up')}
                              variant="ghost"
                              size="sm"
                              className={`h-6 w-6 p-0 ${
                                message.rating === 'up' ? 'text-green-600' : 'text-gray-400'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => rateMessage(message.id, 'down')}
                              variant="ghost"
                              size="sm"
                              className={`h-6 w-6 p-0 ${
                                message.rating === 'down' ? 'text-red-600' : 'text-gray-400'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => copyMessage(message.content)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-gray-600">AFFILIFY AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about affiliate marketing, SEO, conversions, or anything else..."
                    disabled={isLoading || !currentSessionId}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim() || !currentSessionId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

