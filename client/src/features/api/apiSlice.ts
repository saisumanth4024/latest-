import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiActivity, ApiStatus, Metrics } from '@/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Activity', 'Status', 'Metrics'],
  endpoints: (builder) => ({
    getApiActivities: builder.query<ApiActivity[], void>({
      query: () => '/activities',
      providesTags: ['Activity'],
    }),
    getApiStatus: builder.query<ApiStatus[], void>({
      query: () => '/status',
      providesTags: ['Status'],
    }),
    getMetrics: builder.query<Metrics, void>({
      query: () => '/metrics',
      providesTags: ['Metrics'],
    }),
    createUser: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/users',
        method: 'POST',
      }),
      invalidatesTags: ['Activity'],
    }),
    deployApi: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/deploy',
        method: 'POST',
      }),
      invalidatesTags: ['Activity', 'Status'],
    }),
    viewLogs: builder.query<string[], void>({
      query: () => '/logs',
    }),
    configureRules: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/configure',
        method: 'POST',
      }),
      invalidatesTags: ['Status'],
    }),
    refreshData: builder.mutation<void, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Activity', 'Status', 'Metrics'],
    }),
    exportData: builder.query<Blob, void>({
      query: () => ({
        url: '/export',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetApiActivitiesQuery,
  useGetApiStatusQuery,
  useGetMetricsQuery,
  useCreateUserMutation,
  useDeployApiMutation,
  useViewLogsQuery,
  useLazyViewLogsQuery,
  useConfigureRulesMutation,
  useRefreshDataMutation,
  useLazyExportDataQuery,
} = apiSlice;
