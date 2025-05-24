import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DashboardFilters, DashboardLayout } from './dashboardSlice';

// Define types for API responses
export interface DashboardLayoutResponse {
  layouts: {
    [key: string]: DashboardLayout;
  };
  activeLayout: string;
}

export interface DashboardDataResponse {
  // Revenue data
  revenue: {
    total: number;
    previousTotal?: number;
    percentChange?: number;
    data: Array<{
      date: string;
      revenue: number;
      expenses: number;
      profit: number;
    }>
  };
  
  // Order statistics
  orderStats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
    percentChange?: number;
  };
  
  // Top products
  topProducts: Array<{
    id: string | number;
    name: string;
    category: string;
    revenue: number;
    units: number;
    percentChange?: number;
  }>;
  
  // Customer statistics
  customerStats: {
    total: number;
    newCustomers: number;
    returningCustomers: number;
    percentChange?: number;
    sources: {
      direct: number;
      search: number;
      social: number;
      referral: number;
      email: number;
      mobile: number;
      desktop: number;
    };
  };
  
  // Traffic data
  trafficData: {
    total: number;
    percentChange?: number;
    sources: Array<{
      source: string;
      visits: number;
      percentage: number;
    }>;
  };
  
  // Search terms
  searchTerms: Array<{
    term: string;
    count: number;
    percentChange?: number;
  }>;
}

export interface RevenueDataResponse {
  total: number;
  previousTotal?: number;
  percentChange?: number;
  data: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

// Create the dashboard API
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getDashboardLayout: builder.query<DashboardLayoutResponse, void>({
      query: () => `/dashboard/layouts`,
    }),
    updateDashboardLayout: builder.mutation<DashboardLayoutResponse, { layouts: any, activeLayout: string }>({
      query: ({ layouts, activeLayout }) => ({
        url: `/dashboard/layouts`,
        method: 'POST',
        body: { layouts, activeLayout },
      }),
    }),
    getDashboardData: builder.query<DashboardDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/data`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
    getRevenueData: builder.query<RevenueDataResponse, DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/revenue`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
    getOrderStats: builder.query<DashboardDataResponse['orderStats'], DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/orders/stats`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
    getTopProducts: builder.query<DashboardDataResponse['topProducts'], DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/products/top`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
    getCustomerStats: builder.query<DashboardDataResponse['customerStats'], DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/customers/stats`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
    getSearchTerms: builder.query<DashboardDataResponse['searchTerms'], DashboardFilters>({
      query: (filters) => ({
        url: `/dashboard/search/terms`,
        method: 'GET',
        params: { ...filters },
      }),
    }),
  }),
});

// Export the generated hooks
export const {
  useGetDashboardLayoutQuery,
  useUpdateDashboardLayoutMutation,
  useGetDashboardDataQuery,
  useGetRevenueDataQuery,
  useGetOrderStatsQuery,
  useGetTopProductsQuery,
  useGetCustomerStatsQuery,
  useGetSearchTermsQuery,
} = dashboardApi;