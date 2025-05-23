import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  tags: string[];
  inStock: boolean;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  colors?: string[];
  sizes?: string[];
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

// Sample product data for development
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'Experience premium sound quality with these wireless headphones. Noise cancelling and long battery life.',
    price: 199.99,
    discountPrice: 159.99,
    rating: 4.8,
    reviewCount: 352,
    category: 'Electronics',
    brand: 'SoundMaster',
    tags: ['wireless', 'headphones', 'noise-cancelling'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    isNew: true,
    colors: ['black', 'silver', 'blue'],
    createdAt: '2023-01-15T12:00:00Z'
  },
  {
    id: 2,
    name: 'Ultra HD Smart TV 55"',
    description: 'Crystal clear 4K display with smart features and voice control.',
    price: 699.99,
    rating: 4.6,
    reviewCount: 128,
    category: 'Electronics',
    brand: 'TechVision',
    tags: ['tv', '4k', 'smart-tv'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    isFeatured: true,
    createdAt: '2023-02-10T12:00:00Z'
  },
  {
    id: 3,
    name: 'Professional Camera Kit',
    description: 'DSLR camera with multiple lenses and accessories for professional photography.',
    price: 1299.99,
    discountPrice: 1099.99,
    rating: 4.9,
    reviewCount: 87,
    category: 'Photography',
    brand: 'PhotoPro',
    tags: ['camera', 'dslr', 'professional'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    createdAt: '2023-01-05T12:00:00Z'
  },
  {
    id: 4,
    name: 'Ultra-thin Laptop',
    description: 'Powerful and lightweight laptop for work and entertainment.',
    price: 1299.99,
    rating: 4.7,
    reviewCount: 215,
    category: 'Electronics',
    brand: 'TechBook',
    tags: ['laptop', 'ultrabook', 'lightweight'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    isNew: true,
    createdAt: '2023-03-20T12:00:00Z'
  },
  {
    id: 5,
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging for all Qi-compatible devices.',
    price: 49.99,
    discountPrice: 39.99,
    rating: 4.5,
    reviewCount: 184,
    category: 'Electronics',
    brand: 'PowerTech',
    tags: ['wireless', 'charger', 'fast-charging'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
    createdAt: '2023-02-25T12:00:00Z'
  },
  {
    id: 6,
    name: 'Bluetooth Smart Speaker',
    description: 'Room-filling sound with voice assistant integration.',
    price: 129.99,
    rating: 4.3,
    reviewCount: 97,
    category: 'Electronics',
    brand: 'SoundMaster',
    tags: ['speaker', 'bluetooth', 'smart-home'],
    inStock: false,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab',
    createdAt: '2023-01-30T12:00:00Z'
  },
  {
    id: 7,
    name: 'Ergonomic Office Chair',
    description: 'Comfortable chair with lumbar support for long working hours.',
    price: 249.99,
    discountPrice: 199.99,
    rating: 4.6,
    reviewCount: 76,
    category: 'Furniture',
    brand: 'ComfortPlus',
    tags: ['chair', 'office', 'ergonomic'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a',
    isFeatured: true,
    createdAt: '2023-02-15T12:00:00Z'
  },
  {
    id: 8,
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch.',
    price: 199.99,
    rating: 4.4,
    reviewCount: 143,
    category: 'Wearables',
    brand: 'FitTech',
    tags: ['smartwatch', 'fitness', 'health'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    isNew: true,
    colors: ['black', 'white', 'blue', 'pink'],
    createdAt: '2023-03-10T12:00:00Z'
  },
  {
    id: 9,
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder.',
    price: 159.99,
    rating: 4.7,
    reviewCount: 89,
    category: 'Kitchen',
    brand: 'BrewMaster',
    tags: ['coffee', 'kitchen', 'appliance'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1606224547099-b7e36c19b1ed',
    createdAt: '2023-01-20T12:00:00Z'
  },
  {
    id: 10,
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable buttons.',
    price: 79.99,
    discountPrice: 69.99,
    rating: 4.8,
    reviewCount: 211,
    category: 'Gaming',
    brand: 'GameTech',
    tags: ['gaming', 'mouse', 'wireless'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
    colors: ['black', 'white', 'rgb'],
    createdAt: '2023-02-05T12:00:00Z'
  },
  {
    id: 11,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with amazing sound quality.',
    price: 89.99,
    rating: 4.5,
    reviewCount: 178,
    category: 'Electronics',
    brand: 'SoundMaster',
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    colors: ['black', 'blue', 'red', 'green'],
    createdAt: '2023-03-15T12:00:00Z'
  },
  {
    id: 12,
    name: 'Smart Home Hub',
    description: 'Control all your smart home devices from one central hub.',
    price: 149.99,
    rating: 4.2,
    reviewCount: 56,
    category: 'Smart Home',
    brand: 'HomeConnect',
    tags: ['smart-home', 'hub', 'automation'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1558002038-64cd4d5c4a69',
    isNew: true,
    createdAt: '2023-03-25T12:00:00Z'
  }
];

// Returns a filtered set of products based on the provided filters
const filterProducts = (products: Product[], filters: ProductFilters): ProductsResponse => {
  let filteredProducts = [...products];
  
  // Apply category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  
  // Apply brand filter
  if (filters.brand && filters.brand.length > 0) {
    filteredProducts = filteredProducts.filter(p => filters.brand?.includes(p.brand));
  }
  
  // Apply price range filter
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => 
      (p.discountPrice || p.price) >= filters.minPrice!
    );
  }
  
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => 
      (p.discountPrice || p.price) <= filters.maxPrice!
    );
  }
  
  // Apply rating filter
  if (filters.minRating !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating!);
  }
  
  // Apply in-stock filter
  if (filters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.inStock === filters.inStock);
  }
  
  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      filters.tags?.some(tag => p.tags.includes(tag))
    );
  }
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Calculate total before pagination
  const total = filteredProducts.length;
  
  // Apply sorting
  if (filters.sortBy) {
    const direction = filters.sortOrder === 'desc' ? -1 : 1;
    
    switch(filters.sortBy) {
      case 'price':
        filteredProducts.sort((a, b) => direction * ((a.discountPrice || a.price) - (b.discountPrice || b.price)));
        break;
      case 'name':
        filteredProducts.sort((a, b) => direction * a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => direction * (b.rating - a.rating));
        break;
      case 'newest':
        filteredProducts.sort((a, b) => direction * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        break;
    }
  }
  
  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  filteredProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    products: filteredProducts,
    total
  };
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductFilters>({
      queryFn: (filters) => {
        // In a real app, this would be an API call
        // But we'll use our filter function and sample data for this demo
        try {
          const response = filterProducts(sampleProducts, filters);
          return { data: response };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getProductById: builder.query<Product, number>({
      queryFn: (id) => {
        // In a real app, this would be an API call
        try {
          const product = sampleProducts.find(p => p.id === id);
          if (!product) {
            return { error: { status: 404, data: 'Product not found' } };
          }
          return { data: product };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getCategories: builder.query<string[], void>({
      queryFn: () => {
        try {
          const categories = [...new Set(sampleProducts.map(p => p.category))];
          return { data: categories };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getBrands: builder.query<string[], void>({
      queryFn: () => {
        try {
          const brands = [...new Set(sampleProducts.map(p => p.brand))];
          return { data: brands };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getTags: builder.query<string[], void>({
      queryFn: () => {
        try {
          const allTags = sampleProducts.flatMap(p => p.tags);
          const uniqueTags = [...new Set(allTags)];
          return { data: uniqueTags };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetTagsQuery,
} = productsApi;