'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, MousePointer, Eye, Calendar, Download, Filter, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  revenue: { month: string; amount: number; }[];
  traffic: { date: string; visitors: number; pageViews: number; }[];
  conversions: { source: string; conversions: number; rate: number; }[];
  demographics: { age: string; percentage: number; }[];
  devices: { device: string; users: number; }[];
  topPages: { page: string; views: number; bounceRate: number; }[];
}

export default function AdvancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        revenue: [
          { month: 'Jan', amount: 12500 },
          { month: 'Feb', amount: 15800 },
          { month: 'Mar', amount: 18200 },
          { month: 'Apr', amount: 22100 },
          { month: 'May', amount: 25600 },
          { month: 'Jun', amount: 28900 },
        ],
        traffic: [
          { date: '2024-01-01', visitors: 1250, pageViews: 3200 },
          { date: '2024-01-02', visitors: 1380, pageViews: 3450 },
          { date: '2024-01-03', visitors: 1420, pageViews: 3680 },
          { date: '2024-01-04', visitors: 1580, pageViews: 4100 },
          { date: '2024-01-05', visitors: 1650, pageViews: 4250 },
        ],
        conversions: [
          { source: 'Organic Search', conversions: 245, rate: 3.2 },
          { source: 'Social Media', conversions: 189, rate: 2.8 },
          { source: 'Email Marketing', conversions: 156, rate: 4.1 },
          { source: 'Paid Ads', conversions: 134, rate: 2.5 },
          { source: 'Direct Traffic', conversions: 98, rate: 3.8 },
        ],
        demographics: [
          { age: '18-24', percentage: 15 },
          { age: '25-34', percentage: 35 },
          { age: '35-44', percentage: 28 },
          { age: '45-54', percentage: 15 },
          { age: '55+', percentage: 7 },
        ],
        devices: [
          { device: 'Desktop', users: 4250 },
          { device: 'Mobile', users: 6800 },
          { device: 'Tablet', users: 1950 },
        ],
        topPages: [
          { page: '/product/wireless-headphones', views: 8500, bounceRate: 25.4 },
          { page: '/product/smartphone-case', views: 6200, bounceRate: 32.1 },
          { page: '/product/laptop-stand', views: 5800, bounceRate: 28.7 },
          { page: '/product/bluetooth-speaker', views: 4900, bounceRate: 35.2 },
        ],
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading advanced analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your affiliate marketing performance</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,900</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,280</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128,450</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData?.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData?.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>User distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData?.devices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percentage }) => `${device}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {analyticsData?.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Sources</CardTitle>
          <CardDescription>Performance by traffic source</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.conversions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <CardDescription>Pages with highest traffic and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData?.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{page.page}</h4>
                  <p className="text-sm text-gray-600">{page.views?.toLocaleString() || "0"} views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{page.bounceRate}% bounce rate</p>
                  <p className="text-xs text-gray-600">Bounce rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

