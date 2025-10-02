'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Settings, BarChart3, Shield, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'expired';
  createdDate: Date;
  lastUsed?: Date;
  expiryDate?: Date;
  requestCount: number;
  rateLimit: number;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requiredPermissions: string[];
  rateLimit: string;
  status: 'active' | 'deprecated';
}

interface ApiUsage {
  date: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
}

export default function ApiManagementPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [usage, setUsage] = useState<ApiUsage[]>([]);
  const [activeTab, setActiveTab] = useState<'keys' | 'endpoints' | 'usage' | 'docs'>('keys');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadApiData();
  }, []);

  const loadApiData = () => {
    // Mock API keys
    const mockKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production API Key',
        key: 'aff_live_sk_1234567890abcdef',
        permissions: ['websites:read', 'websites:write', 'analytics:read'],
        status: 'active',
        createdDate: new Date(Date.now() - 86400000 * 30),
        lastUsed: new Date(Date.now() - 3600000),
        requestCount: 15420,
        rateLimit: 1000,
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'aff_test_sk_abcdef1234567890',
        permissions: ['websites:read', 'analytics:read'],
        status: 'active',
        createdDate: new Date(Date.now() - 86400000 * 15),
        lastUsed: new Date(Date.now() - 7200000),
        requestCount: 3250,
        rateLimit: 500,
      },
      {
        id: '3',
        name: 'Legacy Integration',
        key: 'aff_live_sk_legacy123456789',
        permissions: ['websites:read'],
        status: 'inactive',
        createdDate: new Date(Date.now() - 86400000 * 90),
        lastUsed: new Date(Date.now() - 86400000 * 7),
        expiryDate: new Date(Date.now() + 86400000 * 30),
        requestCount: 8750,
        rateLimit: 100,
      },
    ];

    // Mock API endpoints
    const mockEndpoints: ApiEndpoint[] = [
      {
        method: 'GET',
        path: '/api/websites',
        description: 'Retrieve all websites',
        requiredPermissions: ['websites:read'],
        rateLimit: '100/hour',
        status: 'active',
      },
      {
        method: 'POST',
        path: '/api/websites',
        description: 'Create a new website',
        requiredPermissions: ['websites:write'],
        rateLimit: '50/hour',
        status: 'active',
      },
      {
        method: 'GET',
        path: '/api/websites/{id}',
        description: 'Retrieve a specific website',
        requiredPermissions: ['websites:read'],
        rateLimit: '200/hour',
        status: 'active',
      },
      {
        method: 'PUT',
        path: '/api/websites/{id}',
        description: 'Update a website',
        requiredPermissions: ['websites:write'],
        rateLimit: '50/hour',
        status: 'active',
      },
      {
        method: 'DELETE',
        path: '/api/websites/{id}',
        description: 'Delete a website',
        requiredPermissions: ['websites:delete'],
        rateLimit: '10/hour',
        status: 'active',
      },
      {
        method: 'GET',
        path: '/api/analytics',
        description: 'Retrieve analytics data',
        requiredPermissions: ['analytics:read'],
        rateLimit: '100/hour',
        status: 'active',
      },
      {
        method: 'POST',
        path: '/api/generate',
        description: 'Generate website content using AI',
        requiredPermissions: ['ai:generate'],
        rateLimit: '20/hour',
        status: 'active',
      },
    ];

    // Mock usage data
    const mockUsage: ApiUsage[] = [
      { date: '2024-01-01', requests: 1250, errors: 12, avgResponseTime: 245 },
      { date: '2024-01-02', requests: 1380, errors: 8, avgResponseTime: 230 },
      { date: '2024-01-03', requests: 1420, errors: 15, avgResponseTime: 280 },
      { date: '2024-01-04', requests: 1580, errors: 6, avgResponseTime: 210 },
      { date: '2024-01-05', requests: 1650, errors: 9, avgResponseTime: 225 },
    ];

    setApiKeys(mockKeys);
    setEndpoints(mockEndpoints);
    setUsage(mockUsage);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••' + key.substring(key.length - 4);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'deprecated': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-600 bg-blue-100';
      case 'POST': return 'text-green-600 bg-green-100';
      case 'PUT': return 'text-orange-600 bg-orange-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Key className="h-8 w-8 mr-3 text-blue-600" />
            API Management
          </h1>
          <p className="text-gray-600 mt-2">Manage API keys, monitor usage, and access documentation</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {apiKeys.length} total keys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,650</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.4%</div>
            <p className="text-xs text-muted-foreground">9 errors today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">225ms</div>
            <p className="text-xs text-muted-foreground">-15ms from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'endpoints', label: 'Endpoints', icon: Settings },
            { id: 'usage', label: 'Usage', icon: BarChart3 },
            { id: 'docs', label: 'Documentation', icon: Shield },
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

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{apiKey.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                        {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Requests</p>
                        <p className="font-medium">{apiKey.requestCount?.toLocaleString() || "0"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate Limit</p>
                        <p className="font-medium">{apiKey.rateLimit}/hour</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium">{apiKey.createdDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Used</p>
                        <p className="font-medium">
                          {apiKey.lastUsed ? apiKey.lastUsed.toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>Permissions:</strong> {apiKey.permissions.join(', ')}
                      </p>
                      {apiKey.expiryDate && (
                        <p className="text-sm text-orange-600 mt-1">
                          <AlertTriangle className="inline h-3 w-3 mr-1" />
                          Expires: {apiKey.expiryDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">API Endpoints</h2>
            <div className="text-sm text-gray-600">
              Base URL: <code className="bg-gray-100 px-2 py-1 rounded">https://api.affilify.eu/v1</code>
            </div>
          </div>
          
          {endpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                        {endpoint.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{endpoint.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Required Permissions</p>
                        <p className="font-medium">{endpoint.requiredPermissions.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate Limit</p>
                        <p className="font-medium">{endpoint.rateLimit}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      Try It
                    </Button>
                    <Button variant="outline" size="sm">
                      Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">API Usage Analytics</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Request Volume</CardTitle>
              <CardDescription>Daily API requests over the last 5 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <BarChart3 className="h-12 w-12 mr-4" />
                <span>Usage chart would be displayed here</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>API errors over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <AlertTriangle className="h-8 w-8 mr-2" />
                  <span>Error chart would be displayed here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average response time trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <Clock className="h-8 w-8 mr-2" />
                  <span>Response time chart would be displayed here</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Endpoint</CardTitle>
              <CardDescription>Most popular API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.slice(0, 5).map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Math.floor(Math.random() * 1000) + 100} requests</p>
                      <p className="text-sm text-gray-600">Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">API Documentation</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn how to integrate with the AFFILIFY API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-gray-600 mb-2">
                  All API requests must include your API key in the Authorization header:
                </p>
                <code className="block bg-gray-100 p-3 rounded text-sm">
                  Authorization: Bearer your_api_key_here
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="block bg-gray-100 p-3 rounded text-sm">
                  https://api.affilify.eu/v1
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <p className="text-gray-600 mb-2">
                  All responses are returned in JSON format:
                </p>
                <code className="block bg-gray-100 p-3 rounded text-sm whitespace-pre">
{`{
  "success": true,
  "data": { ... },
  "message": "Request successful"
}`}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Sample code for common operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Create a Website (JavaScript)</h3>
                <code className="block bg-gray-100 p-3 rounded text-sm whitespace-pre">
{`const response = await fetch('https://api.affilify.eu/v1/websites', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Affiliate Site',
    niche: 'technology',
    template: 'modern'
  })
});

const data = await response.json();`}
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Get Analytics (Python)</h3>
                <code className="block bg-gray-100 p-3 rounded text-sm whitespace-pre">
{`import requests

headers = {
    'Authorization': 'Bearer your_api_key'
}

response = requests.get(
    'https://api.affilify.eu/v1/analytics',
    headers=headers
)

data = response.json()`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

