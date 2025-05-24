import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Review,
  SellerResponse,
  ReviewReport,
  ModerationAction,
  ReviewFilters,
  ReviewSortOptions,
  ReviewAnalytics,
  FeedbackForm,
  FeedbackResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewVoteRequest,
  ReportReviewRequest,
  ModerateReviewRequest,
  CreateSellerResponseRequest,
  GetReviewsRequest,
  GetReviewsResponse,
  GetReviewAnalyticsResponse,
  ModerationQueueFilters,
  ModerationQueueItem,
  GetModerationQueueResponse
} from './types';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/reviews' }),
  tagTypes: [
    'Review', 
    'SellerResponse', 
    'Report', 
    'ModerationQueue', 
    'Analytics',
    'FeedbackForm',
    'FeedbackResponse',
    'UserInteraction'
  ],
  endpoints: (builder) => ({
    // Review management endpoints
    getReviews: builder.query<GetReviewsResponse, GetReviewsRequest>({
      query: (params) => {
        const { filters, sorting, pagination } = params;
        
        // Construct query params
        const queryParams = new URLSearchParams();
        
        // Add pagination params
        if (pagination) {
          queryParams.append('page', pagination.page.toString());
          queryParams.append('limit', pagination.limit.toString());
        }
        
        // Add sorting params
        if (sorting) {
          queryParams.append('sortBy', sorting.field);
          queryParams.append('sortDirection', sorting.direction);
        }
        
        // Add filter params
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (key === 'dateRange' && typeof value === 'object') {
                if (value.from) queryParams.append('dateFrom', value.from);
                if (value.to) queryParams.append('dateTo', value.to);
              } else if (key === 'moderation' && typeof value === 'object') {
                if (value.status) queryParams.append('moderationStatus', value.status);
                if (value.type) queryParams.append('moderationType', value.type);
              } else if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v.toString()));
              } else {
                queryParams.append(key, value.toString());
              }
            }
          });
        }
        
        return {
          url: `?${queryParams.toString()}`
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.reviews.map(review => ({ type: 'Review' as const, id: review.id })),
              { type: 'Review', id: 'LIST' }
            ]
          : [{ type: 'Review', id: 'LIST' }]
    }),
    
    getReviewById: builder.query<Review, string>({
      query: (id) => `/${id}`,
      providesTags: (result) => 
        result ? [{ type: 'Review', id: result.id }] : []
    }),
    
    // Get reviews for a specific content item (product, seller, etc.)
    getContentReviews: builder.query<GetReviewsResponse, { contentType: string; contentId: string; request: Partial<GetReviewsRequest> }>({
      query: ({ contentType, contentId, request }) => {
        const { filters = {}, sorting, pagination } = request;
        
        // Construct query params
        const queryParams = new URLSearchParams();
        queryParams.append('contentType', contentType);
        queryParams.append('contentId', contentId);
        
        // Add pagination params
        if (pagination) {
          queryParams.append('page', pagination.page.toString());
          queryParams.append('limit', pagination.limit.toString());
        }
        
        // Add sorting params
        if (sorting) {
          queryParams.append('sortBy', sorting.field);
          queryParams.append('sortDirection', sorting.direction);
        }
        
        // Add the rest of the filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'contentType' && key !== 'contentId') {
            if (key === 'dateRange' && typeof value === 'object') {
              if (value.from) queryParams.append('dateFrom', value.from);
              if (value.to) queryParams.append('dateTo', value.to);
            } else if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        return {
          url: `/content?${queryParams.toString()}`
        };
      },
      providesTags: (result, error, arg) => 
        result
          ? [
              ...result.reviews.map(review => ({ type: 'Review' as const, id: review.id })),
              { type: 'Review', id: `${arg.contentType}_${arg.contentId}` }
            ]
          : [{ type: 'Review', id: `${arg.contentType}_${arg.contentId}` }]
    }),
    
    // Get review children (replies, answers)
    getReviewChildren: builder.query<Review[], string>({
      query: (parentId) => `/children/${parentId}`,
      providesTags: (result, error, parentId) => 
        result
          ? [
              ...result.map(review => ({ type: 'Review' as const, id: review.id })),
              { type: 'Review', id: `children_${parentId}` }
            ]
          : [{ type: 'Review', id: `children_${parentId}` }]
    }),
    
    // Create new review
    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (reviewData) => ({
        url: '/',
        method: 'POST',
        body: reviewData
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: `${arg.contentType}_${arg.contentId}` },
        ...(arg.parentId ? [{ type: 'Review', id: `children_${arg.parentId}` }] : [])
      ]
    }),
    
    // Update existing review
    updateReview: builder.mutation<Review, UpdateReviewRequest>({
      query: ({ id, ...reviewData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: reviewData
      }),
      invalidatesTags: (result) => 
        result ? [{ type: 'Review', id: result.id }] : []
    }),
    
    // Delete review
    deleteReview: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' }
      ]
    }),
    
    // Vote on review
    voteReview: builder.mutation<Review, ReviewVoteRequest>({
      query: ({ reviewId, voteType }) => ({
        url: `/${reviewId}/vote`,
        method: 'POST',
        body: { voteType }
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
        { type: 'UserInteraction', id: `vote_${reviewId}` }
      ]
    }),
    
    // Report review
    reportReview: builder.mutation<ReviewReport, ReportReviewRequest>({
      query: ({ reviewId, ...reportData }) => ({
        url: `/${reviewId}/report`,
        method: 'POST',
        body: reportData
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
        { type: 'Report', id: reviewId },
        { type: 'UserInteraction', id: `report_${reviewId}` },
        { type: 'ModerationQueue', id: 'LIST' }
      ]
    }),
    
    // Moderation
    moderateReview: builder.mutation<Review, ModerateReviewRequest>({
      query: ({ reviewId, ...moderationData }) => ({
        url: `/${reviewId}/moderate`,
        method: 'POST',
        body: moderationData
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
        { type: 'ModerationQueue', id: 'LIST' },
        { type: 'ModerationQueue', id: 'ITEM' }
      ]
    }),
    
    // Seller responses
    getSellerResponses: builder.query<SellerResponse[], string>({
      query: (reviewId) => `/${reviewId}/responses`,
      providesTags: (result, error, reviewId) => 
        result
          ? [
              ...result.map(response => ({ type: 'SellerResponse' as const, id: response.id })),
              { type: 'SellerResponse', id: `review_${reviewId}` }
            ]
          : [{ type: 'SellerResponse', id: `review_${reviewId}` }]
    }),
    
    createSellerResponse: builder.mutation<SellerResponse, CreateSellerResponseRequest>({
      query: ({ reviewId, ...responseData }) => ({
        url: `/${reviewId}/responses`,
        method: 'POST',
        body: responseData
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'SellerResponse', id: `review_${reviewId}` },
        { type: 'Review', id: reviewId }
      ]
    }),
    
    updateSellerResponse: builder.mutation<SellerResponse, { responseId: string; content: any }>({
      query: ({ responseId, content }) => ({
        url: `/responses/${responseId}`,
        method: 'PATCH',
        body: { content }
      }),
      invalidatesTags: (result) => 
        result ? [
          { type: 'SellerResponse', id: result.id },
          { type: 'SellerResponse', id: `review_${result.reviewId}` }
        ] : []
    }),
    
    deleteSellerResponse: builder.mutation<{ success: boolean }, string>({
      query: (responseId) => ({
        url: `/responses/${responseId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, responseId) => [
        { type: 'SellerResponse', id: responseId }
      ]
    }),
    
    // Analytics
    getReviewAnalytics: builder.query<ReviewAnalytics, { contentType: string; contentId: string }>({
      query: ({ contentType, contentId }) => `/analytics?contentType=${contentType}&contentId=${contentId}`,
      providesTags: (result, error, { contentType, contentId }) => [
        { type: 'Analytics', id: `${contentType}_${contentId}` }
      ]
    }),
    
    // Moderation queue
    getModerationQueue: builder.query<GetModerationQueueResponse, { filters?: ModerationQueueFilters; page?: number; limit?: number }>({
      query: ({ filters = {}, page = 1, limit = 20 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        
        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'dateRange' && typeof value === 'object') {
              if (value.from) queryParams.append('dateFrom', value.from);
              if (value.to) queryParams.append('dateTo', value.to);
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        return {
          url: `/moderation?${queryParams.toString()}`
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.items.map(item => ({ type: 'ModerationQueue' as const, id: item.reviewId })),
              { type: 'ModerationQueue', id: 'LIST' }
            ]
          : [{ type: 'ModerationQueue', id: 'LIST' }]
    }),
    
    assignModerationItem: builder.mutation<ModerationQueueItem, { reviewId: string; userId: string }>({
      query: ({ reviewId, userId }) => ({
        url: `/moderation/${reviewId}/assign`,
        method: 'POST',
        body: { userId }
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'ModerationQueue', id: reviewId },
        { type: 'ModerationQueue', id: 'LIST' }
      ]
    }),
    
    // Feedback forms
    getFeedbackForms: builder.query<FeedbackForm[], { status?: string }>({
      query: ({ status }) => `/forms${status ? `?status=${status}` : ''}`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(form => ({ type: 'FeedbackForm' as const, id: form.id })),
              { type: 'FeedbackForm', id: 'LIST' }
            ]
          : [{ type: 'FeedbackForm', id: 'LIST' }]
    }),
    
    getFeedbackFormById: builder.query<FeedbackForm, string>({
      query: (id) => `/forms/${id}`,
      providesTags: (result) => 
        result ? [{ type: 'FeedbackForm', id: result.id }] : []
    }),
    
    createFeedbackForm: builder.mutation<FeedbackForm, Partial<FeedbackForm>>({
      query: (formData) => ({
        url: '/forms',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: [{ type: 'FeedbackForm', id: 'LIST' }]
    }),
    
    updateFeedbackForm: builder.mutation<FeedbackForm, { id: string, data: Partial<FeedbackForm> }>({
      query: ({ id, data }) => ({
        url: `/forms/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result) => 
        result ? [{ type: 'FeedbackForm', id: result.id }] : []
    }),
    
    deleteFeedbackForm: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'FeedbackForm', id },
        { type: 'FeedbackForm', id: 'LIST' }
      ]
    }),
    
    // Feedback responses
    submitFeedbackResponse: builder.mutation<FeedbackResponse, Partial<FeedbackResponse>>({
      query: (responseData) => ({
        url: `/forms/${responseData.formId}/responses`,
        method: 'POST',
        body: responseData
      }),
      invalidatesTags: (result, error, { formId }) => [
        { type: 'FeedbackForm', id: formId },
        { type: 'FeedbackResponse', id: `form_${formId}` }
      ]
    }),
    
    getFeedbackResponses: builder.query<FeedbackResponse[], { formId: string; page?: number; limit?: number }>({
      query: ({ formId, page = 1, limit = 20 }) => 
        `/forms/${formId}/responses?page=${page}&limit=${limit}`,
      providesTags: (result, error, { formId }) => 
        result
          ? [
              ...result.map(response => ({ type: 'FeedbackResponse' as const, id: response.id })),
              { type: 'FeedbackResponse', id: `form_${formId}` }
            ]
          : [{ type: 'FeedbackResponse', id: `form_${formId}` }]
    }),
    
    // User interactions
    getUserReviewInteractions: builder.query<string[], { userId: string, type: 'helpful' | 'unhelpful' | 'report' | 'save' }>({
      query: ({ userId, type }) => `/users/${userId}/interactions?type=${type}`,
      providesTags: (result, error, { userId, type }) => [
        { type: 'UserInteraction', id: `${userId}_${type}` }
      ]
    })
  })
});

export const {
  // Review endpoints
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useGetContentReviewsQuery,
  useGetReviewChildrenQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useVoteReviewMutation,
  useReportReviewMutation,
  
  // Moderation endpoints
  useModerateReviewMutation,
  useGetModerationQueueQuery,
  useAssignModerationItemMutation,
  
  // Seller response endpoints
  useGetSellerResponsesQuery,
  useCreateSellerResponseMutation,
  useUpdateSellerResponseMutation,
  useDeleteSellerResponseMutation,
  
  // Analytics endpoints
  useGetReviewAnalyticsQuery,
  
  // Feedback form endpoints
  useGetFeedbackFormsQuery,
  useGetFeedbackFormByIdQuery,
  useCreateFeedbackFormMutation,
  useUpdateFeedbackFormMutation,
  useDeleteFeedbackFormMutation,
  
  // Feedback response endpoints
  useSubmitFeedbackResponseMutation,
  useGetFeedbackResponsesQuery,
  
  // User interaction endpoints
  useGetUserReviewInteractionsQuery
} = reviewsApi;