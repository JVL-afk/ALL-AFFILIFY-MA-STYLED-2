'use client'

import { useState, useEffect, useRef } from 'react';
import { ILead } from '@/lib/models/Lead';
import LeadCard from '@/components/crm/LeadCard';
import LeadModal from '@/components/crm/LeadModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';


const STATUSES = ['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'] as const;
type LeadStatus = typeof STATUSES[number];

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

  // Drag-and-drop state
  const [draggingLead, setDraggingLead] = useState<ILead | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | null>(null);
  const dragCounterRef = useRef<Record<string, number>>({});

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
      // API returns { leads: [...], pagination: {...} } — extract the array
      setLeads(Array.isArray(data) ? data : (data.leads ?? []));
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

  // ── Drag-and-drop handlers ──────────────────────────────────────────────────

  const handleDragStart = (_e: React.DragEvent, lead: ILead) => {
    setDraggingLead(lead);
  };

  const handleDragEnd = () => {
    setDraggingLead(null);
    setDragOverStatus(null);
    dragCounterRef.current = {};
  };

  // Use a counter per column to handle child element enter/leave events correctly
  const handleColumnDragEnter = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    dragCounterRef.current[status] = (dragCounterRef.current[status] || 0) + 1;
    setDragOverStatus(status);
  };

  const handleColumnDragLeave = (_e: React.DragEvent, status: LeadStatus) => {
    dragCounterRef.current[status] = (dragCounterRef.current[status] || 0) - 1;
    if (dragCounterRef.current[status] <= 0) {
      dragCounterRef.current[status] = 0;
      setDragOverStatus(prev => (prev === status ? null : prev));
    }
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    dragCounterRef.current[targetStatus] = 0;
    setDragOverStatus(null);

    if (!draggingLead) return;
    if (draggingLead.status === targetStatus) return; // No change needed

    const leadId = draggingLead._id?.toString();
    if (!leadId) return;

    // Optimistically update the UI immediately
    const previousLeads = leads;
    setLeads(prev =>
      prev.map(l =>
        l._id?.toString() === leadId ? ({ ...l, status: targetStatus } as ILead) : l
      )
    );
    setDraggingLead(null);

    // Persist to the API
    try {
      const response = await makeAuthenticatedRequest('/api/crm/leads', {
        method: 'PUT',
        body: JSON.stringify({ _id: leadId, status: targetStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }
      // Sync with the server response to get the latest document
      const updatedLead = await response.json();
      setLeads(prev =>
        prev.map(l => (l._id?.toString() === leadId ? updatedLead : l))
      );
    } catch (err) {
      // Roll back on failure
      setLeads(previousLeads);
      setError(err instanceof Error ? err.message : 'Failed to move lead');
      console.error('Error updating lead status via drag:', err);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getLeadsByStatus = (status: string) => leads.filter(l => l.status === status);

  const stats = [
    { label: 'Total Partners', value: leads.length, icon: Users, color: 'text-blue-600' },
    { label: 'New Leads', value: getLeadsByStatus('New').length, icon: Target, color: 'text-yellow-600' },
    { label: 'Won', value: getLeadsByStatus('Won').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Conversion Rate', value: leads.length > 0 ? `${Math.round((getLeadsByStatus('Won').length / leads.length) * 100)}%` : '0%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const getHeaderColor = (s: string) => {
    switch (s) {
      case 'New':           return 'bg-blue-500/20 text-blue-300';
      case 'Contacted':     return 'bg-yellow-500/20 text-yellow-300';
      case 'Proposal Sent': return 'bg-purple-500/20 text-purple-300';
      case 'Won':           return 'bg-green-500/20 text-green-300';
      case 'Lost':          return 'bg-red-500/20 text-red-300';
      default:              return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getDropHighlight = (s: LeadStatus) => {
    if (dragOverStatus !== s || !draggingLead) return '';
    switch (s) {
      case 'New':           return 'ring-2 ring-blue-400 bg-blue-500/10';
      case 'Contacted':     return 'ring-2 ring-yellow-400 bg-yellow-500/10';
      case 'Proposal Sent': return 'ring-2 ring-purple-400 bg-purple-500/10';
      case 'Won':           return 'ring-2 ring-green-400 bg-green-500/10';
      case 'Lost':          return 'ring-2 ring-red-400 bg-red-500/10';
      default:              return 'ring-2 ring-white/40';
    }
  };

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

          {/* Drag hint */}
          {!loading && leads.length > 0 && (
            <p className="text-orange-200/60 text-xs text-center mb-4 select-none">
              ✦ Drag and drop partner cards between columns to update their status
            </p>
          )}

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
                const isDropTarget = dragOverStatus === status && draggingLead !== null && draggingLead.status !== status;

                return (
                  <div
                    key={status}
                    onDragEnter={(e) => handleColumnDragEnter(e, status)}
                    onDragLeave={(e) => handleColumnDragLeave(e, status)}
                    onDragOver={handleColumnDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                    className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-h-96 transition-all duration-150 ${getDropHighlight(status)}`}
                  >
                    <div className={`${getHeaderColor(status)} px-3 py-2 rounded-lg mb-4 text-center`}>
                      <h3 className="font-semibold text-sm">{status}</h3>
                      <p className="text-xs mt-1 opacity-80">{statusLeads.length} partner{statusLeads.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="space-y-2">
                      {statusLeads.length > 0 ? (
                        statusLeads.map((lead) => (
                          <div
                            key={lead._id?.toString()}
                            onDragEnd={handleDragEnd}
                          >
                            <LeadCard
                              lead={lead}
                              onEdit={handleEditLead}
                              onDelete={handleDeleteLead}
                              onDragStart={handleDragStart}
                            />
                          </div>
                        ))
                      ) : (
                        <div className={`flex flex-col items-center justify-center py-8 rounded-lg border-2 border-dashed transition-all duration-150 ${isDropTarget ? 'border-white/40 bg-white/5' : 'border-transparent'}`}>
                          {isDropTarget ? (
                            <p className="text-white/70 text-sm font-medium">Drop here</p>
                          ) : (
                            <p className="text-gray-400 text-sm text-center">No partners</p>
                          )}
                        </div>
                      )}

                      {/* Drop zone shown at the bottom of non-empty columns when dragging */}
                      {statusLeads.length > 0 && isDropTarget && (
                        <div className="h-12 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                          <p className="text-white/50 text-xs">Drop here</p>
                        </div>
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
