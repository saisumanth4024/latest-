import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, MoreHorizontal, X } from 'lucide-react';
import { 
  selectUnreadCount, 
  markLocalNotificationAsRead,
  fetchNotifications,
  markAllAsRead
} from '../notificationsSlice';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../notificationsApi';
import { Notification, NotificationType } from '@/types/notification';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onAction?: (id: string, actionUrl: string) => void;
  onDismiss?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRead, 
  onAction,
  onDismiss
}) => {
  const getIconByType = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case NotificationType.WARNING:
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>;
      case NotificationType.ERROR:
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread') {
      onRead(notification.id);
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${
        notification.status === 'unread' ? 'bg-muted/20' : ''
      }`}
      onClick={handleClick}
    >
      {notification.image ? (
        <Avatar className="h-9 w-9 rounded-full">
          <img src={notification.image} alt="" className="object-cover" />
        </Avatar>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          {notification.icon ? (
            <span className="text-primary">{notification.icon}</span>
          ) : (
            getIconByType(notification.type)
          )}
        </div>
      )}
      
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium leading-none">
            {notification.title}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(new Date(notification.createdAt))}
            </span>
            {notification.status === 'unread' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {notification.actions.map((action, index) => (
              <Button 
                key={index} 
                variant={action.type === 'button' ? 'default' : 'outline'} 
                size="sm"
                className="text-xs h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction && onAction(notification.id, action.url);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export const NotificationBell: React.FC = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(selectUnreadCount);
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllAsReadMutation();
  
  // Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  
  const handleMarkAsRead = (id: string) => {
    // Try to mark as read with API
    if (id.startsWith('local-')) {
      // If it's a local notification, use local action
      dispatch(markLocalNotificationAsRead(id));
    } else {
      // If it's from the server, use API
      markAsRead(id);
    }
  };
  
  const handleMarkAllAsRead = () => {
    // Mark all as read on the server
    markAllNotificationsAsRead();
    // Mark all as read locally in the Redux store
    dispatch(markAllAsRead());
  };
  
  const notifications = notificationsData?.notifications || [];
  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const readNotifications = notifications.filter(n => n.status === 'read');
  
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipContent>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <PopoverContent className="w-80 sm:w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="text-sm font-medium">Notifications</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={handleMarkAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all as read
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Archive all</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                {unreadCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-1.5 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative flex h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-10 w-10 bg-primary/20 items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-medium">All caught up!</h4>
                  <p className="text-xs text-muted-foreground">You have no notifications at the moment.</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onRead={handleMarkAsRead}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative flex h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-10 w-10 bg-primary/20 items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Loading notifications...</p>
                </div>
              ) : unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Check className="h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-medium">No unread notifications</h4>
                  <p className="text-xs text-muted-foreground">You've read all your notifications.</p>
                </div>
              ) : (
                unreadNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onRead={handleMarkAsRead}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs justify-center"
            onClick={() => {}}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};