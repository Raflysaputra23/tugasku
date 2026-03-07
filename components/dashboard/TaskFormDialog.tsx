"use client"

import { useState, useEffect, useActionState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Task } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { formTugasValidation } from '@/lib/formValidation';
import { toastError, toastSuccess } from '@/lib/toast';
import ButtonForm from '../auth/ButtonForm';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  refetch: () => void;
  resetOpenForm: () => void;
}

const TaskFormDialog = ({ open, onOpenChange, task, refetch, resetOpenForm }: TaskFormDialogProps) => {
  const [form, setForm] = useState({
    subject: '',
    title: '',
    description: '',
    class_name: '',
    deadline: '',
    visibility: 'private' as 'private' | 'public',
  });
  const [state, formAction] = useActionState(formTugasValidation, null);

  useEffect(() => {
    (async () => {
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
    })()
  }, [task, open]);

  useEffect(() => {
    if (state) {
      if (state.success) {
        toastSuccess(state.message)
        refetch();
        resetOpenForm();
      } else toastError(state.message);
    }
  }, [state]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{task ? 'Edit Tugas' : 'Buat Tugas Baru'}</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 py-3 relative">
              <Label>Mata Kuliah</Label>
              <Input value={form.subject} name='subject' onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="Contoh: Algoritma" />
              <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.subject}</p>
            </div>
            <div className="space-y-2 py-3 relative">
              <Label>Kelas</Label>
              <Input value={form.class_name} name='class_name' onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))} required placeholder="Contoh: TI-2A" />
              <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.class_name}</p>
            </div>
          </div>
          <div className="space-y-2 py-3 relative">
            <Label>Judul Tugas</Label>
            <Input value={form.title} name='title' onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Judul tugas..." />
            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.title}</p>

          </div>
          <div className="space-y-2 py-3 relative">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} name='description' onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi tugas..." rows={3} />
            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.description}</p>
          </div>
          <div className="space-y-2 py-3 relative">
            <Label>Deadline</Label>
            <Input type="datetime-local" value={form.deadline} name='deadline' onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required />
            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.deadline}</p>
          </div>
          <div className="flex items-center justify-end gap-2 mb-2">
            <Label>Tugas Publik</Label>
            <Switch checked={form.visibility === 'public'} name='visibility' className='bg-red-500' onCheckedChange={c => setForm(f => ({ ...f, visibility: c ? 'public' : 'private' }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <ButtonForm>
              {task ? 'Simpan' : 'Buat Tugas'}
            </ButtonForm>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
