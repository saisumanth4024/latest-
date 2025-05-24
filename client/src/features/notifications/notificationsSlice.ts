import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { apiRequest } from '@/lib/queryClient';
import { Notification, NotificationType, NotificationStatus } from '@/types/notification';

// Define interface for notification state
interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: NotificationStatus | 'all';
    type: NotificationType | 'all';
    startDate?: string;
    endDate?: string;
  };
  // For pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  };
}

// Define initial state
const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  },
};

// Define async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await apiRequest('GET', '/api/notifications');
    return await response.json();
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    const response = await apiRequest('PATCH', `/api/notifications/${id}/read`);
    return await response.json();
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    const response = await apiRequest('PATCH', '/api/notifications/mark-all-read');
    return await response.json();
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string) => {
    const response = await apiRequest('DELETE', `/api/notifications/${id}`);
    return { ...(await response.json()), id };
  }
);

// Create notifications slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof NotificationsState['filters']; value: any }>
    ) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      // Reset pagination when filters change
      state.pagination.currentPage = 1;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    addLocalNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'status'>>
    ) => {
      const newNotification: Notification = {
        id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        status: NotificationStatus.UNREAD,
        ...action.payload,
      };
      
      state.items.unshift(newNotification);
      state.unreadCount += 1;
    },
    
    markLocalNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      
      if (notification && notification.status === NotificationStatus.UNREAD) {
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    removeLocalNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      
      if (index !== -1) {
        const wasUnread = state.items[index].status === NotificationStatus.UNREAD;
        state.items.splice(index, 1);
        
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
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
        
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      // Mark as read
      .addCase(markAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success && action.payload.notification) {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.notification!.id
          );
          
          if (index !== -1) {
            const wasUnread = state.items[index].status === NotificationStatus.UNREAD;
            state.items[index] = action.payload.notification!;
            
            if (wasUnread) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to mark notification as read';
      })
      
      // Mark all as read
      .addCase(markAllAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success) {
          // Update all unread notifications to read
          state.items = state.items.map((item) => {
            if (item.status === NotificationStatus.UNREAD || action.payload.affectedIds.includes(item.id)) {
              return {
                ...item,
                status: NotificationStatus.READ,
                readAt: new Date().toISOString(),
              };
            }
            return item;
          });
          
          state.unreadCount = 0;
        }
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to mark all notifications as read';
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success) {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          
          if (index !== -1) {
            const wasUnread = state.items[index].status === NotificationStatus.UNREAD;
            state.items.splice(index, 1);
            
            if (wasUnread) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete notification';
      });
  },
});

// Export actions
export const {
  setFilter,
  setPage,
  clearError,
  addLocalNotification,
  markLocalNotificationAsRead,
  removeLocalNotification,
} = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: RootState) => state.notifications.isLoading;
export const selectNotificationsError = (state: RootState) => state.notifications.error;
export const selectNotificationsFilters = (state: RootState) => state.notifications.filters;
export const selectNotificationsPagination = (state: RootState) => state.notifications.pagination;

export default notificationsSlice.reducer;