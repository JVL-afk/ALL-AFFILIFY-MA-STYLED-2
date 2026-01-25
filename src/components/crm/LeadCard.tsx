'use client'

import { ILead } from '@/lib/models/Lead';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadCardProps {
  lead: ILead;
  onEdit: (lead: ILead) => void;
  onDelete: (leadId: string) => void;
}

export default function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Proposal Sent':
        return 'bg-purple-100 text-purple-800';
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 mb-3 bg-white/80 backdrop-blur-sm border border-white/30 hover:border-orange-400/50 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{lead.name}</h3>
          <p className="text-xs text-gray-600 truncate">{lead.email}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lead)}
            className="h-7 w-7 p-0 hover:bg-orange-100"
          >
            <Edit2 className="w-3.5 h-3.5 text-orange-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lead._id?.toString() || '')}
            className="h-7 w-7 p-0 hover:bg-red-100"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      </div>

      <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
        {lead.status}
      </Badge>

      {lead.notes && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{lead.notes}</p>
      )}

      {lead.source && (
        <p className="text-xs text-gray-500 mt-1">Source: {lead.source}</p>
      )}
    </Card>
  );
}
