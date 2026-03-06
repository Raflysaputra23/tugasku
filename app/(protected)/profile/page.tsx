"use client"

import { useState, useMemo, useEffect } from 'react';
import { ListTodo, Globe, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatCard from '@/components/dashboard/StatCard';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import LoadingPage from '@/components/LoadingPage';

const Profile = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [className, setClassName] = useState('');
  const [bio, setBio] = useState('');
  const [disableSave, setDisableSave] = useState(true);

  const stats = useMemo(() => {
    const privateTasks = tasks.filter(t => t.visibility === 'private' && !t.source_task_id).length;
    const publicTasks = tasks.filter(t => t.visibility === 'public').length;
    const takenTasks = tasks.filter(t => t.source_task_id).length;
    return { privateTasks, publicTasks, takenTasks };
  }, [tasks]);

  const handleSave = () => {
    updateProfile({ nama_lengkap: fullName, jurusan: major, kelas: className, bio: bio });
    setDisableSave(true);
  };

  useEffect(() => {
    (async() => {
      if(fullName != profile?.nama_lengkap || major != profile?.jurusan || className != profile?.kelas || bio != profile?.bio) {
        setDisableSave(false);
      } else {
        setDisableSave(true);
      }
    })()
  }, [fullName, major, className, bio]);

  useEffect(() => {
    (async() => {
      if(user) {
        setFullName(profile?.nama_lengkap || '');
        setMajor(profile?.jurusan || '');
        setClassName(profile?.kelas || '');
        setBio(profile?.bio || '');
      }
    })()
  }, [user]);

  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  if(loading) return <LoadingPage />;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-display font-bold">Profil</h1>
        <p className="text-sm text-muted-foreground">Informasi akun dan statistik</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Tugas Privat" value={tasksLoading ? -1 : stats.privateTasks} icon={ListTodo} />
        <StatCard title="Tugas Publik" value={tasksLoading ? -1 : stats.publicTasks} icon={Globe} variant="accent" />
        <StatCard title="Tugas Diambil" value={tasksLoading ? -1 : stats.takenTasks} icon={Copy} variant="success" />
      </div>

      <Card className='animate-[fade-in_0.7s_ease-in-out]'>
        <CardHeader>
          <CardTitle className="font-display">Informasi Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-accent/10 text-accent font-display text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{fullName || 'Nama belum diatur'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama lengkap" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Jurusan</Label>
              <Input value={major} onChange={e => setMajor(e.target.value)} placeholder="Contoh: Teknik Informatika" />
            </div>
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Input value={className} onChange={e => setClassName(e.target.value)} placeholder="Contoh: TI-2A" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={bio} className='resize-none overflow-y-auto' onChange={e => setBio(e.target.value)} placeholder="Ceritakan sedikit tentang dirimu..." rows={3} />
          </div>
          <Button variant={'primary'} className='cursor-pointer' disabled={disableSave} onClick={handleSave}>Simpan Profil</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
