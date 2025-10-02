'use client'

import Link from 'next/link'
import { FileText, Shield, Scale, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

export default function LegalPage() {
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
              Legal Information
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Important legal documents and policies for AFFILIFY users.
          </p>
        </motion.div>

        {/* Legal Documents Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/terms">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Terms of Service</h3>
                <p className="text-white/70 mb-6">
                  The legal agreement between you and AFFILIFY governing your use of our platform and services.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Read Terms</span>
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            <Link href="/privacy">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Privacy Policy</h3>
                <p className="text-white/70 mb-6">
                  How we collect, use, and protect your personal information when you use our platform.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Read Policy</span>
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            <Link href="/legal/cookies">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Cookie Policy</h3>
                <p className="text-white/70 mb-6">
                  Information about how we use cookies and similar technologies on our website.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Read Policy</span>
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            <Link href="/legal/disclaimer">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Disclaimer</h3>
                <p className="text-white/70 mb-6">
                  Important disclaimers regarding the use of our platform and affiliate marketing practices.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Read Disclaimer</span>
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Have Legal Questions?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              If you have any questions about our legal policies or need further clarification, please contact our legal team.
            </p>
            <Link href="/contact">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg">
                Contact Legal Team
              </button>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
