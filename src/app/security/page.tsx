'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Globe,
  CreditCard,
  RefreshCw,
  Ban,
  Eye,
  Lock,
  Users,
  Gavel,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Info,
  Clock,
  DollarSign,
  Zap,
  Settings,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Code,
  Key,
  UserCheck,
  Bell,
  Share2
} from 'lucide-react'

export default function SecurityPage() {
  const lastUpdated = "April 13, 2026"

  const sections = [
    {
      id: 'security',
      title: 'Data Isolation & Session Security',
      icon: Shield,
      content: `At affilify.eu, your security and data isolation are our top priorities. We employ enterprise-grade encryption and strict session management to ensure your account remains private and secure. Please note that for security reasons, we implement strict IP-based rate limiting and session validation. In rare cases, if multiple accounts are accessed from the same IP address simultaneously, you may experience session conflicts as part of our anti-fraud protection. If this occurs, simply sign out and log back in to refresh your secure session. This ensures your data remains isolated and protected against unauthorized access attempts.`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold">Trust & Security</h1>
          </div>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="mb-8 bg-gray-800 bg-opacity-60 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <Icon className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </motion.div>
          )
        })}

        {/* Additional security info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 bg-gray-800 bg-opacity-60 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Lock className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold">Data Protection</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            All data transmitted through affilify.eu is encrypted using industry-standard TLS/SSL protocols. 
            Your personal information, payment details, and website data are stored securely and are never 
            shared with third parties without your explicit consent.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8 bg-gray-800 bg-opacity-60 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold">Account Security</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            We recommend using a strong, unique password for your affilify.eu account. If you ever suspect 
            unauthorized access to your account, please sign out immediately and contact our support team. 
            You can also enable two-factor authentication from your account settings for an extra layer of protection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8 bg-gray-800 bg-opacity-60 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold">Contact Security Team</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            If you have any security concerns or wish to report a vulnerability, please reach out to our 
            dedicated security team at <span className="text-purple-400">security@affilify.eu</span>. 
            We take all reports seriously and aim to respond within 24 hours.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
