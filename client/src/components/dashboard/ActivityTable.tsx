import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ApiActivity } from '@/types';

interface ActivityTableProps {
  activities: ApiActivity[];
  isLoading: boolean;
}

const MethodBadge = ({ method }: { method: string }) => {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'POST':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'DELETE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getMethodColor(method))}>
      {method}
    </span>
  );
};

const StatusBadge = ({ status }: { status: number }) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    } else if (status >= 400 && status < 500) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    } else if (status >= 500) {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    } else {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    }
  };
  
  const getStatusText = (status: number) => {
    if (status === 200) return '200 OK';
    if (status === 201) return '201 Created';
    if (status === 204) return '204 No Content';
    if (status === 400) return '400 Bad Request';
    if (status === 401) return '401 Unauthorized';
    if (status === 403) return '403 Forbidden';
    if (status === 404) return '404 Not Found';
    if (status === 500) return '500 Server Error';
    return `${status}`;
  };
  
  return (
    <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getStatusColor(status))}>
      {getStatusText(status)}
    </span>
  );
};

export default function ActivityTable({ activities, isLoading }: ActivityTableProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };
  
  const displayedActivities = activities.slice(0, visibleCount);
  
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Recent API Activity</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last 24 hours of API requests and responses.</p>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Endpoint</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Method</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : displayedActivities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No activity found
                </td>
              </tr>
            ) : (
              displayedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {activity.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <MethodBadge method={activity.method} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-t border-slate-200 dark:border-slate-700 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {isLoading ? 'Loading...' : `Showing ${displayedActivities.length} of ${activities.length} entries`}
          </div>
          <div>
            {visibleCount < activities.length && (
              <button 
                onClick={handleLoadMore}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Load more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
