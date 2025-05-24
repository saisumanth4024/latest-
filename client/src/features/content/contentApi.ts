import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Media,
  Video,
  Banner,
  Page,
  Deal,
  Recommendation,
  ContentFilter,
  Playlist,
  ContentCollection
} from './types';

// Define base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/content',
  prepareHeaders: (headers) => {
    // You could add auth tokens here if needed
    return headers;
  }
});

// Common pagination and filtering params
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Response type with pagination
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Create the content API
export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery,
  tagTypes: [
    'Media', 
    'Video', 
    'Banner', 
    'Page', 
    'Deal', 
    'Recommendation',
    'Playlist',
    'ContentCollection'
  ],
  endpoints: (builder) => ({
    // Media endpoints
    getMedia: builder.query<PaginatedResponse<Media>, PaginationParams & Partial<ContentFilter>>({
      query: (params) => ({
        url: '/media',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Media' as const, id })),
              { type: 'Media', id: 'LIST' }
            ]
          : [{ type: 'Media', id: 'LIST' }],
    }),
    
    getMediaById: builder.query<Media, string>({
      query: (id) => `/media/${id}`,
      providesTags: (result, error, id) => [{ type: 'Media', id }]
    }),
    
    uploadMedia: builder.mutation<Media, FormData>({
      query: (formData) => ({
        url: '/media/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Media', id: 'LIST' }]
    }),
    
    updateMedia: builder.mutation<Media, { id: string, data: Partial<Media> }>({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' }
      ]
    }),
    
    deleteMedia: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Media', id: 'LIST' }]
    }),
    
    // Video-specific endpoints
    getVideos: builder.query<PaginatedResponse<Video>, PaginationParams & Partial<ContentFilter>>({
      query: (params) => ({
        url: '/videos',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Video' as const, id })),
              { type: 'Video', id: 'LIST' }
            ]
          : [{ type: 'Video', id: 'LIST' }],
    }),
    
    getVideoById: builder.query<Video, string>({
      query: (id) => `/videos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Video', id }]
    }),
    
    uploadVideo: builder.mutation<Video, FormData>({
      query: (formData) => ({
        url: '/videos/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }]
    }),
    
    updateVideo: builder.mutation<Video, { id: string, data: Partial<Video> }>({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' }
      ]
    }),
    
    incrementVideoViews: builder.mutation<{ viewCount: number }, string>({
      query: (id) => ({
        url: `/videos/${id}/views`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Video', id }]
    }),
    
    // Banner endpoints
    getBanners: builder.query<PaginatedResponse<Banner>, PaginationParams & {
      position?: string;
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/banners',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Banner' as const, id })),
              { type: 'Banner', id: 'LIST' }
            ]
          : [{ type: 'Banner', id: 'LIST' }],
    }),
    
    getBannerById: builder.query<Banner, string>({
      query: (id) => `/banners/${id}`,
      providesTags: (result, error, id) => [{ type: 'Banner', id }]
    }),
    
    getBannersByPosition: builder.query<Banner[], string>({
      query: (position) => `/banners/position/${position}`,
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Banner' as const, id })),
              { type: 'Banner', id: 'LIST' }
            ]
          : [{ type: 'Banner', id: 'LIST' }],
    }),
    
    createBanner: builder.mutation<Banner, Partial<Banner>>({
      query: (data) => ({
        url: '/banners',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }]
    }),
    
    updateBanner: builder.mutation<Banner, { id: string, data: Partial<Banner> }>({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Banner', id },
        { type: 'Banner', id: 'LIST' }
      ]
    }),
    
    deleteBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }]
    }),
    
    trackBannerClick: builder.mutation<{ clickCount: number }, string>({
      query: (id) => ({
        url: `/banners/${id}/click`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Banner', id }]
    }),
    
    trackBannerView: builder.mutation<{ viewCount: number }, string>({
      query: (id) => ({
        url: `/banners/${id}/view`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Banner', id }]
    }),
    
    // Page endpoints
    getPages: builder.query<PaginatedResponse<Page>, PaginationParams & {
      type?: string;
      isPublished?: boolean;
      tag?: string;
    }>({
      query: (params) => ({
        url: '/pages',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Page' as const, id })),
              { type: 'Page', id: 'LIST' }
            ]
          : [{ type: 'Page', id: 'LIST' }],
    }),
    
    getPageById: builder.query<Page, string>({
      query: (id) => `/pages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Page', id }]
    }),
    
    getPageBySlug: builder.query<Page, string>({
      query: (slug) => `/pages/slug/${slug}`,
      providesTags: (result) => result ? [{ type: 'Page', id: result.id }] : []
    }),
    
    createPage: builder.mutation<Page, Partial<Page>>({
      query: (data) => ({
        url: '/pages',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Page', id: 'LIST' }]
    }),
    
    updatePage: builder.mutation<Page, { id: string, data: Partial<Page> }>({
      query: ({ id, data }) => ({
        url: `/pages/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Page', id },
        { type: 'Page', id: 'LIST' }
      ]
    }),
    
    deletePage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/pages/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Page', id: 'LIST' }]
    }),
    
    // Deal endpoints
    getDeals: builder.query<PaginatedResponse<Deal>, PaginationParams & {
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/deals',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Deal' as const, id })),
              { type: 'Deal', id: 'LIST' }
            ]
          : [{ type: 'Deal', id: 'LIST' }],
    }),
    
    getDealById: builder.query<Deal, string>({
      query: (id) => `/deals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Deal', id }]
    }),
    
    createDeal: builder.mutation<Deal, Partial<Deal>>({
      query: (data) => ({
        url: '/deals',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Deal', id: 'LIST' }]
    }),
    
    updateDeal: builder.mutation<Deal, { id: string, data: Partial<Deal> }>({
      query: ({ id, data }) => ({
        url: `/deals/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Deal', id },
        { type: 'Deal', id: 'LIST' }
      ]
    }),
    
    deleteDeal: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/deals/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Deal', id: 'LIST' }]
    }),
    
    // Recommendation endpoints
    getRecommendations: builder.query<PaginatedResponse<Recommendation>, PaginationParams & {
      type?: string;
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/recommendations',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Recommendation' as const, id })),
              { type: 'Recommendation', id: 'LIST' }
            ]
          : [{ type: 'Recommendation', id: 'LIST' }],
    }),
    
    getRecommendationById: builder.query<Recommendation, string>({
      query: (id) => `/recommendations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Recommendation', id }]
    }),
    
    getRecommendationsByType: builder.query<Recommendation[], string>({
      query: (type) => `/recommendations/type/${type}`,
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Recommendation' as const, id })),
              { type: 'Recommendation', id: 'LIST' }
            ]
          : [{ type: 'Recommendation', id: 'LIST' }],
    }),
    
    getPersonalizedRecommendations: builder.query<Recommendation[], void>({
      query: () => '/recommendations/personalized',
      providesTags: [{ type: 'Recommendation', id: 'PERSONALIZED' }]
    }),
    
    createRecommendation: builder.mutation<Recommendation, Partial<Recommendation>>({
      query: (data) => ({
        url: '/recommendations',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Recommendation', id: 'LIST' }]
    }),
    
    updateRecommendation: builder.mutation<Recommendation, { id: string, data: Partial<Recommendation> }>({
      query: ({ id, data }) => ({
        url: `/recommendations/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Recommendation', id },
        { type: 'Recommendation', id: 'LIST' }
      ]
    }),
    
    deleteRecommendation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/recommendations/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Recommendation', id: 'LIST' }]
    }),
    
    // Playlist endpoints
    getPlaylists: builder.query<PaginatedResponse<Playlist>, PaginationParams & {
      isPublic?: boolean;
      createdBy?: string;
    }>({
      query: (params) => ({
        url: '/playlists',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist', id: 'LIST' }
            ]
          : [{ type: 'Playlist', id: 'LIST' }],
    }),
    
    getPlaylistById: builder.query<Playlist, string>({
      query: (id) => `/playlists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Playlist', id }]
    }),
    
    createPlaylist: builder.mutation<Playlist, Partial<Playlist>>({
      query: (data) => ({
        url: '/playlists',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }]
    }),
    
    updatePlaylist: builder.mutation<Playlist, { id: string, data: Partial<Playlist> }>({
      query: ({ id, data }) => ({
        url: `/playlists/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Playlist', id },
        { type: 'Playlist', id: 'LIST' }
      ]
    }),
    
    deletePlaylist: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/playlists/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }]
    }),
    
    addVideoToPlaylist: builder.mutation<Playlist, { playlistId: string, videoId: string }>({
      query: ({ playlistId, videoId }) => ({
        url: `/playlists/${playlistId}/videos/${videoId}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }]
    }),
    
    removeVideoFromPlaylist: builder.mutation<Playlist, { playlistId: string, videoId: string }>({
      query: ({ playlistId, videoId }) => ({
        url: `/playlists/${playlistId}/videos/${videoId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }]
    }),
    
    // Content collections endpoints
    getContentCollections: builder.query<PaginatedResponse<ContentCollection>, PaginationParams & {
      type?: string;
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/collections',
        params
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'ContentCollection' as const, id })),
              { type: 'ContentCollection', id: 'LIST' }
            ]
          : [{ type: 'ContentCollection', id: 'LIST' }],
    }),
    
    getContentCollectionById: builder.query<ContentCollection, string>({
      query: (id) => `/collections/${id}`,
      providesTags: (result, error, id) => [{ type: 'ContentCollection', id }]
    }),
    
    createContentCollection: builder.mutation<ContentCollection, Partial<ContentCollection>>({
      query: (data) => ({
        url: '/collections',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'ContentCollection', id: 'LIST' }]
    }),
    
    updateContentCollection: builder.mutation<ContentCollection, { id: string, data: Partial<ContentCollection> }>({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ContentCollection', id },
        { type: 'ContentCollection', id: 'LIST' }
      ]
    }),
    
    deleteContentCollection: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'ContentCollection', id: 'LIST' }]
    }),
    
    // Search endpoints
    searchContent: builder.query<{
      media: Media[];
      videos: Video[];
      pages: Page[];
      deals: Deal[];
      total: number;
    }, ContentFilter>({
      query: (params) => ({
        url: '/search',
        params
      })
    }),
    
    getTrendingContent: builder.query<{
      videos: Video[];
      deals: Deal[];
    }, void>({
      query: () => '/trending'
    }),
  }),
});

// Export hooks for each endpoint
export const {
  // Media hooks
  useGetMediaQuery,
  useGetMediaByIdQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
  
  // Video hooks
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useUploadVideoMutation,
  useUpdateVideoMutation,
  useIncrementVideoViewsMutation,
  
  // Banner hooks
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useGetBannersByPositionQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useTrackBannerClickMutation,
  useTrackBannerViewMutation,
  
  // Page hooks
  useGetPagesQuery,
  useGetPageByIdQuery,
  useGetPageBySlugQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  
  // Deal hooks
  useGetDealsQuery,
  useGetDealByIdQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
  
  // Recommendation hooks
  useGetRecommendationsQuery,
  useGetRecommendationByIdQuery,
  useGetRecommendationsByTypeQuery,
  useGetPersonalizedRecommendationsQuery,
  useCreateRecommendationMutation,
  useUpdateRecommendationMutation,
  useDeleteRecommendationMutation,
  
  // Playlist hooks
  useGetPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
  
  // Content collection hooks
  useGetContentCollectionsQuery,
  useGetContentCollectionByIdQuery,
  useCreateContentCollectionMutation,
  useUpdateContentCollectionMutation,
  useDeleteContentCollectionMutation,
  
  // Search hooks
  useSearchContentQuery,
  useGetTrendingContentQuery,
} = contentApi;