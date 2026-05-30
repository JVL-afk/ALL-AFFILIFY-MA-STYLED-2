'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Ban, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AUPPage() {
  const lastUpdated = "May 30, 2026"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-red-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Acceptable Use Policy (AUP)</h1>
          <p className="text-xl opacity-90">Guidelines for using the AFFILIFY platform</p>
          <p className="mt-4 text-sm opacity-75">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 prose prose-slate max-w-none">
          <h2>1. Prohibited Activities</h2>
          <p>Users are prohibited from using AFFILIFY for any of the following:</p>
          <ul>
            <li>Illegal activities or promotion of illegal products/services.</li>
            <li>Generating spam, phishing, or malicious content.</li>
            <li>Infringing on intellectual property rights of others.</li>
            <li>Attempting to circumvent platform security or session isolation.</li>
            <li>Scraping data in violation of third-party terms of service.</li>
          </ul>
          
          <h2>2. Compliance with Affiliate Networks</h2>
          <p>Users must comply with the terms and conditions of all affiliate networks they use (e.g., Amazon Associates, ClickBank). This includes proper affiliate disclosures and following network-specific content guidelines.</p>
          
          <h2>3. Enforcement</h2>
          <p>Violation of this AUP may lead to immediate account suspension or termination without refund. We reserve the right to remove any content that violates these guidelines.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
