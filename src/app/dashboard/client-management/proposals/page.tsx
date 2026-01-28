'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { AlertCircle, Plus, Download, Send, Eye, Trash2, Edit2, FileText, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, Search, Filter, MoreVertical, TrendingUp } from 'lucide-react';

interface ProposalItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Proposal {
  _id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  amount: number;
  currency: string;
  validUntil: string;
  items: ProposalItem[];
  terms: string;
  notes: string;
  clientEmail?: string;
  clientName?: string;
  viewedAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ProposalManagementPage: React.FC = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');

  // Fetch proposals
  const fetchProposals = useCallback(async (page = 1, status = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
      });

      if (status) params.append('status', status);

      const response = await fetch(`/api/crm/proposals?${params}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Proposal management is not available in your current plan. Please upgrade to Pro or Enterprise.');
        } else if (response.status === 401) {
          router.push('/login');
          return;
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch proposals');
        }
        setProposals([]);
        return;
      }

      const data = await response.json();
      setProposals(data.proposals || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching proposals');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, router]);

  // Initial load
  useEffect(() => {
    fetchProposals(1, filterStatus);
  }, [filterStatus, sortBy, fetchProposals]);

  // Handle proposal deletion
  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      const response = await fetch(`/api/crm/proposals?id=${proposalId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to delete proposal');
        return;
      }

      await fetchProposals(pagination.page, filterStatus);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  // Handle PDF export
  const handleExportPDF = async (proposal: Proposal) => {
    try {
      const response = await fetch(`/api/crm/proposals/export?id=${proposal._id}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${proposal.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to export PDF');
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} />;
      case 'sent':
        return <Send size={16} />;
      case 'viewed':
        return <Eye size={16} />;
      case 'rejected':
        return <AlertTriangle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Calculate statistics
  const stats = [
    {
      label: 'Total Proposals',
      value: pagination.total,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Total Value',
      value: `$${proposals.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Accepted',
      value: proposals.filter(p => p.status === 'accepted').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Pending',
      value: proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Proposals & Contracts</h1>
              <p className="text-gray-600 mt-1">Create, send, and manage affiliate partnership proposals</p>
            </div>
            <button
              onClick={() => {
                setEditingProposal(null);
                setShowProposalModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New Proposal
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`${stat.color} opacity-20`} size={32} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="amount">Amount</option>
                  <option value="validUntil">Valid Until</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading proposals...</p>
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-6">Create your first proposal to get started</p>
            <button
              onClick={() => {
                setEditingProposal(null);
                setShowProposalModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Proposal
            </button>
          </div>
        ) : (
          <>
            {/* Proposals Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valid Until</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {proposals.map((proposal) => (
                    <tr key={proposal._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{proposal.title}</p>
                          <p className="text-sm text-gray-600 truncate">{proposal.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {proposal.clientName || proposal.clientEmail || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {proposal.currency} {proposal.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(proposal.validUntil), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleExportPDF(proposal)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Export as PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => setEditingProposal(proposal)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProposal(proposal._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} proposals
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchProposals(pagination.page - 1, filterStatus)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchProposals(page, filterStatus)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pagination.page === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchProposals(pagination.page + 1, filterStatus)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Proposal Modal - Placeholder for now */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingProposal ? 'Edit Proposal' : 'Create New Proposal'}
            </h2>
            <p className="text-gray-600 mb-6">Proposal editor coming soon...</p>
            <button
              onClick={() => {
                setShowProposalModal(false);
                setEditingProposal(null);
              }}
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalManagementPage;
