'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle, Info, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link href="/legal">
            <button className="flex items-center text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Legal</span>
            </button>
          </Link>
        </motion.div>
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Disclaimer
            </span>
          </h1>
          <p className="text-white/80 text-xl text-center max-w-3xl mx-auto">
            Last Updated: October 1, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
        >
          <div className="prose prose-invert max-w-none">
            <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                <p className="text-white/90">
                  <strong>PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING OUR SERVICES.</strong> By using AFFILIFY, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">1. Affiliate Marketing Disclaimer</h2>
            <p className="text-white/80 mb-6">
              AFFILIFY is a platform that enables users to create and manage affiliate marketing websites. Our platform may contain links to third-party websites, products, or services that pay commissions to our users when visitors make purchases through these links.
            </p>
            <p className="text-white/80 mb-6">
              As a user of AFFILIFY, you are responsible for ensuring that your affiliate marketing activities comply with all applicable laws, regulations, and guidelines, including but not limited to the Federal Trade Commission (FTC) guidelines on endorsements and testimonials, as well as similar regulations in other jurisdictions.
            </p>
            <p className="text-white/80 mb-6">
              You must clearly disclose your affiliate relationships to your website visitors in accordance with these regulations. AFFILIFY is not responsible for any failure on your part to make appropriate disclosures or comply with applicable laws and regulations.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">2. No Guarantees of Income</h2>
            <p className="text-white/80 mb-6">
              AFFILIFY does not guarantee any level of income or earnings from using our platform. Any examples of income or earnings that may be displayed on our website or marketing materials are not to be interpreted as a promise or guarantee of earnings. Earning potential is entirely dependent on the person using our platform, their ideas, techniques, knowledge, skills, and many other factors.
            </p>
            <p className="text-white/80 mb-6">
              We do not make any claims that you will earn any specific amount of money by using our platform or following our suggestions. Your results may vary significantly and will be based on your individual capacity, business experience, expertise, and level of desire.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">3. Educational and Informational Purposes</h2>
            <p className="text-white/80 mb-6">
              The information provided by AFFILIFY is for educational and informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our platform for any purpose.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">4. Third-Party Content and Links</h2>
            <p className="text-white/80 mb-6">
              Our platform may include content provided by third parties, including materials provided by other users, bloggers, and third-party licensors, syndicators, aggregators, and/or reporting services. All statements and/or opinions expressed in these materials, and all articles and responses to questions and other content, other than the content provided by AFFILIFY, are solely the opinions and the responsibility of the person or entity providing those materials.
            </p>
            <p className="text-white/80 mb-6">
              AFFILIFY has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that AFFILIFY shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">5. Professional Advice Disclaimer</h2>
            <p className="text-white/80 mb-6">
              The information provided by AFFILIFY is not intended to be a substitute for professional advice. You should consult with a professional advisor before making any financial, legal, or business decisions. AFFILIFY is not engaged in rendering legal, accounting, or other professional services. If professional assistance is required, the services of a competent professional should be sought.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">6. Limitation of Liability</h2>
            <p className="text-white/80 mb-6">
              In no event shall AFFILIFY, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any (i) errors, mistakes, or inaccuracies of content; (ii) personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our platform; (iii) any unauthorized access to or use of our secure servers and/or any and all personal information and/or financial information stored therein; (iv) any interruption or cessation of transmission to or from our platform; (v) any bugs, viruses, trojan horses, or the like, which may be transmitted to or through our platform by any third party; and/or (vi) any errors or omissions in any content or for any loss or damage of any kind incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available via the AFFILIFY platform, whether based on warranty, contract, tort, or any other legal theory, and whether or not AFFILIFY is advised of the possibility of such damages.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">7. Changes to This Disclaimer</h2>
            <p className="text-white/80 mb-6">
              We reserve the right to modify this disclaimer at any time. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this disclaimer, we will notify you that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">8. Contact Us</h2>
            <p className="text-white/80 mb-6">
              If you have any questions about this disclaimer, please contact us at:
            </p>
            <p className="text-white/80 mb-6">
              Email: legal@affilify.eu<br />
              Address: 123 Affiliate Street, Tech City, TC 12345
            </p>
          </div>
        </motion.div>

        {/* Acknowledgment Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg">
            I Acknowledge and Agree
          </button>
        </motion.div>
      </main>
    </div>
  )
}
