'use client'

import { useState, useEffect } from 'react';
import { ITask } from '@/lib/models/Task';
import TaskCard from '@/components/crm/TaskCard';
import TaskModal from '@/components/crm/TaskModal';
import { Button } from '@/components/ui/button';
import { Plus, Clock, CheckCircle, AlertCircle, ListTodo } from 'lucide-react';


const TASK_STATUSES = ['To Do', 'In Progress', 'Review', 'Complete'] as const;

export default function TasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crm/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`/api/crm/tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t._id?.toString() !== taskId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleSaveTask = async (taskData: Partial<ITask>) => {
    try {
      if (selectedTask && selectedTask._id) {
        // Update existing task
        const response = await fetch('/api/crm/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskData, _id: selectedTask._id }),
        });
        if (!response.ok) throw new Error('Failed to update task');
        const updatedTask = await response.json();
        setTasks(tasks.map(t => (t._id?.toString() === selectedTask._id?.toString() ? updatedTask : t)));
      } else {
        // Create new task
        const response = await fetch('/api/crm/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task');
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
      console.error('Error saving task:', err);
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Complete') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'text-blue-600' },
    { label: 'In Progress', value: getTasksByStatus('In Progress').length, icon: Clock, color: 'text-orange-600' },
    { label: 'Completed', value: getTasksByStatus('Complete').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Overdue', value: overdueTasks, icon: AlertCircle, color: 'text-red-600' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Campaign Milestones</h1>
              <p className="text-orange-100">Track website development sprints and campaign milestones</p>
            </div>
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Task
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
              All Tasks
            </Button>
            {TASK_STATUSES.map((status) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus === status ? 'default' : 'outline'}
                className={filterStatus === status ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'text-white border-white/30 hover:bg-white/10'}
              >
                {status} ({getTasksByStatus(status).length})
              </Button>
            ))}
          </div>

          {/* Task List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Loading tasks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterStatus ? (
                // Show filtered tasks
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{filterStatus} Tasks</h3>
                    {getTasksByStatus(filterStatus).length > 0 ? (
                      <div className="space-y-2">
                        {getTasksByStatus(filterStatus).map((task) => (
                          <TaskCard
                            key={task._id?.toString()}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-8">No tasks in this status</p>
                    )}
                  </div>
                </div>
              ) : (
                // Show all tasks in columns by status
                TASK_STATUSES.map((status) => {
                  const statusTasks = getTasksByStatus(status);
                  const getHeaderColor = (s: string) => {
                    switch (s) {
                      case 'To Do':
                        return 'bg-gray-500/20 text-gray-300';
                      case 'In Progress':
                        return 'bg-blue-500/20 text-blue-300';
                      case 'Review':
                        return 'bg-purple-500/20 text-purple-300';
                      case 'Complete':
                        return 'bg-green-500/20 text-green-300';
                      default:
                        return 'bg-gray-500/20 text-gray-300';
                    }
                  };

                  return (
                    <div key={status} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <div className={`${getHeaderColor(status)} px-3 py-2 rounded-lg mb-4 text-center`}>
                        <h3 className="font-semibold text-sm">{status}</h3>
                        <p className="text-xs mt-1 opacity-80">{statusTasks.length} task{statusTasks.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="space-y-2">
                        {statusTasks.length > 0 ? (
                          statusTasks.map((task) => (
                            <TaskCard
                              key={task._id?.toString()}
                              task={task}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                            />
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm text-center py-8">No tasks</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
      />
    </>
  );
}
