"use client"

import { useMemo, useState } from 'react';
import { ListTodo, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import { differenceInHours } from 'date-fns';
import StatCard from '@/components/dashboard/StatCard';
import EmptyState from '@/components/dashboard/EmptyState';
import TaskCard from '@/components/dashboard/TaskCard';
import TaskFormDialog from '@/components/dashboard/TaskFormDialog';

const Dashboard = () => {
  const { tasks, loading, deleteTask, toggleStatus, refetch } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const urgent = tasks.filter(t => {
      const h = differenceInHours(new Date(`${t.date}T${t.time}`), new Date());
      return h <= 48 && h > 0 && t.status === 'pending';
    }).length;
    return { total, completed, pending, urgent };
  }, [tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()).slice(0, 5),
    [tasks]
  );

  const resetOpenForm = async () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan tugas kuliahmu</p>
        </div>
        <Button variant={'primary'} className='cursor-pointer' onClick={() => { setEditingTask(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Buat Tugas
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tugas" value={loading ? -1 : stats.total} icon={ListTodo} />
        <StatCard title="Selesai" value={loading ? -1 : stats.completed} icon={CheckCircle} variant="success" />
        <StatCard title="Belum Selesai" value={loading ? -1 : stats.pending} icon={Clock} variant="accent" />
        <StatCard title="Deadline" value={loading ? -1 : stats.urgent} icon={AlertTriangle} variant="destructive" />
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Tugas Terbaru</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : recentTasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="Belum ada tugas"
            description="Mulai buat tugas pertamamu untuk mengelola deadline kuliah!"
            actionLabel="Buat Tugas Pertama"
            onAction={() => setFormOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recentTasks.map(task => (
              <TaskCard
                key={task.id_task}
                task={task}
                onEdit={t => { setEditingTask(t); setFormOpen(true); }}
                onDelete={deleteTask}
                onToggleStatus={toggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        resetOpenForm={resetOpenForm}
        task={editingTask}
        refetch={refetch}
      />
    </div>
  );
};

export default Dashboard;
