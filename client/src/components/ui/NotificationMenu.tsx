import { useState } from 'react';
import { formatTimeAgo } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  time: string;
  iconType: 'info' | 'success' | 'warning' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'API service update completed',
    time: formatTimeAgo(new Date(Date.now() - 2 * 60 * 1000)), // 2 minutes ago
    iconType: 'info',
  },
  {
    id: 2,
    title: 'Project build succeeded',
    time: formatTimeAgo(new Date(Date.now() - 5 * 60 * 1000)), // 5 minutes ago
    iconType: 'success',
  },
];

const getIconByType = (type: Notification['iconType']) => {
  switch (type) {
    case 'info':
      return (
        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'success':
      return (
        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      );
  }
};

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);
  
  const hasUnreadNotifications = notifications.length > 0;
  
  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        )}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-hidden z-20 border border-slate-200 dark:border-slate-700">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold">Notifications</h3>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        {getIconByType(notification.iconType)}
                      </div>
                      <div>
                        <p className="text-sm">{notification.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center">
              <button 
                onClick={closeMenu}
                className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
