"use client"

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

interface CountdownBadgeProps {
  deadline: string;
  status: 'pending' | 'completed';
}

function getTimeLeft(deadline: Date) {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: diff };
}

function formatTimeLeft(t: { days: number; hours: number; minutes: number; seconds: number }) {
  if (t.days > 0) return `${t.days}h ${t.hours}j ${t.minutes}m ${t.seconds}d`;
  if (t.hours > 0) return `${t.hours}j ${t.minutes}m ${t.seconds}d`;
  if (t.minutes > 0) return `${t.minutes}m ${t.seconds}d`;
  return `${t.seconds}d`;
}

const CountDown = ({ deadline, status }: CountdownBadgeProps) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(new Date(deadline)));

  useEffect(() => {
    if (status === 'completed') return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(deadline)));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, status]);

  if (!timeLeft && status === 'pending') {
    return (
      <Badge variant="destructive" className="text-xs gap-1 animate-pulse">
        <Timer className="h-3 w-3" /> Waktu Habis!
      </Badge>
    );
  }

  if(!timeLeft) return null;
  
  const isUrgent = timeLeft.total <= 12 * 60 * 60 * 1000;
  const isWarning = timeLeft.total <= 24 * 60 * 60 * 1000;

  return (
    <Badge
      variant={isUrgent ? 'destructive' : 'secondary'}
      className={`text-xs gap-1 font-mono tabular-nums border-foreground ${isWarning && !isUrgent ? 'bg-yellow-600/20 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500 dark:border-yellow-500/30 border border-yellow-600/30' : ''}`}
    >
      <Timer className="h-3 w-3" />
      {formatTimeLeft(timeLeft)}
    </Badge>
  );
};

export default CountDown;
