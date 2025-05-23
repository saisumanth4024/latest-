import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, SearchParams, ProductListResponse } from './types';

// Helper function to build query string from search params
const buildQueryString = (params: SearchParams): string => {
  const queryParams: string[] = [];
  
  if (params.query) {
    queryParams.push(`query=${encodeURIComponent(params.query)}`);
  }
  
  if (params.category) {
    queryParams.push(`category=${encodeURIComponent(params.category)}`);
  }
  
  if (params.brand) {
    queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
  }
  
  if (params.minPrice !== null && params.minPrice !== undefined) {
    queryParams.push(`minPrice=${params.minPrice}`);
  }
  
  if (params.maxPrice !== null && params.maxPrice !== undefined) {
    queryParams.push(`maxPrice=${params.maxPrice}`);
  }
  
  if (params.rating !== null && params.rating !== undefined) {
    queryParams.push(`rating=${params.rating}`);
  }
  
  if (params.sort) {
    queryParams.push(`sort=${params.sort}`);
  }
  
  queryParams.push(`page=${params.page}`);
  queryParams.push(`limit=${params.limit}`);
  
  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

// Create API for products
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    // Get products with filters
    getProducts: builder.query<ProductListResponse, SearchParams>({
      query: (params) => {
        return {
          url: `/products${buildQueryString(params)}`,
          method: 'GET',
        };
      },
      // Use a custom response handler for mocking data in development
      transformResponse: (response: ProductListResponse, meta, arg) => {
        // If we have an actual API response, return it
        if (response && Array.isArray(response.products)) {
          return response;
        }
        
        // Otherwise generate mock data for development
        return generateMockProductData(arg);
      },
      providesTags: (result) => 
        result
          ? [
              ...result.products.map(product => ({ type: 'Products' as const, id: product.id })),
              { type: 'Products', id: 'LIST' }
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    
    // Get a single product by ID
    getProduct: builder.query<Product, string | number>({
      query: (id) => `/products/${id}`,
      // Use a custom response handler for mocking data in development
      transformResponse: (response: Product, meta, arg) => {
        // If we have an actual API response, return it
        if (response && response.id) {
          return response;
        }
        
        // Otherwise generate a mock product for development
        return generateMockProduct(arg);
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  }),
});

// Export hooks from API
export const {
  useGetProductsQuery,
  useGetProductQuery,
} = productsApi;

// Mock data generator functions (for development purposes only)
const generateMockProduct = (id: string | number): Product => {
  const productId = typeof id === 'string' ? parseInt(id, 10) : id;
  const isNew = productId % 3 === 0;
  const discountPercentage = productId % 5 === 0 ? 15 : productId % 7 === 0 ? 20 : 0;
  const originalPrice = Math.floor(50 + (productId % 10) * 50);
  const price = discountPercentage > 0 
    ? originalPrice * (1 - discountPercentage / 100) 
    : originalPrice;
  
  return {
    id: productId,
    name: `Product ${productId} - Premium Enterprise Solution`,
    description: `This is a detailed description for product ${productId}. It features advanced technology, robust construction, and intuitive design. Perfect for enterprise applications and scalable solutions.`,
    price: Math.round(price * 100) / 100,
    originalPrice: discountPercentage > 0 ? originalPrice : undefined,
    imageUrl: `https://picsum.photos/seed/product${productId}/400/400`,
    brand: ['Apple', 'Samsung', 'Microsoft', 'Google', 'Cisco'][productId % 5],
    category: ['Electronics', 'Software', 'Office', 'Accessories', 'Security'][productId % 5],
    rating: 3 + (productId % 3) * 0.5,
    reviewCount: 10 + (productId % 90),
    stock: 5 + (productId % 45),
    isNew,
    tags: ['Enterprise', 'Premium', 'Professional', 'Reliable', 'Secure'].slice(0, 2 + (productId % 4)),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Generate a list of mock products
const generateMockProductData = (params: SearchParams): ProductListResponse => {
  const { page, limit } = params;
  const totalCount = 120; // Mock total count
  const totalPages = Math.ceil(totalCount / limit);
  
  const startIndex = (page - 1) * limit;
  const mockProducts = Array.from({ length: Math.min(limit, totalCount - startIndex) }, (_, index) => {
    return generateMockProduct(startIndex + index + 1);
  });
  
  return {
    products: mockProducts,
    totalCount,
    page,
    limit,
    totalPages,
  };
};