import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Order,
  OrdersResponse,
  OrderDetailsResponse,
  OrderTrackingResponse,
  ReturnRequestResponse,
  CancellationRequestResponse,
  InvoiceResponse,
  OrdersQueryParams,
  RequestReturnPayload,
  RequestCancellationPayload,
} from '@/types/order';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Order', 'OrderTracking', 'ReturnRequest', 'CancellationRequest', 'Invoice'],
  endpoints: (builder) => ({
    // Get all orders with pagination and filtering
    getOrders: builder.query<OrdersResponse, OrdersQueryParams>({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Get single order details
    getOrderDetails: builder.query<OrderDetailsResponse, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'OrderTracking', id },
        { type: 'ReturnRequest', id },
        { type: 'CancellationRequest', id },
        { type: 'Invoice', id },
      ],
    }),

    // Get order tracking details
    getOrderTracking: builder.query<OrderTrackingResponse, string>({
      query: (orderId) => `/orders/${orderId}/tracking`,
      providesTags: (result, error, id) => [{ type: 'OrderTracking', id }],
    }),

    // Poll for order tracking updates
    pollOrderTracking: builder.query<OrderTrackingResponse, { orderId: string; interval?: number }>({
      query: ({ orderId }) => `/orders/${orderId}/tracking`,
      providesTags: (result, error, { orderId }) => [{ type: 'OrderTracking', id: orderId }],
      // Enable polling with specified interval (default: 30 seconds)
      keepUnusedDataFor: 5, // seconds
      async onCacheEntryAdded(
        { orderId, interval = 30000 },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Create a polling interval
        let pollingInterval: NodeJS.Timeout | null = null;
        try {
          // Wait for initial query to resolve
          await cacheDataLoaded;

          // Set up polling interval
          pollingInterval = setInterval(async () => {
            const response = await fetch(`/api/orders/${orderId}/tracking`);
            const data = await response.json();
            updateCachedData(() => data);
          }, interval);

          // Clean up when this cache entry is removed
          await cacheEntryRemoved;
          if (pollingInterval) clearInterval(pollingInterval);
        } catch {
          // Clean up in case of error
          if (pollingInterval) clearInterval(pollingInterval);
        }
      },
    }),

    // Get order invoice
    getOrderInvoice: builder.query<InvoiceResponse, string>({
      query: (orderId) => `/orders/${orderId}/invoice`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    // Download invoice PDF
    downloadInvoicePdf: builder.query<Blob, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/invoice/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Submit return request
    submitReturnRequest: builder.mutation<ReturnRequestResponse, RequestReturnPayload>({
      query: (payload) => ({
        url: '/returns',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'ReturnRequest', id: orderId },
      ],
    }),

    // Get return request details
    getReturnRequestDetails: builder.query<ReturnRequestResponse, string>({
      query: (returnId) => `/returns/${returnId}`,
      providesTags: (result, error, id) => [{ type: 'ReturnRequest', id }],
    }),

    // Submit cancellation request
    submitCancellationRequest: builder.mutation<CancellationRequestResponse, RequestCancellationPayload>({
      query: (payload) => ({
        url: '/cancellations',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'CancellationRequest', id: orderId },
      ],
    }),

    // Get cancellation request details
    getCancellationRequestDetails: builder.query<CancellationRequestResponse, string>({
      query: (cancellationId) => `/cancellations/${cancellationId}`,
      providesTags: (result, error, id) => [{ type: 'CancellationRequest', id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useGetOrderTrackingQuery,
  usePollOrderTrackingQuery,
  useGetOrderInvoiceQuery,
  useDownloadInvoicePdfQuery,
  useSubmitReturnRequestMutation,
  useGetReturnRequestDetailsQuery,
  useSubmitCancellationRequestMutation,
  useGetCancellationRequestDetailsQuery,
} = ordersApi;