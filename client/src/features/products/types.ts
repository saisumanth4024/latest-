// Product-related types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  category: string;
  subCategory?: string;
  brand: string;
  tags: string[];
  inStock: boolean;
  stockCount?: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  attributes?: Record<string, string | string[] | number | boolean>;
  specifications?: Record<string, string | number>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  stockCount?: number;
  attributes: Record<string, string | number | boolean>;
  image?: string;
}

export interface ProductFilterAttribute {
  id: string;
  name: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  values?: string[];
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

export type SortOption = 
  | 'relevance' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc' 
  | 'newest' 
  | 'discount' 
  | 'bestselling';

export interface SearchParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  sortDirection?: 'asc' | 'desc';
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  query?: string;
  filters?: Record<string, string | string[] | number | boolean>;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  filters?: Record<string, ProductFilterAttribute>;
  appliedFilters?: Record<string, any>;
  categories?: { name: string; count: number }[];
  brands?: { name: string; count: number }[];
  priceRange?: { min: number; max: number };
}

export interface ProductResponse {
  product: Product;
  relatedProducts?: Product[];
}

// For tracking viewed products in Redux
export interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  category: string;
  brand: string;
  viewedAt: string;
}

// For tracking search history in Redux
export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultCount?: number;
}