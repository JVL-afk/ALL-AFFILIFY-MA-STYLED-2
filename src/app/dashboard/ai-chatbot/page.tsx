'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Settings, Download, Trash2, Copy, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  rating?: 'up' | 'down';
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant for AFFILIFY. I can help you with:\n\n• Website optimization strategies\n• Affiliate marketing best practices\n• Content creation ideas\n• Performance analysis\n• Technical support\n\nHow can I assist you today?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // Load chat sessions
    loadChatSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = () => {
    // Mock chat sessions
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Website Optimization Tips',
        messages: [],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: '2',
        title: 'Affiliate Marketing Strategy',
        messages: [],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ];
    setChatSessions(mockSessions);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = generateAIResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('optimization') || input.includes('optimize')) {
      return `Great question about optimization! Here are some key strategies for your affiliate websites:

🎯 **Conversion Optimization:**
• Use compelling call-to-action buttons
• Implement urgency and scarcity tactics
• A/B test different layouts and copy
• Optimize page loading speed

📊 **SEO Optimization:**
• Target long-tail keywords
• Create high-quality, valuable content
• Build quality backlinks
• Optimize meta descriptions and titles

💡 **User Experience:**
• Ensure mobile responsiveness
• Simplify navigation
• Use clear product descriptions
• Include customer reviews and testimonials

Would you like me to elaborate on any of these strategies?`;
    }
    
    if (input.includes('content') || input.includes('writing')) {
      return `Content creation is crucial for affiliate success! Here are some proven strategies:

✍️ **Content Types That Convert:**
• Product comparison articles
• "Best of" roundup posts
• Tutorial and how-to guides
• Problem-solving content

🎯 **Content Optimization Tips:**
• Focus on buyer intent keywords
• Include personal experiences and stories
• Use high-quality images and videos
• Add clear affiliate disclosures

📈 **Content Strategy:**
• Create content clusters around main topics
• Update content regularly
• Repurpose content across platforms
• Track performance and optimize

Need help with specific content ideas for your niche?`;
    }
    
    if (input.includes('traffic') || input.includes('visitors')) {
      return `Driving traffic is essential for affiliate success! Here are effective methods:

🔍 **Organic Traffic:**
• SEO-optimized blog content
• YouTube video marketing
• Pinterest for visual products
• Social media engagement

💰 **Paid Traffic:**
• Google Ads (be careful with affiliate policies)
• Facebook and Instagram ads
• YouTube advertising
• Influencer partnerships

📧 **Email Marketing:**
• Build an email list with lead magnets
• Send valuable newsletters
• Promote relevant affiliate products
• Segment your audience for better targeting

Which traffic source would you like to focus on first?`;
    }
    
    if (input.includes('commission') || input.includes('earnings')) {
      return `Let's talk about maximizing your affiliate earnings! Here are proven strategies:

💰 **Higher Commission Strategies:**
• Focus on high-ticket items
• Promote recurring subscription products
• Join premium affiliate programs
• Negotiate higher commission rates

📊 **Conversion Optimization:**
• Use heat maps to understand user behavior
• Implement exit-intent popups
• Create compelling product reviews
• Build trust with testimonials

🎯 **Scaling Techniques:**
• Diversify across multiple programs
• Create evergreen content
• Build multiple income streams
• Reinvest profits into growth

What's your current monthly affiliate income goal?`;
    }
    
    // Default response
    return `I understand you're asking about "${userInput}". As your AI assistant, I'm here to help with all aspects of affiliate marketing!

Here are some areas I can assist with:

🚀 **Strategy & Planning:**
• Niche selection and research
• Competitor analysis
• Goal setting and tracking

🛠️ **Technical Support:**
• Website setup and optimization
• Analytics and tracking
• Tool recommendations

📈 **Growth & Scaling:**
• Traffic generation strategies
• Conversion optimization
• Revenue maximization

Could you be more specific about what you'd like help with? I'm here to provide detailed, actionable advice!`;
  };

  const rateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const startNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      type: 'bot',
      content: 'Hello! I\'m ready to help you with your affiliate marketing questions. What would you like to discuss?',
      timestamp: new Date(),
    }]);
    setCurrentSessionId(null);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-600" />
            AI Chatbot Assistant
          </h1>
          <p className="text-gray-600 mt-2">Get instant help with affiliate marketing strategies and optimization</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={startNewChat}>
            <Zap className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Button variant="outline" onClick={clearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-orange-500 hover:bg-orange-500'
                    }`}
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <p className="text-xs text-gray-500">
                      {session.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setInputMessage('How can I optimize my conversion rates?')}
                >
                  Conversion Tips
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setInputMessage('What are the best traffic sources for affiliate marketing?')}
                >
                  Traffic Strategies
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setInputMessage('How do I create compelling content for my affiliate site?')}
                >
                  Content Ideas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setInputMessage('What are the best affiliate programs to join?')}
                >
                  Program Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about affiliate marketing, website optimization, or content strategy
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-gray-900'
                          : 'bg-orange-500 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.type === 'bot' && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => rateMessage(message.id, 'up')}
                                  className={`h-6 w-6 p-0 ${message.rating === 'up' ? 'text-green-600' : ''}`}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => rateMessage(message.id, 'down')}
                                  className={`h-6 w-6 p-0 ${message.rating === 'down' ? 'text-red-600' : ''}`}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-orange-500 rounded-lg p-4 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about affiliate marketing strategies..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

