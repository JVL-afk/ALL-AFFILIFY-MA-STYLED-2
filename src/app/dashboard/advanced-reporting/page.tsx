// Updated with AFFILIFY orange theme
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, DollarSign, Users, Eye, MousePointer, Share, Mail, Printer, Settings } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'traffic' | 'conversion' | 'custom';
  description: string;
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  lastGenerated?: Date;
  nextScheduled?: Date;
  status: 'active' | 'paused' | 'draft';
}

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  metrics: string[];
  preview: string;
}

interface MetricData {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}

export default function AdvancedReportingPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'scheduled' | 'analytics'>('reports');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadReportingData();
  }, []);

  const loadReportingData = () => {
    // Mock reports
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Monthly Revenue Report',
        type: 'revenue',
        description: 'Comprehensive monthly revenue analysis with trends and forecasts',
        schedule: 'monthly',
        format: 'pdf',
        recipients: ['john@affilify.eu', 'sarah@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 2),
        nextScheduled: new Date(Date.now() + 86400000 * 28),
        status: 'active',
      },
      {
        id: '2',
        name: 'Weekly Traffic Summary',
        type: 'traffic',
        description: 'Weekly website traffic and user engagement metrics',
        schedule: 'weekly',
        format: 'excel',
        recipients: ['team@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 1),
        nextScheduled: new Date(Date.now() + 86400000 * 6),
        status: 'active',
      },
      {
        id: '3',
        name: 'Conversion Optimization Report',
        type: 'conversion',
        description: 'A/B testing results and conversion rate analysis',
        schedule: 'manual',
        format: 'pdf',
        recipients: ['marketing@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 5),
        status: 'draft',
      },
      {
        id: '4',
        name: 'Executive Dashboard',
        type: 'custom',
        description: 'High-level KPIs and business metrics for executives',
        schedule: 'daily',
        format: 'pdf',
        recipients: ['ceo@affilify.eu', 'cfo@affilify.eu'],
        lastGenerated: new Date(Date.now() - 3600000),
        nextScheduled: new Date(Date.now() + 86400000),
        status: 'active',
      },
    ];

    // Mock templates
    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Revenue Analysis',
        category: 'Financial',
        description: 'Detailed revenue breakdown with trends and forecasts',
        metrics: ['Total Revenue', 'Revenue by Source', 'Growth Rate', 'Profit Margins'],
        preview: '/previews/revenue-template.jpg',
      },
      {
        id: '2',
        name: 'Traffic Overview',
        category: 'Analytics',
        description: 'Website traffic analysis and user behavior insights',
        metrics: ['Page Views', 'Unique Visitors', 'Bounce Rate', 'Session Duration'],
        preview: '/previews/traffic-template.jpg',
      },
      {
        id: '3',
        name: 'Conversion Funnel',
        category: 'Marketing',
        description: 'Conversion tracking and optimization opportunities',
        metrics: ['Conversion Rate', 'Funnel Drop-offs', 'A/B Test Results', 'ROI'],
        preview: '/previews/conversion-template.jpg',
      },
      {
        id: '4',
        name: 'Executive Summary',
        category: 'Management',
        description: 'High-level business metrics and KPIs',
        metrics: ['Revenue', 'Growth', 'Customer Acquisition', 'Market Share'],
        preview: '/previews/executive-template.jpg',
      },
    ];

    // Mock metrics
    const mockMetrics: MetricData[] = [
      {
        name: 'Total Revenue',
        value: '$45,280',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
      },
      {
        name: 'Website Visitors',
        value: '28,450',
        change: '+8.2%',
        trend: 'up',
        icon: Users,
      },
      {
        name: 'Page Views',
        value: '125,680',
        change: '+15.3%',
        trend: 'up',
        icon: Eye,
      },
      {
        name: 'Conversion Rate',
        value: '3.24%',
        change: '+0.4%',
        trend: 'up',
        icon: MousePointer,
      },
    ];

    setReports(mockReports);
    setTemplates(mockTemplates);
    setMetrics(mockMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'text-green-600 bg-green-100';
      case 'traffic': return 'text-blue-600 bg-blue-100';
      case 'conversion': return 'text-purple-600 bg-purple-100';
      case 'custom': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'csv': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Advanced Reporting
          </h1>
          <p className="text-gray-600 mt-2">Generate comprehensive reports and analytics for your affiliate business</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs flex items-center ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'reports', label: 'My Reports', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Settings },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{report.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Schedule</p>
                        <p className="font-medium capitalize">{report.schedule}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Format</p>
                        <p className="font-medium flex items-center">
                          <span className="mr-1">{getFormatIcon(report.format)}</span>
                          {report.format.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Recipients</p>
                        <p className="font-medium">{report.recipients.length} people</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Generated</p>
                        <p className="font-medium">
                          {report.lastGenerated ? report.lastGenerated.toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    {report.nextScheduled && (
                      <p className="text-sm text-blue-600 mt-2">
                        Next scheduled: {report.nextScheduled.toLocaleDateString()} at {report.nextScheduled.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      Generate Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Report Templates</h2>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Included Metrics:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.metrics.map((metric, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">Use Template</Button>
                    <Button variant="outline" size="sm">Preview</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Scheduled Reports</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reports</CardTitle>
              <CardDescription>Reports scheduled for automatic generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports
                  .filter(r => r.schedule !== 'manual' && r.status === 'active')
                  .sort((a, b) => (a.nextScheduled?.getTime() || 0) - (b.nextScheduled?.getTime() || 0))
                  .map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-gray-600">
                            {report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1)} • {report.format.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {report.nextScheduled?.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {report.nextScheduled?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>Configure how and when reports are delivered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Delivery
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Automatically send reports to specified email addresses
                  </p>
                  <Button variant="outline" className="w-full">
                    Configure Email
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Cloud Storage
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Save reports to your preferred cloud storage service
                  </p>
                  <Button variant="outline" className="w-full">
                    Setup Storage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Reporting Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation Trends</CardTitle>
                <CardDescription>Number of reports generated over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mr-4" />
                  <span>Generation trends chart would be displayed here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Popular Reports</CardTitle>
                <CardDescription>Reports generated most frequently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports
                    .sort((a, b) => (b.lastGenerated?.getTime() || 0) - (a.lastGenerated?.getTime() || 0))
                    .slice(0, 4)
                    .map((report, index) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Math.floor(Math.random() * 50) + 10} times</p>
                          <p className="text-sm text-gray-600">This month</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Performance Metrics</CardTitle>
              <CardDescription>Key statistics about your reporting system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-gray-600">Reports Generated</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-gray-600">Email Deliveries</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xs text-green-600">All time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

