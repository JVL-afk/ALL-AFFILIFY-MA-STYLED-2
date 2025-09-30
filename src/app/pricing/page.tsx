'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap,
  Globe,
  BarChart3,
  Users,
  MessageSquare,
  TestTube,
  Palette,
  Shield,
  Headphones
} from 'lucide-react'

interface PlanFeature {
  name: string
  included: boolean
  icon?: React.ReactNode
}

interface Plan {
  id: string
  name: string
  description: string
  price: number
  period: string
  popular?: boolean
  features: PlanFeature[]
  cta: string
  icon: React.ReactNode
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for getting started with affiliate marketing',
      price: billingPeriod === 'monthly' ? 0 : 0,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      icon: <Zap className="w-6 h-6" />,
      cta: 'Start Basic Plan',
      features: [
        { name: '3 websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Basic templates (Modern, Classic, Bold)', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Basic analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Email support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: 'Pro templates', included: false },
        { name: 'Custom domains', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Reviews management', included: false },
        { name: 'A/B testing', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for serious affiliate marketers',
      price: billingPeriod === 'monthly' ? 29 : 290,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      cta: 'Start Pro Plan',
      features: [
        { name: '10 websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'All templates including Premium & Conversion Pro', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Advanced analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Custom domains', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Website analysis tools', included: true, icon: <TestTube className="w-4 h-4" /> },
        { name: 'Priority support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: 'Reviews management', included: false },
        { name: 'A/B testing', included: false },
        { name: 'API access', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for agencies and large businesses',
      price: billingPeriod === 'monthly' ? 99 : 990,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      icon: <Sparkles className="w-6 h-6" />,
      cta: 'Start Enterprise Plan',
      features: [
        { name: 'Unlimited websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'All templates including Enterprise', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Advanced analytics & reporting', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Reviews management system', included: true, icon: <MessageSquare className="w-4 h-4" /> },
        { name: 'A/B testing framework', included: true, icon: <TestTube className="w-4 h-4" /> },
        { name: 'White-label options', included: true, icon: <Shield className="w-4 h-4" /> },
        { name: 'API access', included: true, icon: <Zap className="w-4 h-4" /> },
        { name: 'Team collaboration', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Dedicated support', included: true, icon: <Headphones className="w-4 h-4" /> }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <span className="text-white text-xl font-bold">AFFILIFY</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/pricing" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link href="/docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Documentation
                </Link>
                <Link href="/about-me" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About Me
                </Link>
                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your affiliate marketing business with{' '}
            <span className="text-blue-400 font-semibold">AI-powered tools</span> and{' '}
            <span className="text-green-400 font-semibold">professional deployment</span>
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-1 border border-white border-opacity-20">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 transition-all hover:bg-white bg-opacity-15 ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  plan.id === 'basic' ? 'bg-gray-600' :
                  plan.id === 'pro' ? 'bg-orange-600' :
                  'bg-red-600'
                } text-white`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-gray-300 text-base mb-4">{plan.description}</p>
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-green-400">FREE</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-300">/{plan.period}</span>
                    </>
                  )}
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div className="text-sm text-green-400 font-medium">
                      Save ${(plan.price / 10 * 12) - plan.price} per year
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-0">
                <Link href={plan.price === 0 ? "/signup" : `/signup?plan=${plan.id}`} className="block mb-6">
                  <button className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    plan.id === 'basic' ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30' :
                    plan.id === 'pro' ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' :
                    'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                  }`}>
                    {plan.price === 0 ? "Get Started Free" : plan.cta}
                  </button>
                </Link>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-600"></div>
                        )}
                      </div>
                      <div className="flex items-center flex-1">
                        {feature.icon && (
                          <span className="mr-2 text-gray-400">
                            {feature.icon}
                          </span>
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-white' : 'text-gray-400'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="font-semibold mb-2 text-white">Can I change my plan later?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="font-semibold mb-2 text-white">Is there a free trial?</h3>
              <p className="text-gray-300">
                We offer a 14-day free trial for all plans. No credit card required to get started. 
                You can explore all features and see if AFFILIFY is right for you.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="font-semibold mb-2 text-white">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. 
                All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="font-semibold mb-2 text-white">Can I cancel anytime?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time. Your account will remain active 
                until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful affiliate marketers using AFFILIFY
          </p>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
              Start Your Free Trial
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
