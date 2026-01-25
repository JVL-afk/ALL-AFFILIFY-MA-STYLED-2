'use client'

import { ITask } from '@/lib/models/Task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getPriorityColor = (dueDate: Date | undefined) => {
    if (!dueDate) return 'bg-gray-100 text-gray-800';
    const now = new Date();
    const diffTime = new Date(dueDate).getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-red-100 text-red-800';
    if (diffDays < 3) return 'bg-orange-100 text-orange-800';
    if (diffDays < 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-purple-100 text-purple-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 mb-3 bg-white/80 backdrop-blur-sm border border-white/30 hover:border-orange-400/50 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-7 w-7 p-0 hover:bg-orange-100"
          >
            <Edit2 className="w-3.5 h-3.5 text-orange-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task._id?.toString() || '')}
            className="h-7 w-7 p-0 hover:bg-red-100"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex gap-2 flex-wrap mb-2">
        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
          {task.status}
        </Badge>
        {task.dueDate && (
          <Badge className={`text-xs ${getPriorityColor(task.dueDate)}`}>
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </Badge>
        )}
      </div>

      {task.assignedTo && (
        <p className="text-xs text-gray-500">Assigned to: {task.assignedTo}</p>
      )}
    </Card>
  );
}
