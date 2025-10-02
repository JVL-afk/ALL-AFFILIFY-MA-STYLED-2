import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Cookie, Info, AlertCircle, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'

export default function CookiePolicyPage() {
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
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Cookie Policy
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
            <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
            <p className="text-white/80 mb-6">
              This Cookie Policy explains how AFFILIFY ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website at affilify.eu ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">2. What Are Cookies?</h2>
            <p className="text-white/80 mb-6">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p className="text-white/80 mb-6">
              Cookies set by the website owner (in this case, AFFILIFY) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">3. Why Do We Use Cookies?</h2>
            <p className="text-white/80 mb-6">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">4. Types of Cookies We Use</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">4.1 Essential Cookies</h3>
              <p className="text-white/80 mb-3">
                These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website, you cannot refuse them without impacting how our Website functions.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Authentication Cookies</p>
                    <p className="text-white/70 text-sm">Used to identify you when you log in to our Website.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Security Cookies</p>
                    <p className="text-white/70 text-sm">Used for security purposes to protect user data from unauthorized access.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">4.2 Performance and Functionality Cookies</h3>
              <p className="text-white/80 mb-3">
                These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Preference Cookies</p>
                    <p className="text-white/70 text-sm">Used to remember your preferences and settings.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Session State Cookies</p>
                    <p className="text-white/70 text-sm">Used to maintain your session state across different pages.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">4.3 Analytics and Customization Cookies</h3>
              <p className="text-white/80 mb-3">
                These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Google Analytics</p>
                    <p className="text-white/70 text-sm">Used to track website usage and user behavior.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Hotjar</p>
                    <p className="text-white/70 text-sm">Used to analyze user interactions with our Website.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">4.4 Advertising Cookies</h3>
              <p className="text-white/80 mb-3">
                These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Google Ads</p>
                    <p className="text-white/70 text-sm">Used for remarketing and ad targeting.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Facebook Pixel</p>
                    <p className="text-white/70 text-sm">Used to track conversions from Facebook ads.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">5. How Can You Control Cookies?</h2>
            <p className="text-white/80 mb-6">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner on our Website.
            </p>
            <p className="text-white/80 mb-6">
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">6. Changes to This Cookie Policy</h2>
            <p className="text-white/80 mb-6">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p className="text-white/80 mb-6">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">7. Contact Us</h2>
            <p className="text-white/80 mb-6">
              If you have any questions about our use of cookies or other technologies, please contact us at:
            </p>
            <p className="text-white/80 mb-6">
              Email: privacy@affilify.eu<br />
              Address: 123 Affiliate Street, Tech City, TC 12345
            </p>
          </div>
        </motion.div>

        {/* Cookie Preferences Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg">
            Update Cookie Preferences
          </button>
        </motion.div>
      </main>
    </div>
  )
}
