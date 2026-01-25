'use client'

import { useState, useEffect } from 'react';
import { IProposal } from '@/lib/models/Proposal';
import ProposalEditor from '@/components/crm/ProposalEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Eye, DollarSign, FileText, Send } from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

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

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<IProposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch proposals on mount
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest('/api/crm/proposals');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch proposals (${response.status})`);
      }
      const data = await response.json();
      setProposals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProposal = () => {
    setSelectedProposal(null);
    setIsEditorOpen(true);
  };

  const handleEditProposal = (proposal: IProposal) => {
    setSelectedProposal(proposal);
    setIsEditorOpen(true);
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;
    try {
      const response = await makeAuthenticatedRequest(`/api/crm/proposals?id=${proposalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete proposal');
      setProposals(proposals.filter(p => p._id?.toString() !== proposalId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete proposal');
      console.error('Error deleting proposal:', err);
    }
  };

  const handleSaveProposal = async (proposalData: Partial<IProposal>) => {
    try {
      if (selectedProposal && selectedProposal._id) {
        // Update existing proposal
        const response = await makeAuthenticatedRequest('/api/crm/proposals', {
          method: 'PUT',
          body: JSON.stringify({ ...proposalData, _id: selectedProposal._id }),
        });
        if (!response.ok) throw new Error('Failed to update proposal');
        const updatedProposal = await response.json();
        setProposals(proposals.map(p => (p._id?.toString() === selectedProposal._id?.toString() ? updatedProposal : p)));
      } else {
        // Create new proposal
        const response = await makeAuthenticatedRequest('/api/crm/proposals', {
          method: 'POST',
          body: JSON.stringify(proposalData),
        });
        if (!response.ok) throw new Error('Failed to create proposal');
        const newProposal = await response.json();
        setProposals([newProposal, ...proposals]);
      }
      setIsEditorOpen(false);
      setSelectedProposal(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save proposal');
      console.error('Error saving proposal:', err);
    }
  };

  const handleSendProposal = async (proposal: IProposal) => {
    try {
      const response = await makeAuthenticatedRequest('/api/crm/proposals', {
        method: 'PUT',
        body: JSON.stringify({ ...proposal, _id: proposal._id, status: 'Sent' }),
      });
      if (!response.ok) throw new Error('Failed to send proposal');
      const updatedProposal = await response.json();
      setProposals(proposals.map(p => (p._id?.toString() === proposal._id?.toString() ? updatedProposal : p)));
      setIsEditorOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send proposal');
      console.error('Error sending proposal:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Viewed':
        return 'bg-purple-100 text-purple-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProposals = filterStatus
    ? proposals.filter(p => p.status === filterStatus)
    : proposals;

  const stats = [
    { label: 'Total Proposals', value: proposals.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Drafts', value: proposals.filter(p => p.status === 'Draft').length, icon: Edit2, color: 'text-gray-600' },
    { label: 'Accepted', value: proposals.filter(p => p.status === 'Accepted').length, icon: Send, color: 'text-green-600' },
    { label: 'Total Value', value: `$${proposals.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-orange-600' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Affiliate Proposals & Contracts</h1>
              <p className="text-orange-100">Create, manage, and track partnership agreements and quotes</p>
            </div>
            <Button
              onClick={handleAddProposal}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Proposal
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

          {/* Status Filter Buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              onClick={() => setFilterStatus(null)}
              variant={filterStatus === null ? 'default' : 'outline'}
              className={filterStatus === null ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'text-white border-white/30 hover:bg-white/10'}
            >
              All Proposals
            </Button>
            {['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'].map((status) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus === status ? 'default' : 'outline'}
                className={filterStatus === status ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'text-white border-white/30 hover:bg-white/10'}
              >
                {status} ({proposals.filter(p => p.status === status).length})
              </Button>
            ))}
          </div>

          {/* Proposals List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Loading proposals...</p>
            </div>
          ) : filteredProposals.length > 0 ? (
            <div className="grid gap-4">
              {filteredProposals.map((proposal) => (
                <Card
                  key={proposal._id?.toString()}
                  className="p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:border-orange-400/50 transition-all hover:shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                      <p className="text-orange-100 text-sm mb-3">Client: {proposal.clientId}</p>

                      <div className="flex gap-2 flex-wrap mb-4">
                        <Badge className={`text-xs ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </Badge>
                        <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                          ${proposal.price.toLocaleString()}
                        </Badge>
                        <Badge className="bg-white/20 text-white text-xs">
                          {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                        </Badge>
                      </div>

                      {proposal.content && (
                        <p className="text-gray-300 text-sm line-clamp-2">{proposal.content.substring(0, 150)}...</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEditProposal(proposal)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-orange-100"
                      >
                        <Edit2 className="w-4 h-4 text-orange-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProposal(proposal._id?.toString() || '')}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white text-lg">No proposals yet</p>
              <p className="text-orange-100 text-sm mt-2">Create your first proposal to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Editor */}
      <ProposalEditor
        isOpen={isEditorOpen}
        proposal={selectedProposal}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedProposal(null);
        }}
        onSave={handleSaveProposal}
        onSend={handleSendProposal}
      />
    </>
  );
}
