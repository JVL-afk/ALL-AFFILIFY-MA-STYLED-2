'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IClient } from '@/lib/models/Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, CheckCircle, Clock, TrendingUp, Share2, Download } from 'lucide-react';

export default function ClientPortalPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tasks' | 'documents'>('overview');

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch the client data by portalId
      // For now, we'll show a placeholder
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portal');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your affiliate portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      {/* Portal Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">AFFILIFY Partner Portal</h1>
            <p className="text-orange-100 text-sm">Your exclusive affiliate performance dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'tasks', label: 'Campaign Tasks', icon: Clock },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-white'
                    : 'border-transparent text-orange-100 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Visitors', value: '12,485', icon: BarChart3, color: 'text-blue-400' },
                { label: 'Conversions', value: '342', icon: CheckCircle, color: 'text-green-400' },
                { label: 'Conversion Rate', value: '2.74%', icon: TrendingUp, color: 'text-orange-400' },
                { label: 'Affiliate Earnings', value: '$4,892', icon: FileText, color: 'text-yellow-400' },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.label} className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">{metric.label}</p>
                        <p className="text-white text-2xl font-bold mt-2">{metric.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${metric.color}`} />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Performance Summary */}
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-orange-100">Traffic Growth (30 days)</span>
                    <span className="text-white font-semibold">+24.5%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-orange-100">Conversion Optimization</span>
                    <span className="text-white font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-orange-100">SEO Rankings</span>
                    <span className="text-white font-semibold">42 keywords in top 10</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Updates */}
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Recent Updates</h3>
              <div className="space-y-4">
                {[
                  { date: '2 days ago', title: 'Website SEO Optimization Complete', status: 'completed' },
                  { date: '5 days ago', title: 'New Content Published - 5 Articles', status: 'completed' },
                  { date: '1 week ago', title: 'A/B Testing Results - Variant B Wins', status: 'completed' },
                  { date: 'In Progress', title: 'Email Campaign Setup', status: 'in-progress' },
                ].map((update, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0">
                    <div className={`w-3 h-3 rounded-full mt-2 ${update.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{update.title}</p>
                      <p className="text-orange-100 text-sm">{update.date}</p>
                    </div>
                    <Badge className={update.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}>
                      {update.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Detailed Analytics</h3>
            <p className="text-orange-100">Analytics dashboard coming soon. Track your website performance in real-time.</p>
          </Card>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Campaign Milestones</h3>
            <div className="space-y-3">
              {[
                { title: 'Website Development', status: 'Complete', progress: 100 },
                { title: 'Content Creation (10 articles)', status: 'In Progress', progress: 60 },
                { title: 'SEO Optimization', status: 'In Progress', progress: 75 },
                { title: 'Email Campaign Setup', status: 'To Do', progress: 0 },
              ].map((task, idx) => (
                <div key={idx} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{task.title}</span>
                    <Badge className={task.status === 'Complete' ? 'bg-green-500/20 text-green-300' : task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all" style={{ width: `${task.progress}%` }}></div>
                  </div>
                  <p className="text-orange-100 text-xs mt-2">{task.progress}% complete</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Documents & Resources</h3>
            <div className="space-y-3">
              {[
                { name: 'Affiliate Partnership Agreement', type: 'PDF', size: '2.4 MB' },
                { name: 'Website Performance Report', type: 'PDF', size: '1.8 MB' },
                { name: 'SEO Recommendations', type: 'PDF', size: '3.1 MB' },
                { name: 'Monthly Analytics Summary', type: 'PDF', size: '1.2 MB' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-orange-100 text-sm">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-orange-400 hover:text-orange-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-orange-100 text-sm">
            Questions? Contact your AFFILIFY account manager at <span className="text-white font-medium">support@affilify.eu</span>
          </p>
          <p className="text-gray-500 text-xs mt-4">AFFILIFY © 2026 • The Ultimate AI-Powered Affiliate Marketing Platform</p>
        </div>
      </div>
    </div>
  );
}
