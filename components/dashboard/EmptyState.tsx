import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="rounded-2xl bg-muted p-6 mb-4">
      <Icon className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} className="mt-4">{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
