'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Download, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Crown,
  Zap,
  Star,
  ArrowUpRight,
  RefreshCw,
  X
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  stripeCustomerId?: string
  subscriptionId?: string
  subscriptionStatus?: string
}

interface Invoice {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  invoice_pdf?: string
  description?: string
}

interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      // Load user data
      const userResponse = await fetch('/api/auth/me')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }

      // Load billing data
      const billingResponse = await fetch('/api/billing/data')
      if (billingResponse.ok) {
        const billingData = await billingResponse.json()
        setInvoices(billingData.invoices || [])
        setPaymentMethods(billingData.paymentMethods || [])
      }
    } catch (error) {
      console.error('Error loading billing data:', error)
      setError('Failed to load billing information')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    setUpgradeLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = data.checkoutUrl
      } else {
        setError(data.message || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setError('An error occurred while processing your upgrade')
    } finally {
      setUpgradeLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return
    }

    setCancelLoading(true)
    setError('')

    try {
      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Subscription cancelled successfully. You will retain access until the end of your billing period.')
        await loadBillingData()
      } else {
        setError(data.message || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      setError('An error occurred while cancelling your subscription')
    } finally {
      setCancelLoading(false)
    }
  }

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'basic':
        return {
          name: 'Basic',
          price: 'FREE',
          color: 'text-gray-600 bg-gray-100',
          icon: <Star className="w-4 h-4" />
        }
      case 'pro':
        return {
          name: 'Pro',
          price: '$29/month',
          color: 'text-purple-600 bg-purple-100',
          icon: <Crown className="w-4 h-4" />
        }
      case 'enterprise':
        return {
          name: 'Enterprise',
          price: '$99/month',
          color: 'text-blue-600 bg-blue-100',
          icon: <Zap className="w-4 h-4" />
        }
      default:
        return {
          name: plan,
          price: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: <Star className="w-4 h-4" />
        }
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const planDetails = getPlanDetails(user?.plan || 'basic')

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription, payment methods, and billing history</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {planDetails.icon}
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription details and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${planDetails.color}`}>
                      {planDetails.name}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{planDetails.price}</span>
                  </div>
                  {user?.subscriptionStatus && (
                    <p className="text-sm text-gray-600">
                      Status: <span className="capitalize">{user.subscriptionStatus}</span>
                    </p>
                  )}
                </div>
                
                {user?.plan === 'basic' ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpgrade('pro')}
                      disabled={upgradeLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {upgradeLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Crown className="w-4 h-4 mr-2" />
                      )}
                      Upgrade to Pro
                    </Button>
                    <Button
                      onClick={() => handleUpgrade('enterprise')}
                      disabled={upgradeLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {upgradeLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      Upgrade to Enterprise
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.location.href = '/pricing'}
                      variant="outline"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Change Plan
                    </Button>
                    {user?.subscriptionStatus === 'active' && (
                      <Button
                        onClick={handleCancelSubscription}
                        disabled={cancelLoading}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {cancelLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <X className="w-4 h-4 mr-2" />
                        )}
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Plan Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.plan === 'basic' ? '3' : user?.plan === 'pro' ? '10' : '∞'}
                  </div>
                  <div className="text-sm text-gray-600">Websites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.plan === 'basic' ? '10' : user?.plan === 'pro' ? '50' : '∞'}
                  </div>
                  <div className="text-sm text-gray-600">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.plan === 'basic' ? '❌' : '✅'}
                  </div>
                  <div className="text-sm text-gray-600">Premium Support</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {method.card?.brand?.toUpperCase()} •••• {method.card?.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {method.card?.exp_month}/{method.card?.exp_year}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a payment method to upgrade your plan.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-500' : 
                          invoice.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">
                            {formatAmount(invoice.amount, invoice.currency)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(invoice.created)} • {invoice.description || 'Subscription'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                        {invoice.invoice_pdf && (
                          <Button
                            onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No billing history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your invoices will appear here once you upgrade.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Plan</span>
                <span className="text-sm font-medium">{planDetails.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Cost</span>
                <span className="text-sm font-medium">{planDetails.price}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Billing</span>
                <span className="text-sm font-medium">
                  {user?.subscriptionStatus === 'active' ? 'Next Month' : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Benefits */}
          {user?.plan === 'basic' && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Why Upgrade?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="w-4 h-4" />
                  More websites & analyses
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="w-4 h-4" />
                  Premium templates
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="w-4 h-4" />
                  Priority support
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="w-4 h-4" />
                  Advanced features
                </div>
                
                <Button 
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  View All Plans
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/dashboard/help'}
                variant="outline"
                className="w-full justify-start"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/docs'}
                variant="outline"
                className="w-full justify-start"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

