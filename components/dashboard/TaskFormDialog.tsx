"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Task } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (data: Partial<Task>) => Promise<void>;
}

const TaskFormDialog = ({ open, onOpenChange, task, onSubmit }: TaskFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    title: '',
    description: '',
    class_name: '',
    deadline: '',
    visibility: 'private' as 'private' | 'public',
  });

  useEffect(() => {
    if (task) {
      setForm({
        subject: task.subject,
        title: task.title,
        description: task.description,
        class_name: task.class_name,
        deadline: `${task.date}T${task.time}`,
        visibility: task.visibility,
      });
    } else {
      setForm({ subject: '', title: '', description: '', class_name: '', deadline: '', visibility: 'private' });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ subject: form.subject, title: form.title, description: form.description, class_name: form.class_name, visibility: form.visibility, time: form.deadline.split('T')[1], date: form.deadline.split('T')[0] });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{task ? 'Edit Tugas' : 'Buat Tugas Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mata Kuliah</Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="Contoh: Algoritma" />
            </div>
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Input value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))} required placeholder="Contoh: TI-2A" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Judul Tugas</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Judul tugas..." />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi tugas..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required />
          </div>
          <div className="flex items-center justify-between">
            <Label>Tugas Publik</Label>
            <Switch checked={form.visibility === 'public'} className='bg-red-500' onCheckedChange={c => setForm(f => ({ ...f, visibility: c ? 'public' : 'private' }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {task ? 'Simpan' : 'Buat Tugas'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
