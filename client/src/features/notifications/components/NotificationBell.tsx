import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, Check, Trash2, ChevronDown, X } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { 
  selectNotifications, 
  selectUnreadCount,
  selectNotificationsLoading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../notificationsSlice';
import { 
  Notification,
  NotificationType, 
  NotificationStatus, 
  NotificationPriority 
} from '@/types/notification';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export const NotificationBell: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  
  const [open, setOpen] = useState(false);
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
  
  // Filter notifications based on the active tab
  const filteredNotifications = React.useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => n.status === NotificationStatus.UNREAD);
    }
    return notifications;
  }, [notifications, activeTab]);
  
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
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-full"><Check className="h-4 w-4" /></div>;
      case NotificationType.WARNING:
        return <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-2 rounded-full"><Bell className="h-4 w-4" /></div>;
      case NotificationType.ERROR:
        return <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-full"><X className="h-4 w-4" /></div>;
      case NotificationType.INFO:
      default:
        return <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-full"><Bell className="h-4 w-4" /></div>;
    }
  };
  
  // Get priority badge for notification
  const getPriorityBadge = (priority?: NotificationPriority) => {
    if (!priority) return null;
    
    const variants = {
      [NotificationPriority.LOW]: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      [NotificationPriority.MEDIUM]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      [NotificationPriority.HIGH]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      [NotificationPriority.URGENT]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    };
    
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${variants[priority]}`}>
        {priority}
      </span>
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark all as read
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark all notifications as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full rounded-none bg-transparent border-b h-auto p-0">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-2 px-4"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-2 px-4"
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              getNotificationIcon={getNotificationIcon}
              getPriorityBadge={getPriorityBadge}
            />
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              getNotificationIcon={getNotificationIcon}
              getPriorityBadge={getPriorityBadge}
            />
          </TabsContent>
        </Tabs>
        
        {filteredNotifications.length > 0 && (
          <div className="p-2 border-t text-center">
            <Button variant="link" size="sm" asChild>
              <a href="/notifications">View all notifications</a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// NotificationList Component
interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getNotificationIcon: (type: NotificationType) => JSX.Element;
  getPriorityBadge: (priority?: NotificationPriority) => JSX.Element | null;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityBadge
}) => {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="p-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex items-start space-x-4 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="font-medium mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground">
          You're all caught up! Check back later for new notifications.
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[350px]">
      <div className="p-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              relative p-3 mb-1 rounded-lg hover:bg-muted/50
              ${notification.status === NotificationStatus.UNREAD ? 'bg-muted/30' : 'bg-transparent'}
              transition-colors duration-200
            `}
          >
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium truncate pr-4">
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimeAgo(new Date(notification.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(notification.priority)}
                    {notification.category && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {notification.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};