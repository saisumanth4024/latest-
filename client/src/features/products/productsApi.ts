import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProductResponse, ProductsResponse, SearchParams } from './types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, SearchParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        // Add all defined parameters to query string
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.category) queryParams.append('category', params.category);
        if (params.brand) queryParams.append('brand', params.brand);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.rating) queryParams.append('rating', params.rating.toString());
        if (params.query) queryParams.append('query', params.query);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
        
        // Add filter attributes
        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // For multi-select filters
              value.forEach(val => queryParams.append(`filter_${key}`, val));
            } else {
              queryParams.append(`filter_${key}`, String(value));
            }
          });
        }
        
        return {
          url: `/products?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    getProductCategories: builder.query<string[], void>({
      query: () => '/products/categories',
    }),
    
    getProductBrands: builder.query<string[], void>({
      query: () => '/products/brands',
    }),
    
    searchProducts: builder.query<ProductsResponse, string>({
      query: (query) => `/products/search?query=${encodeURIComponent(query)}`,
      providesTags: [{ type: 'Products', id: 'SEARCH' }],
    }),
    
    getSuggestedSearches: builder.query<string[], string>({
      query: (query) => `/products/suggestions?query=${encodeURIComponent(query)}`,
    }),
    
    getHotSearchTags: builder.query<string[], void>({
      query: () => '/products/hot-searches',
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductCategoriesQuery,
  useGetProductBrandsQuery,
  useSearchProductsQuery,
  useGetSuggestedSearchesQuery,
  useGetHotSearchTagsQuery,
} = productsApi;