import { Calendar, Clock, BookOpen, MoreVertical, Check, Eye, Copy, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/lib/types';
import { format, differenceInHours, isPast } from 'date-fns';
import { id } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  isOwner?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (task: Task) => void;
  onTake?: (task: Task) => void;
  onView?: (task: Task) => void;
}

const TaskCard = ({ task, isOwner = true, onEdit, onDelete, onToggleStatus, onTake, onView }: TaskCardProps) => {
  const deadline = new Date(`${task.date}T${task.time}`);
  const hoursUntil = differenceInHours(deadline, new Date());
  const isOverdue = isPast(deadline) && task.status === 'pending';
  const isUrgent = hoursUntil <= 24 && hoursUntil > 0 && task.status === 'pending';
  const isWarning = hoursUntil <= 48 && hoursUntil > 24 && task.status === 'pending';

  const urgencyClass = isOverdue
    ? 'border-l-4 border-l-destructive'
    : isUrgent
    ? 'border-l-4 border-l-warning'
    : isWarning
    ? 'border-l-4 border-l-accent'
    : '';

  return (
    <Card className={`hover:shadow-md transition-all group ${urgencyClass}`}>
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-lg truncate mb-2">{task.title}</h3>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={task.status === 'completed' ? 'success' : 'destructive' } className="text-xs ">
                {task.status === 'completed' ? 'Selesai' : 'Belum Selesai'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.visibility === 'public' ? 'Publik' : 'Privat'}
              </Badge>
              {isOverdue && <Badge variant="destructive" className="text-xs">Terlambat</Badge>}
              {isUrgent && <Badge className="text-xs bg-warning text-warning-foreground">Mendesak</Badge>}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-accent" />
                {task.subject}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-500" />
                {format(deadline, 'dd MMM yyyy', { locale: id })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                {format(deadline, 'HH:mm')}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{`${task.description}`}</p>
            )}
            {task?.profiles && !isOwner && (
              <p className="text-xs mt-2 p-2 bg-accent/10 border border-accent inline-block rounded-lg text-accent">Created by <span className='font-semibold'>{task.profiles.nama_lengkap}</span></p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(task)}>
                  <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                </DropdownMenuItem>
              )}
              {isOwner && onToggleStatus && (
                <DropdownMenuItem onClick={() => onToggleStatus(task)}>
                  <Check className="mr-2 h-4 w-4" />
                  {task.status === 'completed' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                </DropdownMenuItem>
              )}
              {isOwner && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              )}
              {!isOwner && onTake && (
                <DropdownMenuItem onClick={() => onTake(task)}>
                  <Copy className="mr-2 h-4 w-4" /> Ambil Tugas
                </DropdownMenuItem>
              )}
              {isOwner && onDelete && (
                <DropdownMenuItem onClick={() => onDelete(task.id_task)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
