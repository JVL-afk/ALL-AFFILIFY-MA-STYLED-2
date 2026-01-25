'use client'

import { useState, useEffect } from 'react';
import { ILead } from '@/lib/models/Lead';
import LeadCard from '@/components/crm/LeadCard';
import LeadModal from '@/components/crm/LeadModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';


const STATUSES = ['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'] as const;

// Helper function to get auth token from cookies or localStorage
const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  // Try to get from cookies first
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token' || name === 'auth-token' || name === 'authToken') {
      return decodeURIComponent(value);
    }
  }
  
  // Fallback to localStorage
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
  }
  
  return null;
};

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies in the request
  });
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest('/api/crm/leads');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch leads (${response.status})`);
      }
      const data = await response.json();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: ILead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await makeAuthenticatedRequest(`/api/crm/leads?id=${leadId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      setLeads(leads.filter(l => l._id?.toString() !== leadId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
      console.error('Error deleting lead:', err);
    }
  };

  const handleSaveLead = async (leadData: Partial<ILead>) => {
    try {
      if (selectedLead && selectedLead._id) {
        // Update existing lead
        const response = await makeAuthenticatedRequest('/api/crm/leads', {
          method: 'PUT',
          body: JSON.stringify({ ...leadData, _id: selectedLead._id }),
        });
        if (!response.ok) throw new Error('Failed to update lead');
        const updatedLead = await response.json();
        setLeads(leads.map(l => (l._id?.toString() === selectedLead._id?.toString() ? updatedLead : l)));
      } else {
        // Create new lead
        const response = await makeAuthenticatedRequest('/api/crm/leads', {
          method: 'POST',
          body: JSON.stringify(leadData),
        });
        if (!response.ok) throw new Error('Failed to create lead');
        const newLead = await response.json();
        setLeads([newLead, ...leads]);
      }
      setIsModalOpen(false);
      setSelectedLead(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead');
      console.error('Error saving lead:', err);
    }
  };

  const getLeadsByStatus = (status: string) => leads.filter(l => l.status === status);

  const stats = [
    { label: 'Total Partners', value: leads.length, icon: Users, color: 'text-blue-600' },
    { label: 'New Leads', value: getLeadsByStatus('New').length, icon: Target, color: 'text-yellow-600' },
    { label: 'Won', value: getLeadsByStatus('Won').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Conversion Rate', value: leads.length > 0 ? `${Math.round((getLeadsByStatus('Won').length / leads.length) * 100)}%` : '0%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Affiliate Partner Pipeline</h1>
              <p className="text-orange-100">Manage your affiliate partners and track deals through the sales pipeline</p>
            </div>
            <Button
              onClick={handleAddLead}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Partner
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">{stat.label}</p>
                      <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-100">
              {error}
            </div>
          )}

          {/* Kanban Board */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Loading partners...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {STATUSES.map((status) => {
                const statusLeads = getLeadsByStatus(status);
                const getHeaderColor = (s: string) => {
                  switch (s) {
                    case 'New':
                      return 'bg-blue-500/20 text-blue-300';
                    case 'Contacted':
                      return 'bg-yellow-500/20 text-yellow-300';
                    case 'Proposal Sent':
                      return 'bg-purple-500/20 text-purple-300';
                    case 'Won':
                      return 'bg-green-500/20 text-green-300';
                    case 'Lost':
                      return 'bg-red-500/20 text-red-300';
                    default:
                      return 'bg-gray-500/20 text-gray-300';
                  }
                };

                return (
                  <div key={status} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-h-96">
                    <div className={`${getHeaderColor(status)} px-3 py-2 rounded-lg mb-4 text-center`}>
                      <h3 className="font-semibold text-sm">{status}</h3>
                      <p className="text-xs mt-1 opacity-80">{statusLeads.length} partner{statusLeads.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="space-y-2">
                      {statusLeads.length > 0 ? (
                        statusLeads.map((lead) => (
                          <LeadCard
                            key={lead._id?.toString()}
                            lead={lead}
                            onEdit={handleEditLead}
                            onDelete={handleDeleteLead}
                          />
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-8">No partners</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        lead={selectedLead}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        onSave={handleSaveLead}
      />
    </>
  );
}
