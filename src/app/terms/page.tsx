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

export default function TermsPage() {
  const lastUpdated = "January 1, 2025"
  const effectiveDate = "January 1, 2025"

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: `
        By accessing and using AFFILIFY ("the Service"), you accept and agree to be bound by 
        the terms and provision of this agreement. If you do not agree to abide by the above, 
        please do not use this service.

        These Terms of Service ("Terms") govern your use of our website located at affilify.com 
        and all related services, features, and content offered by AFFILIFY Inc. ("we," "us," or "our").

        **Agreement to Terms:**
        • You must be at least 18 years old to use our services
        • You must provide accurate and complete information
        • You are responsible for maintaining account security
        • You agree to comply with all applicable laws and regulations
        • You understand that your use of the service is at your own risk

        **Modifications:**
        We reserve the right to modify these terms at any time. Changes will be effective 
        immediately upon posting. Your continued use of the service constitutes acceptance 
        of the modified terms.
      `
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: Zap,
      content: `
        AFFILIFY is an AI-powered platform that enables users to create, manage, and optimize 
        affiliate marketing websites. Our service includes but is not limited to:

        **Core Services:**
        • AI-powered website generation and content creation
        • Template library and customization tools
        • Analytics and performance tracking
        • Automated deployment and hosting solutions
        • Team collaboration and management features

        **Service Availability:**
        • We strive to maintain 99.9% uptime but do not guarantee uninterrupted service
        • Scheduled maintenance will be announced in advance when possible
        • Emergency maintenance may occur without prior notice
        • Service availability may vary by geographic location

        **Service Modifications:**
        We reserve the right to modify, suspend, or discontinue any part of our service 
        at any time with or without notice. We will not be liable for any modification, 
        suspension, or discontinuation of the service.
      `
    },
    {
      id: 'accounts',
      title: 'User Accounts and Registration',
      icon: UserCheck,
      content: `
        To access certain features of our service, you must create an account and provide 
        accurate, current, and complete information.

        **Account Requirements:**
        • You must be at least 18 years old or have parental consent
        • You must provide a valid email address
        • You must create a secure password
        • You must not impersonate others or provide false information
        • One person may not maintain multiple accounts

        **Account Security:**
        • You are responsible for maintaining the confidentiality of your account
        • You must notify us immediately of any unauthorized use
        • You are responsible for all activities under your account
        • We recommend using strong passwords and enabling two-factor authentication

        **Account Termination:**
        • You may terminate your account at any time
        • We may terminate accounts that violate these terms
        • Upon termination, your right to use the service ceases immediately
        • We may retain certain information as required by law or for legitimate business purposes
      `
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: Shield,
      content: `
        You agree to use our service only for lawful purposes and in accordance with these Terms.

        **Prohibited Activities:**
        • Violating any applicable laws or regulations
        • Infringing on intellectual property rights
        • Transmitting harmful, offensive, or illegal content
        • Attempting to gain unauthorized access to our systems
        • Interfering with or disrupting our services
        • Using our service for spam or unsolicited communications
        • Engaging in fraudulent or deceptive practices
        • Reverse engineering or attempting to extract source code

        **Content Standards:**
        • Content must be accurate and not misleading
        • Content must not violate third-party rights
        • Content must comply with advertising standards and regulations
        • Content must not promote illegal activities or harmful products
        • Content must not contain malware or malicious code

        **Enforcement:**
        We reserve the right to investigate and take appropriate action against users 
        who violate this policy, including account suspension or termination.
      `
    },
    {
      id: 'subscription',
      title: 'Subscription and Billing',
      icon: CreditCard,
      content: `
        Our service is offered through various subscription plans with different features and limitations.

        **Subscription Plans:**
        • Basic Plan: Limited features with usage restrictions
        • Pro Plan: Enhanced features with higher usage limits
        • Enterprise Plan: Full features with unlimited usage and priority support
        • Custom Plans: Available for large organizations with specific needs

        **Billing and Payment:**
        • Subscriptions are billed in advance on a monthly or annual basis
        • Payment is due immediately upon subscription or renewal
        • We accept major credit cards and other approved payment methods
        • All fees are non-refundable except as expressly stated
        • Prices are subject to change with 30 days notice

        **Automatic Renewal:**
        • Subscriptions automatically renew unless cancelled
        • You can cancel your subscription at any time
        • Cancellation takes effect at the end of the current billing period
        • No refunds are provided for partial billing periods

        **Free Trials:**
        • Free trials may be offered for certain plans
        • Credit card information may be required for free trials
        • Trials automatically convert to paid subscriptions unless cancelled
        • Only one free trial per user is permitted
      `
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: Lock,
      content: `
        The service and its original content, features, and functionality are owned by 
        AFFILIFY Inc. and are protected by international copyright, trademark, patent, 
        trade secret, and other intellectual property laws.

        **Our Rights:**
        • We own all rights to the AFFILIFY platform, software, and technology
        • Our trademarks, logos, and brand elements are our exclusive property
        • The design, structure, and organization of our service are protected
        • All improvements and modifications to our service belong to us

        **Your Rights:**
        • You retain ownership of content you create using our service
        • You grant us a license to host, display, and distribute your content
        • You can export your content and data at any time
        • You may use our service to create derivative works for your business

        **License to Use:**
        We grant you a limited, non-exclusive, non-transferable license to use our 
        service in accordance with these terms. This license terminates when your 
        account is terminated or these terms are violated.

        **DMCA Compliance:**
        We respect intellectual property rights and respond to valid DMCA takedown 
        notices. If you believe your copyright has been infringed, please contact us 
        with the required information.
      `
    },
    {
      id: 'user-content',
      title: 'User-Generated Content',
      icon: Database,
      content: `
        You may create, upload, or submit content through our service. You retain ownership 
        of your content but grant us certain rights to provide our services.

        **Content Ownership:**
        • You retain all rights to content you create or upload
        • You are responsible for ensuring you have rights to all content you submit
        • You must not upload content that infringes on third-party rights
        • You warrant that your content is accurate and lawful

        **License Grant:**
        By submitting content, you grant us a worldwide, non-exclusive, royalty-free 
        license to use, reproduce, modify, adapt, publish, translate, distribute, and 
        display your content in connection with providing our services.

        **Content Standards:**
        • Content must comply with our Acceptable Use Policy
        • Content must not violate any laws or regulations
        • Content must not infringe on intellectual property rights
        • Content must be appropriate for a business environment

        **Content Removal:**
        • We may remove content that violates these terms
        • You can delete your own content at any time
        • We may retain copies of content for backup and legal purposes
        • Deleted content may remain in our systems for up to 30 days
      `
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: Eye,
      content: `
        Your privacy is important to us. Our collection and use of personal information 
        is governed by our Privacy Policy, which is incorporated into these terms by reference.

        **Data Collection:**
        • We collect information necessary to provide our services
        • We use cookies and similar technologies to enhance your experience
        • We may collect usage data to improve our services
        • We comply with applicable data protection laws

        **Data Use:**
        • We use your data to provide and improve our services
        • We may use aggregated, anonymized data for analytics
        • We do not sell your personal information to third parties
        • We may share data with service providers under strict confidentiality agreements

        **Data Security:**
        • We implement industry-standard security measures
        • We encrypt sensitive data in transit and at rest
        • We regularly audit our security practices
        • We notify users of security breaches as required by law

        **Your Rights:**
        • You can access, correct, or delete your personal information
        • You can opt out of marketing communications
        • You can request data portability where applicable
        • You can file complaints with data protection authorities
      `
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      icon: AlertTriangle,
      content: `
        Our service is provided "as is" without warranties of any kind, either express or implied.

        **Service Disclaimers:**
        • We do not guarantee that our service will be uninterrupted or error-free
        • We do not warrant that our service will meet your specific requirements
        • We do not guarantee the accuracy or completeness of content generated by AI
        • We do not warrant that our service is free from viruses or harmful components

        **Performance Disclaimers:**
        • We do not guarantee specific results from using our service
        • Success in affiliate marketing depends on many factors beyond our control
        • Past performance does not guarantee future results
        • Individual results may vary significantly

        **Third-Party Services:**
        • We integrate with third-party services that we do not control
        • We are not responsible for the availability or performance of third-party services
        • Third-party services have their own terms and privacy policies
        • We may change or discontinue third-party integrations at any time

        **Limitation of Liability:**
        To the fullest extent permitted by law, AFFILIFY Inc. shall not be liable for 
        any indirect, incidental, special, consequential, or punitive damages, including 
        but not limited to loss of profits, data, or business opportunities.
      `
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: Shield,
      content: `
        You agree to indemnify, defend, and hold harmless AFFILIFY Inc., its officers, 
        directors, employees, agents, and affiliates from and against any claims, 
        liabilities, damages, losses, and expenses arising out of or in any way connected with:

        **Indemnification Scope:**
        • Your use of our service in violation of these terms
        • Your violation of any third-party rights, including intellectual property rights
        • Your violation of any applicable laws or regulations
        • Content you submit, post, or transmit through our service
        • Your negligent or wrongful conduct

        **Defense Obligations:**
        • You will provide us with reasonable cooperation in defending any claims
        • We reserve the right to assume exclusive defense of any matter
        • You will not settle any claims without our prior written consent
        • This indemnification obligation survives termination of these terms

        **Limitations:**
        • Our liability is limited to the amount you paid for our service in the 12 months 
          preceding the claim
        • We are not liable for indirect, consequential, or punitive damages
        • Some jurisdictions do not allow limitation of liability, so these limitations 
          may not apply to you
      `
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: XCircle,
      content: `
        Either party may terminate this agreement at any time, with or without cause, 
        with or without notice.

        **Termination by You:**
        • You may cancel your subscription at any time through your account settings
        • Cancellation takes effect at the end of your current billing period
        • You remain responsible for all charges incurred before termination
        • You can export your data before termination

        **Termination by Us:**
        • We may terminate your account for violation of these terms
        • We may terminate your account for non-payment of fees
        • We may terminate your account if we discontinue our service
        • We will provide reasonable notice when possible

        **Effect of Termination:**
        • Your right to use our service ceases immediately
        • We may delete your account and data after a reasonable period
        • Provisions that should survive termination will remain in effect
        • You remain liable for obligations incurred before termination

        **Data Retention:**
        • We may retain your data for legal or business purposes
        • We will delete your data upon request, subject to legal requirements
        • Backup copies may persist in our systems for up to 90 days
        • We are not obligated to return or transfer your data after termination
      `
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      icon: Gavel,
      content: `
        These terms are governed by and construed in accordance with the laws of the 
        State of Delaware, United States, without regard to conflict of law principles.

        **Jurisdiction:**
        • Any disputes will be resolved in the state or federal courts of Delaware
        • You consent to the personal jurisdiction of these courts
        • You waive any objection to venue in these courts
        • This agreement is subject to U.S. federal law where applicable

        **Dispute Resolution:**
        • We encourage informal resolution of disputes through direct communication
        • Formal disputes may be subject to binding arbitration
        • Arbitration will be conducted under the rules of the American Arbitration Association
        • Each party will bear their own costs and fees in arbitration

        **Class Action Waiver:**
        • You agree to resolve disputes individually and not as part of a class action
        • You waive the right to participate in class actions or representative proceedings
        • This waiver does not apply where prohibited by law
        • Small claims court proceedings are not subject to this waiver

        **Injunctive Relief:**
        • Either party may seek injunctive relief for violations of intellectual property rights
        • Injunctive relief may be sought without posting bond or proving damages
        • This right is in addition to other available remedies
      `
    },
    {
      id: 'miscellaneous',
      title: 'Miscellaneous Provisions',
      icon: Settings,
      content: `
        **Entire Agreement:**
        These terms, together with our Privacy Policy and any other legal notices 
        published by us, constitute the entire agreement between you and us.

        **Severability:**
        If any provision of these terms is found to be unenforceable, the remaining 
        provisions will remain in full force and effect.

        **Waiver:**
        Our failure to enforce any provision of these terms does not constitute a 
        waiver of that provision or any other provision.

        **Assignment:**
        You may not assign your rights under these terms without our written consent. 
        We may assign our rights and obligations without restriction.

        **Force Majeure:**
        We are not liable for any failure to perform due to circumstances beyond our 
        reasonable control, including natural disasters, war, terrorism, or government actions.

        **Notices:**
        All notices must be in writing and sent to the addresses specified in these terms. 
        Email notices are acceptable for routine communications.

        **Language:**
        These terms are written in English. Any translations are provided for convenience 
        only, and the English version controls in case of conflicts.

        **Survival:**
        Provisions that should reasonably survive termination will remain in effect, 
        including intellectual property rights, disclaimers, and limitation of liability.
      `
    }
  ]

  const quickLinks = [
    { title: 'Privacy Policy', href: '/privacy', icon: Eye },
    { title: 'Cookie Policy', href: '/cookie-policy', icon: Settings },
    { title: 'Acceptable Use Policy', href: '/aup', icon: Shield },
    { title: 'DMCA Policy', href: '/dmca', icon: FileText }
  ]

  const contactInfo = [
    { 
      title: 'Legal Department',
      email: 'legal@affilify.com',
      description: 'For legal matters and terms-related questions'
    },
    {
      title: 'General Support',
      email: 'support@affilify.com',
      description: 'For general questions about our services'
    },
    {
      title: 'Billing Support',
      email: 'billing@affilify.com',
      description: 'For subscription and billing inquiries'
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
              <Scale className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl leading-relaxed mb-6">
              Please read these terms carefully before using our service. 
              By using AFFILIFY, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Effective: {effectiveDate}</span>
              </div>
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
                <h4 className="font-semibold text-gray-900 mb-3">Related Policies</h4>
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
            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                  <p className="text-yellow-700">
                    These terms contain important information about your rights and obligations. 
                    Please read them carefully. By using our service, you agree to these terms. 
                    If you don't agree, please don't use our service.
                  </p>
                </div>
              </div>
            </div>

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

                  <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                If you have any questions about these Terms of Service, please contact us:
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
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Address</h3>
                    <p className="text-gray-700">
                      AFFILIFY Inc.<br />
                      123 Business Street<br />
                      Suite 100<br />
                      Wilmington, DE 19801<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Download These Terms</h2>
              <p className="text-gray-600 mb-6">
                You can download a copy of these Terms of Service for your records:
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

