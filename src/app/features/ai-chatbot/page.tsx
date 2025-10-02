import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Brain, Zap, Users, Settings, ArrowRight, CheckCircle, Globe, Target, Clock } from 'lucide-react'
import Header from '@/components/Header'

export default function AIChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              AI-Powered Chatbot for Affiliate Websites
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Engage visitors, answer questions, and guide them toward conversion with intelligent AI chatbots.
          </p>
        </motion.div>

        {/* Chatbot Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">AFFILIFY Assistant</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-white/70 text-sm">Online</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                  <p className="text-white text-sm">
                    Hello! Welcome to FitnessGearPro. How can I help you find the perfect fitness equipment today?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-orange-600/30 rounded-lg p-3 max-w-[80%]">
                  <p className="text-white text-sm">
                    I'm looking for a treadmill for my home gym. My budget is around $1000.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                  <p className="text-white text-sm">
                    Great! For a $1000 budget, I recommend the NordicTrack T Series or the ProForm Carbon T10. Both offer excellent features for home use. Would you like me to compare their specifications?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-orange-600/30 rounded-lg p-3 max-w-[80%]">
                  <p className="text-white text-sm">
                    Yes, please compare them for me.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. AI Training</h3>
              <p className="text-white/70">
                Our AI chatbot is trained on your products, content, and affiliate offers to provide accurate and helpful responses.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Visitor Engagement</h3>
              <p className="text-white/70">
                The chatbot engages with visitors, answers questions, and guides them toward products that match their needs.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Conversion Optimization</h3>
              <p className="text-white/70">
                The chatbot strategically recommends affiliate products and provides links to maximize your conversion rate.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Product Knowledge</h3>
                <p className="text-white/70">
                  The AI chatbot has deep knowledge of your affiliate products and can answer detailed questions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">24/7 Availability</h3>
                <p className="text-white/70">
                  Provide instant support to visitors around the clock, even when you're not available.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Personalized Recommendations</h3>
                <p className="text-white/70">
                  The chatbot tailors product recommendations based on visitor preferences and needs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Natural Conversations</h3>
                <p className="text-white/70">
                  Advanced natural language processing enables human-like conversations with visitors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Conversion Tracking</h3>
                <p className="text-white/70">
                  Track how chatbot interactions lead to affiliate link clicks and conversions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Customizable Appearance</h3>
                <p className="text-white/70">
                  Customize the chatbot's appearance to match your website's branding and style.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Benefits for Affiliate Marketers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Zap className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Increased Conversions</h3>
              <p className="text-white/70">
                Boost your conversion rates by providing personalized product recommendations and answering questions instantly.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Better User Experience</h3>
              <p className="text-white/70">
                Enhance visitor satisfaction with instant support and personalized assistance throughout their journey.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Clock className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Time Savings</h3>
              <p className="text-white/70">
                Automate customer support and product recommendations, freeing up your time for other marketing activities.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Add an AI Chatbot to Your Affiliate Website?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Boost your conversions and provide better user experience with our intelligent AI chatbot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
