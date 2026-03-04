"use client"

import { useState, useMemo } from 'react';
import { Plus, Search, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from '@/components/dashboard/TaskCard';
import TaskFormDialog from '@/components/dashboard/TaskFormDialog';
import EmptyState from '@/components/dashboard/EmptyState';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';

const TugasPrivate = () => {
    const { tasks, loading, createTask, updateTask, deleteTask, toggleStatus } = useTasks();
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('deadline');

    const filtered = useMemo(() => {
        let result = [...tasks];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.subject.toLowerCase().includes(q) ||
                t.class_name.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(t => t.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return result;
    }, [tasks, search, statusFilter, sortBy]);

    const handleSubmit = async (data: Partial<Task>) => {
        if (editingTask) {
            await updateTask(editingTask.id, data);
        } else {
            await createTask(data);
        }
        setEditingTask(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold">Tugas Saya</h1>
                    <p className="text-sm text-muted-foreground">{tasks.length} tugas</p>
                </div>
                <Button onClick={() => { setEditingTask(null); setFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Buat Tugas
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari tugas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <div className='flex items-center gap-3'>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="pending">Belum Selesai</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="deadline">Deadline</SelectItem>
                            <SelectItem value="created">Terbaru</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={ListTodo}
                    title={search ? 'Tidak ada hasil' : 'Belum ada tugas'}
                    description={search ? 'Coba kata kunci lain' : 'Mulai buat tugas pertamamu!'}
                    actionLabel={!search ? 'Buat Tugas' : undefined}
                    onAction={!search ? () => setFormOpen(true) : undefined}
                />
            ) : (
                <div className="space-y-3">
                    {filtered.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={t => { setEditingTask(t); setFormOpen(true); }}
                            onDelete={deleteTask}
                            onToggleStatus={toggleStatus}
                        />
                    ))}
                </div>
            )}

            <TaskFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                task={editingTask}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default TugasPrivate;
