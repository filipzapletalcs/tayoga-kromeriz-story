import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  className?: string;
}

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  error: 'text-destructive',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export const FormError = ({ type = 'error', message, className }: FormErrorProps) => {
  const Icon = iconMap[type];
  
  return (
    <div className={cn('flex items-center gap-2 text-sm', colorMap[type], className)}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Komponenta pro zobrazení chyb formuláře
export const FormFieldError = ({ error, className }: { error?: string; className?: string }) => {
  if (!error) return null;
  
  return <FormError message={error} className={className} />;
};

// Komponenta pro success zprávy
export const FormSuccess = ({ message, className }: { message?: string; className?: string }) => {
  if (!message) return null;
  
  return <FormError type="success" message={message} className={className} />;
};




