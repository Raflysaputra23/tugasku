"use client"

import { useState, useMemo } from 'react';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TaskCard from '@/components/dashboard/TaskCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { usePublicTasks, useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

const PublicTasks = () => {
  const { tasks: publicTasks, loading } = usePublicTasks();
  const { createTask } = useTasks();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return publicTasks;
    const q = search.toLowerCase();
    return publicTasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    );
  }, [publicTasks, search]);


  const handleTake = async (task: Task) => {
    await createTask({
      ...task,
      visibility: 'private',
      source_task_id: task.id_task,
      status: 'pending',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Tugas Publik</h1>
        <p className="text-sm text-muted-foreground">Temukan dan ambil tugas dari pengguna lain</p>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari tugas publik..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Globe} title="Belum ada tugas publik" description="Tugas publik dari pengguna lain akan muncul di sini" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map(task => (
            <TaskCard
              key={task.id_task}
              task={task}
              isOwner={task.id_user === user?.id}
              onTake={task.id_user !== user?.id ? handleTake : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicTasks;
