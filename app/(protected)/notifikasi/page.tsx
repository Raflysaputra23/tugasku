"use client"

import { Bell, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/dashboard/EmptyState';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotification';

const typeIcons = {
  deadline_12h: AlertTriangle,
  deadline_1d: Clock,
  deadline_2d: Calendar,
};

const typeColors = {
  deadline_12h: 'bg-destructive/10 text-destructive',
  deadline_1d: 'bg-warning/10 text-warning',
  deadline_2d: 'bg-accent/10 text-accent',
};

const Notifications = () => {
  const { tasks, loading } = useTasks();
  const { notifications } = useNotifications(tasks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Notifikasi</h1>
        <p className="text-sm text-muted-foreground">Pengingat deadline tugas pribadimu</p>
      </div>

      {loading ?
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="Tidak ada notifikasi" description="Semua tugas pribadimu aman dari deadline yang mendesak!" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {notifications.map(notif => {
              const Icon = typeIcons[notif.type];
              return (
                <Card key={notif.id} className="animate-fade-in">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`rounded-xl p-3 ${typeColors[notif.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.task_title}</p>
                    </div>
                    <Badge variant={notif.type === 'deadline_12h' ? 'destructive' : 'secondary'} className="text-xs">
                      {notif.type === 'deadline_12h' ? '< 12 jam' : notif.type === 'deadline_1d' ? '< 1 hari' : '< 2 hari'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default Notifications;
