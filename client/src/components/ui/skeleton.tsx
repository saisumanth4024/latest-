import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1, ...props }: SkeletonProps) {
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div
          key={i}
          className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)}
          {...props}
        />
      );
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
}

interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
  width?: string | string[];
}

export function SkeletonText({ 
  className,
  lines = 3,
  width = ['100%', '90%', '80%'],
  ...props 
}: SkeletonTextProps) {
  const widths = Array.isArray(width) ? width : Array(lines).fill(width);
  
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={cn('h-4', className)}
          style={{ width: widths[index % widths.length] }}
          {...props}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn('h-10 w-10 rounded-full', className)}
      {...props}
    />
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className, ...props }: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-6 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;