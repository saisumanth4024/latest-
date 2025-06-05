import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, Check, Trash2 } from 'lucide-react';
import { Link } from '@/router/wouterCompat';
import { formatTimeAgo } from '@/lib/utils';
import { 
  selectNotifications, 
  selectUnreadCount,
  selectNotificationsLoading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '@/features/notifications/notificationsSlice';
import { 
  Notification as NotificationType,
  NotificationType as NotificationTypeEnum, 
  NotificationStatus
} from '@/types/notification';

// Import from our new components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationMenu() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Effect to fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  
  // Set up polling for notifications (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);
  
  // Filter notifications based on the active tab
  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => n.status === NotificationStatus.UNREAD)
    : notifications;
  
  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  
  // Handle deleting a notification
  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationTypeEnum) => {
    switch (type) {
      case NotificationTypeEnum.SUCCESS:
        return (
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        );
      case NotificationTypeEnum.WARNING:
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        );
      case NotificationTypeEnum.ERROR:
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case NotificationTypeEnum.INFO:
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-hidden z-20 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  Mark all as read
                </Button>
              )}
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="border-b border-slate-200 dark:border-slate-700">
                <TabsList className="w-full rounded-none bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="all"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 py-2 px-4 text-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 py-2 px-4 text-sm"
                  >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Notification Content */}
              <TabsContent value="all" className="m-0 p-0">
                {renderNotificationList()}
              </TabsContent>
              
              <TabsContent value="unread" className="m-0 p-0">
                {renderNotificationList()}
              </TabsContent>
            </Tabs>
            
            {/* Footer */}
            <div className="p-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center">
              <Link href="/notifications">
                <a 
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                  onClick={closeMenu}
                >
                  View all notifications
                </a>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  // Helper function to render notification list
  function renderNotificationList() {
    if (isLoading && notifications.length === 0) {
      return (
        <div className="p-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-start space-x-4 mb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (filteredNotifications.length === 0) {
      return (
        <div className="p-6 text-center">
          <Bell className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-slate-500 opacity-40" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'unread' 
              ? "You're all caught up!" 
              : "No notifications yet"
            }
          </p>
        </div>
      );
    }
    
    return (
      <ScrollArea className="max-h-[320px]">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`
                p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50
                ${notification.status === NotificationStatus.UNREAD ? 'bg-slate-50 dark:bg-slate-700/20' : ''}
              `}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
                      {formatTimeAgo(new Date(notification.createdAt))}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end mt-2 space-x-1">
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
}
