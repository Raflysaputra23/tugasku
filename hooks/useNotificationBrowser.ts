"use client"

import { useEffect, useRef, useCallback } from 'react';
import { Task } from '@/lib/types';
import { differenceInMilliseconds, differenceInHours } from 'date-fns';

const NOTIFIED_KEY = 'tugasku_notified';

function getNotified(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');
  } catch { return {}; }
}

function markNotified(key: string) {
  const notified = getNotified();
  notified[key] = true;
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
}

export function useNotificationBrowser(tasks: Task[]) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  useEffect(() => {
    // Request on mount
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    // Clear previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    const notified = getNotified();

    const pendingPrivate = tasks.filter(t => t.visibility === 'private' && t.status === 'pending');

    const thresholds = [
      { key: '2d', hours: 48, label: '2 hari' },
      { key: '1d', hours: 24, label: '1 hari' },
      { key: '12h', hours: 12, label: '12 jam' },
    ];

    pendingPrivate.forEach(task => {
      const deadline = new Date(`${task.date}T${task.time}`);

      thresholds.forEach(({ key, hours, label }) => {
        const notifKey = `${task.id_task}-${key}`;
        if (notified[notifKey]) return;

        const triggerTime = new Date(deadline.getTime() - hours * 60 * 60 * 1000);
        const msUntilTrigger = differenceInMilliseconds(triggerTime, now);

        // If trigger time is in the past but deadline hasn't passed, fire immediately
        const hoursLeft = differenceInHours(deadline, now);
        const shouldFireNow = msUntilTrigger <= 0 && hoursLeft > 0 && hoursLeft <= hours;

        if (shouldFireNow) {
          markNotified(notifKey);
          new Notification(`⏰ Deadline Mendekat!`, {
            body: `"${task.title}" tinggal ${label} lagi!`,
            icon: '/favicon.ico',
            tag: notifKey,
          });
        } else if (msUntilTrigger > 0 && msUntilTrigger < 48 * 60 * 60 * 1000) {
          // Schedule future notification (max 48h ahead to avoid huge timeouts)
          const timer = setTimeout(() => {
            markNotified(notifKey);
            if (Notification.permission === 'granted') {
              new Notification(`⏰ Deadline Mendekat!`, {
                body: `"${task.title}" tinggal ${label} lagi!`,
                icon: '/favicon.ico',
                tag: notifKey,
              });
            }
          }, msUntilTrigger);
          timersRef.current.push(timer);
        }
      });
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [tasks]);

  return { requestPermission };
}
