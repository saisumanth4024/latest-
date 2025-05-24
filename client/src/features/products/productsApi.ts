import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
}

// Create the API
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        // Add all params that exist
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
        
        return {
          url: `/products?${queryParams.toString()}`,
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
    
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
    
    getProductsByCategory: builder.query<ProductsResponse, { category: string; params?: ProductParams }>({
      query: ({ category, params = {} }) => {
        const queryParams = new URLSearchParams();
        
        // Add all params that exist
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
        
        return {
          url: `/products/category/${category}?${queryParams.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'CATEGORY_LIST' },
            ]
          : [{ type: 'Products', id: 'CATEGORY_LIST' }],
    }),
    
    searchProducts: builder.query<ProductsResponse, { query: string; params?: ProductParams }>({
      query: ({ query, params = {} }) => {
        const queryParams = new URLSearchParams();
        
        // Add search query
        queryParams.append('search', query);
        
        // Add all params that exist
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
        
        return {
          url: `/products/search?${queryParams.toString()}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'SEARCH_RESULTS' },
            ]
          : [{ type: 'Products', id: 'SEARCH_RESULTS' }],
    }),
    
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => '/products/featured',
      providesTags: [{ type: 'Products', id: 'FEATURED' }],
    }),
    
    getNewArrivals: builder.query<Product[], void>({
      query: () => '/products/new-arrivals',
      providesTags: [{ type: 'Products', id: 'NEW_ARRIVALS' }],
    }),
    
    getBestSellers: builder.query<Product[], void>({
      query: () => '/products/best-sellers',
      providesTags: [{ type: 'Products', id: 'BEST_SELLERS' }],
    }),
    
    getProductRecommendations: builder.query<Product[], number>({
      query: (productId) => `/products/${productId}/recommendations`,
      providesTags: (_, __, id) => [{ type: 'Products', id: `RECOMMENDATIONS_${id}` }],
    }),
  }),
});

// Export hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
  useGetProductRecommendationsQuery,
} = productsApi;