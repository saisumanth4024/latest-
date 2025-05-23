import { cn } from '@/lib/utils';
import type { ApiStatus } from '@/types';

interface APIStatusProps {
  statuses: ApiStatus[];
  isLoading: boolean;
}

export default function APIStatus({ statuses, isLoading }: APIStatusProps) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">API Status</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Current service health metrics.</p>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading status information...
          </div>
        ) : (
          <div className="space-y-4">
            {statuses.length === 0 ? (
              <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No status information available
              </div>
            ) : (
              statuses.map((status) => (
                <div key={status.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "mr-3 h-3 w-3 rounded-full",
                        status.status === 'operational' ? "bg-green-500" : 
                        status.status === 'degraded' ? "bg-amber-500" : 
                        "bg-red-500"
                      )}
                    ></div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{status.name}</span>
                  </div>
                  <span 
                    className={cn(
                      "text-sm",
                      status.status === 'operational' ? "text-green-600 dark:text-green-400" : 
                      status.status === 'degraded' ? "text-amber-600 dark:text-amber-400" : 
                      "text-red-600 dark:text-red-400"
                    )}
                  >
                    {status.status === 'operational' ? 'Operational' : 
                     status.status === 'degraded' ? 'Degraded' : 
                     'Down'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
