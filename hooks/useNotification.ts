"use client"

import { useMemo } from 'react';
import { Notification, Task } from '@/lib/types';
import { differenceInHours } from 'date-fns';

export function useNotifications(tasks: Task[]) {
  const notifications = useMemo(() => {
    const notifs: Notification[] = [];
    const now = new Date();

    tasks
      .filter(t => t.visibility === 'private' && t.status === 'pending')
      .forEach(task => {
        const deadline = new Date(`${task.date}T${task.time}`);
        const hoursLeft = differenceInHours(deadline, now);

        if (hoursLeft <= 12 && hoursLeft > 0) {
          notifs.push({
            id: `${task.id_task}-12h`,
            task_id: task.id_task,
            task_title: task.title,
            message: `Deadline "${task.title}" tinggal ${hoursLeft} jam lagi!`,
            type: 'deadline_12h',
            read: false,
            created_at: now.toISOString(),
          });
        } else if (hoursLeft <= 24 && hoursLeft > 12) {
          notifs.push({
            id: `${task.id_task}-1d`,
            task_id: task.id_task,
            task_title: task.title,
            message: `Deadline "${task.title}" tinggal 1 hari lagi!`,
            type: 'deadline_1d',
            read: false,
            created_at: now.toISOString(),
          });
        } else if (hoursLeft <= 48 && hoursLeft > 24) {
          notifs.push({
            id: `${task.id_task}-2d`,
            task_id: task.id_task,
            task_title: task.title,
            message: `Deadline "${task.title}" tinggal 2 hari lagi!`,
            type: 'deadline_2d',
            read: false,
            created_at: now.toISOString(),
          });
        }
      });

    return notifs.sort((a, b) => {
      const order = { deadline_12h: 0, deadline_1d: 1, deadline_2d: 2 };
      return order[a.type] - order[b.type];
    });
  }, [tasks]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount };
}
