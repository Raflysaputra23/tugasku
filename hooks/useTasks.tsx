import { Task } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const fetchTasks = async (id_user?: string): Promise<Task[]> => {
  try {
    if (id_user) {
      const { error, data } = await supabase.from('tasks').select('*').eq('id_user', id_user).order('created_at', { ascending: false });
      if (error) throw error;
      return data ? data : [];
    } else {
      const { error, data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ? data : [];
    }
  } catch { return []; }
};

const saveTasks = async (tasks: Task) => {
  const { error } = await supabase.from('tasks').insert(tasks);
  if (error) throw error;
};

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getTask();
      setLoading(false);
    })()
  }, []);


  const getTask = async () => {
    const tasks = await fetchTasks(user?.id);
    setTasks(tasks);
  };

  const createTask = async (data: Partial<Task>) => {
    if (!user) return;
    setLoading(true);
    const newTask: Task = {
      id_task: crypto.randomUUID(),
      id_user: user.id,
      subject: data.subject || '',
      title: data.title || '',
      description: data.description || '',
      class_name: data.class_name || '',
      deadline: data.deadline || new Date().toISOString(),
      status: 'pending',
      visibility: data.visibility || 'private',
      file_url: data.file_url,
      file_name: data.file_name,
      source_task_id: data.source_task_id
    };

    try {
      await saveTasks(newTask);
      await getTask();
      toast.success('Tugas berhasil dibuat!');
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const { error } = await supabase.from('tasks').update(data).eq('id_task', id);
      if (error) throw error;
      await getTask();
      toast.success('Tugas berhasil diperbarui!');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('tasks').delete().eq('id_task', id);
      if (error) throw error;
      await getTask();
      toast.success('Tugas berhasil dihapus!');
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (task: Task) => {
    await updateTask(task.id_task, { status: task.status === 'completed' ? 'pending' : 'completed' });
  };

  return { tasks, loading, createTask, updateTask, deleteTask, toggleStatus, refetch: fetchTasks };
}

export function usePublicTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tasks = await fetchTasks();
      setTasks(tasks.filter(t => t.visibility === 'public'));
      setLoading(false);
    })()
  }, []);

  return { tasks, loading };
}
