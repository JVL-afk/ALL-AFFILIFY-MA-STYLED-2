// Updated with AFFILIFY orange theme
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Users, Send, Plus, Edit, Trash2, BarChart3, Calendar, Target, Zap, Eye, MousePointer } from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate?: Date;
  scheduledDate?: Date;
  type: 'newsletter' | 'promotional' | 'automated';
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
}

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics' | 'subscribers'>('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
  }, []);

  const loadCampaigns = () => {
    const mockCampaigns: EmailCampaign[] = [
      {
        id: '1',
        name: 'Welcome Series - New Subscribers',
        subject: 'Welcome to AFFILIFY! Your journey starts here',
        status: 'active',
        recipients: 1250,
        openRate: 45.2,
        clickRate: 12.8,
        type: 'automated',
      },
      {
        id: '2',
        name: 'Black Friday Deals 2024',
        subject: '🔥 Exclusive Black Friday Deals - Up to 70% Off!',
        status: 'sent',
        recipients: 8500,
        openRate: 38.7,
        clickRate: 15.3,
        sentDate: new Date(Date.now() - 86400000),
        type: 'promotional',
      },
      {
        id: '3',
        name: 'Weekly Newsletter #47',
        subject: 'Top Affiliate Marketing Trends This Week',
        status: 'scheduled',
        recipients: 6200,
        openRate: 0,
        clickRate: 0,
        scheduledDate: new Date(Date.now() + 172800000),
        type: 'newsletter',
      },
      {
        id: '4',
        name: 'Product Launch - AI Website Builder',
        subject: 'Introducing: AI-Powered Website Builder',
        status: 'draft',
        recipients: 0,
        openRate: 0,
        clickRate: 0,
        type: 'promotional',
      },
    ];
    setCampaigns(mockCampaigns);
  };

  const loadTemplates = () => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        category: 'Onboarding',
        thumbnail: '/templates/welcome.jpg',
        description: 'Perfect for welcoming new subscribers',
      },
      {
        id: '2',
        name: 'Product Promotion',
        category: 'Sales',
        thumbnail: '/templates/promotion.jpg',
        description: 'Drive sales with compelling product showcases',
      },
      {
        id: '3',
        name: 'Newsletter Template',
        category: 'Content',
        thumbnail: '/templates/newsletter.jpg',
        description: 'Share valuable content with your audience',
      },
      {
        id: '4',
        name: 'Abandoned Cart',
        category: 'Automation',
        thumbnail: '/templates/cart.jpg',
        description: 'Recover lost sales with targeted reminders',
      },
    ];
    setTemplates(mockTemplates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-orange-600 bg-orange-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter': return <Mail className="h-4 w-4" />;
      case 'promotional': return <Target className="h-4 w-4" />;
      case 'automated': return <Zap className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Mail className="h-8 w-8 mr-3 text-blue-600" />
            Email Marketing
          </h1>
          <p className="text-gray-600 mt-2">Create, manage, and track your email campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.7%</div>
            <p className="text-xs text-muted-foreground">+1.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,250</div>
            <p className="text-xs text-muted-foreground">+15.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(campaign.type)}
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{campaign.recipients?.toLocaleString() || "0"}</p>
                      <p className="text-xs text-gray-500">Recipients</p>
                    </div>
                    
                    {campaign.status === 'sent' && (
                      <>
                        <div className="text-center">
                          <p className="text-sm font-medium">{campaign.openRate}%</p>
                          <p className="text-xs text-gray-500">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{campaign.clickRate}%</p>
                          <p className="text-xs text-gray-500">Click Rate</p>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {campaign.sentDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Sent: {campaign.sentDate.toLocaleDateString()} at {campaign.sentDate.toLocaleTimeString()}
                  </p>
                )}
                
                {campaign.scheduledDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Scheduled: {campaign.scheduledDate.toLocaleDateString()} at {campaign.scheduledDate.toLocaleTimeString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {template.category}
                </span>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" className="flex-1">Use Template</Button>
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Open and click rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <BarChart3 className="h-12 w-12 mr-4" />
                <span>Analytics chart would be displayed here</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Growth</CardTitle>
              <CardDescription>New subscribers and unsubscribes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <Users className="h-12 w-12 mr-4" />
                <span>Subscriber growth chart would be displayed here</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Campaigns with highest engagement rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns
                  .filter(c => c.status === 'sent')
                  .sort((a, b) => b.clickRate - a.clickRate)
                  .map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                      </div>
                      <div className="flex space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{campaign.openRate}%</p>
                          <p className="text-gray-500">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{campaign.clickRate}%</p>
                          <p className="text-gray-500">Click Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Subscriber Management</h2>
              <p className="text-gray-600">Manage your email subscribers and segments</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Import Subscribers
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Segments</CardTitle>
              <CardDescription>Organize your subscribers into targeted groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">All Subscribers</h3>
                  <p className="text-2xl font-bold text-blue-600">12,450</p>
                  <p className="text-sm text-gray-600">Total active subscribers</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">High Engagement</h3>
                  <p className="text-2xl font-bold text-green-600">3,280</p>
                  <p className="text-sm text-gray-600">Opens 80%+ of emails</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">New Subscribers</h3>
                  <p className="text-2xl font-bold text-orange-600">1,150</p>
                  <p className="text-sm text-gray-600">Joined in last 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { email: 'john.doe@example.com', date: '2024-01-15', source: 'Website Signup' },
                  { email: 'jane.smith@example.com', date: '2024-01-14', source: 'Lead Magnet' },
                  { email: 'mike.johnson@example.com', date: '2024-01-13', source: 'Social Media' },
                  { email: 'sarah.wilson@example.com', date: '2024-01-12', source: 'Referral' },
                ].map((subscriber, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{subscriber.email}</p>
                      <p className="text-sm text-gray-600">Source: {subscriber.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{subscriber.date}</p>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

