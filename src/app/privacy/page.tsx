'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  FileText,
  Users,
  Settings,
  Trash2,
  Edit,
  Share2,
  Cookie,
  Smartphone,
  Monitor,
  Cloud,
  Server,
  Key,
  UserCheck,
  Clock,
  Bell,
  Zap
} from 'lucide-react'

export default function PrivacyPage() {
  const lastUpdated = "January 1, 2025"

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Info,
      content: `
        At AFFILIFY, we take your privacy seriously. This Privacy Policy explains how we collect, 
        use, disclose, and safeguard your information when you use our platform, website, and services. 
        Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
        policy, please do not access or use our services.
      `
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      subsections: [
        {
          title: 'Personal Information',
          content: `
            We collect personal information that you voluntarily provide to us when you:
            • Register for an account
            • Use our services
            • Contact us for support
            • Subscribe to our newsletter
            • Participate in surveys or promotions
            
            This may include:
            • Name and contact information (email, phone, address)
            • Account credentials (username, password)
            • Payment information (processed securely by third parties)
            • Profile information and preferences
            • Communication history with our support team
          `
        },
        {
          title: 'Automatically Collected Information',
          content: `
            When you use our services, we automatically collect certain information:
            • Device information (IP address, browser type, operating system)
            • Usage data (pages visited, features used, time spent)
            • Log files and analytics data
            • Cookies and similar tracking technologies
            • Location data (if permitted by your device settings)
          `
        },
        {
          title: 'Third-Party Information',
          content: `
            We may receive information about you from third parties:
            • Social media platforms (if you connect your accounts)
            • Payment processors and financial institutions
            • Analytics and marketing service providers
            • Public databases and data aggregators
            • Business partners and affiliates
          `
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Settings,
      content: `
        We use the information we collect for various purposes:
        
        **Service Provision:**
        • Provide, operate, and maintain our services
        • Process transactions and send related information
        • Send administrative information and updates
        • Provide customer support and respond to inquiries
        
        **Improvement and Development:**
        • Analyze usage patterns to improve our services
        • Develop new features and functionality
        • Conduct research and analytics
        • Test and optimize our platform performance
        
        **Communication:**
        • Send marketing communications (with your consent)
        • Notify you about changes to our services
        • Provide personalized content and recommendations
        • Send security alerts and important notices
        
        **Legal and Security:**
        • Comply with legal obligations
        • Protect against fraud and security threats
        • Enforce our terms of service
        • Resolve disputes and legal issues
      `
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Share2,
      content: `
        We do not sell, trade, or rent your personal information to third parties. 
        We may share your information in the following circumstances:
        
        **Service Providers:**
        We work with trusted third-party service providers who assist us in operating 
        our platform, conducting business, or serving our users. These parties are 
        contractually obligated to keep your information confidential.
        
        **Business Transfers:**
        In the event of a merger, acquisition, or sale of assets, your information 
        may be transferred as part of the business transaction.
        
        **Legal Requirements:**
        We may disclose your information if required by law, court order, or 
        government request, or to protect our rights and safety.
        
        **Consent:**
        We may share your information with your explicit consent or at your direction.
      `
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Shield,
      content: `
        We implement appropriate technical and organizational security measures to protect 
        your personal information:
        
        **Technical Safeguards:**
        • Encryption of data in transit and at rest
        • Secure server infrastructure with regular updates
        • Multi-factor authentication for account access
        • Regular security audits and vulnerability assessments
        • Intrusion detection and prevention systems
        
        **Administrative Safeguards:**
        • Employee training on data protection
        • Access controls and need-to-know basis
        • Regular review of security policies
        • Incident response procedures
        • Third-party security certifications
        
        **Physical Safeguards:**
        • Secure data centers with restricted access
        • Environmental controls and monitoring
        • Backup and disaster recovery procedures
        
        While we strive to protect your information, no method of transmission over 
        the internet or electronic storage is 100% secure.
      `
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: Cookie,
      content: `
        We use cookies and similar tracking technologies to enhance your experience:
        
        **Types of Cookies:**
        • Essential cookies: Required for basic functionality
        • Performance cookies: Help us analyze and improve our services
        • Functional cookies: Remember your preferences and settings
        • Marketing cookies: Deliver relevant advertisements
        
        **Cookie Management:**
        You can control cookies through your browser settings. However, disabling 
        certain cookies may affect the functionality of our services.
        
        **Third-Party Cookies:**
        We may allow third-party service providers to place cookies on our website 
        for analytics and advertising purposes.
        
        For more detailed information, please see our Cookie Policy.
      `
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: UserCheck,
      content: `
        Depending on your location, you may have certain rights regarding your personal information:
        
        **Access and Portability:**
        • Request access to your personal information
        • Receive a copy of your data in a portable format
        • Review how your information is being used
        
        **Correction and Updates:**
        • Correct inaccurate or incomplete information
        • Update your account information and preferences
        • Modify your communication preferences
        
        **Deletion and Restriction:**
        • Request deletion of your personal information
        • Restrict or object to certain processing activities
        • Withdraw consent where applicable
        
        **Marketing Communications:**
        • Opt out of marketing emails and communications
        • Manage your subscription preferences
        • Control personalized advertising
        
        To exercise these rights, please contact us using the information provided below.
      `
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Clock,
      content: `
        We retain your personal information for as long as necessary to:
        • Provide our services to you
        • Comply with legal obligations
        • Resolve disputes and enforce agreements
        • Maintain business records
        
        **Retention Periods:**
        • Account information: Retained while your account is active
        • Transaction records: Retained for 7 years for tax and legal purposes
        • Support communications: Retained for 3 years
        • Marketing data: Retained until you opt out
        • Analytics data: Aggregated and anonymized after 2 years
        
        When we no longer need your information, we will securely delete or anonymize it.
      `
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: `
        Your information may be transferred to and processed in countries other than 
        your country of residence. These countries may have different data protection 
        laws than your country.
        
        **Safeguards:**
        When we transfer your information internationally, we implement appropriate 
        safeguards such as:
        • Standard contractual clauses approved by regulatory authorities
        • Adequacy decisions by relevant data protection authorities
        • Certification schemes and codes of conduct
        • Binding corporate rules for intra-group transfers
        
        We ensure that any international transfers comply with applicable data 
        protection laws and regulations.
      `
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      icon: Users,
      content: `
        Our services are not intended for children under the age of 13 (or 16 in the EU). 
        We do not knowingly collect personal information from children under these ages.
        
        If we become aware that we have collected personal information from a child 
        without parental consent, we will take steps to delete that information promptly.
        
        If you are a parent or guardian and believe your child has provided us with 
        personal information, please contact us immediately.
      `
    },
    {
      id: 'changes',
      title: 'Changes to This Privacy Policy',
      icon: Edit,
      content: `
        We may update this Privacy Policy from time to time to reflect changes in 
        our practices, services, or legal requirements.
        
        **Notification of Changes:**
        • We will post the updated policy on our website
        • We will update the "Last Updated" date
        • For material changes, we will provide additional notice
        • We may send email notifications for significant updates
        
        **Your Continued Use:**
        Your continued use of our services after any changes constitutes acceptance 
        of the updated Privacy Policy.
        
        We encourage you to review this Privacy Policy periodically to stay informed 
        about how we protect your information.
      `
    }
  ]

  const quickLinks = [
    { title: 'Cookie Policy', href: '/cookie-policy', icon: Cookie },
    { title: 'Terms of Service', href: '/terms', icon: FileText },
    { title: 'Data Processing Agreement', href: '/dpa', icon: Shield },
    { title: 'Security Overview', href: '/security', icon: Lock }
  ]

  const contactInfo = [
    { 
      title: 'Data Protection Officer',
      email: 'privacy@affilify.com',
      description: 'For privacy-related inquiries and requests'
    },
    {
      title: 'General Support',
      email: 'support@affilify.com',
      description: 'For general questions about our services'
    },
    {
      title: 'Legal Department',
      email: 'legal@affilify.com',
      description: 'For legal matters and compliance issues'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl leading-relaxed mb-6">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.title}
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mb-12 last:mb-0"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <section.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>

                  <div className="prose max-w-none">
                    {section.subsections ? (
                      <div className="space-y-8">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              {subsection.title}
                            </h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {subsection.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-8">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us using the information below:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                    <Mail className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-purple-600 hover:text-purple-700 font-medium mb-2 block"
                    >
                      {contact.email}
                    </a>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p className="text-gray-700">
                      We aim to respond to all privacy-related inquiries within 30 days. 
                      For urgent matters, please mark your email as "URGENT" in the subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Download This Policy</h2>
              <p className="text-gray-600 mb-6">
                You can download a copy of this Privacy Policy for your records:
              </p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  <FileText className="w-5 h-5" />
                  Print Version
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

