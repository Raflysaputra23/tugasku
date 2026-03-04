import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-green-500/10 text-green-500',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatCard = ({ title, value, icon: Icon, description, variant = 'default' }: StatCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="flex items-center gap-4">
      <div className={`rounded-xl p-3 ${variantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{title}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
