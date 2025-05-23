import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
  fullScreen?: boolean;
  label?: string;
}

export function Loader({
  size = 'md',
  variant = 'primary',
  className,
  fullScreen = false,
  label,
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-gray-300 border-t-transparent dark:border-gray-600',
    white: 'border-white border-t-transparent',
  };

  const spinnerClasses = cn(
    'animate-spin rounded-full',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <div className="inline-flex items-center">
      <div className={spinnerClasses} />
      {label && <span className="ml-3">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;