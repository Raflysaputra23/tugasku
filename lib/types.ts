export interface Task {
  id_task: string;
  id_user: string;
  subject: string;
  title: string;
  description: string;
  class_name: string;
  profiles?: { nama_lengkap: string };
  date: string;
  time: string;
  status: 'pending' | 'completed';
  visibility: 'private' | 'public';
  file_url?: string;
  file_name?: string;
  source_task_id?: string; // if taken from public
  created_at?: string;
  updated_at?: string;
  // joined fields
  author_name?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  class_name?: string;
  major?: string;
  bio?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  task_id: string;
  task_title: string;
  message: string;
  type: 'deadline_2d' | 'deadline_1d' | 'deadline_12h';
  read: boolean;
  created_at: string;
}
