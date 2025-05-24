import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Notification,
  NotificationsResponse,
  MarkAsReadResponse,
  UnreadCountResponse,
  NotificationSettings,
  NotificationSettingsResponse,
} from '@/types/notification';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Notifications', 'NotificationSettings'],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
      // Poll for new notifications every 60 seconds
      pollingInterval: 60000,
    }),

    // Get notification by ID
    getNotificationById: builder.query<Notification, string>({
      query: (id) => `/notifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notifications', id }],
    }),

    // Get unread count
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notifications'],
      // Poll for new count every 30 seconds
      pollingInterval: 30000,
    }),

    // Mark notification as read
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<MarkAsReadResponse, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Archive notification
    archiveNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/archive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Delete notification
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Get notification settings
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => '/notifications/settings',
      providesTags: ['NotificationSettings'],
    }),

    // Update notification settings
    updateNotificationSettings: builder.mutation<
      NotificationSettingsResponse,
      Partial<NotificationSettings>
    >({
      query: (settings) => ({
        url: '/notifications/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['NotificationSettings'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useArchiveNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationsApi;