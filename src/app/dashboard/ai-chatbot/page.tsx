'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Target,
  BarChart3,
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

interface QuickPrompt {
  icon: any
  title: string
  prompt: string
  color: string
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts: QuickPrompt[] = [
    {
      icon: TrendingUp,
      title: 'Boost Conversions',
      prompt: 'How can I improve my affiliate website conversion rate?',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Target,
      title: 'SEO Strategy',
      prompt: 'What are the best SEO practices for affiliate marketing?',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Insights',
      prompt: 'How do I analyze my affiliate marketing performance?',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Lightbulb,
      title: 'Content Ideas',
      prompt: 'Give me content ideas for my affiliate blog',
      color: 'from-blue-500 to-purple-600',
    },
  ]

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
        const sessions: ChatSession[] = data.sessions ?? []
        setChatSessions(sessions)

        if (sessions.length === 0) {
          // FIX: await createNewSession so we have an ID immediately
          await createNewSession('Getting Started with AFFILIFY')
        } else {
          setCurrentSessionId(sessions[0].id)
        }
      } else {
        setError('Failed to load chat sessions')
      }
    } catch (err) {
      console.error('Error loading chat sessions:', err)
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
        setMessages(data.messages ?? [])
      } else {
        setError('Failed to load messages')
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages')
    }
  }

  /**
   * FIX: createNewSession now returns the new session ID so callers
   * can immediately use it — no more fragile setTimeout().
   */
  const createNewSession = async (title: string = 'New Chat'): Promise<string | null> => {
    try {
      const response = await fetch('/api/chatbot/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (response.ok) {
        const newSession: ChatSession = data.session
        setChatSessions(prev => [newSession, ...prev])
        setCurrentSessionId(newSession.id)
        setMessages([])
        return newSession.id
      } else {
        setError('Failed to create new session')
        return null
      }
    } catch (err) {
      console.error('Error creating session:', err)
      setError('Failed to create new session')
      return null
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return

    try {
      const response = await fetch(`/api/chatbot/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChatSessions(prev => {
          const remaining = prev.filter(s => s.id !== sessionId)
          if (currentSessionId === sessionId) {
            if (remaining.length > 0) {
              setCurrentSessionId(remaining[0].id)
            } else {
              // Will auto-create a fresh session
              createNewSession('New Chat')
            }
          }
          return remaining
        })
      } else {
        setError('Failed to delete session')
      }
    } catch (err) {
      console.error('Error deleting session:', err)
      setError('Failed to delete session')
    }
  }

  /**
   * FIX: If there is no currentSessionId yet (race on mount), create one first
   * before sending the message, then use the returned ID.
   */
  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage
    if (!messageToSend.trim() || isLoading) return

    // FIX: Resolve (or create) session before doing anything else
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await createNewSession('New Chat')
      if (!sessionId) return // session creation failed — error already set
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend, sessionId }),
      })

      const data = await response.json()

      if (response.ok && data.message) {
        setMessages(prev => [...prev, {
          ...data.message,
          timestamp: new Date(data.message.timestamp),
        }])
        // Refresh session list to update lastMessage preview
        loadChatSessions()
      } else {
        const errText = data.error || data.message || 'Failed to get AI response'
        setError(errText)
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm experiencing some technical difficulties. Please try again in a moment.",
          timestamp: new Date(),
        }])
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message')
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const rateMessage = async (messageId: string, rating: 'up' | 'down') => {
    // Optimistic UI update first
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    ))
    try {
      await fetch('/api/chatbot/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, rating }),
      })
    } catch (err) {
      console.error('Error rating message:', err)
    }
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loadingSessions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg">Loading AI Assistant...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400">
                  AI Assistant
                </h1>
                <p className="text-blue-200/70 text-sm">Expert affiliate marketing advice powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-500/20 rounded-full text-sm text-green-300 border border-green-500/30 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Online
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-200">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-120px)]">
          {/* Chat Sessions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span>Chat History</span>
                  </CardTitle>
                  <Button
                    onClick={() => createNewSession()}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-600 hover:to-yellow-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="space-y-2 max-h-full overflow-y-auto p-4">
                  {chatSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentSessionId === session.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border-blue-500/50'
                          : 'bg-black/20 border-blue-500/20 hover:border-yellow-500/50'
                      }`}
                      onClick={() => setCurrentSessionId(session.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-white truncate">{session.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-blue-300/60" />
                            <p className="text-xs text-blue-200/60">
                              {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          {session.lastMessage && (
                            <p className="text-xs text-blue-300/50 mt-1 truncate">{session.lastMessage}</p>
                          )}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 h-full flex flex-col">
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Start a Conversation</h3>
                    <p className="text-blue-200/70 mb-8 max-w-md">
                      Ask me anything about affiliate marketing, SEO, conversions, or content strategy!
                    </p>

                    {/* Quick Prompts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                      {quickPrompts.map((prompt, index) => {
                        const Icon = prompt.icon
                        return (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => sendMessage(prompt.prompt)}
                            className={`p-4 bg-gradient-to-r ${prompt.color} bg-opacity-10 border border-blue-500/30 rounded-lg hover:border-yellow-500/50 transition-all text-left group`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${prompt.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-semibold mb-1 flex items-center justify-between">
                                  {prompt.title}
                                  <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div className="text-xs text-blue-200/70">{prompt.prompt}</div>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1">
                            <div className={`p-4 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                            }`}>
                              <p className="text-white whitespace-pre-wrap">{message.content}</p>
                            </div>

                            {/* Message Actions */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-blue-200/60">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>

                              {message.type === 'bot' && (
                                <>
                                  <button
                                    onClick={() => copyMessage(message.content, message.id)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    {copiedId === message.id ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => rateMessage(message.id, 'up')}
                                    className={`transition-colors ${
                                      message.rating === 'up' ? 'text-green-400' : 'text-blue-400 hover:text-green-400'
                                    }`}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rateMessage(message.id, 'down')}
                                    className={`transition-colors ${
                                      message.rating === 'down' ? 'text-red-400' : 'text-blue-400 hover:text-red-400'
                                    }`}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about affiliate marketing..."
                    className="flex-1 bg-black/50 border-blue-500/30 text-white placeholder:text-blue-300/50 h-12"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500 hover:from-blue-600 hover:via-yellow-600 hover:to-orange-600 text-white h-12 px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-blue-200/60 mt-2 text-center">
                  AI can make mistakes. Verify important information.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
