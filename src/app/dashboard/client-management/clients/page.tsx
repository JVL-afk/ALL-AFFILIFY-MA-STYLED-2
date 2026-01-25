'use client'

import { useState, useEffect } from 'react';
import { IClient } from '@/lib/models/Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Copy, Eye, Mail, Users } from 'lucide-react';

import { X } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [copiedPortalId, setCopiedPortalId] = useState<string | null>(null);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crm/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setFormData({ name: '', email: '' });
    setIsModalOpen(true);
  };

  const handleEditClient = (client: IClient) => {
    setSelectedClient(client);
    setFormData({ name: client.name, email: client.email });
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      const response = await fetch(`/api/crm/clients?id=${clientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete client');
      setClients(clients.filter(c => c._id?.toString() !== clientId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
      console.error('Error deleting client:', err);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClient && selectedClient._id) {
        // Update existing client
        const response = await fetch('/api/crm/clients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, _id: selectedClient._id }),
        });
        if (!response.ok) throw new Error('Failed to update client');
        const updatedClient = await response.json();
        setClients(clients.map(c => (c._id?.toString() === selectedClient._id?.toString() ? updatedClient : c)));
      } else {
        // Create new client
        const response = await fetch('/api/crm/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create client');
        const newClient = await response.json();
        setClients([newClient, ...clients]);
      }
      setIsModalOpen(false);
      setSelectedClient(null);
      setFormData({ name: '', email: '' });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save client');
      console.error('Error saving client:', err);
    }
  };

  const copyPortalLink = (portalId: string) => {
    const portalUrl = `${window.location.origin}/portal/${portalId}`;
    navigator.clipboard.writeText(portalUrl);
    setCopiedPortalId(portalId);
    setTimeout(() => setCopiedPortalId(null), 2000);
  };

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600' },
    { label: 'Active Portals', value: clients.filter(c => c.portalAccess).length, icon: Eye, color: 'text-green-600' },
    { label: 'Pending Invites', value: clients.filter(c => !c.portalAccess).length, icon: Mail, color: 'text-orange-600' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Client Management</h1>
              <p className="text-orange-100">Manage your affiliate clients and their branded portals</p>
            </div>
            <Button
              onClick={handleAddClient}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Client
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          {/* Clients List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Loading clients...</p>
            </div>
          ) : clients.length > 0 ? (
            <div className="grid gap-4">
              {clients.map((client) => (
                <Card
                  key={client._id?.toString()}
                  className="p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:border-orange-400/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{client.name}</h3>
                      <p className="text-orange-100 text-sm mb-3">Email: {client.email}</p>

                      <div className="flex gap-2 flex-wrap mb-4">
                        <Badge className={client.portalAccess ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                          {client.portalAccess ? 'Portal Active' : 'Portal Inactive'}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          Portal ID: {client.portalId.substring(0, 8)}...
                        </Badge>
                      </div>

                      {/* Portal Link */}
                      <div className="bg-black/20 rounded-lg p-3 mb-4">
                        <p className="text-xs text-orange-100 mb-2">Portal Link:</p>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/portal/${client.portalId}`}
                            className="flex-1 bg-black/30 text-white text-xs px-3 py-2 rounded border border-white/10 font-mono"
                          />
                          <Button
                            onClick={() => copyPortalLink(client.portalId)}
                            size="sm"
                            variant="ghost"
                            className="text-orange-400 hover:text-orange-300"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        {copiedPortalId === client.portalId && (
                          <p className="text-xs text-green-400 mt-2">✓ Copied to clipboard</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => window.open(`/portal/${client.portalId}`, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => handleEditClient(client)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-orange-100"
                      >
                        <Edit2 className="w-4 h-4 text-orange-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClient(client._id?.toString() || '')}
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
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white text-lg">No clients yet</p>
              <p className="text-orange-100 text-sm mt-2">Add your first client to create their branded portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Client Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Acme Affiliate Network"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  {selectedClient ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
