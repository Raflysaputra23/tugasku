import { Task } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Mock data store - will be replaced with Supabase once tables are created
const STORAGE_KEY = 'studyvault_tasks';

const getStoredTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const all = getStoredTasks();
    const mine = all.filter(t => t.user_id === user?.id);
    setTasks(mine);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { 
    (async() => {
        fetchTasks(); 
    })()
  }, [fetchTasks]);

  const createTask = async (data: Partial<Task>) => {
    if (!user) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      user_id: user.id,
      subject: data.subject || '',
      title: data.title || '',
      description: data.description || '',
      class_name: data.class_name || '',
      deadline: data.deadline || new Date().toISOString(),
      status: 'pending',
      visibility: data.visibility || 'private',
      file_url: data.file_url,
      file_name: data.file_name,
      source_task_id: data.source_task_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const all = getStoredTasks();
    all.push(newTask);
    saveTasks(all);
    fetchTasks();
    toast.success('Tugas berhasil dibuat!');
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const all = getStoredTasks();
    const idx = all.findIndex(t => t.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data, updated_at: new Date().toISOString() };
      saveTasks(all);
      fetchTasks();
      toast.success('Tugas berhasil diperbarui!');
    }
  };

  const deleteTask = async (id: string) => {
    const all = getStoredTasks().filter(t => t.id !== id);
    saveTasks(all);
    fetchTasks();
    toast.success('Tugas berhasil dihapus!');
  };

  const toggleStatus = async (task: Task) => {
    await updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' });
  };

  return { tasks, loading, createTask, updateTask, deleteTask, toggleStatus, refetch: fetchTasks };
}

export function usePublicTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
        const all = getStoredTasks();
        setTasks(all.filter(t => t.visibility === 'public'));
        setLoading(false);
    })()
  }, []);

  return { tasks, loading };
}
