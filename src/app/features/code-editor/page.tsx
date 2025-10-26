'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code2, Sparkles, GitBranch, Rocket, Wand2, History, Eye, CheckCircle, Zap, Shield, Users, Crown } from 'lucide-react'
import Header from '@/components/Header'

export default function CodeEditorPage() {
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Crown className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold">ENTERPRISE EXCLUSIVE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              The World's First In-App Code Editor
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto mb-8">
            Customize your entire AFFILIFY dashboard with professional-grade tools. Code editor, visual editor, AI assistance, and one-click deployment—all in one revolutionary platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/signup?plan=enterprise" 
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Enterprise Trial
            </Link>
            <Link 
              href="/pricing" 
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>

        {/* Editor Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Editor Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-white font-bold text-lg">🚀 AFFILIFY Code Editor</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 rounded text-white text-sm">💻 Code Editor</button>
                  <button className="px-4 py-2 bg-gray-700 rounded text-white text-sm">🎨 Visual Editor</button>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 rounded text-white text-sm">💾 Save</button>
                <button className="px-4 py-2 bg-orange-600 rounded text-white text-sm">🚀 Deploy</button>
              </div>
            </div>
            
            {/* Editor Body */}
            <div className="flex">
              {/* File Tree */}
              <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
                <h4 className="text-white font-semibold mb-4">📁 Files</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-white/70 hover:text-white cursor-pointer">📄 page.tsx</div>
                  <div className="text-white/70 hover:text-white cursor-pointer">📄 layout.tsx</div>
                  <div className="text-white/70 hover:text-white cursor-pointer">📄 ab-testing/page.tsx</div>
                  <div className="text-white/70 hover:text-white cursor-pointer">📄 analytics/page.tsx</div>
                  <div className="text-blue-400 font-semibold">📄 dashboard/page.tsx</div>
                  <div className="text-white/70 hover:text-white cursor-pointer">📄 settings/page.tsx</div>
                </div>
              </div>
              
              {/* Code Area */}
              <div className="flex-1 p-6 bg-gray-900">
                <div className="font-mono text-sm">
                  <div className="text-gray-500">1</div>
                  <div className="text-gray-500">2</div>
                  <div className="text-gray-500">3</div>
                  <div className="text-gray-500">4</div>
                  <div className="text-gray-500">5</div>
                  <div className="text-gray-500">6</div>
                  <div className="text-gray-500">7</div>
                  <div className="text-gray-500">8</div>
                  <div className="text-gray-500">9</div>
                </div>
                <div className="font-mono text-sm -mt-[180px] ml-8">
                  <div><span className="text-purple-400">export</span> <span className="text-blue-400">default</span> <span className="text-yellow-400">function</span> <span className="text-green-400">Dashboard</span>() {'{'}</div>
                  <div className="ml-4"><span className="text-purple-400">return</span> (</div>
                  <div className="ml-8">{'<'}<span className="text-blue-400">div</span> <span className="text-orange-400">className</span>=<span className="text-green-300">"flex flex-col"</span>{'>'}</div>
                  <div className="ml-12">{'<'}<span className="text-blue-400">h1</span>{'>'}<span className="text-white">Welcome to AFFILIFY</span>{'</'}<span className="text-blue-400">h1</span>{'>'}</div>
                  <div className="ml-12">{'<'}<span className="text-blue-400">p</span>{'>'}<span className="text-white">Customize this page however you want!</span>{'</'}<span className="text-blue-400">p</span>{'>'}</div>
                  <div className="ml-8">{'</'}<span className="text-blue-400">div</span>{'>'}</div>
                  <div className="ml-4">)</div>
                  <div>{'}'}</div>
                </div>
              </div>
              
              {/* Deployment History */}
              <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
                <h4 className="text-white font-semibold mb-4">📜 Deployments</h4>
                <div className="space-y-3">
                  <div className="bg-green-900/30 border border-green-600 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-green-400 text-xs font-semibold">✅ Success</span>
                      <span className="text-gray-400 text-xs">2m ago</span>
                    </div>
                    <div className="text-white text-xs">v1.2.3</div>
                  </div>
                  <div className="bg-green-900/30 border border-green-600 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-green-400 text-xs font-semibold">✅ Success</span>
                      <span className="text-gray-400 text-xs">1h ago</span>
                    </div>
                    <div className="text-white text-xs">v1.2.2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dual Mode Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Dual-Mode Editing System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">💻 Code Editor Mode</h3>
              <p className="text-white/70 mb-4">
                Professional Monaco Editor (VS Code engine) with full TypeScript/JSX support, syntax highlighting, auto-completion, and error detection.
              </p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> IntelliSense auto-completion</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Real-time error detection</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Multi-file editing</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Format on paste & type</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">🎨 Visual Editor Mode</h3>
              <p className="text-white/70 mb-4">
                Drag-and-drop Wix-style interface for non-technical users. Build stunning dashboards without writing a single line of code.
              </p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Drag & drop components</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Live preview</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Property inspector</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Responsive design tools</li>
              </ul>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Revolutionary Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">GitHub Integration</h3>
              <p className="text-white/70">
                Automatic code push to your personal GitHub branch. Full version control with commit history tracking.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">One-Click Deployment</h3>
              <p className="text-white/70">
                Deploy to Netlify with a single click. Real-time build status tracking and live URL generation.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Assistance</h3>
              <p className="text-white/70">
                Gemini 2.0 AI explains build errors, suggests fixes, and provides code improvement recommendations.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <History className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Version Control & Rollback</h3>
              <p className="text-white/70">
                Full deployment history with one-click rollback to any previous version. Never lose your work.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Enterprise Security</h3>
              <p className="text-white/70">
                Bulletproof user isolation. Your code is stored in a private database and deployed to your own GitHub branch.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">24 Default Files</h3>
              <p className="text-white/70">
                Start with a complete, working dashboard. All files are pre-populated and ready to customize.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Advanced Toolbar */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Advanced Editor Toolbar</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Format</h4>
                <p className="text-white/70 text-sm">Instant code formatting</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Search</h4>
                <p className="text-white/70 text-sm">Multi-file search with regex</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Replace</h4>
                <p className="text-white/70 text-sm">Global find-and-replace</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">AI Assist</h4>
                <p className="text-white/70 text-sm">Get improvement suggestions</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why This is Revolutionary */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why This is Revolutionary</h2>
          
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">🌟 First-of-its-Kind</h3>
                <p className="text-white/80 mb-6">
                  No other SaaS platform in the world offers in-app code editing. AFFILIFY is pioneering a new era of user customization.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-white">🚀 Full-Stack Integration</h3>
                <p className="text-white/80 mb-6">
                  Real GitHub integration, Netlify deployment, MongoDB storage, and AI assistance—all working together seamlessly.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-white">🎯 For Everyone</h3>
                <p className="text-white/80">
                  Developers get professional tools (Monaco Editor). Non-technical users get a visual editor. Everyone wins.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">🤖 AI-Powered</h3>
                <p className="text-white/80 mb-6">
                  Gemini 2.0 Flash provides intelligent error explanations, fix suggestions, and code improvement recommendations.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-white">🔒 Enterprise Security</h3>
                <p className="text-white/80 mb-6">
                  Your code is isolated in a private database. Your deployments go to your own GitHub branch. No cross-user access.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-white">⏪ Version Control</h3>
                <p className="text-white/80">
                  Full deployment history with one-click rollback. Experiment with confidence knowing you can always go back.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Perfect For</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Agencies</h3>
              <p className="text-white/70">
                Customize dashboards for each client with unique branding, features, and workflows.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Code2 className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Developers</h3>
              <p className="text-white/70">
                Build custom features, integrate APIs, and create unique workflows tailored to your needs.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Crown className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Power Users</h3>
              <p className="text-white/70">
                Take full control of your dashboard appearance and functionality without limitations.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Revolutionize Your Workflow?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Join the Enterprise plan today and get access to the world's first in-app code editor. Customize everything, deploy with one click, and build the dashboard of your dreams.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/signup?plan=enterprise" 
                className="px-8 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Enterprise Trial - $99/month
              </Link>
              <Link 
                href="/dashboard/code-editor" 
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                View Live Demo
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              💎 Exclusive to Enterprise plan • 🚀 Deploy in minutes • 🤖 AI-powered assistance
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

