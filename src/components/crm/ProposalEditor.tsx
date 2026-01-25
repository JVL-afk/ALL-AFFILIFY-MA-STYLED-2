'use client'

import { useState, useEffect } from 'react';
import { IProposal } from '@/lib/models/Proposal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Send } from 'lucide-react';

interface ProposalEditorProps {
  isOpen: boolean;
  proposal: IProposal | null;
  onClose: () => void;
  onSave: (proposal: Partial<IProposal>) => void;
  onSend?: (proposal: IProposal) => void;
}

export default function ProposalEditor({ isOpen, proposal, onClose, onSave, onSend }: ProposalEditorProps) {
  const [formData, setFormData] = useState<Partial<IProposal>>({
    title: '',
    clientId: '',
    content: '',
    price: 0,
    status: 'Draft',
  });

  useEffect(() => {
    if (proposal) {
      setFormData(proposal);
    } else {
      setFormData({
        title: '',
        clientId: '',
        content: generateDefaultProposalTemplate(),
        price: 0,
        status: 'Draft',
      });
    }
  }, [proposal, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSend = () => {
    if (proposal) {
      onSend?.({ ...proposal, ...formData } as IProposal);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {proposal ? 'Edit Proposal' : 'Create New Proposal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Proposal Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g., Website Development & SEO Package"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="clientId" className="text-sm font-medium text-gray-700">
                Client Email
              </Label>
              <Input
                id="clientId"
                name="clientId"
                type="email"
                value={formData.clientId || ''}
                onChange={handleChange}
                placeholder="client@example.com"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Proposal Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price || 0}
                onChange={handleChange}
                placeholder="5000"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={formData.status || 'Draft'}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Viewed">Viewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Proposal Content (Markdown)
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              placeholder="Enter proposal content in markdown format..."
              rows={12}
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supports markdown formatting: **bold**, *italic*, # Headings, - Lists, etc.
            </p>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 -mb-6 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            {proposal && proposal.status === 'Draft' && (
              <Button
                type="button"
                onClick={handleSend}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Client
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function generateDefaultProposalTemplate(): string {
  return `# Affiliate Partnership Proposal

## Executive Summary
This proposal outlines the terms of our affiliate partnership and the services we will provide.

## Scope of Services
- Website development and optimization
- SEO implementation and content strategy
- Performance tracking and analytics
- Monthly reporting and optimization

## Investment & Pricing
- **Total Investment:** [Price will be filled in]
- **Payment Terms:** 50% upfront, 50% upon completion
- **Timeline:** 30-45 days

## Deliverables
1. Fully optimized affiliate website
2. Initial SEO setup and keyword research
3. Content creation (10-15 articles)
4. Analytics dashboard setup
5. 30-day optimization period

## Success Metrics
- Organic traffic growth
- Conversion rate optimization
- Search engine rankings
- Affiliate link performance

## Terms & Conditions
- This proposal is valid for 14 days
- Changes to scope may affect pricing and timeline
- Payment is due upon agreement

---

**Generated by AFFILIFY**
*The Ultimate AI-Powered Affiliate Marketing Platform*`;
}
