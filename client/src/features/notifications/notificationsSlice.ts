import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/app/store';
import { 
  Notification, 
  NotificationType,
  NotificationCategory,
  NotificationStatus,
  NotificationPriority,
  NotificationsResponse,
  MarkAsReadResponse,
  UnreadCountResponse 
} from '@/types/notification';
import { apiRequest } from '@/lib/queryClient';

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pollingInterval: number;
  settings: {
    desktopNotificationsEnabled: boolean;
    soundEnabled: boolean;
  };
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pollingInterval: 60000, // 1 minute default
  settings: {
    desktopNotificationsEnabled: true,
    soundEnabled: true
  }
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest<NotificationsResponse>('GET', '/api/notifications');
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest<MarkAsReadResponse>('PUT', `/api/notifications/${notificationId}/read`);
      return {
        id: notificationId,
        response
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest<MarkAsReadResponse>('PUT', '/api/notifications/read-all');
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark all notifications as read');
    }
  }
);

export const dismissNotification = createAsyncThunk(
  'notifications/dismissNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await apiRequest('DELETE', `/api/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to dismiss notification');
    }
  }
);

export const archiveNotification = createAsyncThunk(
  'notifications/archiveNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await apiRequest('PUT', `/api/notifications/${notificationId}/archive`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to archive notification');
    }
  }
);

export const pollNotificationCount = createAsyncThunk(
  'notifications/pollNotificationCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest<UnreadCountResponse>('GET', '/api/notifications/unread-count');
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to poll notification count');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Create a local notification that's not persisted to the server
    addLocalNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'status'>>) => {
      const newNotification: Notification = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        status: NotificationStatus.UNREAD,
        ...action.payload
      };
      
      state.items.unshift(newNotification);
      state.unreadCount += 1;
      
      // Show browser notification if enabled
      if (state.settings.desktopNotificationsEnabled && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: newNotification.icon
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
      
      // Play sound if enabled
      if (state.settings.soundEnabled) {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(() => {
          // Ignore errors from autoplay restrictions
        });
      }
    },
    
    // Remove a local notification by ID
    removeLocalNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        const notification = state.items[index];
        if (notification.status === NotificationStatus.UNREAD) {
          state.unreadCount -= 1;
        }
        state.items.splice(index, 1);
      }
    },
    
    // Mark a local notification as read
    markLocalNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && notification.status === NotificationStatus.UNREAD) {
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date().toISOString();
        state.unreadCount -= 1;
      }
    },
    
    // Update notification settings
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationsState['settings']>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
    },
    
    // Set polling interval
    setPollingInterval: (state, action: PayloadAction<number>) => {
      state.pollingInterval = action.payload;
    },
    
    // Clear all local notifications
    clearAllLocalNotifications: (state) => {
      state.items = state.items.filter(item => item.userId !== undefined);
      state.unreadCount = state.items.filter(item => item.status === NotificationStatus.UNREAD).length;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(item => item.id === action.payload.id);
        if (notification) {
          notification.status = NotificationStatus.READ;
          notification.readAt = new Date().toISOString();
        }
        state.unreadCount = action.payload.response.unreadCount;
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.items.forEach(item => {
          if (item.status === NotificationStatus.UNREAD) {
            item.status = NotificationStatus.READ;
            item.readAt = new Date().toISOString();
          }
        });
        state.unreadCount = action.payload.unreadCount;
      })
      
      // Dismiss notification
      .addCase(dismissNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload);
        if (index !== -1) {
          const notification = state.items[index];
          if (notification.status === NotificationStatus.UNREAD) {
            state.unreadCount -= 1;
          }
          state.items.splice(index, 1);
        }
      })
      
      // Archive notification
      .addCase(archiveNotification.fulfilled, (state, action) => {
        const notification = state.items.find(item => item.id === action.payload);
        if (notification) {
          notification.status = NotificationStatus.ARCHIVED;
          if (notification.status === NotificationStatus.UNREAD) {
            state.unreadCount -= 1;
          }
        }
      })
      
      // Poll notification count
      .addCase(pollNotificationCount.fulfilled, (state, action) => {
        if (action.payload.unreadCount !== state.unreadCount) {
          // If the counts don't match, we should refresh the full list
          // This will happen automatically if using React Query's polling
          state.unreadCount = action.payload.unreadCount;
        }
      });
  }
});

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectIsLoading = (state: RootState) => state.notifications.isLoading;
export const selectError = (state: RootState) => state.notifications.error;
export const selectNotificationSettings = (state: RootState) => state.notifications.settings;
export const selectPollingInterval = (state: RootState) => state.notifications.pollingInterval;

// Filtered selectors
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => n.status === NotificationStatus.UNREAD)
);

export const selectNotificationsByCategory = createSelector(
  [selectNotifications, (_, category: NotificationCategory) => category],
  (notifications, category) => notifications.filter(n => n.category === category)
);

export const selectNotificationsByType = createSelector(
  [selectNotifications, (_, type: NotificationType) => type],
  (notifications, type) => notifications.filter(n => n.type === type)
);

export const selectNotificationsByPriority = createSelector(
  [selectNotifications, (_, priority: NotificationPriority) => priority],
  (notifications, priority) => notifications.filter(n => n.priority === priority)
);

// Export actions and reducer
export const {
  addLocalNotification,
  removeLocalNotification,
  markLocalNotificationAsRead,
  updateNotificationSettings,
  setPollingInterval,
  clearAllLocalNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;