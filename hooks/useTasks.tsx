import { Task } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';
import { toastError, toastSuccess } from '@/lib/toast';

const supabase = createClient();

const fetchTasks = async (id_user?: string): Promise<Task[]> => {
  try {
    if (id_user) {
      const { error, data } = await supabase.from('tasks').select('*, profiles(nama_lengkap)').eq('id_user', id_user).order('created_at', { ascending: false });
      if (error) throw error;
      return data ? data : [];
    } else {
      const { error, data } = await supabase.from('tasks').select('*, profiles(nama_lengkap)').order('created_at', { ascending: false });
      if (error) throw error;
      return data ? data : [];
    }
  } catch { return []; }
};

const saveTasks = async (tasks: Task) => {
  const { error } = await supabase.from('tasks').insert(tasks);
  console.log(error);
  if (error) throw error;
};

export function useTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if(user) {
        await getTask();
        setLoading(false);
      }
    })()
  }, [user, authLoading]);


  const getTask = async () => {
    const tasks = await fetchTasks(user?.id);
    setTasks(tasks);
  };

  const createTask = async (data: Partial<Task>) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    const newTask: Task = {
      id_task: crypto.randomUUID(),
      id_user: user.id,
      subject: data.subject || '',
      title: data.title || '',
      description: data.description || '',
      class_name: data.class_name || '',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || new Date().toISOString().split('T')[1],
      status: 'pending',
      visibility: data.visibility || 'private',
      file_url: data.file_url,
      file_name: data.file_name,
      source_task_id: data.source_task_id || ''
    };

    try {
      await saveTasks(newTask);
      await getTask();
      toastSuccess('Tugas berhasil ditambahkan!');
    } catch (error) {
      toastError('Tugas gagal ditambahkan!');
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
      toastSuccess('Tugas berhasil diubah!');
    } catch (error) {
      toastError('Tugas gagal diubah!');
      console.log(error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('tasks').delete().eq('id_task', id);
      if (error) throw error;
      toastSuccess('Tugas berhasil dihapus!');
      await getTask();
    } catch (error) {
      toastError('Tugas gagal dihapus!');
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
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tasksPublic = await fetchTasks();
      const tasksPrivate = await fetchTasks(user?.id);
      const source_task = tasksPrivate.map(t => t.source_task_id || '');
      setTasks(tasksPublic.filter(t => t.visibility === 'public' && source_task.includes(t.id_task) === false));
      setLoading(false);
    })()
  }, [user, authLoading]);

  return { tasks, loading };
}
