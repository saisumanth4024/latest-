import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DashboardStatsResponse,
  RevenueDataResponse,
  OrdersDataResponse,
  UserGrowthResponse,
  TrafficSourcesResponse,
  DeviceDataResponse,
  TopProductsResponse,
  SearchTermsResponse,
  GeographicDataResponse,
  DashboardFilters,
  DashboardLayout,
  TimeRange,
} from '@/types/dashboard';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['DashboardStats', 'DashboardLayout'],
  endpoints: (builder) => ({
    // Get dashboard stats (summary numbers)
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => '/dashboard/stats',
      providesTags: ['DashboardStats'],
      // Poll for live updates every 30 seconds
      keepUnusedDataFor: 30,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Create WebSocket connection for real-time updates
        let ws: WebSocket | null = null;
        try {
          await cacheDataLoaded;

          ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/dashboard/stats/live`);
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            updateCachedData(() => data);
          };
          
          await cacheEntryRemoved;
          ws?.close();
        } catch {
          ws?.close();
        }
      },
    }),

    // Get revenue data for charts
    getRevenueData: builder.query<RevenueDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/revenue',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          compareWith: filters.compareWith,
          compareStartDate: filters.compareDateRange?.startDate,
          compareEndDate: filters.compareDateRange?.endDate,
        },
      }),
    }),

    // Get orders data for charts
    getOrdersData: builder.query<OrdersDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/orders',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          compareWith: filters.compareWith,
          compareStartDate: filters.compareDateRange?.startDate,
          compareEndDate: filters.compareDateRange?.endDate,
        },
      }),
    }),

    // Get user growth data
    getUserGrowthData: builder.query<UserGrowthResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/users',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          compareWith: filters.compareWith,
          compareStartDate: filters.compareDateRange?.startDate,
          compareEndDate: filters.compareDateRange?.endDate,
        },
      }),
    }),

    // Get traffic sources data
    getTrafficSourcesData: builder.query<TrafficSourcesResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/traffic',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
        },
      }),
    }),

    // Get device breakdown data
    getDeviceData: builder.query<DeviceDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/devices',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
        },
      }),
    }),

    // Get top products data
    getTopProductsData: builder.query<TopProductsResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/products/top',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          limit: 10,
        },
      }),
    }),

    // Get search analytics data
    getSearchTermsData: builder.query<SearchTermsResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/search',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
          limit: 10,
        },
      }),
    }),

    // Get geographic distribution data
    getGeographicData: builder.query<GeographicDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: '/dashboard/geography',
        method: 'GET',
        params: {
          timeRange: filters.timeRange,
          startDate: filters.dateRange?.startDate,
          endDate: filters.dateRange?.endDate,
        },
      }),
    }),

    // Get dashboard layout
    getDashboardLayout: builder.query<DashboardLayout, string | undefined>({
      query: (userId) => `/dashboard/layout${userId ? `?userId=${userId}` : ''}`,
      providesTags: ['DashboardLayout'],
    }),

    // Update dashboard layout
    updateDashboardLayout: builder.mutation<DashboardLayout, { userId: string; layout: Partial<DashboardLayout> }>({
      query: ({ userId, layout }) => ({
        url: `/dashboard/layout`,
        method: 'PUT',
        body: { userId, ...layout },
      }),
      invalidatesTags: ['DashboardLayout'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueDataQuery,
  useGetOrdersDataQuery,
  useGetUserGrowthDataQuery,
  useGetTrafficSourcesDataQuery,
  useGetDeviceDataQuery,
  useGetTopProductsDataQuery,
  useGetSearchTermsDataQuery,
  useGetGeographicDataQuery,
  useGetDashboardLayoutQuery,
  useUpdateDashboardLayoutMutation,
} = dashboardApi;