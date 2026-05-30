'use client'

import { motion } from 'framer-motion'
import { FileText, Gavel, Mail, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DMCAPage() {
  const lastUpdated = "May 30, 2026"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <Gavel className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">DMCA Policy</h1>
          <p className="text-xl opacity-90">Digital Millennium Copyright Act Compliance</p>
          <p className="mt-4 text-sm opacity-75">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 prose prose-slate max-w-none">
          <h2>1. Copyright Infringement Notification</h2>
          <p>If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with a written notice containing the following information:</p>
          <ul>
            <li>A physical or electronic signature of the person authorized to act on behalf of the owner of the copyright interest.</li>
            <li>A description of the copyrighted work that you claim has been infringed.</li>
            <li>A description of where the material that you claim is infringing is located on the site.</li>
            <li>Your address, telephone number, and email address.</li>
            <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
          </ul>
          
          <h2>2. Contact Information</h2>
          <p>Please send all DMCA notices to: <span className="font-bold">legal@affilify.eu</span></p>
          
          <h2>3. Counter-Notification</h2>
          <p>If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification to our Copyright Agent with the required information under the DMCA.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
