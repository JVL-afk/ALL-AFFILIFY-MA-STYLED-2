'use client'

import { motion } from 'framer-motion'
import { Shield, Database, Lock, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DPAPage() {
  const lastUpdated = "May 30, 2026"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Data Processing Agreement (DPA)</h1>
          <p className="text-xl opacity-90">How we handle and protect your data</p>
          <p className="mt-4 text-sm opacity-75">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 prose prose-slate max-w-none">
          <h2>1. Introduction</h2>
          <p>This Data Processing Agreement ("DPA") forms part of the Terms of Service between AFFILIFY and the User. It reflects the parties' agreement with regard to the processing of personal data.</p>
          
          <h2>2. Definitions</h2>
          <p>Terms used in this DPA shall have the meanings set forth in the GDPR or other applicable data protection laws.</p>
          
          <h2>3. Processing of Personal Data</h2>
          <p>AFFILIFY shall process personal data only on behalf of and in accordance with the User's documented instructions for the following purposes: (i) processing in accordance with the Agreement; and (ii) processing to comply with other documented reasonable instructions provided by the User.</p>
          
          <h2>4. Technical and Organizational Measures</h2>
          <p>AFFILIFY has implemented and will maintain appropriate technical and organizational measures to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, damage, alteration, or disclosure.</p>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
            <h3 className="text-blue-800 mt-0">Security Commitments:</h3>
            <ul className="list-none pl-0 space-y-2">
              <li className="flex items-center gap-2 text-blue-700"><CheckCircle className="w-4 h-4" /> Encryption of data at rest and in transit</li>
              <li className="flex items-center gap-2 text-blue-700"><CheckCircle className="w-4 h-4" /> Regular security audits and vulnerability scans</li>
              <li className="flex items-center gap-2 text-blue-700"><CheckCircle className="w-4 h-4" /> Strict access controls and session management</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
