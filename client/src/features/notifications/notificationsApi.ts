import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Notification } from '@/types/notification';

// Define response types
export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination?: {
    total: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  notification?: Notification;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  affectedIds: string[];
  unreadCount: number;
}

// Create the notifications API
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Notification', 'UnreadCount'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => '/notifications',
      providesTags: (result) => 
        result
          ? [
              ...result.notifications.map(({ id }) => ({ type: 'Notification' as const, id })),
              { type: 'Notification', id: 'LIST' },
              { type: 'UnreadCount', id: 'COUNT' },
            ]
          : [{ type: 'Notification', id: 'LIST' }, { type: 'UnreadCount', id: 'COUNT' }],
    }),
    
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/notifications/unread-count',
      providesTags: [{ type: 'UnreadCount', id: 'COUNT' }],
    }),
    
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
    }),
    
    markAllAsRead: builder.mutation<MarkAllAsReadResponse, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: (result) =>
        result
          ? [
              ...result.affectedIds.map(id => ({ type: 'Notification' as const, id })),
              { type: 'UnreadCount', id: 'COUNT' },
            ]
          : [{ type: 'Notification', id: 'LIST' }, { type: 'UnreadCount', id: 'COUNT' }],
    }),
    
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;