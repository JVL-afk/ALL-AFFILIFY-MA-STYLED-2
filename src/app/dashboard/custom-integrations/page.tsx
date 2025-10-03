// Updated with AFFILIFY orange theme
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plug, Plus, Settings, CheckCircle, AlertTriangle, ExternalLink, Zap, Database, Mail, BarChart3, ShoppingCart, Globe, Code, Webhook } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'email' | 'ecommerce' | 'social' | 'automation' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: string;
  provider: string;
  connectedDate?: Date;
  lastSync?: Date;
  settings: Record<string, any>;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  createdDate: Date;
  lastTriggered?: Date;
  deliveryCount: number;
}

export default function CustomIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'custom' | 'marketplace'>('integrations');
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    loadIntegrationsData();
  }, []);

  const loadIntegrationsData = () => {
    // Mock integrations
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Google Analytics',
        description: 'Track website performance and user behavior',
        category: 'analytics',
        status: 'connected',
        icon: '📊',
        provider: 'Google',
        connectedDate: new Date(Date.now() - 86400000 * 15),
        lastSync: new Date(Date.now() - 3600000),
        settings: { trackingId: 'GA-123456789', enhanced: true },
      },
      {
        id: '2',
        name: 'Mailchimp',
        description: 'Email marketing and automation',
        category: 'email',
        status: 'connected',
        icon: '📧',
        provider: 'Mailchimp',
        connectedDate: new Date(Date.now() - 86400000 * 10),
        lastSync: new Date(Date.now() - 7200000),
        settings: { listId: 'abc123', apiKey: 'hidden' },
      },
      {
        id: '3',
        name: 'Shopify',
        description: 'E-commerce platform integration',
        category: 'ecommerce',
        status: 'error',
        icon: '🛒',
        provider: 'Shopify',
        connectedDate: new Date(Date.now() - 86400000 * 5),
        lastSync: new Date(Date.now() - 86400000),
        settings: { storeUrl: 'mystore.shopify.com', webhookUrl: 'configured' },
      },
      {
        id: '4',
        name: 'Facebook Pixel',
        description: 'Track conversions and optimize ads',
        category: 'analytics',
        status: 'disconnected',
        icon: '📘',
        provider: 'Meta',
        settings: {},
      },
      {
        id: '5',
        name: 'Zapier',
        description: 'Automate workflows between apps',
        category: 'automation',
        status: 'connected',
        icon: '⚡',
        provider: 'Zapier',
        connectedDate: new Date(Date.now() - 86400000 * 20),
        lastSync: new Date(Date.now() - 1800000),
        settings: { webhookUrl: 'configured', activeZaps: 3 },
      },
    ];

    // Mock webhooks
    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: '1',
        name: 'Website Created Webhook',
        url: 'https://myapp.com/webhooks/website-created',
        events: ['website.created', 'website.published'],
        status: 'active',
        secret: 'whsec_1234567890abcdef',
        createdDate: new Date(Date.now() - 86400000 * 7),
        lastTriggered: new Date(Date.now() - 3600000),
        deliveryCount: 45,
      },
      {
        id: '2',
        name: 'Analytics Webhook',
        url: 'https://analytics.myapp.com/affilify-data',
        events: ['analytics.daily', 'conversion.tracked'],
        status: 'active',
        secret: 'whsec_abcdef1234567890',
        createdDate: new Date(Date.now() - 86400000 * 12),
        lastTriggered: new Date(Date.now() - 7200000),
        deliveryCount: 128,
      },
      {
        id: '3',
        name: 'Payment Webhook',
        url: 'https://billing.myapp.com/affilify-payments',
        events: ['payment.succeeded', 'subscription.updated'],
        status: 'inactive',
        secret: 'whsec_fedcba0987654321',
        createdDate: new Date(Date.now() - 86400000 * 3),
        deliveryCount: 12,
      },
    ];

    setIntegrations(mockIntegrations);
    setWebhooks(mockWebhooks);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'ecommerce': return <ShoppingCart className="h-5 w-5" />;
      case 'social': return <Globe className="h-5 w-5" />;
      case 'automation': return <Zap className="h-5 w-5" />;
      case 'custom': return <Code className="h-5 w-5" />;
      default: return <Plug className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Plug className="h-8 w-8 mr-3 text-blue-600" />
            Custom Integrations
          </h1>
          <p className="text-gray-600 mt-2">Connect AFFILIFY with your favorite tools and services</p>
        </div>
        <Button onClick={() => setShowConnectModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</div>
            <p className="text-xs text-muted-foreground">
              {integrations.length} total integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.filter(w => w.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {webhooks.reduce((sum, w) => sum + w.deliveryCount, 0)} total deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Synced</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m ago</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'integrations', label: 'Integrations', icon: Plug },
            { id: 'webhooks', label: 'Webhooks', icon: Webhook },
            { id: 'custom', label: 'Custom APIs', icon: Code },
            { id: 'marketplace', label: 'Marketplace', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(integration.category)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          {getStatusIcon(integration.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <p className="text-xs text-gray-500">Provider: {integration.provider}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {integration.status === 'connected' && (
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Connected: {integration.connectedDate?.toLocaleDateString()}</p>
                        <p className="text-gray-600">Last sync: {integration.lastSync?.toLocaleTimeString()}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {integration.status === 'connected' ? (
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      ) : (
                        <Button size="sm">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {integration.status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <AlertTriangle className="inline h-4 w-4 mr-1" />
                      Connection error: Authentication failed. Please reconnect your account.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Webhook Endpoints</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </div>
          
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{webhook.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                        {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{webhook.url}</code>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {event}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{webhook.createdDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Triggered</p>
                          <p className="font-medium">
                            {webhook.lastTriggered ? webhook.lastTriggered.toLocaleTimeString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deliveries</p>
                          <p className="font-medium">{webhook.deliveryCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Custom APIs Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Custom API Integrations</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Integrations</CardTitle>
              <CardDescription>Create custom integrations using our REST API and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    REST API
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Access all AFFILIFY features programmatically with our comprehensive REST API.
                  </p>
                  <Button variant="outline" className="w-full">
                    View API Docs
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Webhook className="h-5 w-5 mr-2" />
                    Webhooks
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Receive real-time notifications when events occur in your AFFILIFY account.
                  </p>
                  <Button variant="outline" className="w-full">
                    Setup Webhooks
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-3">
                  Our integration team can help you build custom solutions for your specific needs.
                </p>
                <Button>Contact Integration Team</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Integration Marketplace</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Stripe', category: 'Payment', description: 'Accept payments and manage subscriptions', icon: '💳', popular: true },
              { name: 'Slack', category: 'Communication', description: 'Get notifications in your Slack workspace', icon: '💬', popular: false },
              { name: 'HubSpot', category: 'CRM', description: 'Sync leads and customer data', icon: '🎯', popular: true },
              { name: 'Airtable', category: 'Database', description: 'Store and organize your data', icon: '📊', popular: false },
              { name: 'Discord', category: 'Community', description: 'Engage with your community', icon: '🎮', popular: false },
              { name: 'Notion', category: 'Productivity', description: 'Organize your workflow and notes', icon: '📝', popular: true },
            ].map((app, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{app.name}</h3>
                        {app.popular && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{app.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{app.description}</p>
                  
                  <Button className="w-full">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

